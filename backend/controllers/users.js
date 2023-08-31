require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Joi } = require('celebrate');
const User = require('../models/user');
const Card = require('../models/card');

const getUserProfile = async (req, res) => {
  try {
    // Menggunakan req.user._id dari middleware auth untuk mengambil data pengguna saat ini
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while retrieving user profile' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  console.log(req.headers, 'ini adalah getAllUsers');
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving users' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  console.log(req.headers, 'ini adalah getUserById');
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).orFail(() => {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    });
    return res.json(user);
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error retrieving user' });
  }
};

const getUserByMe = async (req, res) => {
  const token = req.header('Authorization').split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(decoded);
  } catch (error) {
    console.error('Error checking token validity:', error);
    res.status(401).json({ error: 'Token tidak valid' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const {
    email,
    password,
    name = 'Jacques Cousteau',
    about = 'Explorer',
    avatar = 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
  } = req.body;

  // Validasi input menggunakan Joi
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string(),
    about: Joi.string(),
    avatar: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    });
    await newUser.save();
    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, { name, about }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred on the server' });
  }
};

// Update user avatar
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(_id, { avatar }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred on the server' });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const payload = {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token });
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while logging in' });
  }
};

const updateOtherUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, about } = req.body;

  try {
    // Temukan pengguna berdasarkan ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Pastikan pengguna saat ini hanya dapat mengedit profil mereka sendiri
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to edit this user profile' });
    }

    // Lanjutkan dengan proses pembaruan profil
    user.name = name;
    user.about = about;
    await user.save();

    return res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while updating the user profile' });
  }
};

const deleteOtherCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    // Temukan kartu berdasarkan ID
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Pastikan pengguna saat ini hanya dapat menghapus kartu yang miliknya
    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this card' });
    }

    // Lanjutkan dengan proses penghapusan
    await card.remove();

    return res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while deleting the card' });
  }
};

module.exports = {
  getUserProfile,
  getAllUsers,
  getUserById,
  getUserByMe,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  updateOtherUserProfile,
  deleteOtherCard,
};
