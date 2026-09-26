import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Award,
} from 'lucide-react';

interface QuizIntroProps {
  totalQuestions: number;
  hasSavedProgress: boolean;
  savedCount: number;
  hasPreviousResult: boolean;
  onStart: () => void;
  onResume: () => void;
  onViewPrevious: () => void;
}

export const QuizIntro: React.FC<QuizIntroProps> = ({
  totalQuestions,
  hasSavedProgress,
  savedCount,
  hasPreviousResult,
  onStart,
  onResume,
  onViewPrevious,
}) => {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 flex flex-col justify-between min-h-[92dvh]">
      {/* Top Brand / Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Методологія на основі Gottman Institute</span>
          </div>

          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            30 запитань
          </span>
        </div>

        {/* Hero Title & Description */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-red-400 leading-tight">
            Через скільки днів ви розійдетесь?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            «Ви справді ідеальна пара чи просто гарно виглядаєте в сторіз?» Дослідження
            показують: більшість пар розпадаються не через зраду, а через сарказм, ігнор і
            «мовчанку». Пройдіть експрес-перевірку на стійкість за методом Готтмана та
            дізнайтеся, чи є у вас шанс дожити до сивини разом, чи пора шукати психотерапевта.
          </p>
        </div>

        {/* Feature Pills (Emerald / Rose duality) */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1.5" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              ~3 хвилини
            </span>
            <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
              Швидкий темп
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-1.5" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              100% анонімно
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Без реєстрації
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50">
            <Award className="w-5 h-5 text-rose-600 dark:text-rose-400 mb-1.5" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              До 90%
            </span>
            <span className="text-[11px] text-rose-700/80 dark:text-rose-400/80">
              Точність моделі
            </span>
          </div>
        </div>

        {/* Saved progress notice if exists */}
        {hasSavedProgress && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Збережений прогрес
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {savedCount} із {totalQuestions} пройдено
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Ви можете продовжити з місця зупинки або розпочати проходження заново.
            </p>
          </div>
        )}

        {/* Collapsible Methodology Info */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/40">
          <button
            type="button"
            onClick={() => setShowMethodology((prev) => !prev)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Що оцінює цей тест? (5 факторів)</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                showMethodology ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showMethodology && (
            <div className="px-4 pb-4 pt-1 space-y-2.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <p>
                Тест досліджує співвідношення{' '}
                <strong className="text-rose-600 dark:text-rose-400">тригерів ризику</strong>{' '}
                та{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  зелених зон гармонії
                </strong>
                :
              </p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>
                  <strong className="text-rose-600 dark:text-rose-400">
                    Зневага (Contempt)
                  </strong>{' '}
                  — сарказм і вищість
                </li>
                <li>
                  <strong className="text-rose-500 dark:text-rose-400">
                    Стіна (Stonewalling)
                  </strong>{' '}
                  — ігнорування та бойкоти{' '}
                </li>
                <li>
                  <strong className="text-amber-600 dark:text-amber-400">
                    Критика (Criticism)
                  </strong>{' '}
                  — звинувачення та атаки{' '}
                </li>
                <li>
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    Емоційні карти
                  </strong>{' '}
                  — знання внутрішнього світу{' '}
                </li>
                <li>
                  <strong className="text-emerald-500 dark:text-emerald-400">
                    Баланс 5:1
                  </strong>{' '}
                  — співвідношення ніжності до сварок{' '}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Actions (Thumb Zone) */}
      <div className="pt-6 pb-2 space-y-3">
        {hasSavedProgress ? (
          <>
            <button
              type="button"
              onClick={onResume}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Продовжити тест</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onStart}
              className="w-full py-3 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-[0.98] font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Почати заново з 1-го питання</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Почати тестування</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {hasPreviousResult && (
          <button
            type="button"
            onClick={onViewPrevious}
            className="w-full py-2.5 px-4 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Переглянути останній збережений результат
          </button>
        )}

        <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-1">
          Відповідайте щиро — результати бачите лише ви на цьому пристрої.
        </p>
      </div>
    </div>
  );
};
