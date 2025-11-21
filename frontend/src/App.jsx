import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import AuthForm from './components/AuthForm';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import api from './services/api';
import { Button } from './components/ui/button';
import { LogIn } from 'lucide-react';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [savedItems, setSavedItems] = useState(() => {
    // При первой загрузке беру сохраненные данные из localStorage (если есть)
    const saved = localStorage.getItem('savedItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  
  // Храню здесь результаты генераций, чтобы они не терялись при переключении вкладок
  const [generatedQuotes, setGeneratedQuotes] = useState([]);
  const [currentJoke, setCurrentJoke] = useState(null);

  // Функция для загрузки избранного с сервера
  const loadFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      if (response.data.success) {
        setSavedItems(response.data.data);
        // Дублирую в localStorage на случай офлайн режима
        localStorage.setItem('savedItems', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      // Если сервер недоступен, беру данные из localStorage
      const saved = localStorage.getItem('savedItems');
      if (saved) {
        setSavedItems(JSON.parse(saved));
      }
    }
  };

  // При загрузке приложения проверяю есть ли сохраненный токен и валиден ли он
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await api.get('/auth/verify');
          if (response.data.success) {
            setIsAuthenticated(true);
            // Сразу загружаю избранное пользователя
            loadFavorites();
          } else {
            // Токен протух или невалидный - чищу всё
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Если сервер не ответил - тоже чищу токен
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setShowAuthForm(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthForm(false);
    // После успешного входа подгружаю избранное с сервера
    loadFavorites();
  };

  const handleCloseAuthForm = () => {
    setShowAuthForm(false);
  };

  const handleLogout = () => {
    // При выходе чищу все данные пользователя
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('savedItems');
    
    setIsAuthenticated(false);
    setSavedItems([]);
    navigate('/');
  };

  const handleAddToFavorites = async (item, type) => {
    if (!isAuthenticated) {
      toast.error('Пожалуйста, войдите в систему, чтобы сохранять в избранное');
      return;
    }
    
    const isAlreadySaved = savedItems.some(saved => saved.id === item.id);
    
    if (isAlreadySaved) {
      return false;
    }
    
    try {
      // Отправляю POST запрос на сервер для сохранения в базу
      const savedItem = { ...item, type };
      const response = await api.post('/favorites', savedItem);
      
      if (response.data.success) {
        // Добавляю в мое локальное состояние для мгновенного отображения
        const newSavedItems = [...savedItems, savedItem];
        setSavedItems(newSavedItems);
        
        // И дублирую в localStorage на всякий случай
        localStorage.setItem('savedItems', JSON.stringify(newSavedItems));
        
        return true;
      }
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
      toast.error(error.response?.data?.message || 'Ошибка при добавлении в избранное');
      return false;
    }
  };

  const isItemSaved = (id) => {
    return savedItems.some(item => item.id === id);
  };

  const handleRemoveFromFavorites = async (id) => {
    try {
      // Отправляю DELETE запрос на сервер для удаления из базы
      const response = await api.delete(`/favorites/${id}`);
      
      if (response.data.success) {
        // Удаляю из локального состояния для мгновенного обновления UI
        const newSavedItems = savedItems.filter(item => item.id !== id);
        setSavedItems(newSavedItems);
        
        // Обновляю localStorage
        localStorage.setItem('savedItems', JSON.stringify(newSavedItems));
        
        toast.success('Удалено из избранного');
      }
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error);
      toast.error(error.response?.data?.message || 'Ошибка при удалении из избранного');
    }
  };

  // Пока проверяю токен, показываю спиннер
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl overflow-x-hidden">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                onAddToFavorites={handleAddToFavorites}
                isAuthenticated={isAuthenticated}
                isItemSaved={isItemSaved}
                generatedQuotes={generatedQuotes}
                setGeneratedQuotes={setGeneratedQuotes}
                currentJoke={currentJoke}
                setCurrentJoke={setCurrentJoke}
              />
            } 
          />
          <Route 
            path="/collection" 
            element={
              isAuthenticated ? (
                <CollectionPage
                  savedItems={savedItems}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <h2 className="text-2xl text-gray-700 mb-4">Вход требуется</h2>
                  <p className="text-gray-500 mb-6">
                    Пожалуйста, войдите в систему, чтобы просматривать свою коллекцию
                  </p>
                  <Button onClick={handleLogin}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </Button>
                </div>
              )
            } 
          />
        </Routes>
      </main>

      <Toaster position="bottom-left" closeButton richColors />
      {showAuthForm && <AuthForm onSuccess={handleLoginSuccess} onClose={handleCloseAuthForm} />}
    </div>
  );
}

export default App;
