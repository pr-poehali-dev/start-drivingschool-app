import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const YARD_IMG = 'https://cdn.poehali.dev/projects/71838770-5b95-4cb6-ba21-f3390b81b031/files/9522fa27-eb6c-4fee-902f-833e77257ebc.jpg';

const advantages = [
  {
    icon: 'Award',
    title: 'Опытные инструкторы',
    desc: 'Все инструкторы с опытом от 8 лет, знают психологию новичков и умеют объяснять терпеливо',
  },
  {
    icon: 'MapPin',
    title: 'Своя площадка',
    desc: 'Крытая учебная площадка в центре Владимира, где можно тренироваться без нервов и пробок',
  },
  {
    icon: 'Calendar',
    title: 'Гибкий график',
    desc: 'Занятия утром, днём и вечером — подберём время под ваш рабочий или учебный график',
  },
  {
    icon: 'Shield',
    title: 'Высокая сдаваемость',
    desc: 'Более 80% наших учеников сдают экзамен в ГИБДД с первого раза',
  },
];

const steps = [
  { num: '01', title: 'Теория', desc: 'Занятия в классе с опытным преподавателем, онлайн-тесты ПДД' },
  { num: '02', title: 'Площадка', desc: 'Упражнения на закрытой площадке: парковка, развороты, эстакада' },
  { num: '03', title: 'Город', desc: 'Выезды по реальным маршрутам города с инструктором рядом' },
  { num: '04', title: 'Экзамен', desc: 'Подготовка и сдача в ГИБДД — мы едем вместе и поддерживаем' },
];

const tariffs = [
  {
    category: 'Категория B',
    price: 'от 45 000 ₽',
    period: '3 месяца',
    features: ['56 часов теории', '54 часа вождения', 'Учебник и тесты', 'Сдача в ГИБДД'],
    accent: true,
  },
  {
    category: 'Категория A',
    price: 'от 30 000 ₽',
    period: '2 месяца',
    features: ['40 часов теории', '28 часов езды', 'Мотодром', 'Сдача в ГИБДД'],
    accent: false,
  },
  {
    category: 'Доп. занятие',
    price: '2 500 ₽/час',
    period: 'по записи',
    features: ['Индивидуально', 'Любой инструктор', 'Любое время', 'Без ограничений'],
    accent: false,
  },
];

const instructors = [
  { name: 'Александр Петров', exp: '12 лет опыта', cat: 'B, C' },
  { name: 'Михаил Сидоров', exp: '9 лет опыта', cat: 'B' },
  { name: 'Ольга Иванова', exp: '8 лет опыта', cat: 'A, B' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-950" />
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy/30 via-gray-950 to-gray-950" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-burgundy/20 border border-burgundy/40 text-white text-xs px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Icon name="MapPin" size={12} className="text-red-300" />
              г. Владимир — официальная автошкола ГИБДД
            </div>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl text-white leading-tight mb-4">
              Сдай с<br />
              <span className="text-red-400">первого</span><br />
              раза
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Автошкола «Старт» — учим водить уверенно и безопасно. Категории A и B, опытные инструкторы, своя площадка.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 bg-burgundy hover:bg-burgundy-light text-white font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-burgundy/30 text-base"
              >
                Записаться
                <Icon name="ArrowRight" size={18} />
              </Link>
              <Link
                to="/tariffs"
                className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg transition-all text-base backdrop-blur-sm"
              >
                Тарифы
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10">
              {[
                { val: '15+', label: 'лет работы' },
                { val: '2 000+', label: 'выпускников' },
                { val: '80%', label: 'сдают с 1-го раза' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-montserrat font-black text-2xl text-white">{s.val}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={28} className="text-white/50" />
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="section-divider w-12 mx-auto mb-4" />
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-900 mb-3">Почему выбирают нас</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Мы не просто учим правилам — мы готовим уверенных водителей</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => (
              <div key={i} className="p-6 rounded-xl bg-gray-50 border border-gray-100 hover-lift group">
                <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-burgundy/20 transition-colors">
                  <Icon name={a.icon} size={22} className="text-burgundy" />
                </div>
                <h3 className="font-montserrat font-semibold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE TEACH */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-divider w-12 mb-4" />
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-900 mb-4">Как мы учим</h2>
              <p className="text-gray-500 mb-8">Чёткая программа — от нуля до прав за 3 месяца</p>
              <div className="space-y-4">
                {steps.map((s) => (
                  <div key={s.num} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-burgundy text-white font-montserrat font-bold text-sm flex items-center justify-center shrink-0">
                      {s.num}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{s.title}</h4>
                      <p className="text-sm text-gray-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/how-we-teach" className="inline-flex items-center gap-2 mt-8 text-burgundy font-semibold hover:gap-3 transition-all">
                Подробнее о программе
                <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={YARD_IMG} alt="Учебная площадка" className="w-full h-72 md:h-96 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* TARIFFS */}
      <section id="tariffs" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="section-divider w-12 mx-auto mb-4" />
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-900 mb-3">Тарифы</h2>
            <p className="text-gray-500">Прозрачные цены без скрытых доплат</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tariffs.map((t, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border-2 hover-lift ${
                  t.accent
                    ? 'bg-burgundy border-burgundy text-white shadow-xl shadow-burgundy/20'
                    : 'bg-white border-gray-100 text-gray-900'
                }`}
              >
                {t.accent && (
                  <div className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full inline-block mb-3">
                    Популярный
                  </div>
                )}
                <h3 className={`font-montserrat font-bold text-xl mb-1 ${t.accent ? 'text-white' : 'text-gray-900'}`}>
                  {t.category}
                </h3>
                <div className={`font-montserrat font-black text-3xl mb-1 ${t.accent ? 'text-white' : 'text-burgundy'}`}>
                  {t.price}
                </div>
                <div className={`text-sm mb-5 ${t.accent ? 'text-white/70' : 'text-gray-400'}`}>{t.period}</div>
                <ul className="space-y-2 mb-6">
                  {t.features.map((f, fi) => (
                    <li key={fi} className={`flex items-center gap-2 text-sm ${t.accent ? 'text-white/90' : 'text-gray-600'}`}>
                      <Icon name="Check" size={14} className={t.accent ? 'text-white' : 'text-burgundy'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/apply"
                  className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    t.accent
                      ? 'bg-white text-burgundy hover:bg-gray-100'
                      : 'bg-burgundy text-white hover:bg-burgundy-light'
                  }`}
                >
                  Записаться
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTORS PREVIEW */}
      <section id="instructors" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="section-divider w-12 mx-auto mb-4" />
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-900 mb-3">Наши инструкторы</h2>
            <p className="text-gray-500">Терпеливые, опытные, умеющие учить</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {instructors.map((ins, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover-lift text-center">
                <div className="h-24 bg-burgundy/10 flex items-center justify-center">
                  <Icon name="UserCircle" size={56} className="text-burgundy/40" />
                </div>
                <div className="p-4">
                  <h3 className="font-montserrat font-semibold text-gray-900 text-sm">{ins.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{ins.exp}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full">
                    <Icon name="Car" size={11} />
                    Кат. {ins.cat}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/instructors" className="inline-flex items-center gap-2 text-burgundy font-semibold hover:gap-3 transition-all">
              Все инструкторы
              <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-burgundy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-montserrat font-black text-3xl md:text-4xl text-white mb-4">
            Готов начать?
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Оставь заявку — мы свяжемся и расскажем всё о начале обучения
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/apply"
              className="inline-flex items-center justify-center gap-2 bg-white text-burgundy font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all text-base"
            >
              Подать заявку
              <Icon name="ArrowRight" size={18} />
            </Link>
            <a
              href="tel:+79991234567"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-all text-base"
            >
              <Icon name="Phone" size={18} />
              +7 (999) 123-45-67
            </a>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <div className="section-divider w-12 mx-auto mb-4" />
            <h2 className="font-montserrat font-bold text-3xl text-gray-900 mb-3">Контакты</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: 'MapPin', title: 'Адрес', value: 'г. Владимир, ул. Примерная 10' },
              { icon: 'Phone', title: 'Телефон', value: '+7 (999) 123-45-67', href: 'tel:+79991234567' },
              { icon: 'Clock', title: 'Режим работы', value: 'Пн–Пт 9:00–18:00' },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-burgundy/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon name={c.icon} size={20} className="text-burgundy" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{c.title}</div>
                  {c.href
                    ? <a href={c.href} className="font-semibold text-gray-900 hover:text-burgundy transition-colors">{c.value}</a>
                    : <div className="font-semibold text-gray-900">{c.value}</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}