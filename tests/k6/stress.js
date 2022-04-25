import http from 'k6/http';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';

const getQuestionsTrend = new Trend('Get Questions');
const getAnswersTrend = new Trend('Get Answers');

const postQuestionTrend = new Trend('Add Question');
const postAnswerTrend = new Trend('Add Answer');

const putQuestionHelpfulTrend = new Trend('Update Question Helpful');
const putQuestionReportedTrend = new Trend('Update Question Reported');
const putAnswerHelpfulTrend = new Trend('Update Answer Helpful');
const putAnswerReportedTrend = new Trend('Update Answer Reported');

export const options = {
  InsecureSkipTLSVerify: true,
  noConnectionReuse: false,
  // scenarios: {
  //   constant_request_rate: {
  //     executor: 'constant-arrival-rate',
  //     rate: 1,
  //     timeUnit: '1s',
  //     duration: '1m',
  //     preAllocatedVUs: 20,
  //     maxVUs: 100,
  //   },
  // },
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 },
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default () => {
  const questionAPI = 'http://localhost:8008/qa/questions';
  const answerAPI = 'http://localhost:8008/qa/answers';
  const maxOne = 1000011;
  const maxTwo = 3523507;
  const maxThree = 6879325;
  const randomIdOne = Math.floor(Math.random() * maxOne);
  const randomIdTwo = Math.floor(Math.random() * maxTwo);
  const randomIdThree = Math.floor(Math.random() * maxThree);

  const requests = {
    'Get Questions': {
      method: 'GET',
      url: `${questionAPI}?product_id=${randomIdOne}`,
    },
    'Get Answers': {
      method: 'GET',
      url: `${questionAPI}/${randomIdOne}/answers`,
    },
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

  const getQuestionsResponse = responses['Get Questions'];
  const getAnswersResponse = responses['Get Answers'];

  const addQuestionResponse = responses['Add Question'];
  const addAnswerResponse = responses['Add Answer'];

  const updateQHelpfulResponse = responses['Update Question Helpful'];
  const updateQReportedResponse = responses['Update Question Reported'];
  const updateAHelpfulResponse = responses['Update Answer Helpful'];
  const updateAReportedResponse = responses['Update Answer Reported'];

  getQuestionsTrend.add(getQuestionsResponse.timings.duration);
  getAnswersTrend.add(getAnswersResponse.timings.duration);

  postQuestionTrend.add(addQuestionResponse.timings.duration);
  postAnswerTrend.add(addAnswerResponse.timings.duration);

  putQuestionHelpfulTrend.add(updateQHelpfulResponse.timings.duration);
  putQuestionReportedTrend.add(updateQReportedResponse.timings.duration);
  putAnswerHelpfulTrend.add(updateAHelpfulResponse.timings.duration);
  putAnswerReportedTrend.add(updateAReportedResponse.timings.duration);

  sleep(1);
};
