import { useState } from 'react';
import QuoteCard from './QuoteCard';
import { Button } from './ui/button';
import { Dices } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

function JokeGenerator({ onAddToFavorites, isAuthenticated, isItemSaved, currentJoke, setCurrentJoke }) {
  const [loading, setLoading] = useState(false);

  const handleGenerateRandomJoke = async () => {
    setLoading(true);
    
    try {
      // Делаю GET запрос на бэкенд за случайной шуткой
      const [response] = await Promise.all([
        api.get('/jokes/random'),
        new Promise(resolve => setTimeout(resolve, 300))
      ]);
      
      if (response.data.success) {
        setCurrentJoke(response.data.data);
      }
    } catch (error) {
      console.error('Ошибка получения шутки:', error);
      toast.error('Ошибка при загрузке шутки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="mb-6 text-purple-600">Генератор шуток</h2>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Нажмите кнопку, чтобы получить случайную шутку и поднять настроение!
          </p>

          <Button onClick={handleGenerateRandomJoke} size="lg" className="w-full md:w-auto md:min-w-[250px]" disabled={loading}>
            <Dices className="w-5 h-5 mr-2" />
            {loading ? 'Загрузка...' : 'Случайная шутка'}
          </Button>
        </div>
      </div>

      {currentJoke && (
        <div className="space-y-4">
          <h3 className="text-gray-700">Ваша шутка</h3>
          <QuoteCard
            item={currentJoke}
            type="joke"
            onAddToFavorites={onAddToFavorites}
            isAuthenticated={isAuthenticated}
            isSaved={isItemSaved(currentJoke.id)}
          />
        </div>
      )}
    </div>
  );
}

export default JokeGenerator;
