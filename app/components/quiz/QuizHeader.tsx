import React, { useState } from 'react';
import { ChevronLeft, LayoutGrid, RotateCcw, X } from 'lucide-react';

interface QuizHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  onPrev: () => void;
  onOpenJumpDrawer: () => void;
  onReset: () => void;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  onPrev,
  onOpenJumpDrawer,
  onReset,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      {/* Top micro progress bar in green-to-red gradient */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-rose-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Back button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          aria-label="Попереднє питання"
          className="p-2 -ml-2 rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-20 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Question Counter Pill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenJumpDrawer}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {currentIndex + 1}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              / {totalQuestions}
            </span>
            <LayoutGrid className="w-3.5 h-3.5 ml-0.5 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>

        {/* Reset / Quit button */}
        <button
          type="button"
          onClick={() => setShowConfirmReset(true)}
          aria-label="Скинути тест"
          className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation Modal for Resetting */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Розпочати спочатку?
              </h3>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ваші поточні відповіді ({answeredCount} із {totalQuestions}) буде скинуто, і ви
              повернетеся на головну.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Продовжити
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmReset(false);
                  onReset();
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition cursor-pointer"
              >
                Скинути все
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
