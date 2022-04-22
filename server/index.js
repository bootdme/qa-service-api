const { createServer } = require('./create');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { PORT } = process.env || 3000;

const app = createServer();

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`listening on port ${PORT}`);
});
