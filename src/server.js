const app = require('./app');
const db = require('./db/mongoose');
const Logger = require('./utils/logger');

const PORT = require('./config/index').PORT;
app.listen(PORT, () => {
  Logger.info(`Service is running on ${PORT}`);
  console.log(`Service is running on ${PORT} `);
});
