import React from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface QuizFooterProps {
  currentIndex: number;
  totalQuestions: number;
  hasAnswer: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOpenJumpDrawer: () => void;
}

export const QuizFooter: React.FC<QuizFooterProps> = ({
  currentIndex,
  totalQuestions,
  hasAnswer,
  onPrev,
  onNext,
  onOpenJumpDrawer,
}) => {
  return (
    <footer className="w-full max-w-lg mx-auto px-4 py-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        {/* Previous button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Назад</span>
        </button>

        {/* Quick jump overview trigger */}
        <button
          type="button"
          onClick={onOpenJumpDrawer}
          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          aria-label="Всі запитання"
          title="Список усіх запитань"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
            hasAnswer
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs active:scale-95'
              : 'border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95'
          }`}
        >
          <span>Вперед</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
