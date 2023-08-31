const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { validateURL } = require('../middleware/validations');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /cards
router.get('/cards', authMiddleware, getAllCards);

// POST /cards
router.post('/cards', celebrate({
  body: Joi.object({
    name: Joi.string().required(),
    link: Joi.string().required().custom(validateURL), // Menggunakan validasi khusus untuk tautan
  }),
}), authMiddleware, createCard);

// DELETE /cards/:cardId
router.delete('/cards/:cardId', authMiddleware, deleteCard);

// PUT /cards/:cardId/likes - Like a card
router.put('/cards/:cardId/likes', authMiddleware, likeCard);

// DELETE /cards/:cardId/likes - Dislike a card
router.delete('/cards/:cardId/likes', authMiddleware, dislikeCard);

module.exports = router;
