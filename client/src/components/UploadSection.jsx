import { useRef, useState, useCallback } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useLanguage } from '../LanguageContext';
import PrivacyModal from './PrivacyModal';

/* --- File validation constants --- */
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/* --- SVG Icons for objectives --- */
const TargetIcon = ({ active }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFFFFF' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill={active ? '#FFFFFF' : '#9CA3AF'} />
  </svg>
);

const MagnetIcon = ({ active }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFFFFF' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
    <path d="M6 2v6a6 6 0 1012 0V2" />
    <path d="M6 2h4v6a2 2 0 11-4 0V2z" fill={active ? 'rgba(255,255,255,0.2)' : 'none'} />
    <path d="M14 2h4v6a2 2 0 11-4 0V2z" fill={active ? 'rgba(255,255,255,0.2)' : 'none'} />
    <line x1="6" y1="6" x2="10" y2="6" />
    <line x1="14" y1="6" x2="18" y2="6" />
  </svg>
);

const BriefcaseIcon = ({ active }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFFFFF' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
    <rect x="2" y="7" width="20" height="14" rx="2" fill={active ? 'rgba(255,255,255,0.2)' : 'none'} />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    <line x1="2" y1="13" x2="22" y2="13" />
  </svg>
);

const MegaphoneIcon = ({ active }) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#FFFFFF' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300">
    <path d="M19 4L9 8H5a2 2 0 00-2 2v0a2 2 0 002 2h4l10 4V4z" fill={active ? 'rgba(255,255,255,0.2)' : 'none'} />
    <path d="M19 4v16" />
    <path d="M7 12v4a2 2 0 002 2h1" />
    <circle cx="21" cy="10" r="1" fill={active ? '#FFFFFF' : '#9CA3AF'} />
  </svg>
);

const ICON_MAP = {
  clients: TargetIcon,
  talents: MagnetIcon,
  recruteurs: BriefcaseIcon,
  branding: MegaphoneIcon,
};

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

export default function UploadSection({
  pdfFile,
  onPdfChange,
  bannerFile,
  onBannerChange,
  skipBanner,
  onSkipBannerChange,
  photoFile,
  onPhotoChange,
  skipPhoto,
  onSkipPhotoChange,
  objective,
  onObjectiveChange,
  turnstileToken,
  onTurnstileToken,
  consent,
  onConsentChange,
  onAnalyze,
  error,
}) {
  const { t } = useLanguage();
  const pdfInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const [pdfDragActive, setPdfDragActive] = useState(false);
  const [bannerDragActive, setBannerDragActive] = useState(false);
  const [photoDragActive, setPhotoDragActive] = useState(false);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  /* --- File validation helpers --- */
  const validatePdf = useCallback((file) => {
    if (!file || file.type !== 'application/pdf') {
      setFileError(t('errorPdfType'));
      return false;
    }
    if (file.size > MAX_PDF_SIZE) {
      setFileError(t('errorPdfSize'));
      return false;
    }
    setFileError(null);
    return true;
  }, [t]);

  const validateImage = useCallback((file) => {
    if (!file || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFileError(t('errorImageType'));
      return false;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setFileError(t('errorImageSize'));
      return false;
    }
    setFileError(null);
    return true;
  }, [t]);

  /* --- PDF handlers --- */
  const handlePdfDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setPdfDragActive(true);
    else if (e.type === 'dragleave') setPdfDragActive(false);
  }, []);

  const handlePdfDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setPdfDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && validatePdf(file)) onPdfChange(file);
  }, [onPdfChange, validatePdf]);

  const handlePdfSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file && validatePdf(file)) onPdfChange(file);
  }, [onPdfChange, validatePdf]);

  /* --- Banner handlers --- */
  const handleBannerDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setBannerDragActive(true);
    else if (e.type === 'dragleave') setBannerDragActive(false);
  }, []);

  const handleBannerDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setBannerDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && validateImage(file)) {
      onBannerChange(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  }, [onBannerChange, validateImage]);

  const handleBannerSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      onBannerChange(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  }, [onBannerChange, validateImage]);

  const removeBanner = useCallback(() => {
    onBannerChange(null);
    setBannerPreview(null);
    if (bannerInputRef.current) bannerInputRef.current.value = '';
  }, [onBannerChange]);

  /* --- Photo handlers --- */
  const handlePhotoDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setPhotoDragActive(true);
    else if (e.type === 'dragleave') setPhotoDragActive(false);
  }, []);

  const handlePhotoDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && validateImage(file)) {
      onPhotoChange(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [onPhotoChange, validateImage]);

  const handlePhotoSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      onPhotoChange(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [onPhotoChange, validateImage]);

  const removePhoto = useCallback(() => {
    onPhotoChange(null);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  }, [onPhotoChange]);

  const removePdf = useCallback(() => {
    onPdfChange(null);
    if (pdfInputRef.current) pdfInputRef.current.value = '';
  }, [onPdfChange]);

  const OBJECTIVES = [
    {
      key: 'clients',
      title: t('objectiveClients'),
      description: t('objectiveClientsDesc'),
    },
    {
      key: 'talents',
      title: t('objectiveTalents'),
      description: t('objectiveTalentsDesc'),
    },
    {
      key: 'recruteurs',
      title: t('objectiveRecruiters'),
      description: t('objectiveRecruitersDesc'),
    },
    {
      key: 'branding',
      title: t('objectiveBranding'),
      description: t('objectiveBrandingDesc'),
    },
  ];

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const hasTurnstile = Boolean(siteKey);
  const photoHandled = photoFile || skipPhoto;
  const bannerHandled = bannerFile || skipBanner;
  const isReady = pdfFile && objective && consent && (turnstileToken || !hasTurnstile) && photoHandled && bannerHandled;

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Step 1 - PDF Upload */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">1</span>
            <h3 className="font-black text-text text-2xl">{t('step1Title').replace('1. ', '')}</h3>
          </div>

          {!pdfFile ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 min-h-[180px] flex flex-col items-center justify-center ${
                pdfDragActive
                  ? 'border-accent bg-blue-50/80'
                  : 'border-gray-300 bg-blue-50/30 upload-zone-idle'
              }`}
              onDragEnter={handlePdfDrag}
              onDragOver={handlePdfDrag}
              onDragLeave={handlePdfDrag}
              onDrop={handlePdfDrop}
              onClick={() => pdfInputRef.current?.click()}
            >
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-sm text-gray-600 mb-1 font-medium">{t('pdfDropText')}</p>
              <p className="text-xs text-gray-400">{t('pdfDropHint')}</p>
              <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfSelect} />
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 min-h-[180px]">
              <div className="animate-bounce-check">
                <svg className="w-6 h-6 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-green-800 truncate">{pdfFile.name}</p>
                <p className="text-xs text-green-600">{formatFileSize(pdfFile.size)}</p>
              </div>
              <button onClick={removePdf} className="text-green-400 hover:text-green-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Step 2 - Visuals (Optional) */}
        <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 space-y-5">
          {/* Optional badge */}
          <span className="absolute top-3 right-4 text-xs text-gray-400 font-medium">{t('optionalBadge')}</span>

          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">2</span>
            <h3 className="font-black text-text text-2xl">{t('step2Title').replace('2. ', '')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner sub-section */}
            <div className="space-y-3">
              <h4 className="font-bold text-text text-sm">{t('bannerLabel')}</h4>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" checked={skipBanner} onChange={(e) => { onSkipBannerChange(e.target.checked); if (e.target.checked) { onBannerChange(null); setBannerPreview(null); if (bannerInputRef.current) bannerInputRef.current.value = ''; } }} />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-accent transition-colors"></div>
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="text-sm text-gray-500">{t('bannerSkip')}</span>
              </label>

              {!skipBanner ? (
                <>
                  {!bannerFile ? (
                    <div
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 min-h-[120px] flex flex-col items-center justify-center ${
                        bannerDragActive
                          ? 'border-accent bg-blue-50/80'
                          : 'border-gray-300 bg-blue-50/30 upload-zone-idle'
                      }`}
                      onDragEnter={handleBannerDrag}
                      onDragOver={handleBannerDrag}
                      onDragLeave={handleBannerDrag}
                      onDrop={handleBannerDrop}
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">{t('bannerAdd')}</p>
                      <p className="text-xs text-gray-400">{t('bannerFormats')}</p>
                      <input ref={bannerInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleBannerSelect} />
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 min-h-[120px]">
                      {bannerPreview && <img src={bannerPreview} alt="Bannière" className="w-full h-24 object-cover" />}
                      <div className="p-2 bg-green-50 flex items-center justify-between">
                        <p className="text-xs text-green-700 truncate">{bannerFile.name}</p>
                        <button onClick={removeBanner} className="text-green-400 hover:text-green-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 min-h-[120px] flex items-center justify-center">
                  <p className="text-sm text-gray-400 italic">{t('bannerSkipped')}</p>
                </div>
              )}
            </div>

            {/* Photo sub-section */}
            <div className="space-y-3">
              <h4 className="font-bold text-text text-sm">{t('photoLabel')}</h4>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" checked={skipPhoto} onChange={(e) => { onSkipPhotoChange(e.target.checked); if (e.target.checked) { onPhotoChange(null); setPhotoPreview(null); if (photoInputRef.current) photoInputRef.current.value = ''; } }} />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-accent transition-colors"></div>
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="text-sm text-gray-500">{t('photoSkip')}</span>
              </label>

              {!skipPhoto ? (
                <>
                  {!photoFile ? (
                    <div
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 min-h-[120px] flex flex-col items-center justify-center ${
                        photoDragActive
                          ? 'border-accent bg-blue-50/80'
                          : 'border-gray-300 bg-blue-50/30 upload-zone-idle'
                      }`}
                      onDragEnter={handlePhotoDrag}
                      onDragOver={handlePhotoDrag}
                      onDragLeave={handlePhotoDrag}
                      onDrop={handlePhotoDrop}
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">{t('photoAdd')}</p>
                      <p className="text-xs text-gray-400">{t('photoFormats')}</p>
                      <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoSelect} />
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 min-h-[120px]">
                      {photoPreview && <img src={photoPreview} alt="Photo de profil" className="w-full h-24 object-cover" />}
                      <div className="p-2 bg-green-50 flex items-center justify-between">
                        <p className="text-xs text-green-700 truncate">{photoFile.name}</p>
                        <button onClick={removePhoto} className="text-green-400 hover:text-green-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 min-h-[120px] flex items-center justify-center">
                  <p className="text-sm text-gray-400 italic">{t('photoSkipped')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 3 - Objective selection */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-bold">3</span>
            <h3 className="font-black text-text text-2xl">{t('step3Title').replace('3. ', '')}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OBJECTIVES.map((obj) => {
              const isSelected = objective === obj.key;
              const IconComponent = ICON_MAP[obj.key];
              return (
                <button
                  key={obj.key}
                  onClick={() => onObjectiveChange(obj.key)}
                  className={`relative text-left p-5 rounded-2xl card-hover ${
                    isSelected
                      ? 'border-[3px] objective-card-selected scale-[1.02]'
                      : 'border-[3px] border-transparent bg-white shadow-md'
                  }`}
                >
                  <div className="absolute top-3.5 right-3.5 z-10">
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#0A1F3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div className="mb-3 relative z-10">
                    <IconComponent active={isSelected} />
                  </div>
                  <h4 className={`font-bold mb-1 relative z-10 ${isSelected ? 'text-white' : 'text-text'}`}>{obj.title}</h4>
                  <p className={`text-sm leading-relaxed pr-8 relative z-10 ${isSelected ? 'text-blue-200/80' : 'text-gray-500'}`}>{obj.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* RGPD Consent + Turnstile + CTA */}
        <div className="flex flex-col items-center gap-5 pt-2">
          {/* File validation error */}
          {fileError && (
            <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-3 text-center animate-fade-in">
              <p className="text-sm text-red-700 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {fileError}
              </p>
            </div>
          )}

          {/* RGPD Consent checkbox */}
          <label className="flex items-start gap-3 cursor-pointer max-w-md">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={consent}
                onChange={(e) => onConsentChange(e.target.checked)}
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-accent peer-checked:border-accent transition-all flex items-center justify-center">
                {consent && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600 leading-relaxed">
              {t('consentLabel')}{' '}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setPrivacyOpen(true); }}
                className="text-accent hover:text-blue-700 underline underline-offset-2 font-medium"
              >
                {t('consentPrivacyLink')}
              </button>
            </span>
          </label>

          {hasTurnstile && (
            <Turnstile
              siteKey={siteKey}
              onSuccess={(token) => onTurnstileToken(token)}
              options={{ theme: 'light', size: 'normal' }}
            />
          )}

          <button
            onClick={onAnalyze}
            disabled={!isReady}
            className={`analyze-btn relative flex items-center justify-center gap-3 font-bold py-4 px-10 rounded-[16px] text-lg transition-all duration-200 ${
              isReady
                ? 'analyze-btn--active text-white shadow-lg cursor-pointer'
                : 'bg-[#D1D5DB] text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isReady && (
              <>
                <span className="bubble bubble-1" />
                <span className="bubble bubble-2" />
                <span className="bubble bubble-3" />
                <span className="bubble bubble-4" />
                <span className="bubble bubble-5" />
              </>
            )}
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
              <path
                d="M16 4h8v2h-1v10.5l8.5 14.25A3 3 0 0128.93 36H11.07a3 3 0 01-2.57-4.75L17 17V6h-1V4z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
              />
            </svg>
            <span className="relative z-10">{t('analyzeButton')}</span>
          </button>

          {error && (
            <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-4 text-center animate-fade-in">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  );
}
