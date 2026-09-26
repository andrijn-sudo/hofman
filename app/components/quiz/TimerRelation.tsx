import React, { useState, useEffect, useMemo } from 'react';
import { Hourglass, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface TimerRelationProps {
  riskPercentage: number;
  completedAt?: string;
}

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_MONTH = 30 * 86400; // 30 днів
const SECONDS_IN_YEAR = 365 * 86400; // 365 днів (без урахування високосного року)

/**
 * Розрахунок початкової тривалості у секундах:
 * 100% запасу = 5 років.
 * Чим вищий ризик кризи, тим менше часу залишилось:
 * Залишковий відсоток = 100% - Ризик кризи.
 * Наприклад:
 *  - Ризик 50% => 50% від 5 років = 2 роки 6 місяців.
 *  - Ризик 20% => 80% від 5 років = 4 роки.
 *  - Ризик 80% => 20% від 5 років = 1 рік.
 * Округлюється до меншого значення (floor).
 */
export function calculateInitialDurationSeconds(riskPercentage: number): number {
  const remainingPercentage = Math.max(0, Math.min(100, 100 - riskPercentage));
  const totalYears = (remainingPercentage / 100) * 5;

  const initialYears = Math.floor(totalYears);
  const remMonthsTotal = (totalYears - initialYears) * 12;
  const initialMonths = Math.floor(remMonthsTotal);
  const remDaysTotal = (remMonthsTotal - initialMonths) * 30;
  const initialDays = Math.floor(remDaysTotal);
  const remHoursTotal = (remDaysTotal - initialDays) * 24;
  const initialHours = Math.floor(remHoursTotal);
  const remMinutesTotal = (remHoursTotal - initialHours) * 60;
  const initialMinutes = Math.floor(remMinutesTotal);
  const remSecondsTotal = (remMinutesTotal - initialMinutes) * 60;
  const initialSeconds = Math.floor(remSecondsTotal);

  return (
    initialYears * SECONDS_IN_YEAR +
    initialMonths * SECONDS_IN_MONTH +
    initialDays * SECONDS_IN_DAY +
    initialHours * SECONDS_IN_HOUR +
    initialMinutes * SECONDS_IN_MINUTE +
    initialSeconds
  );
}

export function decomposeRemainingSeconds(totalSec: number) {
  let sec = Math.max(0, Math.floor(totalSec));

  const years = Math.floor(sec / SECONDS_IN_YEAR);
  sec %= SECONDS_IN_YEAR;

  const months = Math.floor(sec / SECONDS_IN_MONTH);
  sec %= SECONDS_IN_MONTH;

  const days = Math.floor(sec / SECONDS_IN_DAY);
  sec %= SECONDS_IN_DAY;

  const hours = Math.floor(sec / SECONDS_IN_HOUR);
  sec %= SECONDS_IN_HOUR;

  const minutes = Math.floor(sec / SECONDS_IN_MINUTE);
  const seconds = sec % SECONDS_IN_MINUTE;

  return { years, months, days, hours, minutes, seconds };
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export const TimerRelation: React.FC<TimerRelationProps> = ({
  riskPercentage,
  completedAt,
}) => {
  const totalInitialSeconds = useMemo(
    () => calculateInitialDurationSeconds(riskPercentage),
    [riskPercentage]
  );

  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalInitialSeconds);

  useEffect(() => {
    const start = completedAt ? new Date(completedAt).getTime() : Date.now();
    const validStart = Number.isNaN(start) ? Date.now() : start;
    const targetEndTime = validStart + totalInitialSeconds * 1000;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((targetEndTime - Date.now()) / 1000));
      setRemainingSeconds(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [completedAt, totalInitialSeconds]);

  const { years, months, days, hours, minutes, seconds } = useMemo(
    () => decomposeRemainingSeconds(remainingSeconds),
    [remainingSeconds]
  );

  // Визначення кольорової гами залежно від рівня ризику
  const statusConfig = useMemo(() => {
    if (riskPercentage >= 60) {
      return {
        badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
        badgeBorder: 'border-rose-200/80 dark:border-rose-800/60',
        badgeText: 'text-rose-700 dark:text-rose-300',
        glowBg: '#f43f5e',
        cardBorder: 'border-rose-200/80 dark:border-rose-900/40',
        numberColor: 'text-rose-600 dark:text-rose-400',
        icon: AlertTriangle,
        statusText: 'Високий ризик кризи — потрібні активні дії вже зараз',
      };
    }
    if (riskPercentage >= 30) {
      return {
        badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
        badgeBorder: 'border-amber-200/80 dark:border-amber-800/60',
        badgeText: 'text-amber-700 dark:text-amber-300',
        glowBg: '#f59e0b',
        cardBorder: 'border-amber-200/80 dark:border-amber-900/40',
        numberColor: 'text-amber-600 dark:text-amber-400',
        icon: Clock,
        statusText: 'Помірний ризик — варто вчасно нейтралізувати тригери',
      };
    }
    return {
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      badgeBorder: 'border-emerald-200/80 dark:border-emerald-800/60',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      glowBg: '#10b981',
      cardBorder: 'border-emerald-200/80 dark:border-emerald-900/40',
      numberColor: 'text-emerald-600 dark:text-emerald-400',
      icon: ShieldCheck,
      statusText: 'Високий запас міцності — підтримуйте культуру тепла',
    };
  }, [riskPercentage]);

  const StatusIcon = statusConfig.icon;

  const timeUnits = [
    {
      value: years,
      label: pluralize(years, 'рік', 'роки', 'років'),
    },
    {
      value: months,
      label: pluralize(months, 'місяць', 'місяці', 'місяців'),
    },
    {
      value: days,
      label: pluralize(days, 'день', 'дні', 'днів'),
    },
    {
      value: String(hours).padStart(2, '0'),
      label: pluralize(hours, 'година', 'години', 'годин'),
    },
    {
      value: String(minutes).padStart(2, '0'),
      label: pluralize(minutes, 'хвилина', 'хвилини', 'хвилин'),
    },
    {
      value: String(seconds).padStart(2, '0'),
      label: pluralize(seconds, 'секунда', 'секунди', 'секунд'),
    },
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900/70 border ${statusConfig.cardBorder} shadow-sm space-y-4`}
    >
      {/* Декоративне м'яке світіння */}
      <div
        className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: statusConfig.glowBg }}
      />

      <div className="relative z-10 space-y-3">
        {/* Верхній бейдж */}
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold ${statusConfig.badgeBg} ${statusConfig.badgeBorder} ${statusConfig.badgeText}`}
          >
            <Hourglass className="w-3.5 h-3.5 animate-pulse" />
            <span>Зворотній відлік стосунків</span>
          </div>

          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
            {/* База: 5 років */}
          </span>
        </div>

        {/* Заголовок та опис */}
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Скільки часу залишилось вашим стосункам
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Розраховано за поточної динаміки при ризику кризи {riskPercentage}%
          </p>
        </div>

        {/* Сітка зворотного таймера */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {timeUnits.map((unit, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-xs"
            >
              <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                {unit.value}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-full">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {/* Інформаційний статусний рядок */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
          <StatusIcon className={`w-4 h-4 shrink-0 ${statusConfig.numberColor}`} />
          <span className="leading-snug">{statusConfig.statusText}</span>
        </div>
      </div>
    </div>
  );
};
