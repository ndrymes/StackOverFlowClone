const User = require('../model/user');
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
}
const userServices = new UserServices();
module.exports = userServices;
