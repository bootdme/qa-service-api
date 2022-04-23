const express = require('express');

const router = express();
const {
  getQuestions, getAnswers, addQuestion
} = require('./controllers');

router.get('/questions', getQuestions);
router.get('/questions/:question_id/answers', getAnswers);

router.post('/questions', addQuestion);

module.exports = router;
