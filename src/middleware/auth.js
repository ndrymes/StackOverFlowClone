const jwt = require('jsonwebtoken');
const User = require('../model/user');
const config = require('../config/index');
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    var decoded = jwt.verify(token, config.JWTSECRET);
    const id = decoded._id;
    var user = await User.findOne({ _id: id, 'tokens.token': token }).exec();
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({
      code: 401,
      error: true,
      message: 'please Authenticate'
    });
  }
};
module.exports = auth;
