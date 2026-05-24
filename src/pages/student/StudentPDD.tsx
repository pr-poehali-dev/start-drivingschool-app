import { useState } from 'react';
import Icon from '@/components/ui/icon';

const PDD_QUESTIONS = [
  {
    id: 1,
    q: 'На каком расстоянии от края проезжей части разрешена стоянка?',
    answers: ['Не ближе 3 м', 'Не ближе 1 м', 'Не ближе 5 м', 'Без ограничений'],
    correct: 0,
    explain: 'Стоянка разрешается не ближе 3 м от края проезжей части (ПДД п. 12.1)',
  },
  {
    id: 2,
    q: 'Что означает знак «Уступи дорогу»?',
    answers: ['Остановиться перед знаком', 'Уступить дорогу транспортным средствам на пересекаемой дороге', 'Движение запрещено', 'Главная дорога'],
    correct: 1,
    explain: 'Знак 2.4 «Уступи дорогу» означает, что водитель должен уступить дорогу ТС, движущимся по пересекаемой дороге',
  },
  {
    id: 3,
    q: 'С какого возраста разрешено управление мотоциклом категории А?',
    answers: ['16 лет', '18 лет', '21 год', '17 лет'],
    correct: 1,
    explain: 'Управление мотоциклом категории А разрешается с 18 лет',
  },
  {
    id: 4,
    q: 'Что должен сделать водитель при мигающем жёлтом сигнале светофора?',
    answers: ['Остановиться', 'Продолжать движение без ограничений', 'Проехать с повышенным вниманием', 'Уступить дорогу пешеходам'],
    correct: 2,
    explain: 'Мигающий жёлтый сигнал предупреждает о нерегулируемом перекрёстке — нужно проехать с повышенным вниманием',
  },
  {
    id: 5,
    q: 'Какое максимальное содержание алкоголя в выдыхаемом воздухе допускается для водителя?',
    answers: ['0 промилле', '0.16 мг/л', '0.5 промилле', '0.3 мг/л'],
    correct: 1,
    explain: 'Допустимая норма — не более 0.16 мг/л в выдыхаемом воздухе (суммарная погрешность прибора)',
  },
];

export default function StudentPDD() {
  const [pddIdx, setPddIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [testDone, setTestDone] = useState(false);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === PDD_QUESTIONS[pddIdx].correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (pddIdx + 1 >= PDD_QUESTIONS.length) {
      setTestDone(true);
    } else {
      setPddIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const resetTest = () => {
    setPddIdx(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setTestDone(false);
  };

  return (
    <div className="max-w-2xl">
      {testDone ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${score >= 4 ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <Icon name={score >= 4 ? 'Award' : 'AlertCircle'} size={32} className={score >= 4 ? 'text-green-500' : 'text-yellow-500'} />
          </div>
          <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-2">Тест завершён!</h3>
          <p className="text-gray-500 mb-2">Вы ответили правильно</p>
          <div className="font-montserrat font-black text-4xl text-burgundy mb-4">{score} / {PDD_QUESTIONS.length}</div>
          <p className="text-sm text-gray-400 mb-6">{score >= 4 ? 'Отличный результат! Вы хорошо знаете ПДД.' : 'Повторите материал и попробуйте снова.'}</p>
          <button onClick={resetTest} className="bg-burgundy text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-burgundy-light transition-all">
            Пройти ещё раз
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">Вопрос {pddIdx + 1} из {PDD_QUESTIONS.length}</span>
            <div className="flex gap-1">
              {PDD_QUESTIONS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < pddIdx ? 'bg-green-400' : i === pddIdx ? 'bg-burgundy' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
          <h3 className="font-montserrat font-semibold text-gray-900 text-lg mb-5 leading-snug">
            {PDD_QUESTIONS[pddIdx].q}
          </h3>
          <div className="space-y-2.5 mb-6">
            {PDD_QUESTIONS[pddIdx].answers.map((ans, i) => {
              let cls = 'border border-gray-200 text-gray-700 hover:border-burgundy hover:bg-burgundy/5';
              if (answered) {
                if (i === PDD_QUESTIONS[pddIdx].correct) cls = 'border-green-400 bg-green-50 text-green-800';
                else if (i === selected) cls = 'border-red-400 bg-red-50 text-red-800';
                else cls = 'border-gray-200 text-gray-400';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${cls}`}
                >
                  <span className="font-medium mr-2">{['А', 'Б', 'В', 'Г'][i]}.</span>
                  {ans}
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 mb-4">
              <Icon name="Info" size={14} className="inline mr-1.5 text-gray-400" />
              {PDD_QUESTIONS[pddIdx].explain}
            </div>
          )}
          {answered && (
            <button onClick={nextQuestion} className="w-full bg-burgundy text-white font-semibold py-3 rounded-xl hover:bg-burgundy-light transition-all">
              {pddIdx + 1 >= PDD_QUESTIONS.length ? 'Завершить' : 'Следующий вопрос'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
