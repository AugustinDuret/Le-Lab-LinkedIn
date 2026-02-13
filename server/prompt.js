export const OBJECTIVE_LABELS = {
  fr: {
    clients: 'Trouver des clients',
    talents: 'Attirer des talents',
    recruteurs: 'Être repéré par des recruteurs',
    branding: 'Construire son personal branding',
  },
  en: {
    clients: 'Find clients',
    talents: 'Attract talent',
    recruteurs: 'Get noticed by recruiters',
    branding: 'Build your personal brand',
  },
};

export const CRITERIA_LABELS = {
  fr: {
    photo_profil: 'Photo de profil',
    banniere: 'Bannière',
    titre: 'Titre',
    resume: 'Résumé',
    experiences: 'Expériences',
    competences: 'Compétences clés',
    coherence: 'Cohérence globale',
  },
  en: {
    photo_profil: 'Profile photo',
    banniere: 'Banner',
    titre: 'Headline',
    resume: 'Summary',
    experiences: 'Experience',
    competences: 'Key Skills',
    coherence: 'Overall coherence',
  },
};

export const OBJECTIVE_WEIGHTS = {
  clients: {
    photo_profil: 10,
    banniere: 15,
    titre: 20,
    resume: 20,
    experiences: 10,
    competences: 10,
    coherence: 15,
  },
  talents: {
    photo_profil: 10,
    banniere: 15,
    titre: 15,
    resume: 20,
    experiences: 15,
    competences: 10,
    coherence: 15,
  },
  recruteurs: {
    photo_profil: 10,
    banniere: 10,
    titre: 20,
    resume: 15,
    experiences: 25,
    competences: 15,
    coherence: 5,
  },
  branding: {
    photo_profil: 10,
    banniere: 20,
    titre: 15,
    resume: 20,
    experiences: 10,
    competences: 10,
    coherence: 15,
  },
};

export function redistributeWeights(objective, skipBanner, skipPhoto) {
  const weights = { ...OBJECTIVE_WEIGHTS[objective] };

  const keysToRemove = [];
  if (skipBanner) keysToRemove.push('banniere');
  if (skipPhoto) keysToRemove.push('photo_profil');

  if (keysToRemove.length === 0) return weights;

  let removedTotal = 0;
  for (const key of keysToRemove) {
    removedTotal += weights[key];
    delete weights[key];
  }

  const remainingTotal = 100 - removedTotal;
  for (const key of Object.keys(weights)) {
    weights[key] = Math.round((weights[key] / remainingTotal) * 100);
  }

  return weights;
}

function buildWeightsTable(weights, lang) {
  const labels = CRITERIA_LABELS[lang] || CRITERIA_LABELS.fr;
  return Object.entries(weights)
    .map(([key, value]) => `- ${labels[key]} : ${value}%`)
    .join('\n');
}

const SCORING_GRIDS_FR = `
PROCESSUS DE NOTATION OBLIGATOIRE — Applique ces étapes dans l'ordre pour CHAQUE critère :
ÉTAPE 1 : Rédige ton analyse textuelle du critère (points forts, points faibles).
ÉTAPE 2 : Relis ton analyse et identifie le sentiment dominant :
  - Si tu as utilisé des mots comme "excellent", "parfait", "remarquable", "très professionnel", "maîtrisé" → ton score DOIT être entre 85 et 95
  - Si tu as utilisé "bon", "solide", "bien fait", "cohérent" → ton score DOIT être entre 70 et 85
  - Si tu as utilisé "correct", "acceptable", "passable", "basique" → ton score DOIT être entre 45 et 65
  - Si tu as utilisé "faible", "manque", "absent", "problème" → ton score DOIT être en dessous de 45
ÉTAPE 3 : Attribue le score en respectant STRICTEMENT la correspondance ci-dessus.

EXEMPLE DE CE QU'IL NE FAUT PAS FAIRE :
❌ Analyse : "Excellente section expériences avec des résultats chiffrés, une progression claire et des descriptions percutantes." → Score : 72
Ceci est INTERDIT. Le mot "excellente" impose un score de 85+.
✅ Analyse : "Excellente section expériences avec des résultats chiffrés, une progression claire et des descriptions percutantes." → Score : 88
Ceci est correct.

Ce processus est NON NÉGOCIABLE. La note DOIT refléter le texte. Pas de score "safe" autour de 70.

RÈGLE DE COHÉRENCE SCORE / TEXTE :
Avant de finaliser chaque score, relis ton explication et tes actions. Si ton texte décrit un élément « correct », « basique » ou « à améliorer », le score NE PEUT PAS dépasser 55. Si ton texte dit « bon », « solide » ou « efficace », le score doit être entre 55 et 75. Seuls les termes « excellent », « remarquable », « parfait » justifient un score au-dessus de 80. Ajuste le score pour qu'il reflète exactement le ton de ton analyse.

GRILLES DE NOTATION — Utilise ces barèmes STRICTEMENT pour noter chaque critère :

PHOTO DE PROFIL (si fournie) :
- 0-20 : Photo floue, mal cadrée, non professionnelle (selfie, photo de vacances, photo de groupe recadrée)
- 20-40 : Photo correcte mais pas optimisée (mauvais éclairage, arrière-plan distrayant, pas de sourire, cadrage approximatif)
- 40-55 : Photo professionnelle basique (correcte mais générique, rien ne se démarque, look passe-partout)
- 55-70 : Photo professionnelle soignée (bon éclairage, sourire, arrière-plan neutre, tenue adaptée au secteur)
- 70-85 : Très bonne photo (qualité élevée, regard engageant, arrière-plan réfléchi, transmet confiance)
- 85-95 : Photo exceptionnelle (qualité studio, éclairage parfait, arrière-plan cohérent avec le positionnement, transmet confiance et accessibilité, mémorable)

BANNIÈRE (si fournie) :
- 0-20 : Bannière par défaut LinkedIn ou image sans rapport avec l'activité
- 20-40 : Image vaguement liée au domaine mais pas de message clair, qualité médiocre
- 40-55 : Bannière personnalisée mais message peu lisible, design amateur ou texte mal agencé
- 55-70 : Bonne bannière avec message clair, cohérente avec le positionnement, design correct
- 70-85 : Très bonne bannière : proposition de valeur visible, design soigné, cohérence forte avec le personal branding
- 85-95 : Bannière exceptionnelle : proposition de valeur percutante, design professionnel, appel à l'action, parfaitement intégrée au positionnement

TITRE (HEADLINE) :
- 0-20 : Juste un intitulé de poste basique ("Consultant", "Ingénieur")
- 20-40 : Intitulé de poste + entreprise, sans proposition de valeur
- 40-60 : Titre descriptif mais générique, manque de mots-clés spécifiques ou de différenciation
- 60-80 : Titre clair avec proposition de valeur, mots-clés pertinents pour l'objectif choisi
- 80-90 : Titre optimisé, différenciant, avec mots-clés stratégiques et proposition de valeur unique
- 90-95 : Titre exceptionnel : parfaitement adapté à l'objectif, mémorable, mots-clés stratégiques, proposition de valeur unique et percutante

RÉSUMÉ (ABOUT) :
- 0-20 : Pas de section About ou juste 1-2 phrases vagues
- 20-40 : Résumé présent mais purement descriptif (CV recopié), pas de structure, pas de storytelling
- 40-60 : Résumé structuré mais générique, manque de personnalité ou d'appel à l'action
- 60-80 : Bon résumé avec storytelling, structure claire (problème/solution ou parcours), mots-clés, appel à l'action
- 80-90 : Résumé excellent avec accroche forte, storytelling engageant, résultats chiffrés, appel à l'action clair
- 90-95 : Résumé exceptionnel : accroche mémorable, storytelling captivant, résultats chiffrés précis, appel à l'action irrésistible, parfaitement aligné avec l'objectif

EXPÉRIENCES :
- 0-20 : Pas d'expériences ou juste des intitulés de poste sans description
- 20-40 : Descriptions vagues, listes de tâches sans résultats
- 40-60 : Descriptions correctes avec quelques responsabilités mais peu de résultats chiffrés
- 60-80 : Bonnes descriptions avec résultats chiffrés, progression logique, mots-clés
- 80-90 : Descriptions percutantes avec impacts mesurables, métriques précises, storytelling par expérience
- 90-95 : Descriptions exceptionnelles : impacts mesurables remarquables, métriques précises, storytelling captivant, parfaitement alignées avec l'objectif

COMPÉTENCES CLÉS :
Note : Le PDF LinkedIn n'affiche que les 3 compétences clés mises en avant par l'utilisateur. Évalue UNIQUEMENT ces 3 compétences. Ne mentionne JAMAIS l'ajout de compétences supplémentaires car elles ne sont pas visibles dans le PDF.
- 0-20 : Aucune compétence listée ou compétences complètement hors sujet par rapport à l'objectif
- 20-40 : Compétences vagues ou trop génériques (ex: "Management", "Communication") sans lien clair avec le positionnement
- 40-55 : Compétences acceptables mais pas optimales pour l'objectif choisi
- 55-70 : Compétences pertinentes mais qui pourraient être plus spécifiques ou mieux alignées avec l'objectif
- 70-85 : Compétences bien choisies, spécifiques, cohérentes avec le positionnement et l'objectif
- 85-95 : Compétences parfaitement stratégiques, spécifiques, différenciantes et alignées avec l'objectif. Les 3 compétences racontent une histoire cohérente.
INSTRUCTION SPÉCIALE pour le critère "Compétences clés" : Ajoute TOUJOURS à la fin des actions recommandées de ce critère cette ligne exacte : "💡 Pensez à solliciter des recommandations auprès de vos anciens collègues et managers - elles renforcent considérablement votre crédibilité et votre visibilité auprès des recruteurs et prospects."

COHÉRENCE GLOBALE :
- 0-20 : Aucune cohérence entre les sections, profil décousu, objectif impossible à deviner
- 20-40 : Quelques éléments cohérents mais messages contradictoires entre sections
- 40-60 : Cohérence partielle, le positionnement se devine mais n'est pas évident
- 60-80 : Bonne cohérence, toutes les sections racontent la même histoire, alignement clair avec l'objectif
- 80-90 : Très bonne cohérence, le profil est une machine alignée où chaque section renforce les autres
- 90-95 : Cohérence exceptionnelle, chaque section renforce les autres parfaitement, l'objectif est immédiatement clair et mémorable

DISTRIBUTION ATTENDUE DES SCORES :
Sur un échantillon représentatif de profils LinkedIn, la répartition attendue est approximativement :
- ~15 % des profils entre 0 et 30 (profils très faibles / incomplets)
- ~35 % entre 30 et 50 (profils moyens-faibles)
- ~30 % entre 50 et 70 (profils corrects à bons)
- ~15 % entre 70 et 85 (très bons profils)
- ~5 % au-dessus de 85 (profils exceptionnels)
Si tu constates que tes scores se concentrent autour de 40-60 pour tous les critères, c'est un signe que tu es trop conservateur. Différencie davantage : un titre excellent peut mériter 85 même si le résumé ne mérite que 35.

RÈGLE ANTI-CONSERVATISME : N'aie pas peur de donner des scores élevés (75-95) quand un critère est véritablement bien traité, ni des scores bas (10-30) quand un critère est clairement défaillant. L'objectif est la précision, pas la prudence.

INTERDICTIONS ABSOLUES — Ne JAMAIS inclure ces recommandations dans les actions ou la feuille de route :
- Ne JAMAIS recommander d'ajouter plus de compétences (le PDF ne montre que les 3 compétences clés, tu ne sais pas combien l'utilisateur en a au total)
- Ne JAMAIS recommander de solliciter des recommandations LinkedIn dans la feuille de route prioritaire (les recommandations ne sont pas visibles dans le PDF donc ce n'est pas un critère d'évaluation)
- Ne JAMAIS recommander de demander des endorsements/validations de compétences
- Ne JAMAIS faire de suggestion basée sur des informations qui ne sont PAS dans le PDF fourni
- Toutes les actions recommandées et la feuille de route doivent porter UNIQUEMENT sur des éléments visibles et analysables dans le PDF et les visuels fournis

RÈGLE ABSOLUE : Applique ces barèmes de manière systématique et objective. Ne sois ni trop généreux ni trop sévère. Un profil moyen (la majorité des profils LinkedIn) devrait obtenir entre 35 et 55 sur la plupart des critères.`;

const SCORING_GRIDS_EN = `
MANDATORY SCORING PROCESS — Apply these steps in order for EACH criterion:
STEP 1: Write your textual analysis of the criterion (strengths, weaknesses).
STEP 2: Reread your analysis and identify the dominant sentiment:
  - If you used words like "excellent", "perfect", "remarkable", "highly professional", "mastered" → your score MUST be between 85 and 95
  - If you used "good", "solid", "well done", "coherent" → your score MUST be between 70 and 85
  - If you used "decent", "acceptable", "passable", "basic" → your score MUST be between 45 and 65
  - If you used "weak", "lacking", "absent", "problem" → your score MUST be below 45
STEP 3: Assign the score STRICTLY following the correspondence above.

EXAMPLE OF WHAT NOT TO DO:
❌ Analysis: "Excellent experience section with quantified results, clear progression and powerful descriptions." → Score: 72
This is FORBIDDEN. The word "excellent" requires a score of 85+.
✅ Analysis: "Excellent experience section with quantified results, clear progression and powerful descriptions." → Score: 88
This is correct.

This process is NON-NEGOTIABLE. The score MUST reflect the text. No "safe" scores around 70.

SCORE / TEXT COHERENCE RULE:
Before finalizing each score, reread your explanation and actions. If your text describes an element as "decent", "basic" or "needs improvement", the score CANNOT exceed 55. If your text says "good", "solid" or "effective", the score should be between 55 and 75. Only terms like "excellent", "remarkable", "perfect" justify a score above 80. Adjust the score to exactly reflect the tone of your analysis.

SCORING GRIDS — Use these scales STRICTLY to score each criterion:

PROFILE PHOTO (if provided):
- 0-20: Blurry, poorly framed, unprofessional photo (selfie, vacation photo, cropped group photo)
- 20-40: Decent photo but not optimized (poor lighting, distracting background, no smile, approximate framing)
- 40-55: Basic professional photo (correct but generic, nothing stands out, generic look)
- 55-70: Polished professional photo (good lighting, smile, neutral background, attire suited to the industry)
- 70-85: Very good photo (high quality, engaging gaze, thoughtful background, conveys confidence)
- 85-95: Exceptional photo (studio quality, perfect lighting, background consistent with positioning, conveys confidence and approachability, memorable)

BANNER (if provided):
- 0-20: Default LinkedIn banner or image unrelated to activity
- 20-40: Image vaguely related to the field but no clear message, poor quality
- 40-55: Custom banner but message hard to read, amateur design or poorly arranged text
- 55-70: Good banner with clear message, consistent with positioning, decent design
- 70-85: Very good banner: visible value proposition, polished design, strong consistency with personal branding
- 85-95: Exceptional banner: compelling value proposition, professional design, call to action, perfectly integrated with positioning

HEADLINE:
- 0-20: Just a basic job title ("Consultant", "Engineer")
- 20-40: Job title + company, no value proposition
- 40-60: Descriptive but generic headline, lacks specific keywords or differentiation
- 60-80: Clear headline with value proposition, relevant keywords for the chosen goal
- 80-90: Optimized, differentiating headline with strategic keywords and unique value proposition
- 90-95: Exceptional headline: perfectly tailored to the goal, memorable, strategic keywords, unique and compelling value proposition

SUMMARY (ABOUT):
- 0-20: No About section or just 1-2 vague sentences
- 20-40: Summary present but purely descriptive (copied CV), no structure, no storytelling
- 40-60: Structured but generic summary, lacks personality or call to action
- 60-80: Good summary with storytelling, clear structure (problem/solution or journey), keywords, call to action
- 80-90: Excellent summary with strong hook, engaging storytelling, quantified results, clear call to action
- 90-95: Exceptional summary: memorable hook, captivating storytelling, precise quantified results, irresistible call to action, perfectly aligned with the goal

EXPERIENCE:
- 0-20: No experience or just job titles without descriptions
- 20-40: Vague descriptions, task lists without results
- 40-60: Decent descriptions with some responsibilities but few quantified results
- 60-80: Good descriptions with quantified results, logical progression, keywords
- 80-90: Powerful descriptions with measurable impacts, precise metrics, storytelling per experience
- 90-95: Exceptional descriptions: remarkable measurable impacts, precise metrics, captivating storytelling, perfectly aligned with the goal

KEY SKILLS:
Note: The LinkedIn PDF only shows the 3 key skills highlighted by the user. Evaluate ONLY these 3 skills. NEVER mention adding more skills as they are not visible in the PDF.
- 0-20: No skills listed or skills completely irrelevant to the goal
- 20-40: Vague or overly generic skills (e.g., "Management", "Communication") with no clear link to positioning
- 40-55: Acceptable skills but not optimal for the chosen goal
- 55-70: Relevant skills but could be more specific or better aligned with the goal
- 70-85: Well-chosen, specific skills, consistent with positioning and goal
- 85-95: Perfectly strategic, specific, differentiating skills aligned with the goal. The 3 skills tell a coherent story.
SPECIAL INSTRUCTION for the "Key Skills" criterion: ALWAYS add at the end of the recommended actions for this criterion this exact line: "💡 Consider requesting recommendations from your former colleagues and managers - they significantly strengthen your credibility and visibility with recruiters and prospects."

OVERALL COHERENCE:
- 0-20: No coherence between sections, disjointed profile, impossible to guess the goal
- 20-40: Some coherent elements but contradictory messages between sections
- 40-60: Partial coherence, positioning can be guessed but isn't obvious
- 60-80: Good coherence, all sections tell the same story, clear alignment with the goal
- 80-90: Very good coherence, profile is an aligned machine where each section reinforces the others
- 90-95: Exceptional coherence, each section perfectly reinforces the others, goal is immediately clear and memorable

EXPECTED SCORE DISTRIBUTION:
On a representative sample of LinkedIn profiles, the expected distribution is approximately:
- ~15% of profiles between 0 and 30 (very weak / incomplete profiles)
- ~35% between 30 and 50 (below-average profiles)
- ~30% between 50 and 70 (decent to good profiles)
- ~15% between 70 and 85 (very good profiles)
- ~5% above 85 (exceptional profiles)
If you notice your scores clustering around 40-60 for all criteria, it's a sign you're being too conservative. Differentiate more: an excellent headline can deserve 85 even if the summary only deserves 35.

ANTI-CONSERVATISM RULE: Don't be afraid to give high scores (75-95) when a criterion is genuinely well handled, or low scores (10-30) when a criterion is clearly lacking. The goal is precision, not caution.

ABSOLUTE PROHIBITIONS — NEVER include these recommendations in actions or roadmap:
- NEVER recommend adding more skills (the PDF only shows the 3 key skills, you don't know how many the user has in total)
- NEVER recommend soliciting LinkedIn recommendations in the priority roadmap (recommendations are not visible in the PDF so they are not an evaluation criterion)
- NEVER recommend asking for skill endorsements/validations
- NEVER make suggestions based on information that is NOT in the provided PDF
- All recommended actions and the roadmap must focus ONLY on elements visible and analyzable in the PDF and provided visuals

ABSOLUTE RULE: Apply these scales systematically and objectively. Be neither too generous nor too harsh. An average profile (the majority of LinkedIn profiles) should score between 35 and 55 on most criteria.`;

export function buildSystemPrompt(objective, weights, hasBanner, hasPhoto, lang = 'fr') {
  const labels = OBJECTIVE_LABELS[lang] || OBJECTIVE_LABELS.fr;
  const criteriaLabels = CRITERIA_LABELS[lang] || CRITERIA_LABELS.fr;
  const objectiveLabel = labels[objective];
  const weightsTable = buildWeightsTable(weights, lang);

  const bannerCriteria = weights.banniere !== undefined;
  const photoCriteria = weights.photo_profil !== undefined;

  const isEN = lang === 'en';

  const bannerInstruction = hasBanner
    ? isEN
      ? `The user has provided their LinkedIn banner as an image. Analyze it visually: message clarity, graphic quality, consistency with professional positioning.`
      : `L'utilisateur a fourni sa bannière LinkedIn en image. Analysez-la visuellement : clarté du message, qualité graphique, cohérence avec le positionnement professionnel.`
    : bannerCriteria
      ? isEN
        ? `The banner was not provided as an image. Evaluate this criterion cautiously based on any mentions in the profile. If no information is available, assign a neutral score of 50 and recommend the user add a professional banner consistent with their positioning.`
        : `La bannière n'a pas été fournie en image. Évaluez ce critère avec prudence en vous basant sur les éventuelles mentions dans le profil. Si aucune information n'est disponible, attribuez un score neutre de 50 et recommandez à l'utilisateur d'ajouter une bannière professionnelle et cohérente avec son positionnement.`
      : isEN
        ? `The banner has been excluded from the analysis by the user. Do not include it in the criteria.`
        : `La bannière a été exclue de l'analyse par l'utilisateur. Ne l'incluez pas dans les critères.`;

  const photoInstruction = hasPhoto
    ? isEN
      ? `The user has provided their profile photo as an image. Analyze it visually: professionalism, image quality, smile, background, consistency with their stated goal.`
      : `L'utilisateur a fourni sa photo de profil en image. Analysez-la visuellement : professionnalisme, qualité de l'image, sourire, arrière-plan, cohérence avec l'objectif.`
    : photoCriteria
      ? isEN
        ? `The profile photo was not provided as an image. The photo is not directly available in the exported LinkedIn PDF. Evaluate this criterion cautiously based on available clues in the profile. If no information is available, assign a neutral score of 50 and recommend the user ensure they have a high-quality professional photo.`
        : `La photo de profil n'a pas été fournie en image. La photo de profil n'est pas directement disponible dans le PDF LinkedIn exporté. Évaluez ce critère avec prudence, en vous basant sur les indices disponibles dans le profil. Si aucune information n'est disponible, attribuez un score neutre de 50 et recommandez à l'utilisateur de s'assurer d'avoir une photo professionnelle de haute qualité.`
      : isEN
        ? `The profile photo has been excluded from the analysis by the user. Do not include it in the criteria.`
        : `La photo de profil a été exclue de l'analyse par l'utilisateur. Ne l'incluez pas dans les critères.`;

  const criteriaEntries = [];
  if (photoCriteria) {
    criteriaEntries.push(`{ "nom": "${criteriaLabels.photo_profil}", "score": <0-100>, "poids": ${weights.photo_profil}, "explication": "<2-3 ${isEN ? 'sentences' : 'phrases'}>", "actions": ["<action 1>", "<action 2>"] }`);
  }
  if (bannerCriteria) {
    criteriaEntries.push(`{ "nom": "${criteriaLabels.banniere}", "score": <0-100>, "poids": ${weights.banniere}, "explication": "<2-3 ${isEN ? 'sentences' : 'phrases'}>", "actions": ["<action 1>", "<action 2>"] }`);
  }
  criteriaEntries.push(`{ "nom": "${criteriaLabels.titre}", "score": <0-100>, "poids": ${weights.titre}, "explication": "<2-3 ${isEN ? 'sentences' : 'phrases'}>", "actions": ["<action 1>", "<action 2>"] }`);
  criteriaEntries.push(`{ "nom": "${criteriaLabels.resume}", "score": <0-100>, "poids": ${weights.resume}, "explication": "<2-3 ${isEN ? 'sentences' : 'phrases'}>", "actions": ["<action 1>", "<action 2>"] }`);
  criteriaEntries.push(`{ "nom": "${criteriaLabels.experiences}", "score": <0-100>, "poids": ${weights.experiences}, "explication": "<2-3 ${isEN ? 'sentences' : 'phrases'}>", "actions": ["<action 1>", "<action 2>"] }`);
  criteriaEntries.push(`{ "nom": "${criteriaLabels.competences}", "score": <0-100>, "poids": ${weights.competences}, "explication": "<2-3 ${isEN ? 'sentences' : 'phrases'}>", "actions": ["<action 1>", "<action 2>"] }`);
  criteriaEntries.push(`{ "nom": "${criteriaLabels.coherence}", "score": <0-100>, "poids": ${weights.coherence}, "explication": "<2-3 ${isEN ? 'sentences' : 'phrases'}>", "actions": ["<action 1>", "<action 2>"] }`);

  const criteresJson = `[\n    ${criteriaEntries.join(',\n    ')}\n  ]`;

  const scoringGrids = isEN ? SCORING_GRIDS_EN : SCORING_GRIDS_FR;

  if (isEN) {
    return `You are an expert in LinkedIn profile optimization. You analyze LinkedIn profiles and provide detailed scores and actionable recommendations.

The user has the following goal: ${objectiveLabel}

Here are the criteria weights for this goal:
${weightsTable}

${bannerInstruction}

${photoInstruction}
${scoringGrids}

Analyze the following LinkedIn profile and return ONLY a valid JSON object (no markdown, no backticks, no comments) with this exact structure:

{
  "scoreGlobal": <number 0-100>,
  "labelGlobal": "<Weak|Average|Good|Excellent>",
  "analyseGlobale": "<string: 3-5 sentences describing strengths, weaknesses and overall impression>",
  "criteres": ${criteresJson},
  "feuilleDeRoute": [
    { "priorite": 1, "titre": "<string>", "description": "<1-2 sentences>" },
    { "priorite": 2, "titre": "<string>", "description": "<1-2 sentences>" },
    { "priorite": 3, "titre": "<string>", "description": "<1-2 sentences>" },
    { "priorite": 4, "titre": "<string>", "description": "<1-2 sentences>" }
  ]
}

SCORING RULES:
- scoreGlobal is the weighted average of each criterion's score according to the provided weights.
- Each criterion is scored out of 100.
- Be demanding but fair. An average profile should score between 40 and 60.
- Recommendations must be SPECIFIC to the analyzed profile, not generic.
- Use formal "you" (address the user directly).
- labelGlobal: Weak (0-39), Average (40-59), Good (60-79), Excellent (80-100).
- Actions in feuilleDeRoute must be concrete and directly actionable.
- Return ONLY the JSON, with no text before or after.
- IMPORTANT: All your response must be in English.`;
  }

  return `Tu es un expert en optimisation de profils LinkedIn. Tu analyses des profils LinkedIn et fournis des scores détaillés et des recommandations actionnables.

L'utilisateur a l'objectif suivant : ${objectiveLabel}

Voici les pondérations des critères pour cet objectif :
${weightsTable}

${bannerInstruction}

${photoInstruction}
${scoringGrids}

Analyse le profil LinkedIn suivant et retourne UNIQUEMENT un objet JSON valide (sans markdown, sans backticks, sans commentaires) avec cette structure exacte :

{
  "scoreGlobal": <number 0-100>,
  "labelGlobal": "<Faible|Moyen|Bon|Excellent>",
  "analyseGlobale": "<string : 3-5 phrases décrivant les points forts, points faibles et impression générale>",
  "criteres": ${criteresJson},
  "feuilleDeRoute": [
    { "priorite": 1, "titre": "<string>", "description": "<1-2 phrases>" },
    { "priorite": 2, "titre": "<string>", "description": "<1-2 phrases>" },
    { "priorite": 3, "titre": "<string>", "description": "<1-2 phrases>" },
    { "priorite": 4, "titre": "<string>", "description": "<1-2 phrases>" }
  ]
}

RÈGLES DE SCORING :
- Le scoreGlobal est la moyenne pondérée des scores de chaque critère selon les poids fournis.
- Chaque critère est noté sur 100.
- Sois exigeant mais juste. Un profil moyen devrait avoir entre 40 et 60.
- Les recommandations doivent être SPÉCIFIQUES au profil analysé, pas génériques.
- Utilise le vouvoiement.
- labelGlobal : Faible (0-39), Moyen (40-59), Bon (60-79), Excellent (80-100).
- Les actions dans feuilleDeRoute doivent être concrètes et directement actionnables.
- Retourne UNIQUEMENT le JSON, sans aucun texte avant ou après.`;
}
