DROP TABLE IF EXISTS users;

CREATE TABLE users (
<<<<<<< HEAD
    user_ID INT PRIMARY KEY, 
=======
    user_ID serial PRIMARY KEY, 
>>>>>>> 0ce1aaab26cdeb07120247e859d12a2dc85981e4
    username VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    hpassword VARCHAR NOT NULL
);

DROP TABLE IF EXISTS habits;

CREATE TABLE habits (
    habit_ID serial PRIMARY KEY, 
<<<<<<< HEAD
    user_ID INT, 
=======
    user_ID INT,
>>>>>>> 0ce1aaab26cdeb07120247e859d12a2dc85981e4
    habit VARCHAR(100),
    frequency INT, 
    goal INT, 
    units VARCHAR(50),
<<<<<<< HEAD
    streak INT DEFAULT 0
=======
    streak INT
    FOREIGN KEY(user_ID)
        REFERENCES user(user_ID)
        ON DELETE SET NULL
>>>>>>> 0ce1aaab26cdeb07120247e859d12a2dc85981e4
);

DROP TABLE IF EXISTS habit_data;

CREATE TABLE habit_data (
    habit_data_id serial PRIMARY KEY, 
<<<<<<< HEAD
    habit_ID INT, 
=======
    habit_ID INT,
>>>>>>> 0ce1aaab26cdeb07120247e859d12a2dc85981e4
    interval_start DATE,
    interval_end DATE,
    habit_amount INT, 
    habit_achieved BOOLEAN
);