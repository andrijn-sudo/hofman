import React, { useState } from 'react';
import { ChevronDown, Sparkles, AlertCircle } from 'lucide-react';
import type { CategoryResult } from '~/types/quiz';
import { CATEGORIES_META } from '~/data/questions';

interface CategoryCardProps {
  categoryResult: CategoryResult;
  isDominant?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  categoryResult,
  isDominant = false,
}) => {
  const [isOpen, setIsOpen] = useState(isDominant);
  const meta = CATEGORIES_META[categoryResult.key];

  const severityBadge = {
    low: {
      text: 'Безпечно',
      class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    moderate: {
      text: 'Потребує уваги',
      class: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    },
    high: {
      text: 'Критична зона',
      class: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
    },
  }[categoryResult.severity];

  const barColor =
    categoryResult.percentage >= 60
      ? 'bg-rose-600 dark:bg-rose-500'
      : categoryResult.percentage >= 35
        ? 'bg-amber-500 dark:bg-amber-400'
        : 'bg-emerald-500 dark:bg-emerald-400';

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white dark:bg-slate-900/50 ${
        isDominant
          ? 'border-rose-500/50 ring-2 ring-rose-500/20 dark:ring-rose-500/30'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Header (Always Visible / Tap to Expand) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-4 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta?.emoji ?? '📌'}</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {categoryResult.name}
                </h4>
                {isDominant && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                    Головний тригер
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Вага в оцінці: ×{meta?.weight?.toFixed(1) ?? '1.0'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${severityBadge.class}`}
            >
              {severityBadge.text}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {/* Percentage Progress Bar */}
        <div className="space-y-1 mt-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">
              Бал: {categoryResult.rawScore} із {categoryResult.maxRawScore}
            </span>
            <span className="text-slate-900 dark:text-white font-bold">
              {categoryResult.percentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${categoryResult.percentage}%` }}
            />
          </div>
        </div>
      </button>

      {/* Expandable Accordion Body */}
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3.5 text-xs">
          {/* Description */}
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {categoryResult.description}
          </p>

          {/* Danger sign */}
          {meta?.dangerSign && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold block text-[11px] text-amber-800 dark:text-amber-300">
                  Чому це небезпечно:
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {meta.dangerSign}
                </p>
              </div>
            </div>
          )}

          {/* Antidote Block (Ґоттманівська протиотрута) */}
          {meta?.antidote && (
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Протиотрута за Ґоттманом: {meta.antidote.title}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {meta.antidote.explanation}
              </p>
              <div className="pt-1 text-[11px] font-medium text-emerald-950 dark:text-emerald-200 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                <strong className="block text-emerald-700 dark:text-emerald-400 mb-0.5">
                  Практична дія:
                </strong>
                {meta.antidote.actionStep}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
