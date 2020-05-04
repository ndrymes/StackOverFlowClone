const User = require('../model/user/user');
const Subscription = require('../model/subscription/subscription');
class UserServices {
  async getUser(data) {
    return User.findOne(data).exec();
  }
  async addUser(data) {
    return new User(data);
  }
  async verifyUser(email, password) {
    return User.verifyDetails(email, password);
  }
  async addSubscription(data) {
    return Subscription.create(data);
  }
}
const userServices = new UserServices();
module.exports = userServices;
