const express = require('express');
const router = express.Router();

// База данных шуток
const jokes = [
  {
    id: 'j1',
    text: 'Программист — это человек, который решает проблему, о существовании которой вы не знали, способом, который вы не понимаете.',
    category: 'IT',
  },
  {
    id: 'j2',
    text: 'Почему программисты путают Хэллоуин и Рождество? Потому что 31 OCT = 25 DEC.',
    category: 'IT',
  },
  {
    id: 'j3',
    text: 'Оптимист видит стакан наполовину полным. Пессимист видит стакан наполовину пустым. Программист видит стакан в два раза больше необходимого.',
    category: 'IT',
  },
  {
    id: 'j4',
    text: 'Жизнь как коробка шоколадных конфет: никогда не знаешь, какая попадётся. Особенно если у тебя нет инструкции на русском.',
    category: 'Жизнь',
  },
  {
    id: 'j5',
    text: 'Моя способность запоминать песни никому не нужна в школе, но очень пригождается на караоке.',
    category: 'Жизнь',
  },
  {
    id: 'j6',
    text: 'Успех — это 10% таланта и 90% избегания встреч, которые можно было провести по email.',
    category: 'Работа',
  },
  {
    id: 'j7',
    text: 'Мотивация в понедельник: завтра обязательно начну новую жизнь. Мотивация во вторник: ну ладно, со следующего понедельника.',
    category: 'Мотивация',
  },
  {
    id: 'j8',
    text: 'Кофе — это способ напомнить себе, что ты взрослый, который сам выбирает свои зависимости.',
    category: 'Жизнь',
  },
  {
    id: 'j9',
    text: 'Главное в работе — не то, сколько ты делаешь, а то, насколько занято ты выглядишь.',
    category: 'Работа',
  },
  {
    id: 'j10',
    text: 'Почему художники всегда спокойны? Потому что у них всегда есть выход — нарисовать его!',
    category: 'Искусство',
  },
];

// Получить все категории шуток
router.get('/categories', (req, res) => {
  const categories = [...new Set(jokes.map(j => j.category))];
  res.json({
    success: true,
    data: categories
  });
});

// Получить случайную шутку
router.get('/random', (req, res) => {
  try {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    res.json({
      success: true,
      data: randomJoke
    });
  } catch (error) {
    console.error('Ошибка получения случайной шутки:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении шутки'
    });
  }
});

// Получить все шутки с фильтрацией
router.get('/', (req, res) => {
  try {
    const { category, limit } = req.query;
    let filtered = [...jokes];

    if (category && category !== 'Все категории') {
      filtered = filtered.filter(j => j.category === category);
    }

    if (limit) {
      filtered = filtered.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      data: filtered,
      total: jokes.length
    });
  } catch (error) {
    console.error('Ошибка получения шуток:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении шуток'
    });
  }
});

module.exports = router;

