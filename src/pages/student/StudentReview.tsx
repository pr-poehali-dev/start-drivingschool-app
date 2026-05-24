import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { postReview } from '@/lib/api';

export default function StudentReview({ userId }: { userId: number }) {
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const [reviewSent, setReviewSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!reviewForm.text) return;
    setLoading(true);
    try {
      await postReview(userId, reviewForm.rating, reviewForm.text);
      setReviewSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (reviewSent) {
    return (
      <div className="max-w-md text-center bg-white rounded-2xl border border-gray-100 p-10">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={28} className="text-green-500" />
        </div>
        <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-2">Спасибо за отзыв!</h3>
        <p className="text-gray-500 text-sm">Ваш отзыв опубликован на странице отзывов</p>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-montserrat font-semibold text-gray-900 mb-5">Оцените обучение</h3>
        <div className="mb-5">
          <p className="text-sm text-gray-600 mb-2">Ваша оценка</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(r => (
              <button key={r} onClick={() => setReviewForm(f => ({ ...f, rating: r }))}>
                <Icon
                  name="Star"
                  size={32}
                  className={r <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-200'}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ваш отзыв</label>
          <textarea
            rows={4}
            value={reviewForm.text}
            onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
            placeholder="Расскажите о своём опыте обучения..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!reviewForm.text || loading}
          className="w-full bg-burgundy text-white font-semibold py-3 rounded-xl hover:bg-burgundy-light transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Icon name="Loader2" size={16} className="animate-spin" />Отправляем...</> : 'Отправить отзыв'}
        </button>
      </div>
    </div>
  );
}
