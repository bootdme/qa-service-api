const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

const createServer = () => {
  const app = express();

  const corsOptions = { origin: process.env.URL || '*' };

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors(corsOptions));

  app.use('/', routes);

  return app;
};

module.exports = { createServer };
