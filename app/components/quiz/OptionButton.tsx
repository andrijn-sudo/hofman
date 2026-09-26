import React from 'react';
import { Check } from 'lucide-react';
import type { AnswerOption } from '~/types/quiz';

interface OptionButtonProps {
  option: AnswerOption;
  isSelected: boolean;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  option,
  isSelected,
  onSelect,
  disabled = false,
}) => {
  // Green-to-Red continuum configuration based on answer severity
  const toneConfig = [
    // 0: Взагалі не про нас (Healthy green)
    {
      selectedBorder: 'border-emerald-500 dark:border-emerald-400',
      selectedBg: 'bg-emerald-50/90 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20',
      badgeActive: 'bg-emerald-600 text-white',
      checkBg: 'border-emerald-600 bg-emerald-600 text-white',
      textActive: 'text-emerald-950 dark:text-emerald-100',
      hintActive: 'text-emerald-700/80 dark:text-emerald-300/80',
    },
    // 1: Буває, але рідко (Teal / Light green)
    {
      selectedBorder: 'border-teal-500 dark:border-teal-400',
      selectedBg: 'bg-teal-50/90 dark:bg-teal-950/40 ring-2 ring-teal-500/20',
      badgeActive: 'bg-teal-600 text-white',
      checkBg: 'border-teal-600 bg-teal-600 text-white',
      textActive: 'text-teal-950 dark:text-teal-100',
      hintActive: 'text-teal-700/80 dark:text-teal-300/80',
    },
    // 2: Часто таке трапляється (Amber / Coral warning)
    {
      selectedBorder: 'border-amber-500 dark:border-amber-400',
      selectedBg: 'bg-amber-50/90 dark:bg-amber-950/40 ring-2 ring-amber-500/20',
      badgeActive: 'bg-amber-600 text-white',
      checkBg: 'border-amber-600 bg-amber-600 text-white',
      textActive: 'text-amber-950 dark:text-amber-100',
      hintActive: 'text-amber-700/80 dark:text-amber-300/80',
    },
    // 3: Це буквально наші будні (Crimson / Rose danger)
    {
      selectedBorder: 'border-rose-500 dark:border-rose-400',
      selectedBg: 'bg-rose-50/90 dark:bg-rose-950/40 ring-2 ring-rose-500/20',
      badgeActive: 'bg-rose-600 text-white',
      checkBg: 'border-rose-600 bg-rose-600 text-white',
      textActive: 'text-rose-950 dark:text-rose-100',
      hintActive: 'text-rose-700/80 dark:text-rose-300/80',
    },
  ][option.value] ?? {
    selectedBorder: 'border-emerald-500',
    selectedBg: 'bg-emerald-50/80',
    badgeActive: 'bg-emerald-600 text-white',
    checkBg: 'border-emerald-600 bg-emerald-600 text-white',
    textActive: 'text-emerald-950',
    hintActive: 'text-emerald-700',
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      disabled={disabled}
      className={`group relative w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none outline-none active:scale-[0.985] ${
        isSelected
          ? `${toneConfig.selectedBorder} ${toneConfig.selectedBg} shadow-xs`
          : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/60 dark:hover:bg-slate-850'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Subtle index badge */}
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold transition-all shrink-0 ${
              isSelected
                ? toneConfig.badgeActive
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
            }`}
          >
            {option.badge}
          </div>

          <div className="space-y-0.5">
            <div
              className={`text-sm sm:text-base font-semibold transition-colors ${
                isSelected ? toneConfig.textActive : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {option.label}
            </div>
            {option.hint && (
              <div
                className={`text-[11px] ${
                  isSelected ? toneConfig.hintActive : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {option.hint}
              </div>
            )}
          </div>
        </div>

        {/* Minimal checkmark / radio icon */}
        <div
          className={`flex items-center justify-center w-5 h-5 rounded-full border transition-all shrink-0 ${
            isSelected
              ? toneConfig.checkBg
              : 'border-slate-300 dark:border-slate-700 bg-transparent'
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>
    </button>
  );
};
