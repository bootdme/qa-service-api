if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const { createServer } = require('./create');

const { PORT } = process.env || 3000;

const app = createServer();

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`listening on port ${PORT}`);
});
