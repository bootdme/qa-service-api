const models = require('./models');

module.exports = {
  // Controller routes here
  getQuestions: (req, res) => {
    models.getQuestions()
      .then((questions) => {
        res.status(200).send(questions);
      })
      .catch((err) => {
        res.send(404).send(err);
      });
  },
};
