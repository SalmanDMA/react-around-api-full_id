const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUserByMe,
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  updateOtherUserProfile,
  deleteOtherCard,
} = require('../controllers/users');
const authMiddleware = require('../middleware/auth');
const { validateURL } = require('../middleware/validations');

const router = express.Router();

// Get /users/me
router.get('/users/me', authMiddleware, getUserByMe);

// GET /users
router.get('/users', authMiddleware, getAllUsers);

// GET /users/:userId
router.get('/users/:userId', authMiddleware, getUserById);

// POST /signup
router.post('/signup', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string(),
    about: Joi.string(),
    avatar: Joi.string().custom(validateURL),
  }),
}), createUser);

// POST /signin
router.post('/signin', login);

// PATCH /users/me - Update user profile
router.patch('/users/me', authMiddleware, updateProfile);

// PATCH /users/me/avatar - Update user avatar
router.patch('/users/me/avatar', authMiddleware, updateAvatar);

// PATCH /users/:userId
router.patch('/users/:userId', authMiddleware, updateOtherUserProfile);

// DELETE /users/:userId
router.delete('/users/:userId', authMiddleware, deleteOtherCard);

module.exports = router;
