import { useState, useEffect, useCallback, useRef } from 'react';
import type { Question, TestResult, StoredProgress } from '~/types/quiz';
import { questionsData } from '~/data/questions';
import { calculateGottmanResult } from '~/services/calculator';
import {
  saveQuizProgress,
  loadQuizProgress,
  clearQuizProgress,
  saveLastResult,
  loadLastResult,
} from '~/services/storage';
import { useHaptic } from './useHaptic';

export type QuizScreen = 'intro' | 'quiz' | 'result' | 'review';

export function useQuiz() {
  const [screen, setScreen] = useState<QuizScreen>('intro');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [savedProgress, setSavedProgress] = useState<StoredProgress | null>(() => {
    const progress = loadQuizProgress();
    return progress && Object.keys(progress.answers).length > 0 ? progress : null;
  });
  const [lastSavedResult, setLastSavedResult] = useState<TestResult | null>(() =>
    loadLastResult()
  );
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  const { lightTap, successTap } = useHaptic();
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const totalQuestions = questionsData.length;
  const currentQuestion: Question | undefined = questionsData[currentIndex];
  const answeredCount = Object.keys(answers).length;

  // Start a fresh quiz
  const startQuiz = useCallback(() => {
    clearQuizProgress();
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setSavedProgress(null);
    setScreen('quiz');
  }, []);

  // Resume unfinished quiz
  const resumeQuiz = useCallback(() => {
    if (savedProgress) {
      setAnswers(savedProgress.answers);
      const safeIndex = Math.min(savedProgress.currentIndex, totalQuestions - 1);
      setCurrentIndex(safeIndex);
      setScreen('quiz');
    } else {
      startQuiz();
    }
  }, [savedProgress, startQuiz, totalQuestions]);

  // View previously saved result
  const viewPreviousResult = useCallback(() => {
    if (lastSavedResult) {
      setResult(lastSavedResult);
      setScreen('result');
    }
  }, [lastSavedResult]);

  // Handle selecting an answer with seamless auto-advance
  const handleSelectAnswer = useCallback(
    (value: number) => {
      if (!currentQuestion) return;

      lightTap();
      const updatedAnswers = { ...answers, [currentQuestion.id]: value };
      setAnswers(updatedAnswers);

      // Save progress automatically
      saveQuizProgress(updatedAnswers, currentIndex);

      // Brief tactile delay for visual touch confirmation
      setIsAdvancing(true);
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }

      advanceTimerRef.current = setTimeout(() => {
        setIsAdvancing(false);

        if (currentIndex + 1 < totalQuestions) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          saveQuizProgress(updatedAnswers, nextIdx);
        } else {
          // Finished all questions!
          const calculated = calculateGottmanResult(questionsData, updatedAnswers);
          setResult(calculated);
          saveLastResult(calculated);
          setLastSavedResult(calculated);
          clearQuizProgress();
          setSavedProgress(null);
          setScreen('result');
          successTap();
        }
      }, 240);
    },
    [answers, currentIndex, currentQuestion, lightTap, successTap, totalQuestions]
  );

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      lightTap();
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, lightTap]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 < totalQuestions) {
      lightTap();
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, lightTap, totalQuestions]);

  const handleJumpToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        lightTap();
        setCurrentIndex(index);
      }
    },
    [lightTap, totalQuestions]
  );

  const handleReset = useCallback(() => {
    clearQuizProgress();
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setSavedProgress(null);
    setScreen('intro');
  }, []);

  const handleReview = useCallback(() => {
    setScreen('review');
  }, []);

  const handleBackToResults = useCallback(() => {
    if (result) {
      setScreen('result');
    } else {
      setScreen('quiz');
    }
  }, [result]);

  return {
    screen,
    setScreen,
    currentIndex,
    currentQuestion,
    totalQuestions,
    answers,
    result,
    isAdvancing,
    hasSavedProgress: Boolean(savedProgress && Object.keys(savedProgress.answers).length > 0),
    savedProgressCount: savedProgress ? Object.keys(savedProgress.answers).length : 0,
    hasPreviousResult: Boolean(lastSavedResult),
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
  };
}
