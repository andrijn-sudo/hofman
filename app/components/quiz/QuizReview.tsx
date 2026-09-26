import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { questionsData, ANSWER_OPTIONS, CATEGORIES_META } from '~/data/questions';

interface QuizReviewProps {
  answers: Record<number, number>;
  onBack: () => void;
}

export const QuizReview: React.FC<QuizReviewProps> = ({ answers, onBack }) => {
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Повернутися до результатів</span>
        </button>

        <span className="text-xs text-slate-500">
          {Object.keys(answers).length} із {questionsData.length} заповнено
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Огляд ваших відповідей
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Нижче наведено всі 30 запитань та ваші обрані варіанти.
        </p>
      </div>

      {/* List of 30 questions */}
      <div className="space-y-3">
        {questionsData.map((q, idx) => {
          const answerVal = answers[q.id];
          const selectedOption = ANSWER_OPTIONS.find((opt) => opt.value === answerVal);
          const meta = CATEGORIES_META[q.category];

          return (
            <div
              key={q.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-400">#{idx + 1}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    meta
                      ? `${meta.color.bg} ${meta.color.border} ${meta.color.text}`
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {q.categoryName}
                </span>
              </div>

              <p className="font-medium text-slate-800 dark:text-slate-200">{q.text}</p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Ваша відповідь:</span>
                <span
                  className={`font-semibold ${
                    answerVal === undefined
                      ? 'text-slate-400 italic'
                      : answerVal >= 2
                        ? 'text-rose-600 dark:text-rose-400'
                        : answerVal === 1
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {selectedOption ? selectedOption.label : 'Немає відповіді'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Back Button */}
      <div className="pt-4 pb-8">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          Повернутися назад
        </button>
      </div>
    </div>
  );
};
