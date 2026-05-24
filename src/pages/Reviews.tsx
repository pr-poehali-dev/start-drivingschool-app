import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function Reviews() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-montserrat font-black text-4xl text-white mb-3">Отзывы</h1>
          <p className="text-gray-400 max-w-md mx-auto">Мнения наших выпускников появятся здесь</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="MessageSquare" size={36} className="text-burgundy" />
          </div>
          <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-3">Скоро здесь будут отзывы</h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            Мы только начинаем собирать отзывы выпускников. Если вы уже учились у нас — расскажите о своём опыте в личном кабинете.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-burgundy text-white font-semibold px-6 py-3 rounded-xl hover:bg-burgundy-light transition-all"
            >
              <Icon name="LogIn" size={16} />
              Войти и оставить отзыв
            </Link>
            <Link
              to="/apply"
              className="inline-flex items-center justify-center gap-2 border-2 border-burgundy text-burgundy font-semibold px-6 py-3 rounded-xl hover:bg-burgundy hover:text-white transition-all"
            >
              Стать учеником
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
