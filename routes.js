const express = require('express');
const utilities = require('./util');
require('dotenv').config();
const router = express.Router();
const User = require('./model/user').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

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
router.get('*', (_req, res) => {
  res.sendFile('./public/not-found.html', { root: __dirname });
});

router.post('/api/register', async (req, res) => {
  const { userName, password: plainTextPassword } = req.body;
  if (utilities.checkUserName(userName, res) || utilities.checkPassword(plainTextPassword, res)) {
    return;
  } else {
    const password = await bcrypt.hash(plainTextPassword, 10);
    try {
      await User.create({
        userName,
        password,
      });
      res.status(201).json({ status: 'ok', message: 'Profile created successfully' });
    } catch (error) {
      if (error.code === 11000) {
        JSON.stringify(error);
        return res.json({ message: 'error', error: 'This username is already taken' });
      } else {
        throw error;
      }
    }
  }
});

router.post('/api/login', async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName }).lean();
  if (!user) {
    return res.status(422).json({ message: 'error', error: 'Invalid user name/password11' });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, userName: user.userName }, jwt_secret);
    return res.status(201).json({ status: 'ok', data: token, message: 'Logged in successfully' });
  } else {
    res.json({ message: 'error', error: 'Invalid user name/password12' });
  }
});

router.post('/api/change-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (utilities.checkPassword(newPassword, res)) {
    return;
  } else {
    try {
      const user = jwt.verify(token, jwt_secret);
      const _id = user.id;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne(
        { _id },
        {
          $set: { password: hashedPassword },
        },
      );
      res.status(201).json({ status: 'ok', message: 'Password succesfully changed' });
    } catch (error) {
      res.json({ status: 'error', error: 'Not possible' });
    }
  }
});

module.exports = router;
