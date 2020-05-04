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
    // i will considered a check mark as a feature later
    //   answered:{
    //     type: Boolean,
    //     default: false
    //   },
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
answerSchema.index({ title: 'text', description: 'text' });
const Answers = mongoose.model('Answers', answerSchema);
module.exports = Answers;
