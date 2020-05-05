const jwt = require('jsonwebtoken');
const User = require('../model/user/user');
const config = require('../config/index');
const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (!token) {
      return res.status(401).send({
        code: 401,
        error: true,
        message: 'please provide an authorization token'
      });
    }
    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.JWTSECRET);
    const id = decoded._id;

    const user = await User.findOne({ _id: id, 'tokens.token': token }).exec();

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
