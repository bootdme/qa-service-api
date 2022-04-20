const express = require('express');
const router = express();
const { getQuestions, getAnswers } = require('./controllers');
const models = require('./models');

router.get('/questions', getQuestions);
router.get('/questions/:question_id/answers', getAnswers);

module.exports = router;
