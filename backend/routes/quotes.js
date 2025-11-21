const express = require('express');
const router = express.Router();

// База данных цитат
const quotes = [
  { id: '1', text: 'Единственный способ делать великую работу — любить то, что ты делаешь.', author: 'Стив Джобс', category: 'Мотивация' },
  { id: '2', text: 'Жизнь — это то, что с тобой происходит, пока ты строишь другие планы.', author: 'Джон Леннон', category: 'Жизнь' },
  { id: '3', text: 'Будь собой; все остальные роли уже заняты.', author: 'Оскар Уайльд', category: 'Жизнь' },
  { id: '4', text: 'Успех — это способность идти от одной неудачи к другой, не теряя энтузиазма.', author: 'Уинстон Черчилль', category: 'Успех' },
  { id: '5', text: 'Не важно, как медленно ты идёшь, главное — не останавливаться.', author: 'Конфуций', category: 'Мотивация' },
  { id: '6', text: 'Искусство — это ложь, которая позволяет нам понять правду.', author: 'Пабло Пикассо', category: 'Искусство' },
  { id: '7', text: 'Творчество требует мужества.', author: 'Анри Матисс', category: 'Искусство' },
  { id: '8', text: 'Лучшее время посадить дерево было 20 лет назад. Второе лучшее время — сейчас.', author: 'Китайская пословица', category: 'Мотивация' },
  { id: '9', text: 'Величайшая слава не в том, чтобы никогда не падать, а в том, чтобы подниматься каждый раз, когда мы падаем.', author: 'Конфуций', category: 'Успех' },
  { id: '10', text: 'Воображение важнее знания.', author: 'Альберт Эйнштейн', category: 'Искусство' },
  { id: '11', text: 'Счастье — это не готовый продукт. Оно приходит от твоих собственных действий.', author: 'Далай-лама', category: 'Жизнь' },
  { id: '12', text: 'Успех — это сумма небольших усилий, повторяемых изо дня в день.', author: 'Роберт Кольер', category: 'Успех' },
];

// Получить все категории
router.get('/categories', (req, res) => {
  const categories = [...new Set(quotes.map(q => q.category))];
  res.json({
    success: true,
    data: categories
  });
});

// Получить всех авторов
router.get('/authors', (req, res) => {
  const authors = [...new Set(quotes.map(q => q.author))];
  res.json({
    success: true,
    data: authors
  });
});

// Получить цитаты с фильтрацией
router.get('/', (req, res) => {
  try {
    const { category, author, keyword, limit = 3 } = req.query;
    let filtered = [...quotes];

    if (category && category !== 'Все категории') {
      filtered = filtered.filter(q => q.category === category);
    }

    if (author && author !== 'Все авторы') {
      filtered = filtered.filter(q => q.author === author);
    }

    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      filtered = filtered.filter(q =>
        q.text.toLowerCase().includes(keywordLower) ||
        q.author.toLowerCase().includes(keywordLower)
      );
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const result = shuffled.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: result,
      total: filtered.length
    });
  } catch (error) {
    console.error('Ошибка получения цитат:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении цитат'
    });
  }
});

// Получить случайную цитату
router.get('/random', (req, res) => {
  try {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({
      success: true,
      data: randomQuote
    });
  } catch (error) {
    console.error('Ошибка получения случайной цитаты:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении цитаты'
    });
  }
});

module.exports = router;

