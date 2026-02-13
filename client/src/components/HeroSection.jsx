import { useLanguage } from '../LanguageContext';

export default function HeroSection() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="hero-gradient pt-8 pb-20 px-4 relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern" />

      {/* Subtle glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 bg-accent rounded-full blur-3xl opacity-[0.06]" />
        <div className="absolute -bottom-10 left-10 w-56 h-56 bg-blue-300 rounded-full blur-3xl opacity-[0.06]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Logo + Language selector row */}
        <div className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-3">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 6h10v2h-2v12l10 16a4 4 0 01-3.4 6.1H14.4A4 4 0 0111 36l10-16V8h-2V6z"
                fill="#1E3A5F"
                stroke="#60A5FA"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.4 42.1a4 4 0 01-3.4-6.1l6.5-10.4C18.8 23.4 20 22 22 22h4c2 0 3.2 1.4 4.5 3.6L37 36a4 4 0 01-3.4 6.1H14.4z"
                fill="url(#liquidGradient)"
                opacity="0.8"
              />
              <rect x="21" y="8" width="6" height="12" fill="#60A5FA" opacity="0.08" rx="1" />
              <circle cx="20" cy="35" r="1.8" fill="#93C5FD" opacity="0.6">
                <animate attributeName="cy" values="35;26;20" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.3;0" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="r" values="1.8;1.2;0.4" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="27" cy="38" r="1.4" fill="#A78BFA" opacity="0.6">
                <animate attributeName="cy" values="38;28;22" dur="2.5s" begin="0.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.3;0" dur="2.5s" begin="0.4s" repeatCount="indefinite" />
                <animate attributeName="r" values="1.4;0.9;0.3" dur="2.5s" begin="0.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="23" cy="36" r="1" fill="#34D399" opacity="0.6">
                <animate attributeName="cy" values="36;24;18" dur="1.8s" begin="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.3;0" dur="1.8s" begin="0.8s" repeatCount="indefinite" />
                <animate attributeName="r" values="1;0.6;0.2" dur="1.8s" begin="0.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="22" cy="4" r="1.2" fill="#93C5FD" opacity="0.4">
                <animate attributeName="cy" values="5;1;-2" dur="3s" begin="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.2;0" dur="3s" begin="1.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="26" cy="3" r="0.8" fill="#A78BFA" opacity="0.3">
                <animate attributeName="cy" values="4;0;-3" dur="2.8s" begin="0.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.15;0" dur="2.8s" begin="0.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="24" cy="3" r="0.6" fill="#34D399" opacity="0.35">
                <animate attributeName="cy" values="3;-1;-4" dur="3.2s" begin="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0.15;0" dur="3.2s" begin="2s" repeatCount="indefinite" />
              </circle>
              <defs>
                <linearGradient id="liquidGradient" x1="14" y1="22" x2="34" y2="42" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold text-white/90">
              Le{' '}
              <span className="inline-block bg-accent text-white text-sm font-bold px-3 py-1 rounded-full align-middle">
                Lab
              </span>{' '}
              LinkedIn{' '}
              <span className="text-blue-200">d'Augustin</span>
            </span>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang('fr')}
              className={`text-2xl leading-none rounded-md p-1 transition-all duration-200 ${
                lang === 'fr'
                  ? 'ring-2 ring-accent opacity-100'
                  : 'opacity-50 hover:opacity-75'
              }`}
              aria-label="Français"
            >
              🇫🇷
            </button>
            <button
              onClick={() => setLang('en')}
              className={`text-2xl leading-none rounded-md p-1 transition-all duration-200 ${
                lang === 'en'
                  ? 'ring-2 ring-accent opacity-100'
                  : 'opacity-50 hover:opacity-75'
              }`}
              aria-label="English"
            >
              🇬🇧
            </button>
          </div>
        </div>

        {/* Hero text */}
        <div className="text-center mb-6 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            {t('heroTitle1')}
            <br />
            {t('heroTitle2')}<span className="text-gradient">{t('heroTitleHighlight')}</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-200/80 max-w-2xl mx-auto leading-relaxed font-normal">
            {t('heroSubtitle')}
          </p>
        </div>
      </div>
    </header>
  );
}
