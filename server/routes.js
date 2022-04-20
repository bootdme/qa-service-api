const express = require('express');
const router = express();
const { getQuestions } = require('./controllers');
const models = require('./models');

router.get('/questionInfo', getQuestions);

module.exports = router;
