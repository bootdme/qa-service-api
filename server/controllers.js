const models = require('./models');

module.exports = {
  // Controller routes here
  getQuestions: (req, res) => {
    const { product_id } = req.query;
    const page = req.query.page || 1;
    const count = req.query.count || 5;

    const returnObject = {
      product_id,
      results: [],
    };

    models.getQuestions(product_id, page, count)
      .then((questions) => {
        returnObject.results = questions;
        res.status(200).send(returnObject);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
  getAnswers: (req, res) => {
    const { question_id } = req.params;
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;

    const returnObject = {
      question: question_id,
      page,
      count,
      results: [],
    };

    models.getAnswers(question_id, page, count)
      .then((answers) => {
        returnObject.results = answers;
        res.status(200).send(returnObject);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  },
};
