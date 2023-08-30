// middleware/errorHandler.js
const errorHandler = (error, req, res, next) => {
  // Tangani kesalahan di sini
  console.error(error);

  // Jika ada respons kesalahan sebelumnya, lewati middleware ini
  if (res.headersSent) {
    return next(error);
  }

  // Kembalikan respons kesalahan dengan status 500
  return res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
