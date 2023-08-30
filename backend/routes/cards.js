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

const router = express.Router();

// GET /cards
router.get('/cards', getAllCards);

// POST /cards
router.post('/cards', celebrate({
  body: Joi.object({
    name: Joi.string().required(),
    link: Joi.string().required().custom(validateURL), // Menggunakan validasi khusus untuk tautan
  }),
}), createCard);

// DELETE /cards/:cardId
router.delete('/cards/:cardId', deleteCard);

// PUT /cards/:cardId/likes - Like a card
router.put('/cards/:cardId/likes', likeCard);

// DELETE /cards/:cardId/likes - Dislike a card
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
