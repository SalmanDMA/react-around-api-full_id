const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();

// Menghubungkan ke MongoDB

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/aroundb');
}
main().catch((err) => console.log(err));

// Middleware untuk memproses body JSON pada request
app.use(express.json());

// Middleware untuk menangani request logger
app.use(requestLogger);

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

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
