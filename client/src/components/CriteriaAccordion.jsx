import { useState } from 'react';
import { useLanguage } from '../LanguageContext';

function getBarColor(score) {
  if (score < 40) return 'bg-danger';
  if (score < 60) return 'bg-warning';
  if (score < 80) return 'bg-accent';
  return 'bg-success';
}

function getTextColor(score) {
  if (score < 40) return 'text-danger';
  if (score < 60) return 'text-warning';
  if (score < 80) return 'text-accent';
  return 'text-success';
}

function CopyableBlock({ text, badge, badgeColor }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}
        >
          {badge}
        </span>
      </div>
      <div className="flex items-start gap-2 bg-gray-50 rounded-xl border border-gray-200 p-3">
        <span className="flex-1 text-sm font-semibold text-gray-800 leading-snug">{text}</span>
        <button
          onClick={handleCopy}
          className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg transition-all duration-200 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {copied ? t('labCopiedButton') : t('labCopyButton')}
        </button>
      </div>
    </div>
  );
}

function CopyableSummaryBlock({ text }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap mb-3">{text}</p>
      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
        >
          {copied ? t('labCopiedButton') : t('labCopySummaryButton')}
        </button>
      </div>
    </div>
  );
}

function LabRecommendationBox({ children }) {
  const { t } = useLanguage();
  return (
    <div
      className="mt-4 rounded-xl p-4"
      style={{
        background: '#FFF9E6',
        border: '2px dashed #F5C842',
        borderRadius: '12px',
      }}
    >
      <p className="text-sm font-bold mb-3" style={{ color: '#B8860B' }}>
        <span style={{ color: '#B8860B' }}>{t('labRecommendationAstuce')}</span>
        {' | '}
        {t('labRecommendationTitle')}
      </p>
      {children}
    </div>
  );
}

export default function CriteriaAccordion({ criteres, recommandationTitre, recommandationResume }) {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Identify titre and resume criteria keys (language-agnostic)
  const titreCriterionNames = ['Titre', 'Headline'];
  const resumeCriterionNames = ['Résumé', 'Summary'];

  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-black text-primary mb-4">{t('criteriaDetail')}</h3>
      {criteres.map((critere, index) => {
        const isOpen = openIndex === index;
        const isTitre = titreCriterionNames.some(n => critere.nom.includes(n));
        const isResume = resumeCriterionNames.some(n => critere.nom.includes(n));

        return (
          <div key={critere.nom} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggle(index)}
              className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className={`text-2xl font-black tabular-nums ${getTextColor(critere.score)}`}>
                {critere.score}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-text text-sm">{critere.nom}</span>
                  <span className="text-xs text-gray-400 ml-2 shrink-0">x {critere.poids}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full progress-bar-fill ${getBarColor(critere.score)}`}
                    style={{ width: `${critere.score}%` }}
                  />
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-3">{critere.explication}</p>
                  {critere.actions && critere.actions.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('recommendedActions')}</p>
                      <ul className="space-y-1.5">
                        {critere.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-accent mt-0.5 font-bold">→</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommandation du Lab — Titre */}
                  {isTitre && recommandationTitre?.recommande && recommandationTitre?.alternative && (
                    <LabRecommendationBox>
                      <CopyableBlock
                        text={recommandationTitre.recommande}
                        badge={t('labRecommendedBadge')}
                        badgeColor="bg-green-100 text-green-700 border border-green-200"
                      />
                      <CopyableBlock
                        text={recommandationTitre.alternative}
                        badge={t('labAlternativeBadge')}
                        badgeColor="bg-blue-100 text-blue-700 border border-blue-200"
                      />
                    </LabRecommendationBox>
                  )}

                  {/* Recommandation du Lab — Résumé */}
                  {isResume && recommandationResume && (
                    <LabRecommendationBox>
                      <CopyableSummaryBlock text={recommandationResume} />
                    </LabRecommendationBox>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
