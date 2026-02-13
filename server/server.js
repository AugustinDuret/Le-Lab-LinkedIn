import express from 'express';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const __envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');
if (fs.existsSync(__envPath)) {
  dotenv.config({ path: __envPath });
}
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { buildSystemPrompt, redistributeWeights } from './prompt.js';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('trust proxy', 1);
const isProduction = process.env.NODE_ENV === 'production';

// --- Supabase (lazy init) ---
console.log("SUPABASE_URL présente:", !!process.env.SUPABASE_URL);
console.log("SUPABASE_KEY présente:", !!process.env.SUPABASE_KEY);

let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient) {
    console.log("getSupabase() - SUPABASE_URL:", process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 20) + "..." : "MANQUANTE");
    console.log("getSupabase() - SUPABASE_KEY:", process.env.SUPABASE_KEY ? "présente (" + process.env.SUPABASE_KEY.length + " chars)" : "MANQUANTE");
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }
  }
  return supabaseClient;
}

app.use(cors());
app.use(express.json());

// --- PDF Magic Numbers ---
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF

// --- Allowed image MIME types ---
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

// --- Text Sanitization ---
function sanitizeText(text, maxLength = 50000) {
  if (!text || typeof text !== 'string') return '';
  // Strip HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  // Strip control characters (keep newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // Strip potential script injections
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  sanitized = sanitized.replace(/data:\s*text\/html/gi, '');
  // Truncate
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized.trim();
}

// --- Rate Limiting ---

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Trop de requetes. Veuillez reessayer dans une minute.' },
});

const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Vous avez atteint la limite d\'analyses. Reessayez dans une heure.' },
});

app.use(globalLimiter);

// --- Multer ---

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
      cb(null, true);
    } else if (
      (file.fieldname === 'banner' || file.fieldname === 'photo') &&
      ALLOWED_IMAGE_MIMES.includes(file.mimetype)
    ) {
      // Also enforce 5MB for images at multer level
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorise'));
    }
  },
});

const uploadFields = upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
]);

// --- Turnstile Verification ---

async function verifyTurnstile(token, remoteIp) {
  try {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.warn('TURNSTILE_SECRET_KEY not set, skipping verification');
      return true;
    }
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: secretKey,
        response: token || '',
        remoteip: remoteIp,
      }),
    });
    const data = await response.json();
    return data.success;
  } catch (err) {
    console.error('Turnstile verification failed:', err.message);
    return true; // Fail open in dev
  }
}

// --- Helper: production-safe error response ---
function errorResponse(res, status, devMessage, prodMessage) {
  if (isProduction) {
    return res.status(status).json({ error: prodMessage || 'Une erreur est survenue.' });
  }
  return res.status(status).json({ error: devMessage });
}

// --- Analyze Endpoint ---

app.post('/api/analyze', analyzeLimiter, (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'Fichier trop volumineux (max 10 Mo).' });
      }
      return errorResponse(res, 400, err.message, 'Une erreur est survenue lors de l\'upload. Veuillez reessayer.');
    }
    next();
  });
}, async (req, res) => {
  try {
    // 1. Verify Turnstile
    const { turnstileToken, objective, skipBanner, skipPhoto, lang } = req.body;
    const isValid = await verifyTurnstile(turnstileToken, req.ip);
    if (!isValid) {
      return res.status(403).json({ error: 'Verification CAPTCHA echouee. Veuillez rafraichir la page et reessayer.' });
    }

    // 2. Validate inputs
    if (!req.files?.pdf?.[0]) {
      return res.status(400).json({ error: 'Le fichier PDF est requis.' });
    }
    const validObjectives = ['clients', 'talents', 'recruteurs', 'branding'];
    if (!objective || !validObjectives.includes(objective)) {
      return res.status(400).json({ error: 'Objectif invalide.' });
    }

    // 3. Validate PDF magic number
    const pdfBuffer = req.files.pdf[0].buffer;
    if (pdfBuffer.length < 4 || !pdfBuffer.subarray(0, 4).equals(PDF_MAGIC)) {
      return res.status(400).json({ error: 'Le fichier ne semble pas etre un PDF valide.' });
    }

    // 4. Validate image sizes (5MB limit for images)
    const imageFields = ['banner', 'photo'];
    for (const field of imageFields) {
      if (req.files?.[field]?.[0]) {
        const imgFile = req.files[field][0];
        if (imgFile.size > 5 * 1024 * 1024) {
          return res.status(400).json({ error: `L'image ${field} depasse la taille maximale de 5 Mo.` });
        }
      }
    }

    // 5. Extract PDF text
    let pdfText;
    try {
      const pdfData = await pdf(pdfBuffer);
      pdfText = pdfData.text;
    } catch (pdfErr) {
      console.error('PDF parse error:', pdfErr.message);
      return res.status(400).json({ error: 'Impossible de lire le PDF. Verifiez que le fichier n\'est pas corrompu.' });
    }

    if (!pdfText || pdfText.trim().length < 50) {
      return res.status(400).json({ error: 'Le PDF ne semble pas contenir un profil LinkedIn valide. Assurez-vous d\'exporter votre profil via "Enregistrer en PDF" sur LinkedIn.' });
    }

    // 6. Sanitize PDF text
    pdfText = sanitizeText(pdfText);

    // 7. Prepare banner
    const skipBannerBool = skipBanner === 'true' || skipBanner === true;
    const hasBanner = !skipBannerBool && req.files?.banner?.[0];
    let bannerBase64 = null;
    let bannerMediaType = null;
    if (hasBanner) {
      const bannerFile = req.files.banner[0];
      bannerBase64 = bannerFile.buffer.toString('base64');
      bannerMediaType = bannerFile.mimetype;
    }

    // 8. Prepare photo
    const skipPhotoBool = skipPhoto === 'true' || skipPhoto === true;
    const hasPhoto = !skipPhotoBool && req.files?.photo?.[0];
    let photoBase64 = null;
    let photoMediaType = null;
    if (hasPhoto) {
      const photoFile = req.files.photo[0];
      photoBase64 = photoFile.buffer.toString('base64');
      photoMediaType = photoFile.mimetype;
    }

    // 9. Build prompt
    const userLang = lang === 'en' ? 'en' : 'fr';
    const weights = redistributeWeights(objective, skipBannerBool, skipPhotoBool);
    const systemPrompt = buildSystemPrompt(objective, weights, !!hasBanner, !!hasPhoto, userLang);

    // 10. Build Claude messages
    const userContent = [];
    userContent.push({
      type: 'text',
      text: userLang === 'en'
        ? `Here is the text extracted from the LinkedIn profile:\n\n${pdfText}`
        : `Voici le texte extrait du profil LinkedIn :\n\n${pdfText}`,
    });
    if (hasBanner) {
      userContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: bannerMediaType,
          data: bannerBase64,
        },
      });
      userContent.push({
        type: 'text',
        text: userLang === 'en'
          ? 'Above is the user\'s LinkedIn banner. Analyze it visually.'
          : 'Ci-dessus la banniere LinkedIn de l\'utilisateur. Analysez-la visuellement.',
      });
    }
    if (hasPhoto) {
      userContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: photoMediaType,
          data: photoBase64,
        },
      });
      userContent.push({
        type: 'text',
        text: userLang === 'en'
          ? 'Above is the user\'s profile photo. Analyze it visually: professionalism, quality, smile, background, consistency with their goal.'
          : 'Ci-dessus la photo de profil de l\'utilisateur. Analysez-la visuellement : professionnalisme, qualité, sourire, arrière-plan, cohérence avec l\'objectif.',
      });
    }

    // 11. Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'placeholder') {
      return errorResponse(res, 500,
        'Cle API Anthropic non configuree. Ajoutez votre ANTHROPIC_API_KEY dans le fichier .env',
        'Service temporairement indisponible. Veuillez reessayer plus tard.'
      );
    }

    // 12. Call Claude API
    const anthropic = new Anthropic({ apiKey });
    const callClaude = async () => {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        temperature: 0,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }],
      });
      return message.content[0].text;
    };

    // Try parsing, retry once if malformed
    let analysisText;
    try {
      analysisText = await callClaude();
    } catch (apiErr) {
      console.error('Claude API error:', apiErr.status, apiErr.error?.error?.message || apiErr.message);
      if (apiErr.status === 401) {
        return errorResponse(res, 500,
          'Cle API Anthropic invalide. Verifiez votre ANTHROPIC_API_KEY dans le fichier .env',
          'Service temporairement indisponible. Veuillez reessayer plus tard.'
        );
      }
      if (apiErr.status === 429) {
        return res.status(429).json({ error: 'Limite de l\'API atteinte. Reessayez dans quelques minutes.' });
      }
      if (apiErr.status === 400 && apiErr.error?.error?.message?.includes('credit balance')) {
        return errorResponse(res, 402,
          'Credits Anthropic insuffisants. Rechargez vos credits sur console.anthropic.com/settings/billing',
          'Service temporairement indisponible. Veuillez reessayer plus tard.'
        );
      }
      return errorResponse(res, 500,
        'Erreur lors de l\'appel a l\'API Claude. Veuillez reessayer.',
        'Une erreur est survenue lors de l\'analyse. Veuillez reessayer.'
      );
    }

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      console.warn('First JSON parse failed, retrying...');
      // Retry once
      try {
        analysisText = await callClaude();
        analysis = JSON.parse(analysisText);
      } catch (retryErr) {
        console.error('Retry also failed:', retryErr.message);
        return errorResponse(res, 500,
          'L\'analyse a echoue. Veuillez reessayer.',
          'Une erreur est survenue lors de l\'analyse. Veuillez reessayer.'
        );
      }
    }

    // 13. Save analysis to Supabase (non-blocking)
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('analyses').insert({
          lang: userLang,
          objective,
          score_global: analysis.scoreGlobal ?? null,
          label_global: analysis.labelGlobal ?? null,
          score_photo: analysis.criteres.find(c => c.nom.includes('Photo'))?.score || null,
          score_banniere: analysis.criteres.find(c => c.nom.includes('Bannière') || c.nom.includes('Banner'))?.score || null,
          score_titre: analysis.criteres.find(c => c.nom.includes('Titre') || c.nom.includes('Headline'))?.score || null,
          score_resume: analysis.criteres.find(c => c.nom.includes('Résumé') || c.nom.includes('About'))?.score || null,
          score_experiences: analysis.criteres.find(c => c.nom.includes('Expérience') || c.nom.includes('Experience'))?.score || null,
          score_competences: analysis.criteres.find(c => c.nom.includes('Compétence') || c.nom.includes('Skill'))?.score || null,
          score_coherence: analysis.criteres.find(c => c.nom.includes('Cohérence') || c.nom.includes('Coherence'))?.score || null,
          analyse_globale: analysis.analyseGlobale ?? null,
          feuille_de_route: JSON.stringify(analysis.feuilleDeRoute ?? []),
          profil_texte: pdfText,
          has_banner: !!hasBanner,
          has_photo: !!hasPhoto,
        });
      } else {
        console.error('Supabase non configuré');
      }
    } catch (err) {
      console.error('Erreur Supabase:', err);
    }

    return res.json({ ...analysis, objective });
  } catch (error) {
    console.error('Analyze error:', error);
    return errorResponse(res, 500,
      'Une erreur est survenue lors de l\'analyse. Veuillez reessayer.',
      'Une erreur est survenue. Veuillez reessayer.'
    );
  }
});

// --- Admin: view analyses ---

app.get('/api/admin/analyses', async (req, res) => {
  if (!process.env.ADMIN_KEY || req.query.key?.trim() !== process.env.ADMIN_KEY?.trim()) {
    return res.status(403).json({ error: 'Acces interdit.' });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase non configuré.' });
  }

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase read error:', error.message);
    return res.status(500).json({ error: 'Erreur lors de la recuperation des donnees.' });
  }

  return res.json(data);
});

// --- Production static files ---

if (isProduction) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// --- Start ---

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key === 'placeholder') {
    console.warn('⚠️  ANTHROPIC_API_KEY non configuree ! Editez le fichier .env avec votre cle API.');
  } else {
    console.log('✓ ANTHROPIC_API_KEY configuree (' + key.slice(0, 10) + '...)');
  }
});
