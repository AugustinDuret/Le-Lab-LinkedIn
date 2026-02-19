import { useLanguage } from '../LanguageContext';

export default function CTASection({ score }) {
  const { t } = useLanguage();

  const buyMeCoffeeUrl = 'https://buymeacoffee.com/augustin.lelab';
  const linkedInProfileUrl = 'https://www.linkedin.com/in/augustin-duret/';

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 hero-gradient overflow-hidden">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {t('ctaSectionTitle')}
          </h2>
          <p className="text-2xl md:text-3xl font-black text-gradient">
            {t('ctaSectionTitle2')}
          </p>
        </div>

        {/* Buy Me a Coffee Block */}
        <div className="cta-glass rounded-2xl p-6 md:p-8">
          <div className="space-y-5">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <span className="text-2xl">☕</span>
              {t('ctaSupportTitle')}
            </h3>

            <div className="space-y-4">
              <p className="text-sm text-blue-200/90 leading-relaxed">{t('ctaSupportText1')}</p>
              <p className="text-sm text-blue-200/90 leading-relaxed">{t('ctaSupportText2')}</p>
              <p className="text-lg text-white font-medium text-center leading-relaxed">{t('ctaSupportTextEmoji')}</p>
            </div>

            <div className="flex justify-center pt-1">
              <a
                href={buyMeCoffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center cursor-pointer transition-opacity duration-200 hover:opacity-90"
                style={{
                  background: '#FFDD00',
                  border: '1px solid #000000',
                  borderRadius: '5px',
                  padding: '7px 10px',
                  fontFamily: "'Cookie', cursive",
                  fontSize: '28px',
                  color: '#000000',
                  textDecoration: 'none',
                }}
              >
                {t('ctaSupportButton')}
              </a>
            </div>
          </div>
        </div>

        {/* LinkedIn Profile Link — discreet, at bottom */}
        <div className="text-center pt-2">
          <p className="text-white/80 text-sm leading-relaxed">
            {t('ctaConnectText')}{' '}
            <a
              href={linkedInProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 decoration-white/50 hover:decoration-white font-medium transition-all"
            >
              {t('ctaConnectLink')}
            </a>
            {' '}<span className="text-3xl align-middle">{'\u{1F91D}'}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
