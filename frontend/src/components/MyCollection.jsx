import { useState } from 'react';
import QuoteCard from './QuoteCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Heart } from 'lucide-react';

function MyCollection({ savedItems, onRemoveFromFavorites }) {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredItems = savedItems.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-8 h-8 text-purple-600" />
          <h2 className="text-purple-600">Моя коллекция</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Фильтр по типу</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="quote">Цитаты</SelectItem>
                <SelectItem value="joke">Шутки</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Сортировка</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите сортировку" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Недавние</SelectItem>
                <SelectItem value="category">По категории</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {sortedItems.length > 0 ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Всего сохранено: {sortedItems.length}
          </p>
          {sortedItems.map(item => (
            <QuoteCard
              key={item.id}
              item={item}
              type={item.type}
              onAddToFavorites={() => {}}
              onRemove={onRemoveFromFavorites}
              isAuthenticated={true}
              showRemove={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-700 mb-2">Коллекция пуста</h3>
          <p className="text-gray-500">
            Начните добавлять понравившиеся цитаты и шутки в избранное
          </p>
        </div>
      )}
    </div>
  );
}

export default MyCollection;
