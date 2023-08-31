const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();

// Menghubungkan ke MongoDB

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}
main().catch((err) => console.log(err));

// Middleware untuk memproses body JSON pada request
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware untuk memproses cors
app.use(cors());
app.options('*', cors());

// Middleware untuk menangani request logger
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server akan crash saat ini');
  }, 0);
});

// Menggunakan router
app.use(usersRouter);
app.use(cardsRouter);

// Middleware untuk menangani kesalahan pada request
app.use(errorLogger);

// Middleware untuk menangani kesalahan pada request dari celebrate
app.use(errors());

// Middleware untuk menangani 404 (Sumber daya tidak ditemukan)
app.use((req, res) => {
  res.status(404).json({ message: 'Sumber daya yang diminta tidak ada' });
});

// Middleware untuk menangani error umum
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
