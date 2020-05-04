const nodemailer = require('nodemailer');
const Logger = require('./logger');
const config = require('../config/index');

const sendMail = async (to, from, subject, message) => {
  const msg = { to, subject, text: message };
  try {
    const transporter = nodemailer.createTransport({
      host: config.email.NODEMAILER_HOST,
      service: config.email.NODEMAILER_PORT,
      port: config.email.NODEMAILER_PORT,
      secure: true,
      auth: {
        user: config.email.NODEMAILER_USER,
        pass: config.email.NODEMAILER_PASSWORD
      }
    }); 
    const mailOptions = {
      text: message,
      to,
      from,
      subject
    };
    let info = await transporter.sendMail(mailOptions);
    Logger.info(info.messageId);
  } catch (error) {
    Logger.error(`${error}`);
    return false;
  }
};
module.exports = sendMail;
