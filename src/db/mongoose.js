const mongoose = require('mongoose');
const config = require('../config/index');
let url = '';
process.env.NODE_ENV === 'test'
  ? (url = config.MONGODB.TESTDB)
  : (url = config.MONGODB.MONGODBURL);
console.log(url);

mongoose

  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(res => {
    console.log('database connected', url);
  })
  .catch(e => {
    console.log(e);
  });
module.exports = mongoose;
