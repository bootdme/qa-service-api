const models = require('./models');

module.exports = {
  // Controller routes here
  getQuestions: (req, res) => {
    const { product_id } = req.query;
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    models.getQuestions(product_id, page, count)
      .then((questions) => {
        res.status(200).send(questions);
      })
      .catch((err) => {
        res.send(404).send(err);
      });
  },
  getAnswers: (req, res) => {
    const { question_id } = req.params;
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    models.getAnswers(question_id, page, count)
      .then((answers) => {
        res.status(200).send(answers);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
};
