const Answer = require('../model/answer/answers');
const Subcriber = require('../model/subscription/subscription');
class AnswerServices {
  add(data) {
    return Answer.create(data);
  }
  getsubscriber(question) {
    return Subcriber.find({ question, active: true }).select('email');
  }
}
const answerServices = new AnswerServices();
module.exports = answerServices;
