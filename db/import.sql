\c qa;
\copy question_info FROM './csv/questions.csv' WITH (FORMAT CSV, HEADER);
\copy answers FROM './csv/answers.csv' WITH (FORMAT CSV, HEADER);
\copy answer_photos FROM './csv/answers_photos.csv' WITH (FORMAT CSV, HEADER);