const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

server.use(bodyParser.json());
server.use(express.static('public'));
server.use('/', routes);

server.use((_req, _res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
server.use((error, _req, res, _next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
