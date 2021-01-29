const express = require('express');
//const utilities = require('./util');
const router = express.Router();

router.get('/', (_req, res) => {
  res.sendFile('./public/home.html', { root: __dirname });
});
router.get('/login', (_req, res) => {
  res.sendFile('./public/login.html', { root: __dirname });
});
router.get('/change-password', (_req, res) => {
  res.sendFile('./public/change-password.html', { root: __dirname });
});

router.get('/forgot-password', (_req, res) => {
  res.sendFile('./public/forgot-password.html', { root: __dirname });
});

module.exports = router;
