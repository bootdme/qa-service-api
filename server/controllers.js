const models = require('./models');

module.exports = {
  // Controller routes here
  getQuestions: async (req, res) => {
    try {
      const product_id = req.query.product_id || '';
      const page = req.query.page || 1;
      const count = req.query.count || 5;
      const size = page * count;
      const result = await models.getQuestions(product_id, size);
      res.send(result[0]);
    } catch (err) {
      res.status(404).send('Error: invalid product id provided');
    }
  },
  getAnswers: async (req, res) => {
    try {
      const { question_id } = req.params;
      const page = Number(req.query.page) || 1;
      const count = Number(req.query.count) || 5;
      const size = page * count;
      const result = await models.getAnswers(question_id, size);
      res.send({ question: question_id, page: page, count: count, results: result[0].results });
    } catch (err) {
      res.status(404).send('Error: invalid question id provided');
    }
  },
  addQuestion: async (req, res) => {
    try {
      const {
        body, name, email, product_id,
      } = req.body;
      const result = await models.addQuestion(body, name, email, product_id);
      res.status(201).send('Created');
    } catch (err) {
      res.status(422).send('Error: Question body contains invalid entries');
    }
  },
  addAnswer: async (req, res) => {
    try {
      const {
        body, name, email, photos,
      } = req.body;
      const { question_id } = req.params;
      const result = await models.addAnswer(body, name, email, photos, question_id);
      res.status(201).send('Created');
    } catch (err) {
      res.status(404).send('Error');
    }
  },
  markQHelpful: async (req, res) => {
    try {
      const { question_id } = req.params;
      const result = await models.markQHelpful(question_id);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send('Error: invalid question id provided');
    }
  },
  markQReported: async (req, res) => {
    try {
      const { question_id } = req.params;
      const result = await models.markQReported(question_id);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send('Error: invalid question id provided');
    }
  },
  markAHelpful: async (req, res) => {
    try {
      const { answer_id } = req.params;
      const result = await models.markAHelpful(answer_id);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send('Error: invalid answer id provided');
    }
  },
  markAReported: async (req, res) => {
    try {
      const { answer_id } = req.params;
      const result = await models.markAReported(answer_id);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send('Error: invalid answer id provided');
    }
  },
};
