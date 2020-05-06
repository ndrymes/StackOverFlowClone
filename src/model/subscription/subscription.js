const mongoose = require('mongoose');
const subSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    email: {
      type: String
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Question'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);
const Subscribe = mongoose.model('Subscription', subSchema);
module.exports = Subscribe;
