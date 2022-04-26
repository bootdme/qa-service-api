import http from 'k6/http';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';

const putQuestionHelpfulTrend = new Trend('Update Question Helpful');
const putQuestionReportedTrend = new Trend('Update Question Reported');
const putAnswerHelpfulTrend = new Trend('Update Answer Helpful');
const putAnswerReportedTrend = new Trend('Update Answer Reported');

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
  const questionAPI = 'http://localhost:8008/qa/questions';
  const answerAPI = 'http://localhost:8008/qa/answers';
  const maxTwo = 3523507;
  const maxThree = 6879325;
  const randomIdTwo = Math.floor(Math.random() * maxTwo);
  const randomIdThree = Math.floor(Math.random() * maxThree);

  const requests = {
    'Update Question Helpful': {
      method: 'PUT',
      url: `${questionAPI}/${randomIdTwo}/helpful`,
    },
    'Update Question Reported': {
      method: 'PUT',
      url: `${questionAPI}/${randomIdTwo}/report`,
    },
    'Update Answer Helpful': {
      method: 'PUT',
      url: `${answerAPI}/${randomIdThree}/helpful`,
    },
    'Update Answer Reported': {
      method: 'PUT',
      url: `${answerAPI}/${randomIdThree}/report`,
    },
  };
  const responses = http.batch(requests);

  const updateQHelpfulResponse = responses['Update Question Helpful'];
  const updateQReportedResponse = responses['Update Question Reported'];
  const updateAHelpfulResponse = responses['Update Answer Helpful'];
  const updateAReportedResponse = responses['Update Answer Reported'];

  putQuestionHelpfulTrend.add(updateQHelpfulResponse.timings.duration);
  putQuestionReportedTrend.add(updateQReportedResponse.timings.duration);
  putAnswerHelpfulTrend.add(updateAHelpfulResponse.timings.duration);
  putAnswerReportedTrend.add(updateAReportedResponse.timings.duration);

  sleep(1);
};