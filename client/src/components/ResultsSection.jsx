import { useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import ScoreCircle from './ScoreCircle';
import RadarChartSection from './RadarChartSection';
import GlobalAnalysis from './GlobalAnalysis';
import CriteriaAccordion from './CriteriaAccordion';
import RoadmapSection from './RoadmapSection';
import CTASection from './CTASection';
import PdfExport from './PdfExport';

function Separator() {
  return <div className="section-separator my-2" />;
}

export default function ResultsSection({ results, onReset }) {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-4xl mx-auto space-y-16 px-4">
        {/* Score + Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center animate-fade-in-up stagger-1">
            <ScoreCircle score={results.scoreGlobal} objective={results.objective} />
          </div>
          <div className="animate-fade-in-up stagger-2">
            <RadarChartSection criteres={results.criteres} />
          </div>
        </div>

        <Separator />

        <div className="animate-fade-in-up stagger-3">
          <GlobalAnalysis text={results.analyseGlobale} />
        </div>

        <Separator />

        <div className="animate-fade-in-up stagger-4">
          <CriteriaAccordion
            criteres={results.criteres}
            recommandationTitre={results.recommandationTitre}
            recommandationResume={results.recommandationResume}
          />
        </div>

        <Separator />

        <div className="animate-fade-in-up stagger-5">
          <RoadmapSection roadmap={results.feuilleDeRoute} />
        </div>
      </div>

      {/* CTA Section — full width, outside the max-w container */}
      <div className="mt-16 animate-fade-in-up stagger-6">
        <CTASection score={results.scoreGlobal} />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center pt-12 animate-fade-in-up stagger-7">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-text font-bold py-3 px-8 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          {t('newAnalysis')}
        </button>
      </div>

      {/* Floating PDF Export Button */}
      <PdfExport results={results} />
    </section>
  );
}
