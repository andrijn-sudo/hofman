import type { TestResult } from '~/types/quiz';

export interface RelationshipArchetype {
  id: string;
  name: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  vibe: string;
  compatibilityTip: string;
  gradient: string;
  accentColor: string;
  harmonyPercentage: number;
}

export function getRelationshipArchetype(result: TestResult): RelationshipArchetype {
  const harmony = Math.max(2, 100 - result.overallRiskPercentage);

  // 1. Stable / Low Risk
  if (result.riskLevel === 'low') {
    return {
      id: 'zen_couple',
      name: 'Дзен-дует',
      title: '✨ Дзен-дует (The Power Couple)',
      emoji: '✨',
      tagline: 'Емоційний дзен та непохитний тил',
      description:
        'У вашій парі панує взаємоповага, живий душевний контакт і висока культура підтримки. Навіть під час розбіжностей ви залишаєтесь однією командою.',
      vibe: 'Рідкісний баланс тепла • 0% токсичності',
      compatibilityTip:
        'Ваш рівень довіри — рідкість. Підтримуйте його невеликими щоденними проявами ніжності.',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      accentColor: '#10b981',
      harmonyPercentage: harmony,
    };
  }

  // 2. High Contempt or Criticism
  if (
    result.dominantFactor?.key === 'contempt' ||
    result.dominantFactor?.key === 'criticism' ||
    result.scenario === 'early'
  ) {
    return {
      id: 'italian_volcano',
      name: 'Італійський вулкан',
      title: '🌋 Італійський вулкан (The Passion & Storm)',
      emoji: '🌋',
      tagline: 'Пристрасть на межі цунамі',
      description:
        'Між вами вирують щирі почуття, але будь-яка дрібниця здатна перетворитися на словесну битву. Ви надто швидко переходите в захист або сарказм.',
      vibe: '100% пристрасті • Висока напруга',
      compatibilityTip:
        'Навчіться вчасно тиснути на гальма. 20 хвилин тиші врятують більше нервів, ніж будь-яка суперечка.',
      gradient: 'from-rose-500 via-amber-500 to-orange-500',
      accentColor: '#f43f5e',
      harmonyPercentage: harmony,
    };
  }

  // 3. High Stonewalling
  if (result.dominantFactor?.key === 'stonewalling') {
    return {
      id: 'silent_iceberg',
      name: 'Мовчазний айсберг',
      title: '🧊 Мовчазний айсберг (The Silent Iceberg)',
      emoji: '🧊',
      tagline: 'Штиль зовні, буря всередині',
      description:
        'Зовні стосунки виглядають спокійними, але під час непорозумінь один або обоє «вмикають ігнор» та йдуть у мовчанку. Айсберг невисловлених образ зростає під водою.',
      vibe: 'Зовнішній спокій • Потрібна відлига',
      compatibilityTip:
        'Мовчання не лікує рани. Замініть відхід від розмови на коротку домовлену паузу з поверненням.',
      gradient: 'from-sky-500 via-indigo-500 to-blue-600',
      accentColor: '#0ea5e9',
      harmonyPercentage: harmony,
    };
  }

  // 4. Roommates / Low connection
  if (
    result.dominantFactor?.key === 'loveMaps' ||
    result.dominantFactor?.key === 'positiveBalance' ||
    result.scenario === 'late'
  ) {
    return {
      id: 'cozy_roommates',
      name: 'Затишні руммейти',
      title: '🛋️ Затишні руммейти (Cozy Roommates)',
      emoji: '🛋️',
      tagline: 'Ідеальний побут, спляча романтика',
      description:
        'Ви чудово справляєтеся з домашніми обовʼязками та рахунками, але емоційне занурення одне в одного відійшло на другий план. Стосунки стали зручними, але менш яскравими.',
      vibe: '100% побутового комфорту • Дефіцит іскри',
      compatibilityTip:
        'Сходіть на побачення без телефонів і запитайте одне одного про те, про що давно не говорили.',
      gradient: 'from-violet-500 via-purple-500 to-pink-500',
      accentColor: '#8b5cf6',
      harmonyPercentage: harmony,
    };
  }

  // 5. Default / Mixed
  return {
    id: 'emotional_rollercoaster',
    name: 'Емоційні гойдалки',
    title: '🎢 Емоційні гойдалки (The Rollercoaster)',
    emoji: '🎢',
    tagline: 'Від ейфорії до драми за 15 хвилин',
    description:
      'Ваша пара живе на контрастах: теплі моменти близькості раптово змінюються періодами роздратування. Головне завдання — вирівняти емоційну стабільність.',
    vibe: 'Яскраво та непередбачувано • Потрібен якір',
    compatibilityTip:
      'Сфокусуйтеся на щоденних маленьких ритуалах вдячності, щоб закріпити позитивний баланс 5:1.',
    gradient: 'from-fuchsia-500 via-rose-500 to-amber-500',
    accentColor: '#d946ef',
    harmonyPercentage: harmony,
  };
}
