const mongoose = require('mongoose');
const questionServices = require('../services/questions');
const currentTime = require('../utils/getcurrentDate');
const Logger = require('../utils/logger');
const responsesHelper = require('../libs/responsehelper');
const meta = require('../utils/metagenerator');

class Questions {

  /**
     * @description create question 
     * @param {Object} req - Http Request object
     * @param {Object} res - Http Request object
     * @returns {Object} returns object of the required response
     */
  async add(req, res) {
    const data = req.body;
    const date = currentTime();
    //validates for title and description.
    if (!data.title || !data.description) {
      return res
        .status(400)
        .send(responsesHelper.error(400, 'Title and description are required'));
    }
    const param = {
      title: data.title,
      description: data.description,
      date
    };
    //set userId for question
    param.owner = req.user._id;
    try {
      const question = await questionServices.add(param);
      res.status(200).send(responsesHelper.success(200, question));
    } catch (error) {
      Logger.error(`${error}`);
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }

  /**
     * @description view questions and corresponding answers
     * @param {Object} req - Http Request object
     * @param {Object} res - Http Request object
     * @returns {Object} returns object of the required response
     */
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
      //get answers by virtual population
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
/**
  * @description update questions by fields
*/
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
      //validate input fields
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
      //check that question to update belongs to owner
      if (question.owner.toString() !== req.user._id.toString()) {
        return res
        .status(400)
        .send(responsesHelper.error(400, 'Questions can only be edited by owner'));
      }
      const updated = await questionServices.updateById(id, data);
      res.status(200).send(responsesHelper.success(200, updated));
    } catch (error) {
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
/**
  * @description upvote or downvote questions
*/
  async vote(req, res) {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return res
        .status(400)
        .send(responsesHelper.error(400, 'invalid Id type'));
    }
    const { vote } = req.body;
    //check that vote must be a type of boolean, downvote:false, upvote:true
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
      //increase or decrease vote base on input
      let value = 0;
      if (vote === false) {
        value = -1;
        if (question.vote === 0) {
          value = 0;
        }
      } else {
        value = +1;
      }
      //set a mongoose moethod for increament
      const incValue = { $inc: { vote: value } };
      const updated = await questionServices.updateById(id, incValue);
      res.status(200).send(responsesHelper.success(200, updated));
    } catch (error) {
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
  /**
  * @description search questions
*/
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
//search both fields for content
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
const questions = new Questions();
module.exports = questions;
