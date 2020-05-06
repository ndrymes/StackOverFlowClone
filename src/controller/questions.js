const mongoose = require('mongoose');
const questionServices = require('../services/questions');
const currentTime = require('../utils/getcurrentDate');
const Logger = require('../utils/logger');
const responsesHelper = require('../libs/responsehelper');
const meta = require('../utils/metagenerator');

class Questions {
  async add(req, res) {
    const data = req.body;
    const date = currentTime();
    const param = {
      title: data.title,
      description: data.description,
      date
    };
    param.owner = req.user._id;
    try {
      const question = await questionServices.add(param);
      res.status(200).send(responsesHelper.success(200, question));
    } catch (error) {
      Logger.error(`${error}`);
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
  async view(req, res) {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return res
        .status(400)
        .send(responsesHelper.error(400, 'invalid Id type'));
    }
    try {
      const question = await questionServices.getById({ _id: id });
      if (!question) {
        return res
          .status(404)
          .send(responsesHelper.error(404, 'question not found'));
      }
      await question.populate('answers').execPopulate();
      res
        .status(200)
        .send(
          responsesHelper.success(200, { question, answers: question.answers })
        );
    } catch (error) {
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return res
        .status(400)
        .send(responsesHelper.error(400, 'invalid Id type'));
    }
    try {
      const data = req.body;
      const requestValues = Object.keys(data);
      const allowedFields = ['title', 'description'];
      const allowedUpdate = requestValues.every(field =>
        allowedFields.includes(field)
      );
      if (!allowedUpdate) {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'invalid request body'));
      }
      const question = await questionServices.getById({ _id: id });
      if (!question) {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'invalid questionId'));
      }
      const updated = await questionServices.updateById(id, data);
      res.status(200).send(responsesHelper.success(200, updated));
    } catch (error) {
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }

  async vote(req, res) {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return res
        .status(400)
        .send(responsesHelper.error(400, 'invalid Id type'));
    }
    const { vote } = req.body;
    if (typeof vote !== 'boolean') {
      return res
        .status(400)
        .send(
          responsesHelper.error(400, 'invalid request, vote must be a boolean')
        );
    }
    try {
      const question = await questionServices.getById({ _id: id });
      if (!question) {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'invalid questionId'));
      }
      if (question.owner.toString() === req.user._id.toString()) {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'you cannot Vote for yourself'));
      }
      let value = 0;
      if (vote === false) {
        value = -1;
        if (question.vote === 0) {
          value = 0;
        }
      } else {
        value = +1;
      }
      const incValue = { $inc: { vote: value } };
      const updated = await questionServices.updateById(id, incValue);
      res.status(200).send(responsesHelper.success(200, updated));
    } catch (error) {
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

      const questions = await questionServices.search(search, limit, skip);

      const count = questions.length;
      res
        .status(200)
        .send(
          responsesHelper.success(
            200,
            questions,
            'All questions retrieved succesfully',
            meta(limit, skip, count)
          )
        );
    } catch (error) {
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}

//work on delete question

const questions = new Questions();
module.exports = questions;
