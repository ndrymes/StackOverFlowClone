const mongoose = require('mongoose');
const config = require('../config/index');
const url = config.MONGODB.MONGODBURL;

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
