import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Copy, Heart, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';
import telegramIcon from '../../icons/telegram.svg';
import vkIcon from '../../icons/vk.svg';

function QuoteCard({
  item,
  type,
  onAddToFavorites,
  onRemove,
  isAuthenticated,
  showRemove = false,
  isSaved = false,
}) {
  const navigate = useNavigate();
  const isQuote = type === 'quote';
  const author = isQuote ? item.author : undefined;

  const handleCopy = () => {
    const textToCopy = isQuote
      ? `"${item.text}" — ${author}`
      : item.text;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          toast.success('Скопировано в буфер обмена!');
        }).catch(() => {
          copyTextFallback(textToCopy);
        });
      } else {
        copyTextFallback(textToCopy);
      }
    } catch (error) {
      copyTextFallback(textToCopy);
    }
  };

  const copyTextFallback = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      toast.success('Скопировано в буфер обмена!');
    } catch (error) {
      toast.error('Не удалось скопировать текст');
    }
    
    document.body.removeChild(textarea);
  };

  const handleShare = (platform) => {
    const textToShare = isQuote
      ? `"${item.text}" — ${author}`
      : item.text;
    
    const encodedText = encodeURIComponent(textToShare);
    let url = '';

    if (platform === 'telegram') {
      url = `https://t.me/share/url?text=${encodedText}`;
    } else if (platform === 'vk') {
      url = `https://vk.com/share.php?comment=${encodedText}`;
    }

    window.open(url, '_blank', 'width=600,height=400');
    toast.success('Окно для публикации открыто!');
  };

  const handleAddToFavorites = () => {
    const result = onAddToFavorites(item, type);
    if (result !== false) {
      toast.success('Добавлено в избранное!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-5 space-y-4 hover:shadow-lg transition-shadow">
      <div className="space-y-2">
        <p className="text-base text-gray-800 leading-relaxed">
          {isQuote ? `"${item.text}"` : item.text}
        </p>
        {author && (
          <p className="text-base text-gray-600">
            — {author}
          </p>
        )}
        <div className="flex items-center gap-2 pt-2">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            {item.category}
          </span>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {isQuote ? 'Цитата' : 'Шутка'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={handleCopy} className="flex-shrink-0">
          <Copy className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Скопировать</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('telegram')}
            className="text-blue-600 hover:text-blue-700 flex-shrink-0"
          >
            <img src={telegramIcon} alt="Telegram" className="w-4 h-4 mr-1" />
            <span className="hidden md:inline">Telegram</span>
            <span className="md:hidden">TG</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('vk')}
            className="text-blue-600 hover:text-blue-700 flex-shrink-0"
          >
            <img src={vkIcon} alt="VK" className="w-4 h-4 mr-1" />
            VK
          </Button>
        </div>

        {showRemove && onRemove ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="ml-auto flex-shrink-0"
          >
            Удалить
          </Button>
        ) : isSaved ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate('/collection')}
            className="ml-auto bg-green-600 hover:bg-green-700 flex-shrink-0"
          >
            <BookmarkCheck className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Моя коллекция</span>
            <span className="md:hidden">Коллекция</span>
          </Button>
        ) : (
          <Button
            variant={isAuthenticated ? 'default' : 'outline'}
            size="sm"
            onClick={handleAddToFavorites}
            className="ml-auto flex-shrink-0"
            disabled={!isAuthenticated}
          >
            <Heart className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">В избранное</span>
            <span className="md:hidden">Избранное</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuoteCard;
