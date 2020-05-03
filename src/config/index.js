const dotenv = require('dotenv');
dotenv.config();
const config = {
  PORT: process.env.PORT,
  JWTSECRET: process.env.JWTSECRET,
  MONGODB: {
    MONGODBURL: process.env.MONGODBURL
  },
  ACCESSTYPE: {
    USER: 'auth'
  }
};
module.exports = config;
