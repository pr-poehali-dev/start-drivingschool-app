import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const instructors = [
  {
    id: 1,
    name: 'Александр Петров',
    exp: 12,
    categories: ['B', 'C'],
    about: 'Специализируется на работе с новичками и тревожными учениками. Спокойный, внимательный, умеет объяснять просто.',
    traits: ['Терпеливый', 'Опытный', 'Пунктуальный'],
    rating: 4.9,
    students: 320,
  },
  {
    id: 2,
    name: 'Михаил Сидоров',
    exp: 9,
    categories: ['B'],
    about: 'Хорошо готовит к сдаче экзамена в ГИБДД. Знает все маршруты и типичные ошибки. Работает на механике и автомате.',
    traits: ['Строгий', 'Результативный', 'Чёткий'],
    rating: 4.8,
    students: 210,
  },
  {
    id: 3,
    name: 'Ольга Иванова',
    exp: 8,
    categories: ['A', 'B'],
    about: 'Единственный инструктор по категории А в нашей школе. Мотоциклист со стажем, умеет передать любовь к дороге.',
    traits: ['Энергичная', 'Внимательная', 'Мотивирующая'],
    rating: 4.9,
    students: 175,
  },
  {
    id: 4,
    name: 'Сергей Громов',
    exp: 15,
    categories: ['B', 'D'],
    about: 'Ветеран школы, работает с нами с момента основания. Огромный опыт, знает психологию любого ученика.',
    traits: ['Мудрый', 'Надёжный', 'Справедливый'],
    rating: 5.0,
    students: 480,
  },
];

export default function Instructors() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-100 py-16 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-montserrat font-black text-4xl text-gray-900 mb-3">Инструкторы</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Терпеливые профессионалы, для которых главное — ваша уверенность за рулём
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {instructors.map((ins) => (
            <div key={ins.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover-lift flex flex-col sm:flex-row">
              <div className="sm:w-36 bg-burgundy/10 shrink-0 flex items-center justify-center py-6 sm:py-0">
                <Icon name="UserCircle" size={64} className="text-burgundy/40" />
              </div>
              <div className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-montserrat font-bold text-gray-900">{ins.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full shrink-0">
                      <Icon name="Star" size={11} />
                      {ins.rating}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ins.categories.map(c => (
                      <span key={c} className="text-xs bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full">
                        Кат. {c}
                      </span>
                    ))}
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {ins.exp} лет опыта
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{ins.about}</p>
                  <div className="flex flex-wrap gap-1">
                    {ins.traits.map(t => (
                      <span key={t} className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span>{ins.students}+ учеников</span>
                  <Link to="/apply" className="text-burgundy font-semibold hover:underline">Записаться</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Выбрать конкретного инструктора можно при записи на занятие</p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-burgundy text-white font-semibold px-8 py-3 rounded-xl hover:bg-burgundy-light transition-all"
          >
            Подать заявку
            <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}