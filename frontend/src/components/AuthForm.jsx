import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { LogIn, UserPlus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

function AuthForm({ onSuccess, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, { username, password });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        if (isLogin) {
          toast.success('Успешный вход в систему!');
        } else {
          toast.success('Регистрация прошла успешно!');
        }

        onSuccess();
      }
    } catch (error) {
      const message = error.response?.data?.message || (isLogin ? 'Ошибка при входе' : 'Ошибка при регистрации');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" style={{ backdropFilter: 'blur(8px)' }}>
      <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 relative my-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-purple-600" />
        </div>

        <h2 className="text-center text-purple-600 mb-6">
          {isLogin ? 'Вход в систему' : 'Регистрация'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Логин</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите логин"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              'Загрузка...'
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Войти
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Зарегистрироваться
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setUsername('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-purple-600 hover:text-purple-700 transition-colors"
          >
            {isLogin ? (
              <>
                Нет аккаунта? <span className="underline">Зарегистрируйтесь</span>
              </>
            ) : (
              <>
                Уже есть аккаунт? <span className="underline">Войдите</span>
              </>
            )}
          </button>
        </div>

      </Card>
    </div>
  );
}

export default AuthForm;
