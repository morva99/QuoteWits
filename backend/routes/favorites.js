const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Временная база данных избранного
const favorites = {};

// Получить все избранные элементы пользователя
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userFavorites = favorites[userId] || [];

    res.json({
      success: true,
      data: userFavorites
    });
  } catch (error) {
    console.error('Ошибка получения избранного:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении избранного'
    });
  }
});

// Добавить в избранное
router.post('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const item = req.body;

    if (!item.id || !item.type) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать id и type элемента'
      });
    }

    if (!favorites[userId]) {
      favorites[userId] = [];
    }

    const exists = favorites[userId].some(fav => fav.id === item.id);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Элемент уже добавлен в избранное'
      });
    }

    favorites[userId].push({
      ...item,
      addedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Добавлено в избранное',
      data: item
    });
  } catch (error) {
    console.error('Ошибка добавления в избранное:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при добавлении в избранное'
    });
  }
});

// Удалить из избранного
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    if (!favorites[userId]) {
      return res.status(404).json({
        success: false,
        message: 'Избранное пусто'
      });
    }

    const initialLength = favorites[userId].length;
    favorites[userId] = favorites[userId].filter(item => item.id !== itemId);

    if (favorites[userId].length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Элемент не найден в избранном'
      });
    }

    res.json({
      success: true,
      message: 'Удалено из избранного'
    });
  } catch (error) {
    console.error('Ошибка удаления из избранного:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении из избранного'
    });
  }
});

module.exports = router;

