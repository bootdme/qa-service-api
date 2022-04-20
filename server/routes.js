const express = require('express');

const router = express();
const {
  getQuestions, getAnswers, getUrls,
} = require('./controllers');

router.get('/questions', getQuestions);
router.get('/questions/:question_id/answers', getAnswers);
// router.get('/questions/:answer_id/urls', getUrls);

module.exports = router;
