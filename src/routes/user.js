const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const auth = require('../middleware/auth');

//Sign up user
router.post('/signup', (req, res) => {
  userController.signUp(req, res);
});
//login user
router.post('/login', (req, res) => {
  userController.logIn(req, res);
});
//logout users
router.post('/logout', auth, (req, res) => {
  userController.logOut(req, res);
});
//subscribe for questin
router.post('/add/subscription', auth, (req, res) => {
  userController.subscribe(req, res);
});
//search user
router.get('/user/search', auth, (req, res) => {
  userController.search(req, res);
});
module.exports = router;
