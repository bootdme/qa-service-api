const pool = require('../db/index');

pool.on('error', (err) => {
  console.error(`Failed to connect to database\nError: ${err}`);
  process.exit(-1);
});

module.exports = {
  getQuestions: async (product_id, size) => {
    const psql = `
    SELECT q.id           AS question_id,
          q.body         AS question_body,
          q.date_written AS question_date,
          q.asker_name,
          q.helpful      AS question_helpfulness,
          q.reported,
          (
                  SELECT Array_to_json(COALESCE(Array_agg(c), array[]::record[]))
                  FROM   (
                                SELECT a.id,
                                      a.body,
                                      a.date_written AS date,
                                      a.answerer_name,
                                      a.helpful AS helpfulness,
                                      (
                                              SELECT Array_to_json(COALESCE(Array_agg(d), array[]::record[]))
                                              FROM   (
                                                                SELECT     ap.id,
                                                                          ap.url
                                                                FROM       answer_photos ap
                                                                INNER JOIN answers a
                                                                ON         ( ap.answer_id = a.id )
                                                                WHERE      a.question_id = q.id ) d ) AS photos
                                FROM   answers a
                        WHERE  a.question_id = q.id ) c ) AS answers
    FROM   question_info q
    WHERE  product_id = $1 LIMIT $2`;
    const results = await pool.query(psql, [product_id, size]);
    return results.rows;
  },
  getAnswers: async (question_id, size) => {
    const psql = `
    SELECT a.id             AS answer_id,
           a.body,
           a.date_written  AS date,
           a.answerer_name,
           a.helpful        AS helpfulness,
           (
                  SELECT Array_to_json(COALESCE(Array_agg(d), array[]::record[]))
                  FROM   (
                                SELECT ap.id,
                                       ap.url
                                FROM   answer_photos ap
                                WHERE  ap.answer_id = a.id ) d ) AS photos
    FROM   answers a
    WHERE  a.question_id = $1 LIMIT $2`;
    const results = await pool.query(psql, [question_id, size]);
    return results.rows;
  },
  // TODO: Figure out date conversion instead of converting when running schema
  addQuestion: async (body, name, email, product_id) => {
    const date = new Date();
    const psql = `
    WITH addQuestion AS (
      INSERT INTO question_info (product_id, body, date_written, asker_name, asker_email, reported, helpful)
      VALUES ($1, $2, $3, $4, $5, false, 0)
      RETURNING *
    )
    SELECT nextval('question_info_id_seq');`;
    const results = await pool.query(psql, [product_id, body, date.toISOString(), name, email]);
  },
  addAnswer: async (body, name, email, photos, question_id) => {
    const date = new Date();
    const psql = `
      WITH addAnswer AS (
        INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
        VALUES ($1, $2, $3, $4, $5, false, 0)
        RETURNING question_id
      )
      SELECT nextval('answers_id_seq');`;
      const addA = await pool.query(psql, [question_id, body, date.toISOString(), name, email]);
      console.log(addA);
  },
};

// const psql =
//          `INSERT INTO answers
//          (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
//           VALUES ($1, $2, $3, $4, $5, false, 0) returning answer_id`;
//         var answerInsertReponse = await client.query(psql, [question_id, body, Date.now(), name, email]);
//          var answerId = answerInsertReponse.rows[0]['answer_id'];
//          //insert photos
//          var photoInsertions = photos.map((url, index) => {
//            return [answerId, url];
//          })
//          let photoQuery = format("INSERT INTO answer_photos (answer_id, url) VALUES %L", photoInsertions);
//         var insertPhotoPromise = await client.query(photoQuery);