import { useCallback } from 'react';

export function useHaptic() {
  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Not supported or blocked by policy
      }
    }
  }, []);

  const lightTap = useCallback(() => triggerHaptic(8), [triggerHaptic]);
  const successTap = useCallback(() => triggerHaptic([15, 40, 20]), [triggerHaptic]);

  return { lightTap, successTap };
}
