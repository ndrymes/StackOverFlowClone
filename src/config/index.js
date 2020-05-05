const dotenv = require('dotenv');
dotenv.config();
const config = {
  PORT: process.env.PORT,
  JWTSECRET: process.env.JWTSECRET,
  MONGODB: {
    MONGODBURL: process.env.MONGODBURL,
    TESTDB: process.env.TESTDB
  },
  ACCESSTYPE: {
    USER: 'auth'
  },
  RABBITMQ: {
    RABBIT_HOST: process.env.RABBIT_HOST,
    RABBIT_PORT: process.env.RABBIT_PORT || 5672,
    RABBIT_USERNAME: process.env.RABBIT_USERNAME,
    RABBIT_PASSWORD: process.env.RABBIT_PASSWORD
  },
  SENDGRIDAPIKEY: process.env.SENDGRID_API_KEY,
  email: {
    NODEMAILER_USER: process.env.NODEMAILER_USER,
    NODEMAILER_PORT: process.env.NODEMAILER_PORT,
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
    NODEMAILER_HOST: process.env.NODEMAILER_HOST,
    NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE
  }
};
module.exports = config;
