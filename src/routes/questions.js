const express = require('express');
const router = express.Router();
const questionController = require('../controller/questions');
const auth = require('../middleware/auth');

//add questions
router.post('/add/question', auth, (req, res) => {
  questionController.add(req, res);
});
//view question
router.get('/question/:id', (req, res) => {
  questionController.view(req, res);
});
//update questions
router.put('/update/question/:id', auth, (req, res) => {
  questionController.update(req, res);
});
//vote questions
router.post('/vote/question/:id', auth, (req, res) => {
  questionController.vote(req, res);
});
//search questions
router.get('/questions/search', (req, res) => {
  questionController.search(req, res);
});
module.exports = router;
