import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';

function getScoreColor(score) {
  if (score < 40) return '#EF4444';
  if (score < 70) return '#F59E0B';
  return '#10B981';
}

const OBJECTIVE_BADGE_KEYS = {
  clients: 'objectiveBadgeClients',
  talents: 'objectiveBadgeTalents',
  recruteurs: 'objectiveBadgeRecruteurs',
  branding: 'objectiveBadgeBranding',
};

export default function ScoreCircle({ score, objective }) {
  const { t } = useLanguage();
  const [displayScore, setDisplayScore] = useState(0);
  const animationRef = useRef(null);

  function getScoreLabel(s) {
    if (s < 40) return t('scoreFaible');
    if (s < 60) return t('scoreMoyen');
    if (s < 80) return t('scoreBon');
    return t('scoreExcellent');
  }

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [score]);

  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Glow behind circle */}
        <div
          className="absolute inset-0 rounded-full score-glow"
          style={{ background: color, transform: 'scale(0.85)' }}
        />
        <svg width="200" height="200" className="-rotate-90 relative z-10">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke={color} strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <span className="text-5xl font-black tabular-nums" style={{ color }}>{displayScore}</span>
          <span className="text-sm text-gray-400 font-medium">/100</span>
        </div>
      </div>
      {objective && OBJECTIVE_BADGE_KEYS[objective] && (
        <span className="mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-semibold border" style={{ backgroundColor: '#EBF5FF', color: '#1E3A5F', borderColor: '#BFDBFE' }}>
          {t(OBJECTIVE_BADGE_KEYS[objective])}
        </span>
      )}
      <span className="mt-2 text-lg font-bold" style={{ color }}>{label}</span>
      <span className="text-sm text-gray-400">{t('scoreLabel')}</span>
    </div>
  );
}
