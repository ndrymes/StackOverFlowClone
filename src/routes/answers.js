const express = require('express');
const router = express.Router();
const answerController = require('../controller/answer');
const auth = require('../middleware/auth');

//add questions
router.post('/add/answer', auth, (req, res) => {
  answerController.add(req, res);
});
module.exports = router;
