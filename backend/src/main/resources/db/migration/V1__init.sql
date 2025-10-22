CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) DEFAULT CAST(RANDOM_UUID() AS VARCHAR(36)) NOT NULL PRIMARY KEY,
    email CLOB NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password CLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS scrum (
    id VARCHAR(36) DEFAULT CAST(RANDOM_UUID() AS VARCHAR(36)) NOT NULL PRIMARY KEY,
    name CLOB NOT NULL,
    status CLOB,
    creator_id VARCHAR(36) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS scrum_member (
    scrum_id VARCHAR(36) REFERENCES scrum (id),
    user_email CLOB,
    start_date TIMESTAMP,
    finish_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sprint (
    id VARCHAR(36) DEFAULT CAST(RANDOM_UUID() AS VARCHAR(36)) NOT NULL PRIMARY KEY,
    scrum_id VARCHAR(36) REFERENCES scrum (id),
    name CLOB NOT NULL,
    goal CLOB,
    report CLOB,
    start_date TIMESTAMP,
    finish_date TIMESTAMP,
    status CLOB
);

CREATE TABLE IF NOT EXISTS task_tag (
    id VARCHAR(36) DEFAULT CAST(RANDOM_UUID() AS VARCHAR(36)) NOT NULL PRIMARY KEY,
    scrum_id VARCHAR(36) REFERENCES scrum (id),
    name CLOB NOT NULL,
    color CLOB
);

CREATE TABLE IF NOT EXISTS task (
    id VARCHAR(36) DEFAULT CAST(RANDOM_UUID() AS VARCHAR(36)) NOT NULL PRIMARY KEY,
    sprint_id VARCHAR(36) REFERENCES sprint (id),
    scrum_id VARCHAR(36) REFERENCES scrum (id),
    task_tag_id VARCHAR(36) REFERENCES task_tag (id),
    title CLOB NOT NULL,
    description CLOB,
    status CLOB,
    created_at TIMESTAMP,
    creator_id VARCHAR(36) REFERENCES users (id),
    executor_id VARCHAR(36) REFERENCES users (id)
);
