const express = require('express');

const router = express();
const {
  getQuestions, getAnswers, addQuestion, addAnswer,
  markQHelpful, markQReported, markAHelpful, markAReported,
} = require('./controllers');

router.get('/qa/questions', getQuestions);
router.get('/qa/questions/:question_id/answers', getAnswers);

router.post('/qa/questions', addQuestion);
router.post('/qa/questions/:question_id/answers', addAnswer);

router.put('/qa/questions/:question_id/helpful', markQHelpful);
router.put('/qa/questions/:question_id/report', markQReported);
router.put('/qa/answers/:answer_id/helpful', markAHelpful);
router.put('/qa/answers/:answer_id/report', markAReported);

module.exports = router;
