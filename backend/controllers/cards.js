const Card = require('../models/card');

// Retrieve all cards
const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find();
    return res.json(cards);
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred on the server' });
  }
};

// Create a new card
const createCard = async (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  console.log('User ID:', _id);

  try {
    const card = await Card.create({ name, link, owner: _id });
    return res.status(201).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid data' });
    }
    return res.status(500).json({ message: 'An error occurred on the server' });
  }
};

// Delete a card by ID
const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const deletedCard = await Card.findByIdAndDelete(cardId).orFail(() => {
      const error = new Error('Card not found');
      error.statusCode = 404;
      throw error;
    });
    return res.json({ message: 'Card deleted successfully', deletedCard });
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.status(500).json({ message: 'An error occurred on the server' });
  }
};

// Like a card
const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.json({ message: 'Card liked successfully', card });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred on the server' });
  }
};

// Dislike a card
const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    return res.json({ message: 'Card disliked successfully', card });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred on the server' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
