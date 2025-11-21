import { useState, useEffect } from 'react';
import QuoteCard from './QuoteCard';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

function QuoteGenerator({ onAddToFavorites, isAuthenticated, isItemSaved, generatedQuotes, setGeneratedQuotes }) {
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedAuthor, setSelectedAuthor] = useState('Все авторы');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(['Все категории']);
  const [authors, setAuthors] = useState(['Все авторы']);

  // При первой загрузке подтягиваю список категорий и авторов с сервера
  useEffect(() => {
    const loadFilters = async () => {
      try {
        // Получаю все доступные категории
        const categoriesResponse = await api.get('/quotes/categories');
        if (categoriesResponse.data.success) {
          setCategories(['Все категории', ...categoriesResponse.data.data]);
        }

        // Получаю всех авторов для фильтра
        const authorsResponse = await api.get('/quotes/authors');
        if (authorsResponse.data.success) {
          setAuthors(['Все авторы', ...authorsResponse.data.data]);
        }
      } catch (error) {
        console.error('Ошибка загрузки фильтров:', error);
      }
    };

    loadFilters();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      // Собираю параметры для GET запроса
      const params = {
        limit: 3  // Хочу получить максимум 3 цитаты
      };
      
      // Добавляю фильтры только если они выбраны
      if (selectedCategory !== 'Все категории') {
        params.category = selectedCategory;
      }
      
      if (selectedAuthor !== 'Все авторы') {
        params.author = selectedAuthor;
      }
      
      if (keyword.trim()) {
        params.keyword = keyword.trim();
      }

      // Делаю GET запрос на бэкенд с параметрами
      const [response] = await Promise.all([
        api.get('/quotes', { params }),
        new Promise(resolve => setTimeout(resolve, 300))
      ]);
      
      if (response.data.success) {
        setGeneratedQuotes(response.data.data);
        
        // Если ничего не нашлось, показываю уведомление
        if (response.data.data.length === 0) {
          toast.info('Цитаты не найдены. Попробуйте изменить параметры поиска.');
        }
      }
    } catch (error) {
      console.error('Ошибка генерации цитат:', error);
      toast.error('Ошибка при загрузке цитат');
      setGeneratedQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="mb-6 text-purple-600">Генератор цитат</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label>Категория</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Автор (опционально)</Label>
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите автора" />
              </SelectTrigger>
              <SelectContent>
                {authors.map(author => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ключевое слово (опционально)</Label>
            <Input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Например: любовь"
            />
          </div>
        </div>

        <Button onClick={handleGenerate} className="w-full" size="lg" disabled={loading}>
          <Sparkles className="w-5 h-5 mr-2" />
          {loading ? 'Загрузка...' : 'Сгенерировать цитаты'}
        </Button>
      </div>

      {generatedQuotes.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-gray-700">Найденные цитаты</h3>
          {generatedQuotes.map(quote => (
            <QuoteCard
              key={quote.id}
              item={quote}
              type="quote"
              onAddToFavorites={onAddToFavorites}
              isAuthenticated={isAuthenticated}
              isSaved={isItemSaved(quote.id)}
            />
          ))}
        </div>
      ) : generatedQuotes.length === 0 && selectedCategory !== 'Все категории' ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">
            Цитаты не найдены. Попробуйте изменить параметры поиска.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default QuoteGenerator;
