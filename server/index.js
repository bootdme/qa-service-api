const { createServer } = require('./create');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`listening on port ${PORT}`);
});
