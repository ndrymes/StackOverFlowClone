const express = require('express');
const router = express.Router();
const questionController = require('../controller/questions');
const auth = require('../middleware/auth');

//add questions
router.post('/add/question', auth, (req, res) => {
  questionController.add(req, res);
});
router.get('/question/:id', (req, res) => {
  questionController.view(req, res);
});
router.put('/update/question/:id', auth, (req, res) => {
  questionController.update(req, res);
});
router.put('/vote/question/:id', auth, (req, res) => {
  questionController.vote(req, res);
});
router.get('/questions/search', auth, (req, res) => {
  questionController.search(req, res);
});
module.exports = router;
