const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET;

mongoose.connect('mongodb://localhost:27017/authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//const isEmptyObject = (obj) => !Object.keys(obj).length;

server.use(bodyParser.json());
server.use(express.static('public'));

server.get('/', (_req, res) => {
  res.sendFile('./public/home.html', { root: __dirname });
});
server.get('/login', (_req, res) => {
  res.sendFile('./public/login.html', { root: __dirname });
});
server.get('/change-password', (_req, res) => {
  res.sendFile('./public/change-password.html', { root: __dirname });
});

server.get('/forgot-password', (_req, res) => {
  res.sendFile('./public/forgot-password.html', { root: __dirname });
});

server.post('/api/register', async (req, res) => {
  const { userName, password: plainTextPassword } = req.body;
  if (!userName || typeof userName !== 'string' || userName.length === 0) {
    return res.status(422).json({ error: 'Invalid user name' });
  }
  if (
    !plainTextPassword ||
    typeof plainTextPassword !== 'string' ||
    plainTextPassword.lenght === 0
  ) {
    return res.status(422).json({ error: 'Invalid password format' });
  }
  if (plainTextPassword.length < 5) {
    return res.status(422).json({ error: 'Pasword lenght must be at least 6 characters' });
  } else {
    const password = await bcrypt.hash(plainTextPassword, 10);
    try {
      const response = await User.create({
        userName,
        password,
      });
      console.log('Created user', response);
      res.status(201).json({ status: 'ok', message: 'Succsess' });
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

server.post('/api/login', async (req, res) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName }).lean();
  if (!user) {
    return res.json({ message: 'error', error: 'Invalid user name/password' });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, userName: user.userName }, jwt_secret);
    return res.json({ status: 'ok', data: token, message: 'Logged in successfully' });
  }
  res.json({ message: 'error', error: 'Invalid user name/password11' });
});

server.post('/api/change-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!newPassword || typeof newPassword !== 'string') {
    return res.status(422).json({ error: 'Invalid password format' });
  }
  if (newPassword.length < 5) {
    return res.status(422).json({ error: 'Pasword length must be at least 6 characters' });
  } else {
    try {
      const user = jwt.verify(token, jwt_secret);
      res.status(201).json({ status: 'ok', message: 'Password successfuly changed' });
      console.log('User', user);
      const _id = user.id;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne(
        { _id },
        {
          $set: { password: hashedPassword },
        },
      );
      res.status(201).json({ status: 'ok', message: 'Success change' });
    } catch (error) {
      res.json({ status: 'error', error: 'Not possible' });
    }
  }
});

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
