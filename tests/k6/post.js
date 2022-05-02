import http from 'k6/http';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const postQuestionTrend = new Trend('Add Question');
const postAnswerTrend = new Trend('Add Answer');

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
  const maxTwo = 3523507;
  const randomIdOne = Math.floor(Math.random() * maxOne);
  const randomIdTwo = Math.floor(Math.random() * maxTwo);

  const requests = {
    'Add Question': {
      method: 'POST',
      url: questionAPI,
      body: {
        body: 'This is k6 body text',
        name: 'This is k6 name text',
        email: 'This is k6 email text',
        product_id: randomIdOne,
      },
    },
    'Add Answer': {
      method: 'POST',
      url: `${questionAPI}/${randomIdTwo}/answers`,
      body: {
        body: 'This is k6 body text',
        name: 'This is k6 name text',
        email: 'This is k6 email text',
        photos: ['random photo 1', 'random photo 2', 'random photo 3'],
      },
    },
  };
  const responses = http.batch(requests);

  const addQuestionResponse = responses['Add Question'];
  const addAnswerResponse = responses['Add Answer'];

  postQuestionTrend.add(addQuestionResponse.timings.duration);
  postAnswerTrend.add(addAnswerResponse.timings.duration);

  sleep(1);
};
