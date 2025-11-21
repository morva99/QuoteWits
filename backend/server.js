const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const quotesRoutes = require('./routes/quotes');
const jokesRoutes = require('./routes/jokes');
const favoritesRoutes = require('./routes/favorites');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/jokes', jokesRoutes);
app.use('/api/favorites', favoritesRoutes);

// Главная страница API
app.get('/', (req, res) => {
  res.json({
    message: 'QuoteWits API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      quotes: '/api/quotes',
      jokes: '/api/jokes',
      favorites: '/api/favorites'
    }
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Среда: ${process.env.NODE_ENV || 'development'}`);
});

