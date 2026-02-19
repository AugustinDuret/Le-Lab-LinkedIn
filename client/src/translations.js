const translations = {
  fr: {
    // Hero
    heroTitle1: 'Transformez votre profil LinkedIn',
    heroTitle2: 'en machine à ',
    heroTitleHighlight: 'opportunités',
    heroSubtitle: 'Une analyse complète de votre profil en 2 minutes, avec un score détaillé et un plan d\'action personnalisé selon vos objectifs.',

    // Steps
    step1Title: '1. Votre profil LinkedIn',
    step2Title: '2. Vos visuels',
    step3Title: '3. Votre objectif',
    optionalBadge: 'Optionnel',

    // Step 1
    pdfDropText: 'Déposez votre profil LinkedIn (PDF)',
    pdfDropHint: 'Téléchargez votre profil depuis LinkedIn et déposez-le ici',
    pdfHowToGet: 'Comment l\'obtenir ?',
    pdfGuideTitle: 'Comment télécharger votre profil LinkedIn en PDF',
    pdfGuideSteps: '1. Allez sur votre profil LinkedIn\n2. Cliquez sur « Plus »\n3. Cliquez sur « Enregistrer au format PDF »',
    pdfGuideClose: 'Fermer',

    // Step 2 - Banner
    bannerLabel: 'Bannière LinkedIn',
    bannerSkip: 'Je n\'ai pas de bannière',
    bannerAdd: 'Ajoutez votre bannière',
    bannerFormats: 'JPG, PNG ou WebP',
    bannerSkipped: 'Bannière ignorée pour l\'analyse',

    // Step 2 - Photo
    photoLabel: 'Photo de profil',
    photoSkip: 'Je n\'ai pas de photo de profil',
    photoAdd: 'Ajoutez votre photo de profil',
    photoFormats: 'JPG, PNG ou WebP',
    photoSkipped: 'Photo ignorée pour l\'analyse',

    // Step 3 - Objectives
    objectiveClients: 'Trouver des clients',
    objectiveClientsDesc: 'Votre profil LinkedIn doit convaincre vos prospects que vous êtes LA personne qu\'il leur faut.',
    objectiveTalents: 'Attirer des talents',
    objectiveTalentsDesc: 'Votre profil doit donner envie aux meilleurs candidats de vous répondre - et de rejoindre votre entreprise.',
    objectiveRecruiters: 'Être repéré par des recruteurs',
    objectiveRecruitersDesc: 'Votre profil doit apparaître dans les recherches des recruteurs et leur donner envie de vous contacter.',
    objectiveBranding: 'Construire son personal branding',
    objectiveBrandingDesc: 'Votre profil doit refléter votre expertise et vous positionner comme une voix qui compte dans votre domaine.',

    // CTA
    analyzeButton: 'Analyser mon profil',

    // RGPD / Consent
    consentLabel: 'J\'accepte que mes données soient traitées uniquement pour l\'analyse de mon profil.',
    consentPrivacyLink: 'Politique de confidentialité',

    // File validation errors
    errorPdfType: 'Veuillez sélectionner un fichier PDF valide.',
    errorPdfSize: 'Le fichier PDF ne doit pas dépasser 10 Mo.',
    errorImageType: 'Veuillez sélectionner une image au format JPG, PNG ou WebP.',
    errorImageSize: 'L\'image ne doit pas dépasser 5 Mo.',

    // Privacy Policy Modal
    privacyTitle: 'Politique de confidentialité',
    privacyIntro: 'Le Lab LinkedIn d\'Augustin s\'engage à protéger vos données personnelles. Cette politique explique comment nous traitons les informations que vous nous fournissez.',
    privacyDataCollectedTitle: 'Données collectées',
    privacyDataCollected: 'Nous collectons uniquement les données que vous fournissez volontairement : le PDF de votre profil LinkedIn, votre bannière et photo de profil (optionnelles), ainsi que l\'objectif sélectionné.',
    privacyUsageTitle: 'Utilisation des données',
    privacyUsage: 'Vos données sont utilisées exclusivement pour générer l\'analyse de votre profil via l\'API Claude d\'Anthropic. Elles ne sont jamais vendues, partagées avec des tiers à des fins commerciales, ni utilisées à d\'autres fins.',
    privacyStorageTitle: 'Stockage et conservation',
    privacyStorage: 'Les fichiers uploadés (PDF, images) sont traités en mémoire et ne sont pas stockés de manière permanente sur nos serveurs. Seuls les résultats anonymisés de l\'analyse peuvent être conservés à des fins statistiques.',
    privacyRightsTitle: 'Vos droits',
    privacyRights: 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à l\'adresse indiquée ci-dessous.',
    privacyContactTitle: 'Contact',
    privacyContact: 'Pour toute question relative à la protection de vos données, vous pouvez nous contacter via LinkedIn.',
    privacyClose: 'Fermer',

    // Loading
    loadingMessages: [
      'Analyse de votre profil en cours...',
      'Évaluation de votre titre...',
      'Lecture de vos expériences...',
      'Analyse de votre résumé...',
      'Vérification de vos compétences...',
      'Calcul de votre score...',
      'Préparation de vos recommandations...',
    ],

    // Results
    globalOverview: 'Vue d\'ensemble',
    radarView: 'Vue radar',
    criteriaDetail: 'Détail par critère',
    recommendedActions: 'Actions recommandées',
    priorityActions: 'Vos 4 actions prioritaires',
    newAnalysis: 'Nouvelle analyse',
    scoreLabel: 'Score global',

    // Score labels
    scoreFaible: 'Faible',
    scoreMoyen: 'Moyen',
    scoreBon: 'Bon',
    scoreExcellent: 'Excellent',

    // Objective badges
    objectiveBadgeClients: '\u{1F3AF} Objectif : Clients',
    objectiveBadgeTalents: '\u{1F9F2} Objectif : Talents',
    objectiveBadgeRecruteurs: '\u{1F4BC} Objectif : Emploi',
    objectiveBadgeBranding: '\u{1F3A4} Objectif : Personal Branding',

    // PDF Export
    pdfExportButton: 'Exporter en PDF',
    pdfExportLoading: 'Génération...',
    pdfTitle: 'Votre analyse LinkedIn',
    pdfObjectiveLabel: 'Objectif',
    pdfWeightLabel: 'Poids',
    pdfNotEvaluated: 'Non évalué',
    pdfCoffeeCta: 'Cette analyse vous a été utile ? Soutenez le Lab \u2615',
    pdfFooter: 'Généré par Le Lab LinkedIn d\'Augustin',

    // CTA Section (post-analysis)
    ctaSectionTitle: 'Si cette analyse vous a aidé...',
    ctaSectionTitle2: 'envie de renvoyer l\'ascenseur ?',
    ctaShareTitle: 'Partagez votre score et cet outil sur LinkedIn',
    ctaSharePostText: 'Je viens de passer mon profil LinkedIn au Lab d\'Augustin Duret et j\'ai obtenu un score de {score}/100 ! \u{1F9EA}\n\nUn outil gratuit qui analyse votre profil et vous donne un plan d\'action concret selon vos objectifs.\n\nTestez le vôtre ici \u2192 {url}',
    ctaCopyButton: 'Copier le texte',
    ctaCopiedButton: 'Copié \u2713',
    ctaOpenLinkedIn: 'Ouvrir LinkedIn',
    ctaSupportTitle: 'Soutenir le projet',
    ctaSupportText1: 'Cet outil est gratuit et le restera. C\'est promis.',
    ctaSupportText2: 'Mais entre les heures de développement, les coûts d\'hébergement et les crédits IA qui tournent à chaque analyse, le Lab a un coût ! Si cette analyse vous a apporté quelque chose, un p\'tit café m\'aide à maintenir et améliorer l\'outil.',
    ctaSupportTextEmoji: '\u{1FAF6}\u{1F3FC} Un p\'tit geste chouette de votre part, un gros boost pour moi ! \u{1FAF6}\u{1F3FC}',
    ctaSupportButton: '\u2615 Buy me a coffee',
    ctaConnectText: 'Envie d\'aller plus loin dans l\'optimisation de votre profil ?',
    ctaConnectLink: 'Connectons-nous',

    // Footer
    footerText: 'Concocté en laboratoire par Augustin 🧪',

    // Errors
    errorGeneric: 'Une erreur est survenue. Veuillez réessayer.',
    errorConnection: 'Une erreur de connexion est survenue. Vérifiez votre connexion et réessayez.',
  },
  en: {
    // Hero
    heroTitle1: 'Transform your LinkedIn profile',
    heroTitle2: 'into an opportunity ',
    heroTitleHighlight: 'machine',
    heroSubtitle: 'A complete analysis of your profile in 2 minutes, with a detailed score and a personalized action plan based on your goals.',

    // Steps
    step1Title: '1. Your LinkedIn profile',
    step2Title: '2. Your visuals',
    step3Title: '3. Your goal',
    optionalBadge: 'Optional',

    // Step 1
    pdfDropText: 'Drop your LinkedIn profile (PDF)',
    pdfDropHint: 'Download your profile from LinkedIn and drop it here',
    pdfHowToGet: 'How to get it?',
    pdfGuideTitle: 'How to download your LinkedIn profile as PDF',
    pdfGuideSteps: '1. Go to your LinkedIn profile\n2. Click "More"\n3. Click "Save to PDF"',
    pdfGuideClose: 'Close',

    // Step 2 - Banner
    bannerLabel: 'LinkedIn banner',
    bannerSkip: 'I don\'t have a banner',
    bannerAdd: 'Add your banner',
    bannerFormats: 'JPG, PNG or WebP',
    bannerSkipped: 'Banner skipped for analysis',

    // Step 2 - Photo
    photoLabel: 'Profile photo',
    photoSkip: 'I don\'t have a profile photo',
    photoAdd: 'Add your profile photo',
    photoFormats: 'JPG, PNG or WebP',
    photoSkipped: 'Photo skipped for analysis',

    // Step 3 - Objectives
    objectiveClients: 'Find clients',
    objectiveClientsDesc: 'Your LinkedIn profile must convince your prospects that you are THE person they need.',
    objectiveTalents: 'Attract talent',
    objectiveTalentsDesc: 'Your profile should make the best candidates want to respond to you - and join your company.',
    objectiveRecruiters: 'Get noticed by recruiters',
    objectiveRecruitersDesc: 'Your profile should appear in recruiter searches and make them want to contact you.',
    objectiveBranding: 'Build your personal brand',
    objectiveBrandingDesc: 'Your profile should reflect your expertise and position you as a voice that matters in your field.',

    // CTA
    analyzeButton: 'Analyze my profile',

    // RGPD / Consent
    consentLabel: 'I agree that my data will be processed solely for my profile analysis.',
    consentPrivacyLink: 'Privacy policy',

    // File validation errors
    errorPdfType: 'Please select a valid PDF file.',
    errorPdfSize: 'The PDF file must not exceed 10 MB.',
    errorImageType: 'Please select an image in JPG, PNG or WebP format.',
    errorImageSize: 'The image must not exceed 5 MB.',

    // Privacy Policy Modal
    privacyTitle: 'Privacy Policy',
    privacyIntro: 'Le Lab LinkedIn by Augustin is committed to protecting your personal data. This policy explains how we process the information you provide.',
    privacyDataCollectedTitle: 'Data collected',
    privacyDataCollected: 'We only collect data that you voluntarily provide: your LinkedIn profile PDF, your banner and profile photo (optional), and your selected objective.',
    privacyUsageTitle: 'Use of data',
    privacyUsage: 'Your data is used exclusively to generate your profile analysis via the Anthropic Claude API. It is never sold, shared with third parties for commercial purposes, or used for any other purpose.',
    privacyStorageTitle: 'Storage and retention',
    privacyStorage: 'Uploaded files (PDF, images) are processed in memory and are not permanently stored on our servers. Only anonymized analysis results may be retained for statistical purposes.',
    privacyRightsTitle: 'Your rights',
    privacyRights: 'In accordance with the GDPR, you have the right to access, rectify, delete, and port your data. To exercise these rights, contact us at the address below.',
    privacyContactTitle: 'Contact',
    privacyContact: 'For any questions regarding the protection of your data, you can contact us via LinkedIn.',
    privacyClose: 'Close',

    // Loading
    loadingMessages: [
      'Analyzing your profile...',
      'Evaluating your headline...',
      'Reading your experience...',
      'Analyzing your summary...',
      'Checking your skills...',
      'Calculating your score...',
      'Preparing your recommendations...',
    ],

    // Results
    globalOverview: 'Overview',
    radarView: 'Radar view',
    criteriaDetail: 'Criteria breakdown',
    recommendedActions: 'Recommended actions',
    priorityActions: 'Your 4 priority actions',
    newAnalysis: 'New analysis',
    scoreLabel: 'Overall score',

    // Score labels
    scoreFaible: 'Weak',
    scoreMoyen: 'Average',
    scoreBon: 'Good',
    scoreExcellent: 'Excellent',

    // Objective badges
    objectiveBadgeClients: '\u{1F3AF} Goal: Clients',
    objectiveBadgeTalents: '\u{1F9F2} Goal: Talent',
    objectiveBadgeRecruteurs: '\u{1F4BC} Goal: Employment',
    objectiveBadgeBranding: '\u{1F3A4} Goal: Personal Branding',

    // PDF Export
    pdfExportButton: 'Export as PDF',
    pdfExportLoading: 'Generating...',
    pdfTitle: 'Your LinkedIn Analysis',
    pdfObjectiveLabel: 'Goal',
    pdfWeightLabel: 'Weight',
    pdfNotEvaluated: 'Not evaluated',
    pdfCoffeeCta: 'Found this analysis useful? Support the Lab \u2615',
    pdfFooter: 'Generated by Le Lab LinkedIn d\'Augustin',

    // CTA Section (post-analysis)
    ctaSectionTitle: 'If this analysis helped you...',
    ctaSectionTitle2: 'want to return the favor?',
    ctaShareTitle: 'Share your score and this tool on LinkedIn',
    ctaSharePostText: 'I just ran my LinkedIn profile through Augustin Duret\'s Lab and scored {score}/100! \u{1F9EA}\n\nA free tool that analyzes your profile and gives you a concrete action plan based on your goals.\n\nTry it yourself \u2192 {url}',
    ctaCopyButton: 'Copy text',
    ctaCopiedButton: 'Copied \u2713',
    ctaOpenLinkedIn: 'Open LinkedIn',
    ctaSupportTitle: 'Support the project',
    ctaSupportText1: 'This tool is free and always will be. Pinky promise.',
    ctaSupportText2: 'But between the hours of development, hosting costs and the AI credits used for each analysis, the Lab has a cost! If this analysis brought you something, a small coffee helps me maintain and improve the tool.',
    ctaSupportTextEmoji: '\u{1FAF6}\u{1F3FC} A small gesture from you, a huge boost for me! \u{1FAF6}\u{1F3FC}',
    ctaSupportButton: '\u2615 Buy me a coffee',
    ctaConnectText: 'Want to take your profile optimization further?',
    ctaConnectLink: 'Let\'s connect',

    // Footer
    footerText: 'Brewed in the lab by Augustin 🧪',

    // Errors
    errorGeneric: 'An error occurred. Please try again.',
    errorConnection: 'A connection error occurred. Check your connection and try again.',
  },
};

export default translations;
