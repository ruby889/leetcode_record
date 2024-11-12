DROP TABLE IF EXISTS problem;

CREATE TABLE problem (
  id INTEGER PRIMARY KEY NOT NULL,
  created DATE NOT NULL DEFAULT CURRENT_DATE,
  last_edit TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  status_ TEXT,
  count INTEGER NOT NULL DEFAULT 0,
  hint TEXT,
  tags TEXT[] ,
  topics TEXT[],
  comments JSONB
);