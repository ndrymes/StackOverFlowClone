'use strict';
const mongoose = require('mongoose');
const userServices = require('../services/user');
const responsesHelper = require('../libs/responsehelper');
const encryptionManager = require('../libs/encryption');
const Logger = require('../utils/logger');
const meta = require('../utils/metagenerator');
class User {
  async signUp(req, res) {
    let data = req.body;
    try {
      const userExist = await userServices.getUser({ email: data.email });
      if (userExist) {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'Email already registered.'));
      }
      if (!data.lat || !data.long) {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'user Lat and lng is required'));
      }
      const coordinates = [Number(data.long), Number(data.lat)];

      const param = {
        email: data.email,
        name: data.name,
        password: data.password,
        username: data.username,
        type: 'Point',
        location: {
          coordinates: coordinates
        }
      };

      const user = await userServices.addUser(param);
      await user.generateAuthToken();
      await user.save();
      user;
      res.status(200).send(responsesHelper.success(200, user));
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
          return res.status(201).send(responsesHelper.success(200, user));
        } else {
          return res
            .status(400)
            .send(responsesHelper.error(400, 'Incorrect Password'));
        }
      } else {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'User does not exist.'));
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
  async search(req, res) {
    try {
      let { limit, skip, q, lat, long } = req.query;
      limit = parseInt(limit);
      skip = parseInt(skip);
      if (!limit || !skip) {
        limit = 10;
        skip = 0;
      }
      if (!lat || !long) {
        return res
          .status(400)
          .send(responsesHelper.error(400, 'lat and long is required'));
      }

      const search = {
        location: {
          $near: {
            $maxDistance: 4000,
            $geometry: {
              type: 'Point',
              coordinates: [lat, long]
            }
          }
        }
      };

      const users = await userServices.search(search, limit, skip);
      const count = user.length;
      res
        .status(200)
        .send(
          responsesHelper.success(
            200,
            users,
            'All users retrieved succesfully',
            meta(limit, skip, count)
          )
        );
    } catch (error) {
      console.log(error);

      res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
const user = new User();
module.exports = user;
