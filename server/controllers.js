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
      res.json({ product_id, results: result });
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
      res.json({
        question: question_id, page, count, results: result,
      });
    } catch (err) {
      res.status(404).send('Error: invalid question id provided');
    }
  },
};
