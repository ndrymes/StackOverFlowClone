const Questions = require('../model/question/questions');
class QuestionServices {
  async add(data) {
    return Questions.create(data);
  }
  async getById(data) {
    return Questions.findOne(data).exec();
  }
  async updateById(id, field) {
    return Questions.findByIdAndUpdate(id, field, {
      new: true,
      runValidators: true
    })
      .lean()
      .exec();
  }
  search(search, limit, skip) {
    return Questions.find(search)
      .limit(limit)
      .skip(skip)
      .sort({
        title: 'asc'
      })
      .exec();
  }
}
const questionServices = new QuestionServices();
module.exports = questionServices;
