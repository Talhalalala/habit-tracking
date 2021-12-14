DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id serial PRIMARY KEY, 
    username VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    hpassword VARCHAR NOT NULL
);

DROP TABLE IF EXISTS habits;

CREATE TABLE habits (
    habit_id serial PRIMARY KEY, 
    user_id INT,
    habit VARCHAR(100),
    frequency INT, 
    goal INT, 
    units VARCHAR(50),
    streak INT,
    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

DROP TABLE IF EXISTS habit_data;

CREATE TABLE habit_data (
    habit_data_id serial PRIMARY KEY, 
    habit_id INT,
    interval_start DATE,
    interval_end DATE,
    habit_amount INT, 
    habit_achieved BOOLEAN
);