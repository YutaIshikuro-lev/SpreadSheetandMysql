DROP DATABASE IF EXISTS test_db;
CREATE DATABASE test_db;

USE test_db;

DROP TABLE IF EXISTS test;

CREATE TABLE test (
  dates varchar(30) UNIQUE,
  -- dates varchar(30) NOT NULL PRIMARY KEY,
  temp varchar(30) NOT NULL
);

INSERT INTO test (dates, temp) VALUES ("6/1", '21');
INSERT INTO test (dates, temp) VALUES ("6/2", '22');
INSERT INTO test (dates, temp) VALUES ("6/3", '23');
INSERT INTO test (dates, temp) VALUES ("6/4", '24');
INSERT INTO test (dates, temp) VALUES ("6/5", '25');
INSERT INTO test (dates, temp) VALUES ("6/6", '26');
INSERT INTO test (dates, temp) VALUES ("6/7", '27');
INSERT INTO test (dates, temp) VALUES ("6/8", '28');
INSERT INTO test (dates, temp) VALUES ("6/9", '29');
INSERT INTO test (dates, temp) VALUES ("6/10", '30');