import React, { useState } from 'react';
import {
  Share2,
  RotateCcw,
  ListChecks,
  Sparkles,
  MessageCircle,
  Image,
  Check,
  AlertTriangle,
} from 'lucide-react';
import type { TestResult } from '~/types/quiz';
import { getRelationshipArchetype, type RelationshipArchetype } from '~/data/archetypes';
import { shareTestResult } from '~/services/share';
import { CircularRadarChart } from './CircularRadarChart';
import { RiskGauge } from './RiskGauge';
import { CategoryCard } from './CategoryCard';
import { ShareCardModal } from './ShareCardModal';
import { TimerRelation } from './TimerRelation';

interface QuizResultsProps {
  result: TestResult;
  onReset: () => void;
  onReview: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ result, onReset, onReview }) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'gauge'>('radar');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [partnerCopied, setPartnerCopied] = useState(false);

  const archetype: RelationshipArchetype = getRelationshipArchetype(result);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareResult = async () => {
    const outcome = await shareTestResult(result);
    if (outcome.copied) {
      showToast('Текст результату скопійовано!');
    } else if (outcome.shared) {
      showToast('Дякуємо, що поділилися!');
    }
  };

  const handleSendChallengeToPartner = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Привіт! Я щойно пройшов(-ла) тест Ґоттмана на міцність нашої пари 👀\nНаш архетип: «${archetype.name}» (${archetype.harmonyPercentage}% гармонії).\n\nТвоя черга пройти, порівняємо результати! 👉 ${url}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      setPartnerCopied(true);
      showToast('Виклик для партнера скопійовано!');
      setTimeout(() => setPartnerCopied(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Countdown Timer: Relationship Lifespan */}
      <TimerRelation
        riskPercentage={result.overallRiskPercentage}
        completedAt={result.completedAt}
      />

      {/* Modern Minimalist Hero: Relationship Archetype */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-3">
        {/* Subtle decorative background glow (Emerald / Crimson) */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            backgroundColor:
              result.riskLevel === 'high'
                ? '#f43f5e'
                : result.riskLevel === 'moderate'
                  ? '#fb923c'
                  : '#10b981',
          }}
        />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Ваш архетип пари</span>
          </div>

          <div className="text-4xl">{archetype.emoji}</div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {archetype.name}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            {archetype.tagline}
          </p>

          <div className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 mt-1">
            {archetype.vibe}
          </div>
        </div>
      </div>

      {/* Visual Chart Card: Circular Radar Graph & Risk Gauge */}
      <div className="rounded-3xl p-5 bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Chart View Toggle Tabs */}
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Коловий баланс
          </span>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'radar'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Коловий радар
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gauge')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'gauge'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Спідометр
            </button>
          </div>
        </div>

        {/* Circular Chart Render */}
        <div className="py-2 flex items-center justify-center min-h-[300px]">
          {activeTab === 'radar' ? (
            <CircularRadarChart result={result} />
          ) : (
            <RiskGauge
              percentage={result.overallRiskPercentage}
              riskLevel={result.riskLevel}
            />
          )}
        </div>

        {/* Score Summary Metrics (Green Harmony vs Red Risk) */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50 text-center">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              Гармонія пари
            </span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {archetype.harmonyPercentage}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/50 text-center">
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
              Ризик кризи
            </span>
            <span
              className={`text-3xl font-black ${
                result.overallRiskPercentage >= 60
                  ? 'text-rose-600 dark:text-rose-400'
                  : result.overallRiskPercentage >= 30
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {result.overallRiskPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Viral Sharing Callout (Green / Red Neon Card) */}
      <div className="p-5 rounded-3xl bg-gradient-to-balck from-slate-900 via-emerald-950/40 to-rose-950/40 border border-emerald-500/30 text-white shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-emerald-300">
              Поділися з друзями
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Instagram Stories
          </span>
        </div>

        <p className="text-xs text-gray-800 dark:text-emerald-300  leading-relaxed">
          Збережіть стильну графічну картку з коловим радаром вашої пари або надішліть виклик
          партнеру.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Картка для Stories 📸</span>
          </button>

          <button
            type="button"
            onClick={handleSendChallengeToPartner}
            className="w-full py-3 px-4 rounded-2xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-950/60 active:scale-95 text-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {partnerCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Скопійовано!</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Виклик партнеру 💬</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dominant Risk Factor Banner (Red warning if >= 40%) */}
      {result.dominantFactor && (
        <div className="p-5 rounded-3xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Ключовий тригер: {result.dominantFactor.name} ({result.dominantFactor.percentage}
              %)
            </h3>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {result.dominantFactor.description}
          </p>

          {result.dominantFactor.antidote && (
            <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-rose-200/60 dark:border-rose-900/40 space-y-1 text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block text-[11px]">
                💡 Протиотрута за Ґоттманом: {result.dominantFactor.antidote.title}
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                {result.dominantFactor.antidote.actionStep}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 5 Factors Breakdown Accordion */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Деталізація за 5 вимірами
          </h3>
          <span className="text-[11px] text-slate-400">Натисніть для опису</span>
        </div>

        <div className="space-y-2">
          {Object.values(result.categoryBreakdown).map((cat) => (
            <CategoryCard
              key={cat.key}
              categoryResult={cat}
              isDominant={result.dominantFactor?.key === cat.key}
            />
          ))}
        </div>
      </div>

      {/* Bottom Secondary Actions */}
      <div className="pt-2 pb-8 space-y-2.5">
        <button
          type="button"
          onClick={handleShareResult}
          className="w-full py-3.5 px-6 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 active:scale-[0.98] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
        >
          <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Швидке поширення результату</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onReview}
            className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ListChecks className="w-4 h-4 text-slate-400" />
            <span>Мої відповіді</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Пройти знову</span>
          </button>
        </div>
      </div>

      {/* Stories Card Modal */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        result={result}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
