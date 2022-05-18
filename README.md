<div align="center" width="100%">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" />
</div>

<p align="center"> A system design recreation of a existing API located at https://github.com/bootdme/ProjectAtelier </p>

## Repository Installation
1. Run `git clone` to clone the repository.
2. Run `npm install` to install dependencies.
3. Download [CSV Data](https://drive.google.com/drive/folders/1iINCGsL9PPc_t6A33TlO2HzBxHwNjG-I?usp=sharing) and extract `csv/` folder to root directory.
4. Import data to local database with `psql -U postgres -f db/schema.sql`
5. Run `npm run start` to start the Node server.
6. OPTIONAL: Run `npm run test` to execute test suites.

NOTE: Default env credentials are set in `db/index.js` as
```js
const poolConfig = {
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'qa',
};
```
To set up local PostgreSQL database with users preferred credentials, create a copy of `.example.env`, name it `.env`, and input credentials

## Service Routes
GET routes:
- `/qa/questions` retrieves a list of questions for a particular product.

Query Parameters

| Parameter  | Type    | Description                                               |
|------------|---------|-----------------------------------------------------------|
| product_id | integer | Specifies the product for which to retrieve questions.    |

Parameters

| Parameter  | Type    | Description                                               |
|------------|---------|-----------------------------------------------------------|
| page	     | integer | Selects the page of results to return. Default 1.         |
| count      | integer | Specifies how many results per page to return. Default 5. |

- `/qa/questions/:question_id/answers` returns answers for a given question.

Parameters
| Parameter   | Type    | Description                                               |
|-------------|---------|-----------------------------------------------------------|
| question_id | integer | Required ID of the question for wich answers are needed.  |

Query Parameters
| Parameter  | Type    | Description                                               |
|------------|---------|-----------------------------------------------------------|
| page	     | integer | Selects the page of results to return. Default 1.         |
| count      | integer | Specifies how many results per page to return. Default 5. |

POST routes:
- `/qa/questions` adds a question for the given product.

Body Parameters
| Parameter  | Type    | Description                                                 |
|------------|---------|-------------------------------------------------------------|
| body       | text    | Text of question being asked                                |
| name       | text    | Username for question asker                                 |
| email      | text    | Email address for question asker                            |
| product_id | integer | Required ID of the Product for which the question is posted |    
- `/qa/questions/:question_id/answers` adds an answer for the given question.

Parameters
| Parameter   | Type    | Description                                        |
|-------------|---------|----------------------------------------------------|
| question_id | integer | Required ID of the question to post the answer for |

Body Parameters
| Parameter  | Type    | Description                                                 |
|------------|---------|-------------------------------------------------------------|
| body       | text    | Text of question being asked                                |
| name       | text    | Username for question asker                                 |
| email      | text    | Email address for question asker                            |
| photos     | [text]  | An array of urls corresponding to images to display         | 

PUT routes:
- `/qa/questions/:question_id/helpful` updates a question to show it was found helpful.
- `/qa/questions/:question_id/report` updates a question to show it was reported.

Parameters
| Parameter   | Type    | Description                                        |
|-------------|---------|----------------------------------------------------|
| question_id | integer | Required ID of the question to update              | 

- `/qa/answers/:answer_id/helpful` updates an answer to show it was found helpful.
- `/qa/answers/:answer_id/report` updates an answer to show it has been reported.

Parameters
| Parameter   | Type    | Description                                        |
|-------------|---------|----------------------------------------------------|
| answer_id   | integer | Required ID of the answer to update                | 

## Dependencies
- [Node.js](https://nodejs.org/en) / [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) / [node-postgres](https://node-postgres.com/)
- [Jest](https://jestjs.io/) / [Supertest](https://www.npmjs.com/package/supertest)
- [k6](https://k6.io/stress-testing/) / [Loader.io](https://loader.io/)
- [AWS EC2](https://aws.amazon.com/ec2/)
- [NGINX](https://nginx.org/en/)
