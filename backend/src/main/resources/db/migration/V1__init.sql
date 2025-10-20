CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    email TEXT NOT NULL,
    user_name TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
)

CREATE TABLE IF NOT EXISTS scrum (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    status TEXT
    creator_id TEXT REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS scrum_member (
    scrum_id TEXT REFERENCES scrum (id),
    user_email TEXT,
    start_date TIMESTAMP,
    finish_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sprint (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    scrum_id TEXT REFERENCES scrum (id),
    name TEXT NOT NULL,
    goal TEXT,
    report TEXT,
    start_date TIMESTAMP,
    finish_date TIMESTAMP,
    status TEXT
);

CREATE TABLE IF NOT EXISTS task_tag (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    scrum_id TEXT REFERENCES scrum (id),
    name TEXT NOT NULL,
    color TEXT
);

CREATE TABLE IF NOT EXISTS task (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    sprint_id TEXT REFERENCES sprint (id),
    scrum_id TEXT REFERENCES scrum (id),
    task_tag_id TEXT REFERENCES task_tag (id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    created_at TIMESTAMP,
    creator_id TEXT REFERENCES users (id),
    executor_id TEXT REFERENCES users (id)
);

