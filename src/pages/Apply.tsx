import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { postApplication } from '@/lib/api';

export default function Apply() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'B',
    comment: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postApplication({ name: form.name, phone: form.phone, email: form.email, category: form.category, comment: form.comment });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircle" size={40} className="text-green-500" />
          </div>
          <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-3">Заявка отправлена!</h2>
          <p className="text-gray-500 leading-relaxed">
            Мы получили вашу заявку и свяжемся с вами по телефону или email в течение рабочего дня.
          </p>
          <p className="text-sm text-gray-400 mt-4">Пн–Пт 9:00–18:00</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-burgundy py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-montserrat font-black text-4xl text-white mb-3">Подать заявку</h1>
          <p className="text-white/70 max-w-md mx-auto">
            Заполните форму — мы свяжемся и расскажем, как начать обучение
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ФИО <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="example@mail.ru"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Категория
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all bg-white"
                >
                  <option value="B">Категория B — легковой автомобиль</option>
                  <option value="A">Категория A — мотоцикл</option>
                  <option value="B+A">Категории A и B</option>
                  <option value="extra">Дополнительное занятие</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Комментарий
                </label>
                <textarea
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  placeholder="Удобное время, вопросы, пожелания..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-burgundy hover:bg-burgundy-light text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    Отправить заявку
                    <Icon name="Send" size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Отправляя форму, вы соглашаетесь с{' '}
                <a href="/privacy" className="underline hover:text-burgundy">политикой конфиденциальности</a>
              </p>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Или позвоните нам:{' '}
            <a href="tel:+79991234567" className="font-semibold text-burgundy">+7 (999) 123-45-67</a>
            <span className="block text-xs mt-1">Пн–Пт 9:00–18:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}