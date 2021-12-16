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
    goal INT, 
    units VARCHAR(50),
    streak INT NOT NULL,
    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

DROP TABLE IF EXISTS habit_data;

CREATE TABLE habit_data (
    habit_data_id serial PRIMARY KEY, 
    habit_id INT,
    habit_date DATE,
    habit_amount INT, 
    habit_achieved BOOLEAN DEFAULT false
);

INSERT INTO users (username, email, hpassword) 
Values
    ('example1', 'email1@email.com', 'lol'),
    ('example2', 'exampleemail2@email.com', 'lol');

INSERT INTO habits (user_id, habit, goal, units, streak)
Values
    (1, 'Walking', 10000, 'Steps', 3),
    (1, 'Reading', 20, 'Pages', 5),
    (1, 'Gym', 3, 'Workouts', 0),
    (2, 'Running', 5000, 'Metres', 1);

INSERT INTO habit_data (habit_id, habit_date, habit_amount, habit_achieved)
Values
    (1, '2021-12-14', 5000, false),
    (1, '2021-12-13', 7000, false),
    (1, '2021-12-12', 11000, true),
    (2, '2021-12-13', 10, false),
    (2, '2021-12-14', 20, true),
    (4, '2021-12-14', 5200, true),
    (4, '2021-12-13', 4500, false),
    (3, '2021-12-15', 1, false);


