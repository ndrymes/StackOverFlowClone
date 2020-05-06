const mongoose = require('mongoose');
const validator = require('validator');
const schemaMethods = require('../utils/mongooseMethods')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('not a valid email');
        }
      }
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },
    avatar: { data: Buffer },
    tokens: [
      {
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

schemaMethods(userSchema)

const User = mongoose.model('User', userSchema);
module.exports = User;
