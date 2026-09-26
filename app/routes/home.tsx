import { GottmanQuizApp } from '~/components/quiz/GottmanQuizApp';

export function meta() {
  return [
    { title: 'Діагностика стійкості стосунків | Тест Джона Ґоттмана' },
    {
      name: 'description',
      content:
        'Онлайн тест стійкості стосунків за науковою методологією д-ра Джона Ґоттмана. Визначте приховані ризики та персональні рекомендації для вашої пари.',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1',
    },
    { name: 'theme-color', content: '#059669' },
  ];
}

export default function Home() {
  return <GottmanQuizApp />;
}
