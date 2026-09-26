import React, { useState } from 'react';
import type { CategoryKey, TestResult } from '~/types/quiz';
import { CATEGORIES_META } from '~/data/questions';

interface CircularRadarChartProps {
  result: TestResult;
  onSelectCategory?: (key: CategoryKey) => void;
}

export const CircularRadarChart: React.FC<CircularRadarChartProps> = ({
  result,
  onSelectCategory,
}) => {
  const [hoveredKey, setHoveredKey] = useState<CategoryKey | null>(null);

  // Categories in fixed pentagonal order: Green zones at bottom, Red risk zones at top
  const categories: CategoryKey[] = [
    'contempt', // Red (Top)
    'stonewalling', // Coral/Amber (Top Right)
    'positiveBalance', // Green (Bottom Right)
    'loveMaps', // Green (Bottom Left)
    'criticism', // Red (Top Left)
  ];

  const size = 320;
  const center = size / 2;
  const maxRadius = 100;
  const totalAxes = categories.length;

  // Calculate points for pentagon web at percentage `level` (0..1)
  const getPolygonPoints = (level: number): string => {
    return categories
      .map((_, i) => {
        const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
        const x = center + maxRadius * level * Math.cos(angle);
        const y = center + maxRadius * level * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Calculate user data points
  const dataPoints = categories.map((catKey, i) => {
    const cat = result.categoryBreakdown[catKey];
    const pct = Math.max(12, cat ? cat.percentage : 15);
    const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const r = (pct / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    // Label position (outside the radar)
    const labelRadius = maxRadius + 36;
    const labelX = center + labelRadius * Math.cos(angle);
    const labelY = center + labelRadius * Math.sin(angle);

    const isHealthyCategory = catKey === 'positiveBalance' || catKey === 'loveMaps';
    const vertexColor = isHealthyCategory ? '#10b981' : '#f43f5e';

    return {
      key: catKey,
      name: cat?.name ?? catKey,
      percentage: cat?.percentage ?? 0,
      x,
      y,
      labelX,
      labelY,
      angle,
      vertexColor,
      meta: CATEGORIES_META[catKey],
    };
  });

  const polygonPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const harmonyScore = Math.max(5, 100 - result.overallRiskPercentage);
  const isGoodHarmony = harmonyScore >= 65;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center select-none">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible drop-shadow-md"
        >
          <defs>
            {/* Emerald-to-Crimson dual mesh gradient */}
            <linearGradient id="greenRedMesh" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#14b8a6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.55" />
            </linearGradient>

            {/* Neon Green-to-Red Stroke Gradient */}
            <linearGradient id="greenRedStroke" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="45%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric grid rings (25%, 50%, 75%, 100%) */}
          {[0.25, 0.5, 0.75, 1.0].map((level) => (
            <polygon
              key={level}
              points={getPolygonPoints(level)}
              fill="none"
              stroke="currentColor"
              strokeWidth={level === 1.0 ? 1.5 : 0.8}
              strokeDasharray={level === 1.0 ? undefined : '3,3'}
              className="text-slate-200 dark:text-slate-800/90"
            />
          ))}

          {/* Outer circle accent */}
          <circle
            cx={center}
            cy={center}
            r={maxRadius + 4}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-emerald-500/20 dark:text-emerald-400/20"
          />

          {/* 5 Radial Axis lines from center */}
          {dataPoints.map((p) => {
            const outerX = center + maxRadius * Math.cos(p.angle);
            const outerY = center + maxRadius * Math.sin(p.angle);
            return (
              <line
                key={`axis-${p.key}`}
                x1={center}
                y1={center}
                x2={outerX}
                y2={outerY}
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-200 dark:text-slate-800"
              />
            );
          })}

          {/* Active Data Filled Polygon */}
          <polygon
            points={polygonPath}
            fill="url(#greenRedMesh)"
            stroke="url(#greenRedStroke)"
            strokeWidth="2.5"
            filter="url(#radarGlow)"
            className="transition-all duration-700 ease-out"
          />

          {/* Data Points on vertices with green/red indicator */}
          {dataPoints.map((p) => {
            const isHovered = hoveredKey === p.key;
            return (
              <g
                key={`vertex-${p.key}`}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredKey(p.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => onSelectCategory?.(p.key)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 7 : 5}
                  fill="#ffffff"
                  stroke={p.vertexColor}
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}

          {/* Center Hub: Harmony / Balance */}
          <circle
            cx={center}
            cy={center}
            r="16"
            className={`fill-white dark:fill-slate-900 ${
              isGoodHarmony ? 'stroke-emerald-500' : 'stroke-rose-500'
            }`}
            strokeWidth="2"
          />
          <text
            x={center}
            y={center + 3.5}
            textAnchor="middle"
            className={`text-[10px] font-extrabold pointer-events-none ${
              isGoodHarmony
                ? 'fill-emerald-600 dark:fill-emerald-400'
                : 'fill-rose-600 dark:fill-rose-400'
            }`}
          >
            {harmonyScore}%
          </text>

          {/* Category Outer Labels & Badges */}
          {dataPoints.map((p) => {
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            let dx = 0;
            let dy = 4;

            if (p.angle > -Math.PI / 4 && p.angle < Math.PI / 4) {
              textAnchor = 'start';
              dx = 4;
            } else if (p.angle > (3 * Math.PI) / 4 || p.angle < -(3 * Math.PI) / 4) {
              textAnchor = 'end';
              dx = -4;
            } else if (p.angle < 0) {
              dy = -4;
            } else {
              dy = 12;
            }

            const isRed =
              p.key === 'contempt' || p.key === 'criticism' || p.key === 'stonewalling';

            return (
              <g
                key={`label-${p.key}`}
                className="cursor-pointer select-none"
                onClick={() => onSelectCategory?.(p.key)}
              >
                {/* Emoji + Short Title */}
                <text
                  x={p.labelX + dx}
                  y={p.labelY + dy}
                  textAnchor={textAnchor}
                  className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300"
                >
                  {p.meta?.emoji} {p.meta?.shortName}
                </text>

                {/* Percentage Badge: Green vs Red */}
                <text
                  x={p.labelX + dx}
                  y={p.labelY + dy + 11}
                  textAnchor={textAnchor}
                  className={`text-[9px] font-black ${
                    isRed && p.percentage >= 40
                      ? 'fill-rose-500'
                      : !isRed && p.percentage >= 40
                        ? 'fill-emerald-500'
                        : 'fill-slate-500 dark:fill-slate-400'
                  }`}
                >
                  {p.percentage}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Гармонія / звʼязок</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Зони ризику</span>
        </span>
      </div>
    </div>
  );
};
