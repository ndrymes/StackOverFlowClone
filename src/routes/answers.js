const express = require('express');
const router = express.Router();
const answerController = require('../controller/answer');
const auth = require('../middleware/auth');

//add questions
router.post('/add/answer', auth, (req, res) => {
  answerController.add(req, res);
});

router.get('/answers/search', (req, res) => {
  answerController.search(req, res);
});
module.exports = router;
