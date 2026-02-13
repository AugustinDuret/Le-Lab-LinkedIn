import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

export default function RadarChartSection({ criteres }) {
  const { t } = useLanguage();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const data = criteres.map((c) => ({
    subject: c.nom
      .replace('Compétences clés', 'Compétences')
      .replace('Cohérence globale', 'Cohérence')
      .replace('Key Skills', 'Skills')
      .replace('Overall coherence', 'Coherence'),
    score: animated ? c.score : 0,
    fullMark: 100,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-black text-primary mb-4 text-center">{t('radarView')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} tickCount={5} />
          <Radar
            name="Glow"
            dataKey="score"
            stroke="none"
            fill="#3B82F6"
            fillOpacity={0.1}
            animationDuration={1000}
            animationEasing="ease-out"
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ r: 5, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
