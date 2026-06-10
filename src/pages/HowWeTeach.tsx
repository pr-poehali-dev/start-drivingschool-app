import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const YARD_IMG = 'https://cdn.poehali.dev/projects/71838770-5b95-4cb6-ba21-f3390b81b031/files/9522fa27-eb6c-4fee-902f-833e77257ebc.jpg';

const stages = [
  {
    num: '01',
    icon: 'BookOpen',
    title: 'Теория',
    duration: '2–3 недели',
    desc: 'Занятия в классе с опытным преподавателем по утверждённой программе. Разбираем правила дорожного движения, знаки, разметку. Онлайн-тесты помогут закрепить материал и подготовиться к теоретическому экзамену ГИБДД.',
    points: ['56 часов теоретических занятий', 'Разбор сложных ситуаций и ДТП', 'Онлайн-тесты в личном кабинете', 'Итоговый пробный экзамен'],
  },
  {
    num: '02',
    icon: 'SquareParking',
    title: 'Площадка',
    duration: '2–3 недели',
    desc: 'Практика на собственной закрытой площадке автошколы. Здесь учимся управлять автомобилем без стресса городского движения: трогание, торможение, парковка, эстакада, разворот. Каждый отрабатывает упражнения до уверенного выполнения.',
    points: ['Парковка: параллельная и перпендикулярная', 'Эстакада (горка)', 'Разворот в ограниченном пространстве', 'Скоростное маневрирование'],
  },
  {
    num: '03',
    icon: 'Navigation',
    title: 'Город',
    duration: '4–6 недель',
    desc: 'Выезды в реальный городской трафик по маршрутам разной сложности. Инструктор рядом — управляет педалями безопасности и даёт чёткие указания. Постепенно уменьшаем подсказки, чтобы ученик принимал решения самостоятельно.',
    points: ['Маршруты разной сложности', 'Движение в часы пик', 'Проезд перекрёстков, круговых', 'Трасса и загородные дороги'],
  },
  {
    num: '04',
    icon: 'BadgeCheck',
    title: 'Экзамен',
    duration: 'Финальный этап',
    desc: 'Разбираем типичные ошибки, проводим пробный экзамен. После — сдача в ГИБДД: сначала теоретический, затем практический. Инструктор и куратор поддерживают до получения удостоверения.',
    points: ['Пробный экзамен в формате ГИБДД', 'Запись на официальный экзамен', 'Разбор ошибок после попытки', 'Поддержка при пересдаче'],
  },
];

export default function HowWeTeach() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-100 py-16 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-montserrat font-black text-4xl text-gray-900 mb-3">Как мы учим</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Проверенная программа: от первого урока до получения прав за 3 месяца
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="space-y-16 max-w-4xl mx-auto">
          {stages.map((stage, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 items-start`}>
              <div className="md:w-1/3 shrink-0">
                <div className="bg-burgundy rounded-2xl p-8 text-white text-center">
                  <div className="font-montserrat font-black text-6xl text-white/20 leading-none">{stage.num}</div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto my-3">
                    <Icon name={stage.icon} size={28} className="text-white" />
                  </div>
                  <h3 className="font-montserrat font-bold text-xl">{stage.title}</h3>
                  <p className="text-white/60 text-sm mt-1">{stage.duration}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 leading-relaxed mb-5">{stage.desc}</p>
                <ul className="space-y-2">
                  {stage.points.map((p, pi) => (
                    <li key={pi} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-burgundy shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl overflow-hidden">
          <img src={YARD_IMG} alt="Учебная площадка" className="w-full h-64 object-cover" />
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500 mb-6">Готов начать обучение?</p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-burgundy text-white font-semibold px-8 py-4 rounded-xl hover:bg-burgundy-light transition-all"
          >
            Подать заявку
            <Icon name="ArrowRight" size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}