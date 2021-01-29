const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes');

const userName = process.env.MONGO_USERNAME;
//const pass = process.env.MONGO_PASSWORD;
//const port = process.env.PORT || 5000;
//const CONNECTION_URL = `mongodb+srv://${userName}:${pass}@user-authentication.sjapq.mongodb.net/authentication?retryWrites=true&w=majority`;
const CONNECTION_URL = process.env.MONGODB_URI;
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    server.listen(port, () => {
      console.log(`Server listening at ${port}`);
    }),
  )
  .catch((err) => console.log(err.message));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
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
