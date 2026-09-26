import React from 'react';
import type { Question } from '~/types/quiz';
import { ANSWER_OPTIONS, CATEGORIES_META } from '~/data/questions';
import { OptionButton } from './OptionButton';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | undefined;
  isAdvancing: boolean;
  onSelectAnswer: (value: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  isAdvancing,
  onSelectAnswer,
}) => {
  const meta = CATEGORIES_META[question.category];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col justify-between space-y-6 animate-in fade-in-50 duration-200">
      {/* Category Pill and Weight Badge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${
            meta
              ? `${meta.color.bg} ${meta.color.border} ${meta.color.text}`
              : 'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}
        >
          <span aria-hidden="true">{meta?.emoji ?? '📋'}</span>
          <span>{question.categoryName}</span>
        </span>

        {meta?.weight !== undefined && (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 tabular-nums"
            title="Вага цього питання в загальній оцінці"
          >
            {/* <span className="text-slate-300 dark:text-slate-600">×</span> */}
            {/* {meta.weight.toFixed(1)} */}
          </span>
        )}
      </div>

      {/* Main Question Text */}
      <div className="min-h-[72px] flex items-center">
        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-200 leading-snug tracking-tight text-balance">
          {question.text}
        </h2>
      </div>

      {/* 4 Options */}
      <div role="radiogroup" aria-label="Варіанти відповіді" className="space-y-2.5 pt-1">
        {ANSWER_OPTIONS.map((opt) => (
          <OptionButton
            key={opt.value}
            option={opt}
            isSelected={selectedAnswer === opt.value}
            disabled={isAdvancing}
            onSelect={onSelectAnswer}
          />
        ))}
      </div>
    </div>
  );
};
