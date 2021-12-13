DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_ID INT, 
    username VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    hpassword VARCHAR(25) NOT NULL
);

DROP TABLE IF EXISTS habits;

CREATE TABLE habits (
    habit_ID serial PRIMARY KEY, 
    user_ID INT FOREIGN KEY REFERENCES users(user_ID) ON DELETE CASCADE,
    habit VARCHAR(100),
    frequency INT, 
    goal INT, 
    units VARCHAR(50),
    streak INT DEFAULT 0,
    creation_date date DEFAULT CAST(GETDATE() AS Date)
);

DROP TABLE IF EXISTS habit_data;

CREATE TABLE habit_data (
    habit_data_id serial PRIMARY KEY, 
    habit_ID INT FOREIGN KEY REFERENCES habits(habit_ID) ON DELETE CASCADE,
    interval_start DATE,
    interval_end DATE,
    habit_amount INT, 
    habit_achieved BOOLEAN
);