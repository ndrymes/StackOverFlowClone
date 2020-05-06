const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//know what compression is really used for and cors
const compression = require('compression');
const API_VERSION = '/v1';
const userRoute = require('./routes/user');

const app = express();
app.use(bodyParser.json());
//know what .urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(compression());
app.use(cors());

//
app.use(API_VERSION, userRoute);

app.get('/', (req, res) => {
  res.status(200).send({
    'health-check': 'OK',
    message: 'base endpoint stack over flow clone is running'
  });
});
module.exports = app;
