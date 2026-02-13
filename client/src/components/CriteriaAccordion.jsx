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

export default function CriteriaAccordion({ criteres }) {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-black text-primary mb-4">{t('criteriaDetail')}</h3>
      {criteres.map((critere, index) => {
        const isOpen = openIndex === index;
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
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
