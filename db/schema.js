const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question_id: { type: Number, unique: true, required: true },
  product_id: { type: Number, required: true },
  question_body: { type: String, required: true },
  question_date: { type: Date, required: true },
  asker_name: { type: String, required: true },
  question_helpfulness: { type: Number, required: true, default: 0 },
  reported: { type: Boolean, required: true },
  answers: [
    {
      answer_id: { type: Number, unique: true, required: true },
      body: { type: String, required: true },
      date: { type: Date, required: true },
      answerer_name: { type: String, required: true },
      helpfulness: { type: Number, required: true, default: 0 },
      photos: [String],
    },
  ],
});

const QA = mongoose.model('QA', questionSchema);
export default QA;
