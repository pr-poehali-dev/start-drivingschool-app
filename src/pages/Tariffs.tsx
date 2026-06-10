import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const tariffs = [
  {
    category: 'Категория B',
    subtitle: 'Легковой автомобиль',
    price: 'от 45 000 ₽',
    period: '3 месяца обучения',
    features: [
      '56 часов теории в классе',
      '54 часа практики вождения',
      'Учебная площадка в центре города',
      'Учебник и онлайн-тесты ПДД',
      'Медицинская комиссия — отдельно',
      'Первичный экзамен в ГИБДД',
    ],
    accent: true,
  },
  {
    category: 'Категория A',
    subtitle: 'Мотоцикл',
    price: 'от 30 000 ₽',
    period: '2 месяца обучения',
    features: [
      '40 часов теории',
      '28 часов практики на мотодроме',
      'Снаряжение для занятий',
      'Тесты ПДД онлайн',
      'Медицинская комиссия — отдельно',
      'Экзамен в ГИБДД',
    ],
    accent: false,
  },
  {
    category: 'Доп. занятие',
    subtitle: 'Индивидуально',
    price: '2 500 ₽/час',
    period: 'По записи',
    features: [
      'Любой инструктор по выбору',
      'Любое удобное время',
      'Маршрут на ваш выбор',
      'Без ограничений по кол-ву',
      'Отличная практика перед экзаменом',
      'Оплата после занятия',
    ],
    accent: false,
  },
];

export default function Tariffs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-100 py-16 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-montserrat font-black text-4xl text-gray-900 mb-3">Тарифы</h1>
          <p className="text-gray-500 max-w-md mx-auto">Прозрачные цены — платите один раз, без скрытых доплат в процессе</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tariffs.map((t, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden border-2 hover-lift ${
                t.accent ? 'border-burgundy shadow-xl shadow-burgundy/15' : 'border-gray-100 bg-white'
              }`}
            >
              {t.accent && (
                <div className="bg-burgundy text-white text-center text-xs font-semibold py-2 tracking-wider uppercase">
                  Самый популярный
                </div>
              )}
              <div className={`p-7 ${t.accent ? 'bg-white' : ''}`}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t.subtitle}</p>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-3">{t.category}</h2>
                <div className="font-montserrat font-black text-4xl text-burgundy mb-1">{t.price}</div>
                <div className="text-sm text-gray-400 mb-6">{t.period}</div>

                <ul className="space-y-3 mb-8">
                  {t.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Icon name="Check" size={15} className="text-burgundy mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/apply"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    t.accent
                      ? 'bg-burgundy text-white hover:bg-burgundy-light'
                      : 'border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white'
                  }`}
                >
                  Записаться
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-100 max-w-3xl mx-auto">
          <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-4">Что входит в стоимость</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Занятия в классе с преподавателем',
              'Все практические уроки вождения',
              'Онлайн-тесты для подготовки к ГИБДД',
              'Запись на экзамен в ГИБДД',
              'Использование учебного автомобиля',
              'Поддержка куратора в течение курса',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="CheckCircle" size={15} className="text-green-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
            <Icon name="Info" size={14} className="inline mr-1.5" />
            Медицинская справка и госпошлина в ГИБДД оплачиваются отдельно
          </div>
        </div>
      </div>
    </div>
  );
}