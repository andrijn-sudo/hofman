export type CategoryKey =
  'contempt' | 'stonewalling' | 'criticism' | 'loveMaps' | 'positiveBalance';

export type RiskLevel = 'low' | 'moderate' | 'high';
export type ScenarioType = 'early' | 'late' | 'stable';
export type SeverityLevel = 'low' | 'moderate' | 'high';

export interface AnswerOption {
  value: number; // 0..3
  label: string;
  badge: string;
  hint?: string;
}

export interface CategoryAntidote {
  title: string;
  subtitle: string;
  explanation: string;
  actionStep: string;
}

export interface CategoryMeta {
  key: CategoryKey;
  name: string;
  shortName: string;
  emoji: string;
  color: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    progress: string;
    lightBg: string;
  };
  weight: number;
  description: string;
  dangerSign: string;
  antidote: CategoryAntidote;
}

export interface Question {
  id: number;
  category: CategoryKey;
  weight: number; // 2.5, 2.0, 1.5, 1.2, 1.0
  categoryName: string;
  text: string;
}

export interface CategoryResult {
  key: CategoryKey;
  name: string;
  rawScore: number; // 0-18
  maxRawScore: number; // 18
  percentage: number; // 0-100%
  description: string;
  severity: SeverityLevel;
  antidote?: CategoryAntidote;
}

export interface ScenarioMeta {
  type: ScenarioType;
  title: string;
  subtitle: string;
  badgeColor: string;
  badgeText: string;
  description: string;
  recommendations: string[];
}

export interface TestResult {
  overallRiskPercentage: number;
  totalWeightedScore: number;
  maxWeightedScore: number;
  dominantFactor: CategoryResult | null;
  categoryBreakdown: Record<CategoryKey, CategoryResult>;
  riskLevel: RiskLevel;
  scenario: ScenarioType;
  completedAt: string;
}

export interface StoredProgress {
  answers: Record<number, number>;
  currentIndex: number;
  updatedAt: number;
}
