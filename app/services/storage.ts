import type { StoredProgress, TestResult } from '~/types/quiz';

const PROGRESS_KEY = 'gottman_test_progress_v1';
const LAST_RESULT_KEY = 'gottman_test_last_result_v1';

export function saveQuizProgress(answers: Record<number, number>, currentIndex: number): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: StoredProgress = {
      answers,
      currentIndex,
      updatedAt: Date.now(),
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
  } catch {
    // Gracefully handle storage quota or private mode restrictions
  }
}

export function loadQuizProgress(): StoredProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProgress;
    // Check if progress is less than 14 days old
    const maxAge = 14 * 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.updatedAt > maxAge) {
      clearQuizProgress();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearQuizProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // Ignore error
  }
}

export function saveLastResult(result: TestResult): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(result));
  } catch {
    // Ignore error
  }
}

export function loadLastResult(): TestResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TestResult;
  } catch {
    return null;
  }
}
