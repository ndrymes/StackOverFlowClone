const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
);
questionSchema.methods.toJSON = function () {
  const question = this
  const newQuestion = question.toObject()
  delete newQuestion.owner
  return newQuestion
}
questionSchema.index({ title: 'text', description: 'text' });
questionSchema.virtual('answers', {
  ref: 'Answers',
  foreignField: 'question',
  localField: '_id'
});
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
