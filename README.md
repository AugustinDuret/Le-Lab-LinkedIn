🧪 Le Lab LinkedIn d'Augustin

**Your LinkedIn profile, scored out of 100 - with a personalised action plan to improve it.**

An AI-powered LinkedIn profile analyser that gives you a detailed score, a radar chart across 7 key criteria, and concrete recommendations tailored to your goals.

🔗 **Try it now:** [le-lab-linkedin-production.up.railway.app](https://le-lab-linkedin-production.up.railway.app)

## What it does

1. Upload your LinkedIn profile (PDF export)
2. Optionally add your profile photo and banner
3. Choose your goal: find clients, attract talent, land a job, or build your personal brand
4. Get an instant, detailed analysis:
   - Overall score out of 100
   - Radar chart across 7 criteria (photo, banner, headline, summary, experience, key skills, overall coherence)
   - Personalised rewrite suggestions for your headline and summary
   - A 4-step priority action plan
5. Export your results as a PDF

## Tech stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **AI:** Anthropic Claude API (Sonnet)
- **Database:** Supabase (PostgreSQL)
- **PDF parsing:** pdf-parse
- **PDF export:** jsPDF
- **Charts:** Recharts
- **CAPTCHA:** Cloudflare Turnstile
- **Hosting:** Railway

## Features

- Bilingual (French / English)
- GDPR compliant with consent and privacy policy
- Rate limiting and file validation
- Deterministic scoring (temperature: 0) with detailed grading rubrics
- Personalised headline and summary rewrite suggestions
- Responsive design (desktop + mobile)

## About

Built from scratch by [Augustin Duret](https://www.linkedin.com/in/augustin-duret) - a business profile with no prior coding experience — using AI-assisted development with Claude Code.

## License

This project is not open source. All rights reserved.
