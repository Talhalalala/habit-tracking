DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_ID serial PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    hpassword VARCHAR(25) NOT NULL
);

DROP TABLE IF EXISTS habits;

CREATE TABLE habits (
    habit_ID serial PRIMARY KEY, 
    user_ID int,
    habit VARCHAR(100),
    frequency INT, 
    goal INT, 
    units VARCHAR(50),
    streak INT, 
    long_streak INT
);

DROP TABLE IF EXISTS habit_data;

CREATE TABLE habit_data (
    habit_data_id serial PRIMARY KEY, 
    habit_ID INT,
    interval_start DATE,
    interval_end DATE,
    habit_amount INT, 
    habit_achieved bit,
);