const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Временная база данных пользователей 
const users = [];

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка наличия данных
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, укажите логин и пароль'
      });
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Пароль должен содержать минимум 6 символов'
      });
    }

    // Проверка существования пользователя
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким логином уже существует'
      });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    // Создание JWT токена
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Регистрация прошла успешно',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при регистрации'
    });
  }
});

// Авторизация
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка наличия данных
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, укажите логин и пароль'
      });
    }

    // Поиск пользователя
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Неверный логин или пароль'
      });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Авторизация прошла успешно',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при авторизации'
    });
  }
});

// Проверка токена
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Токен не предоставлен'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Недействительный токен'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  });
});

module.exports = router;

