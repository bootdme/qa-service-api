require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const { PORT } = process.env || 3000;

const corsOptions = { origin: process.env.URL || '*' };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use('/', routes);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`listening on port ${PORT}`);
});
