import React from 'react';
import type { RiskLevel } from '~/types/quiz';

interface RiskGaugeProps {
  percentage: number;
  riskLevel: RiskLevel;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ percentage, riskLevel }) => {
  // SVG circular arc calculations
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc spans 240 degrees (leaving bottom 120 open for a gauge feel)
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (arcLength * Math.min(percentage, 100)) / 100;

  const colorConfig = {
    low: {
      stroke: 'stroke-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      badge: 'Низький ризик',
      subtitle: 'Стабільні стосунки',
    },
    moderate: {
      stroke: 'stroke-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      badge: 'Помірний ризик',
      subtitle: 'Потребує уваги',
    },
    high: {
      stroke: 'stroke-rose-500',
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      badge: 'Високий ризик',
      subtitle: 'Зона ризику кризи',
    },
  }[riskLevel];

  return (
    <div className="flex flex-col items-center justify-center relative py-2">
      <div className="relative w-[180px] h-[180px] flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-[210deg] overflow-visible"
        >
          {/* Background Track Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            className="text-slate-200 dark:text-slate-800"
          />

          {/* Active Colored Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${colorConfig.stroke} transition-all duration-1000 ease-out`}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 text-center pointer-events-none">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Ризик кризи
          </span>
          <div
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${colorConfig.text}`}
          >
            {percentage}%
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
            {colorConfig.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};
