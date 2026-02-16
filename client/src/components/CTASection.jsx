import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

export default function CTASection({ score }) {
  const { t, lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const siteUrl = 'https://le-lab-linkedin-production.up.railway.app';
  const postText = t('ctaSharePostText')
    .replace('{score}', score)
    .replace('{url}', siteUrl);

  const linkedInProfileUrl = 'https://www.linkedin.com/in/augustin-duret/';
  const linkedInFeedUrl = 'https://www.linkedin.com/feed/';

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = postText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [postText]);

  useEffect(() => {
    // Remove any existing BMC widget so it re-renders with the correct language
    const existing = document.querySelector('.bmc-btn-container');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'augustin.lelab');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-emoji', '☕');
    script.setAttribute('data-font', 'Cookie');
    script.setAttribute('data-text', lang === 'fr' ? "M'offrir un café" : 'Buy me a coffee');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#000000');
    script.setAttribute('data-coffee-color', '#ffffff');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      const btn = document.querySelector('.bmc-btn-container');
      if (btn) btn.remove();
    };
  }, [lang]);

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

        {/* 1. Buy Me a Coffee Block — most visible, first */}
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
              <div className="bmc-btn-container" />
            </div>
          </div>
        </div>

        {/* 2. LinkedIn Share Block — second */}
        <div className="cta-glass rounded-2xl p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#0077B5' }}>
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-lg">{t('ctaShareTitle')}</h3>
          </div>

          {/* Pre-filled post text */}
          <div className="bg-white/10 rounded-xl p-4 md:p-5">
            <p className="text-sm text-blue-100 leading-relaxed whitespace-pre-line font-mono">
              {postText}
            </p>
          </div>

          {/* Two buttons side by side */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 flex-1 ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {t('ctaCopiedButton')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  {t('ctaCopyButton')}
                </>
              )}
            </button>
            <a
              href={linkedInFeedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl text-white text-sm transition-all hover:opacity-90 flex-1"
              style={{ background: '#0077B5' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {t('ctaOpenLinkedIn')}
            </a>
          </div>
        </div>

        {/* 3. LinkedIn Profile Link — discreet, at bottom */}
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
