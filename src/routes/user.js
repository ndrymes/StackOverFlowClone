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
module.exports = router;
