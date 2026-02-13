import { useState, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import HeroSection from './components/HeroSection';
import UploadSection from './components/UploadSection';
import LoadingSection from './components/LoadingSection';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';

function AppContent() {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState('upload'); // 'upload' | 'loading' | 'results'
  const [pdfFile, setPdfFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [skipBanner, setSkipBanner] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [skipPhoto, setSkipPhoto] = useState(false);
  const [objective, setObjective] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [consent, setConsent] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = useCallback(async () => {
    const photoOk = photoFile || skipPhoto;
    const bannerOk = bannerFile || skipBanner;
    if (!pdfFile || !objective || !turnstileToken || !consent || !photoOk || !bannerOk) return;

    setError(null);
    setStep('loading');

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      if (bannerFile && !skipBanner) {
        formData.append('banner', bannerFile);
      }
      if (photoFile && !skipPhoto) {
        formData.append('photo', photoFile);
      }
      formData.append('objective', objective);
      formData.append('skipBanner', skipBanner.toString());
      formData.append('skipPhoto', skipPhoto.toString());
      formData.append('lang', lang);
      formData.append('turnstileToken', turnstileToken);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('errorGeneric'));
        setStep('upload');
        return;
      }

      setResults(data);
      setStep('results');
    } catch {
      setError(t('errorConnection'));
      setStep('upload');
    }
  }, [pdfFile, bannerFile, skipBanner, photoFile, skipPhoto, objective, turnstileToken, consent, lang, t]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setPdfFile(null);
    setBannerFile(null);
    setSkipBanner(false);
    setPhotoFile(null);
    setSkipPhoto(false);
    setObjective(null);
    setTurnstileToken(null);
    setConsent(false);
    setResults(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {step === 'upload' && (
        <UploadSection
          pdfFile={pdfFile}
          onPdfChange={setPdfFile}
          bannerFile={bannerFile}
          onBannerChange={setBannerFile}
          skipBanner={skipBanner}
          onSkipBannerChange={setSkipBanner}
          photoFile={photoFile}
          onPhotoChange={setPhotoFile}
          skipPhoto={skipPhoto}
          onSkipPhotoChange={setSkipPhoto}
          objective={objective}
          onObjectiveChange={setObjective}
          turnstileToken={turnstileToken}
          onTurnstileToken={setTurnstileToken}
          consent={consent}
          onConsentChange={setConsent}
          onAnalyze={handleAnalyze}
          error={error}
        />
      )}

      {step === 'loading' && <LoadingSection />}

      {step === 'results' && results && (
        <ResultsSection results={results} onReset={handleReset} />
      )}

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
