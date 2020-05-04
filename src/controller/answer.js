const mongoose = require('mongoose');
const answerServices = require('../services/answer');
const questionService = require('../services/questions');
const currentTime = require('../utils/getcurrentDate');
const Logger = require('../utils/logger');
const responsesHelper = require('../libs/responsehelper');
const meta = require('../utils/metagenerator');
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
    if (!question) {
      return res
        .status(400)
        .send(responsesHelper.error(400, 'invalid request'));
    }

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
  async search(req, res) {
    try {
      let { limit, skip, q } = req.query;
      limit = parseInt(limit);
      skip = parseInt(skip);
      if (!limit || !skip) {
        limit = 10;
        skip = 0;
      }
      if (!q) {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'Please add content to search'));
      }

      const search = {
        $or: [
          {
            title: {
              $regex: q,
              $options: 'i'
            }
          },
          {
            description: {
              $regex: q,
              $options: 'i'
            }
          }
        ]
      };

      const answers = await answerServices.search(search, limit, skip);

      const count = questions.length;
      res
        .status(200)
        .send(
          responsesHelper.success(
            200,
            answers,
            'All answers retrieved succesfully',
            meta(limit, skip, count)
          )
        );
    } catch (error) {
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
const answers = new Answers();
module.exports = answers;
