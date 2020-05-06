'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config/index');
const encrptionManager = require('../../libs/encryption');
function methods(Schema) {
  Schema.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
      const hash = encrptionManager.getHashed(user.password);
      user.password = hash;
    }
    next();
  });

  Schema.methods.generateAuthToken = async function() {
    const user = this;
    const access = config.ACCESSTYPE.USER;
    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email, name: user.name },
      config.JWTSECRET
    );
    user.tokens = user.tokens.concat({ access, token });
    await user.save();
    return token;
  };
}
module.exports = methods;
