const Answer = require('../model/answer/answers');
const Subcriber = require('../model/subscription/subscription');
class AnswerServices {
  add(data) {
    return Answer.create(data);
  }
  getsubscriber(question) {
    return Subcriber.find({ question, active: true })
      .select('email')
      .exec();
  }
  search(search, limit, skip) {
    return Answer.find(search)
      .limit(limit)
      .skip(skip)
      .sort({
        title: 'asc'
      })
      .exec();
  }
}
const answerServices = new AnswerServices();
module.exports = answerServices;
