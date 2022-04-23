\c qa;

SELECT setval('question_info_id_seq', (SELECT MAX(id) + 1 FROM question_info));
SELECT setval('answers_id_seq', (SELECT MAX(id) + 1 FROM answers));
SELECT setval('answer_photos_id_seq', (SELECT MAX(id) + 1 FROM answer_photos));