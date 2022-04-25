const express = require('express');

const router = express();
const {
  getQuestions, getAnswers, addQuestion, addAnswer,
  markQHelpful, markQReported, markAHelpful, markAReported,
} = require('./controllers');

router.get('/questions', getQuestions);
router.get('/questions/:question_id/answers', getAnswers);

router.post('/questions', addQuestion);
router.post('/questions/:question_id/answers', addAnswer);

router.put('/questions/:question_id/helpful', markQHelpful);
router.put('/questions/:question_id/report', markQReported);
router.put('/answers/:answer_id/helpful', markAHelpful);
router.put('/answers/:answer_id/report', markAReported);

module.exports = router;
