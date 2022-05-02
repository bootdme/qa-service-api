import http from 'k6/http';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const getQuestionsTrend = new Trend('Get Questions');
const getAnswersTrend = new Trend('Get Answers');

export const options = {
  InsecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    // { duration: '10s', target: 100 },
    // { duration: '10s', target: 100 },
    { duration: '10s', target: 100 },
    { duration: '20s', target: 250 },
    { duration: '20s', target: 500 },
    { duration: '25s', target: 750 },
    { duration: '10s', target: 1000 },
    { duration: '10s', target: 1000 },
    { duration: '10s', target: 300 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default () => {
  const questionAPI = `http://localhost:${PORT}/qa/questions`;
  const maxOne = 1000011;
  const randomIdOne = Math.floor(Math.random() * maxOne);

  const requests = {
    'Get Questions': {
      method: 'GET',
      url: `${questionAPI}?product_id=${randomIdOne}`,
    },
    'Get Answers': {
      method: 'GET',
      url: `${questionAPI}/${randomIdOne}/answers`,
    },
  };
  const responses = http.batch(requests);

  const getQuestionsResponse = responses['Get Questions'];
  const getAnswersResponse = responses['Get Answers'];

  getQuestionsTrend.add(getQuestionsResponse.timings.duration);
  getAnswersTrend.add(getAnswersResponse.timings.duration);

  sleep(1);
};
