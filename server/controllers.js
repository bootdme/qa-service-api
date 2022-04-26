const models = require('./models');

module.exports = {
  // Controller routes here
  getQuestions: async (req, res) => {
    try {
      const productId = req.query.product_id || '';
      const page = req.query.page || 1;
      const count = req.query.count || 5;
      const size = page * count;
      const result = await models.getQuestions(productId, size);
      res.send({ product_id: productId, results: result.rows[0].results || [] });
    } catch (err) {
      console.log(err);
      res.status(404).send('Error: invalid product id provided');
    }
  },
  getAnswers: async (req, res) => {
    try {
      const questionId = req.params.question_id;
      const page = Number(req.query.page) || 1;
      const count = Number(req.query.count) || 5;
      const size = page * count;
      const result = await models.getAnswers(questionId, size);
      res.send({
        question: questionId, page, count, results: result.rows[0].results,
      });
    } catch (err) {
      res.status(404).send('Error: invalid question id provided');
    }
  },
  addQuestion: async (req, res) => {
    try {
      const { body, name, email } = req.body;
      const productId = req.body.product_id;
      res.status(201).send('Created');
      await models.addQuestion(body, name, email, productId);
    } catch (err) {
      res.status(422).send('Error: Question body contains invalid entries');
    }
  },
  addAnswer: async (req, res) => {
    try {
      const {
        body, name, email, photos,
      } = req.body;
      const questionId = req.params.question_id;
      await models.addAnswer(body, name, email, photos, questionId);
      res.status(201).send('Created');
    } catch (err) {
      res.status(404).send('Error');
    }
  },
  markQHelpful: async (req, res) => {
    try {
      const questionId = req.params.question_id;
      await models.markQHelpful(questionId);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send('Error: invalid question id provided');
    }
  },
  markQReported: async (req, res) => {
    try {
      const questionId = req.params.question_id;
      await models.markQReported(questionId);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send('Error: invalid question id provided');
    }
  },
  markAHelpful: async (req, res) => {
    try {
      const answerId = req.params.answer_id;
      await models.markAHelpful(answerId);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send('Error: invalid answer id provided');
    }
  },
  markAReported: async (req, res) => {
    try {
      const answerId = req.params.answer_id;
      await models.markAReported(answerId);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send('Error: invalid answer id provided');
    }
  },
};
