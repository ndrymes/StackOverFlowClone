const answerServices = require('../services/answer');
const questionService = require('../services/questions');
const currentTime = require('../utils/getcurrentDate');
const Logger = require('../utils/logger');
const responsesHelper = require('../libs/responsehelper');
const mongoose = require('mongoose');
const rabbitMq = require('../libs/RabbitMq');
const QUEUE_NAME = 'SUBSCRIBER';
class Answers {
  async add(req, res) {
    const data = req.body;
    const { questionId } = req.body;
    if (!questionId) {
      return res
        .status(400)
        .send(responsesHelper.error(400, ' questionId is required'));
    }
    const isValid = mongoose.Types.ObjectId.isValid(questionId);
    if (!isValid) {
      return res
        .status(400)
        .send(responsesHelper.error(400, 'invalid questionId'));
    }
    const question = await questionService.getById({ _id: questionId });
    try {
      const date = currentTime();
      const param = {
        title: data.title,
        description: data.description,
        date,
        question: questionId
      };
      const subscribers = await answerServices.getsubscriber(questionId);
      param.owner = req.user._id;
      const answers = await answerServices.add(param);
      if (subscribers.length > 0) {
        const queueData = {
          data: subscribers,
          question: question.title,
          answer: {
            title: param.title,
            description: param.description
          },

          meta: {
            module: 'Answer',
            operation: 'add'
          }
        };
        await rabbitMq.rabbit_send(QUEUE_NAME, JSON.stringify(queueData));
      }
      res.status(200).send(responsesHelper.success(200, answers));
    } catch (error) {
      Logger.error(`${error}`);
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
const answers = new Answers();
module.exports = answers;
