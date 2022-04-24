const express = require('express');

const router = express();
const {
  getQuestions, getAnswers, addQuestion, addAnswer,
} = require('./controllers');

router.get('/questions', getQuestions);
router.get('/questions/:question_id/answers', getAnswers);

router.post('/questions', addQuestion);
router.post('/questions/:question_id/answers', addAnswer);

module.exports = router;
