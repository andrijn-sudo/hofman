import type {
  CategoryKey,
  CategoryResult,
  Question,
  RiskLevel,
  ScenarioType,
  SeverityLevel,
  TestResult,
} from '~/types/quiz';
import { CATEGORIES_META } from '~/data/questions';

export const MAX_WEIGHTED_SCORE = 147.6; // 30 питань з відповідними коефіцієнтами

export function calculateGottmanResult(
  questions: Question[],
  userAnswers: Record<number, number>
): TestResult {
  let totalWeightedScore = 0;

  const categoryRawScores: Record<CategoryKey, number> = {
    contempt: 0,
    stonewalling: 0,
    criticism: 0,
    loveMaps: 0,
    positiveBalance: 0,
  };

  questions.forEach((q) => {
    const answerVal = userAnswers[q.id] ?? 0;

    // Зважений бал
    totalWeightedScore += answerVal * q.weight;

    // Сирий бал за категорією
    if (categoryRawScores[q.category] !== undefined) {
      categoryRawScores[q.category] += answerVal;
    }
  });

  // Загальний відсоток ризику за формулою (від 5% до 98% для психологічної реалістичності)
  const rawRisk = (totalWeightedScore / MAX_WEIGHTED_SCORE) * 100;
  const overallRiskPercentage = Math.round(Math.min(98, Math.max(5, rawRisk)));

  // Деталізація категорій
  const categoryKeys: CategoryKey[] = [
    'contempt',
    'stonewalling',
    'criticism',
    'loveMaps',
    'positiveBalance',
  ];

  const categoryBreakdown = {} as Record<CategoryKey, CategoryResult>;
  let dominantFactor: CategoryResult | null = null;
  let maxCatPercentage = -1;

  categoryKeys.forEach((catKey) => {
    const rawScore = categoryRawScores[catKey];
    const percentage = Math.min(100, Math.round((rawScore / 18) * 100));
    const meta = CATEGORIES_META[catKey];

    let severity: SeverityLevel = 'low';
    if (percentage >= 60) severity = 'high';
    else if (percentage >= 35) severity = 'moderate';

    const catResult: CategoryResult = {
      key: catKey,
      name: meta?.name ?? catKey,
      rawScore,
      maxRawScore: 18,
      percentage,
      description: meta?.description ?? '',
      severity,
      antidote: meta?.antidote,
    };

    categoryBreakdown[catKey] = catResult;

    if (percentage > maxCatPercentage) {
      maxCatPercentage = percentage;
      dominantFactor = catResult;
    }
  });

  // Домінуючий фактор суттєвий, тільки якщо його відсоток >= 40%
  if (dominantFactor && (dominantFactor as CategoryResult).percentage < 40) {
    dominantFactor = null;
  }

  // Визначення рівня загального ризику
  let riskLevel: RiskLevel = 'low';
  if (overallRiskPercentage >= 60) riskLevel = 'high';
  else if (overallRiskPercentage >= 30) riskLevel = 'moderate';

  // Визначення сценарію динаміки
  let scenario: ScenarioType = 'stable';
  if (riskLevel !== 'low') {
    const highConflict =
      (categoryBreakdown.contempt.percentage + categoryBreakdown.criticism.percentage) / 2;
    const lowConnection =
      (categoryBreakdown.loveMaps.percentage + categoryBreakdown.positiveBalance.percentage) /
      2;

    if (highConflict > lowConnection) {
      scenario = 'early'; // Ранній вибуховий конфлікт
    } else {
      scenario = 'late'; // Повільне згасання (руммейти)
    }
  }

  return {
    overallRiskPercentage,
    totalWeightedScore: Math.round(totalWeightedScore * 10) / 10,
    maxWeightedScore: MAX_WEIGHTED_SCORE,
    dominantFactor,
    categoryBreakdown,
    riskLevel,
    scenario,
    completedAt: new Date().toISOString(),
  };
}
