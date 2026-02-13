import { useLanguage } from '../LanguageContext';

const BORDER_COLORS = ['border-l-blue-500', 'border-l-blue-400', 'border-l-blue-300', 'border-l-blue-200'];
const BG_NUMBERS = ['text-blue-500', 'text-blue-400', 'text-blue-300', 'text-blue-200'];

export default function RoadmapSection({ roadmap }) {
  const { t } = useLanguage();

  return (
    <div className="glass rounded-2xl shadow-sm p-6 space-y-5">
      <h3 className="text-2xl font-black text-primary">{t('priorityActions')}</h3>
      <div className="space-y-4">
        {roadmap.map((item, index) => (
          <div
            key={item.priorite}
            className={`animate-fade-in-up stagger-${index + 1}`}
          >
            <div className={`relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${BORDER_COLORS[index]} p-5 pl-6 card-hover`}>
              <span className={`absolute -right-2 -top-4 text-[120px] font-black leading-none ${BG_NUMBERS[index]} opacity-[0.06] pointer-events-none select-none`}>
                {item.priorite}
              </span>
              <div className="relative z-10 flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm shrink-0 ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-blue-400' : index === 2 ? 'bg-blue-300' : 'bg-blue-200 text-blue-600'
                  }`}
                >
                  {item.priorite}
                </div>
                <div>
                  <h4 className="font-bold text-text mb-1">{item.titre}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
