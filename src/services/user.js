const User = require('../model/user/user');
const Subscription = require('../model/subscription/subscription');
class UserServices {
  
  //get user that has the fields that was passed in
  async getUser(data) {
    return User.findOne(data).exec();
  }

  //create a new user object
  async addUser(data) {
    return new User(data);
  }

  //A mongoose method that helps to verify user credentials
  async verifyUser(email, password) {
    return User.verifyDetails(email, password);
  }

  async addSubscription(data) {
    return Subscription.create(data);
  }
  //search user with search details
  search(search, limit, skip) {
    return User.find(search)
      .limit(limit)
      .skip(skip)
      .sort({
        title: 'asc'
      })
      .exec();
  }
}
const userServices = new UserServices();
module.exports = userServices;
