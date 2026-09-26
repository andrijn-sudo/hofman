import React from 'react';
import { X, Check } from 'lucide-react';
import { questionsData } from '~/data/questions';

interface QuestionJumpDrawerProps {
  isOpen: boolean;
  currentIndex: number;
  answers: Record<number, number>;
  onClose: () => void;
  onSelectQuestion: (index: number) => void;
}

export const QuestionJumpDrawer: React.FC<QuestionJumpDrawerProps> = ({
  isOpen,
  currentIndex,
  answers,
  onClose,
  onSelectQuestion,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Drawer header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Навігація по запитаннях
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Відповідей: {Object.keys(answers).length} із {questionsData.length}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Відповіджено</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full ring-2 ring-emerald-500 bg-white dark:bg-slate-900" />
            <span>Поточне</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <span>Не заповнено</span>
          </div>
        </div>

        {/* 30 Question Grid */}
        <div className="overflow-y-auto flex-1 py-2">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {questionsData.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswer = answers[q.id] !== undefined;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    onSelectQuestion(idx);
                    onClose();
                  }}
                  className={`relative flex flex-col items-center justify-center h-12 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : hasAnswer
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {hasAnswer && !isCurrent && (
                    <Check className="w-3 h-3 text-emerald-200 mt-0.5 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer footer button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          Закрити
        </button>
      </div>
    </div>
  );
};
