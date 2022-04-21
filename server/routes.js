const express = require('express');

const router = express();
const {
  getQuestions, getAnswers,
} = require('./controllers');

router.get('/questions', getQuestions);
router.get('/questions/:question_id/answers', getAnswers);

router.get('/loaderio-8a982ade49380929ffc538685d45096d.txt', (req, res) => {
  res.sendFile(`${__dirname}/loaderio.txt`);
});

module.exports = router;
