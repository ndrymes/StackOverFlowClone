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

   /**
     * @description Add answers to a question using questionId
     * @param {Object} req - Http Request object
     * @param {Object} res - Http Request object
     * @returns {Object} returns object of the required response
     */
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
        .send(responsesHelper.error(400, 'invalid Id type'));
    }
//get questions by Id
    const question = await questionService.getById({ _id: questionId });

    if (!question) {
      return res
        .status(400)
        .send(responsesHelper.error(400, 'invalid questionId'));
    }
    try {
      const date = currentTime();
      const param = {
        title: data.title,
        description: data.description,
        date,
        question: questionId
      };
      param.owner = req.user._id;
      //add question to database
      const answers = await answerServices.add(param);
      //checks if there are  subscribers to questions
      const subscribers = await answerServices.getsubscriber(questionId);
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
        //push it to a queue where user can get notifications
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
      //validates content
      if (!q) {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'Please add content to search'));
      }
      //search contents in both  title and description fields
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

      const count = answers.length;
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
