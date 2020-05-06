const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
const auth = require('../middleware/auth');

//Sign up route
router.post('/signup', (req, res) => {
  userController.signUp(req, res);
});
router.post('/login', (req, res) => {
  userController.logIn(req, res);
});
router.post('/logout', auth, (req, res) => {
  userController.logOut(req, res);
});
router.post('/add/subscription', auth, (req, res) => {
  userController.subscribe(req, res);
});
router.get('/user/search', auth, (req, res) => {
  userController.search(req, res);
});
module.exports = router;
