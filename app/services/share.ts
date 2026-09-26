import type { TestResult } from '~/types/quiz';
import { SCENARIOS_META } from '~/data/questions';

export function formatResultShareText(result: TestResult): string {
  const scenario = SCENARIOS_META[result.scenario]?.title || result.scenario;
  const dominant = result.dominantFactor
    ? `\nКлючовий фактор: ${result.dominantFactor.name} (${result.dominantFactor.percentage}%)`
    : '';

  const riskLabel =
    result.riskLevel === 'high'
      ? 'Високий ризик'
      : result.riskLevel === 'moderate'
        ? 'Помірний ризик'
        : 'Стабільні стосунки (Низький ризик)';

  return `📊 Мій результат тесту стійкості стосунків (Метод Ґоттмана):
• Рівень ризику: ${result.overallRiskPercentage}% (${riskLabel})
• Сценарій: ${scenario}${dominant}

Пройдіть тест і дізнайтеся прогноз для своєї пари!`;
}

export async function shareTestResult(
  result: TestResult
): Promise<{ shared: boolean; copied: boolean }> {
  const text = formatResultShareText(result);
  const title = 'Результат тесту стійкості стосунків';
  const url = typeof window !== 'undefined' ? window.location.href : '';

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return { shared: true, copied: false };
    } catch (err: unknown) {
      // If user aborted/cancelled share dialog, don't fallback to clipboard
      if (err instanceof Error && err.name === 'AbortError') {
        return { shared: false, copied: false };
      }
    }
  }

  // Fallback to clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      return { shared: false, copied: true };
    } catch {
      // Fallback failed
    }
  }

  return { shared: false, copied: false };
}
