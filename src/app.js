const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const API_VERSION = '/v1';
//connect to mongoDb
require('./db/mongoose');
//run cron for sendmail
require('./jobs/sendMail');

//call routes
const userRoute = require('./routes/user');
const questionRoute = require('./routes/questions');
const answerRoute = require('./routes/answers');
const app = express();

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
//compress json output
app.use(compression());
//allow app to use cors
app.use(cors());

app.use(API_VERSION, userRoute);
app.use(API_VERSION, questionRoute);
app.use(API_VERSION, answerRoute);

//call base endpoint
app.get('/', (req, res) => {
  res.status(200).send({
    'health-check': 'OK',
    message: 'base endpoint stack over flow clone is running'
  });
});
module.exports = app;
