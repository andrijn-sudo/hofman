import React, { useState, useEffect } from 'react';
import { useQuiz } from '~/hooks/useQuiz';
import { QuizIntro } from './QuizIntro';
import { QuizHeader } from './QuizHeader';
import { QuestionCard } from './QuestionCard';
import { QuizFooter } from './QuizFooter';
import { QuestionJumpDrawer } from './QuestionJumpDrawer';
import { QuizResults } from './QuizResults';
import { QuizReview } from './QuizReview';

export const GottmanQuizApp: React.FC = () => {
  const {
    screen,
    currentIndex,
    currentQuestion,
    totalQuestions,
    answers,
    result,
    isAdvancing,
    hasSavedProgress,
    savedProgressCount,
    hasPreviousResult,
    answeredCount,
    startQuiz,
    resumeQuiz,
    viewPreviousResult,
    handleSelectAnswer,
    handlePrev,
    handleNext,
    handleJumpToQuestion,
    handleReset,
    handleReview,
    handleBackToResults,
  } = useQuiz();

  const [isJumpDrawerOpen, setIsJumpDrawerOpen] = useState(false);

  // Keyboard navigation support for desktop & tablets
  useEffect(() => {
    if (screen !== 'quiz') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or modal
      if (isJumpDrawerOpen) return;

      if (e.key >= '1' && e.key <= '4') {
        const value = parseInt(e.key, 10) - 1;
        handleSelectAnswer(value);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, isJumpDrawerOpen, handleSelectAnswer, handlePrev, handleNext]);

  // Screen 1: Intro
  if (screen === 'intro') {
    return (
      <main className="min-h-[100dvh] flex flex-col justify-center bg-gradient-to-b from-slate-50 via-emerald-50/20 to-rose-50/10 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-900 transition-colors">
        <QuizIntro
          totalQuestions={totalQuestions}
          hasSavedProgress={hasSavedProgress}
          savedCount={savedProgressCount}
          hasPreviousResult={hasPreviousResult}
          onStart={startQuiz}
          onResume={resumeQuiz}
          onViewPrevious={viewPreviousResult}
        />
      </main>
    );
  }

  // Screen 2: Results
  if (screen === 'result' && result) {
    return (
      <main className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-emerald-50/15 to-slate-100/50 dark:from-slate-950 dark:via-emerald-950/15 dark:to-slate-900 transition-colors">
        <QuizResults result={result} onReset={handleReset} onReview={handleReview} />
      </main>
    );
  }

  // Screen 3: Review Answers
  if (screen === 'review') {
    return (
      <main className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 transition-colors">
        <QuizReview answers={answers} onBack={handleBackToResults} />
      </main>
    );
  }

  // Screen 4: Quiz taking (Mobile-first 100dvh)
  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-slate-50/50 dark:bg-slate-950 transition-colors select-none">
      {/* Top Header & Progress */}
      <QuizHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        onPrev={handlePrev}
        onOpenJumpDrawer={() => setIsJumpDrawerOpen(true)}
        onReset={handleReset}
      />

      {/* Center Question Canvas */}
      <main className="flex-1 flex flex-col justify-center px-4 py-4 sm:py-8 w-full">
        {currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            isAdvancing={isAdvancing}
            onSelectAnswer={handleSelectAnswer}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation */}
      <QuizFooter
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        hasAnswer={currentQuestion ? answers[currentQuestion.id] !== undefined : false}
        onPrev={handlePrev}
        onNext={handleNext}
        onOpenJumpDrawer={() => setIsJumpDrawerOpen(true)}
      />

      {/* Jump Drawer Sheet */}
      <QuestionJumpDrawer
        isOpen={isJumpDrawerOpen}
        currentIndex={currentIndex}
        answers={answers}
        onClose={() => setIsJumpDrawerOpen(false)}
        onSelectQuestion={handleJumpToQuestion}
      />
    </div>
  );
};
