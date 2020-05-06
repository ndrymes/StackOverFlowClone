'use strict';
const mongoose = require('mongoose');
const userServices = require('../services/user');
const responsesHelper = require('../libs/responsehelper');
const encryptionManager = require('../libs/encryption');
const Logger = require('../utils/logger');

class User {
  async signUp(req, res) {
    let data = req.body;
    try {
      const userExist = await userServices.getUser({ email: data.email });
      if (userExist) {
        return res
          .status(500)
          .send(responsesHelper.error(500, 'Email already registered.'));
      }
      const param = {
        email: data.email,
        name: data.name,
        password: data.password
      };
      const user = await userServices.addUser(param);
      await user.generateAuthToken();
      await user.save();
      res.status(201).send(responsesHelper.success(200, user));
    } catch (error) {
      Logger.error(`${error}`);
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }

  async logIn(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send(responsesHelper.error(400, 'Email and password is required'));
    }
    try {
      const user = await userServices.getUser({ email });
      if (user) {
        if (encryptionManager.compareHashed(password, user.password)) {
          await user.generateAuthToken();
          return res.status(200).send(responsesHelper.success(200, user));
        } else {
          return res
            .status(500)
            .send(responsesHelper.error(500, 'Incorrect Password'));
        }
      } else {
        return res
          .status(500)
          .send(responsesHelper.error(500, 'User does not exist.'));
      }
    } catch (error) {
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }

  async logOut(req, res) {
    try {
      req.user.tokens = req.user.tokens.filter(element => {
        return element.token !== req.token;
      });
      await req.user.save();
      res.status(200).send(responsesHelper.success(200, 'logout succesful'));
    } catch (error) {
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
  async subscribe(req, res) {
    try {
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
      const param = {
        user: req.user._id,
        question: questionId,
        email: req.user.email
      };
      const subscription = await userServices.addSubscription(param);
      res.status(200).send(responsesHelper.success(200, subscription));
    } catch (error) {
      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
const user = new User();
module.exports = user;
