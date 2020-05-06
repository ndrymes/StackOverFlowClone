const mongoose = require('mongoose');
const answerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 3,
      required: true,
      trim: true
    },
    description: {
      type: String,
      minlength: 6,
      required: true
    },
    date: {
      type: String
    },
    vote: {
      type: Number,
      default: 0
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Question'
    }
  },
  {
    timestamps: true
  }
);
answerSchema.methods.toJSON = function () {
  const answer = this
  const newAnswer = answer.toObject()
  delete newAnswer.owner
  return newAnswer
}
answerSchema.index({ title: 'text', description: 'text' });
const Answers = mongoose.model('Answers', answerSchema);
module.exports = Answers;
