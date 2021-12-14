INSERT INTO users (username, email, hpassword) 
Values
    ('example', 'exampleemail@email.com', 'examplepassword');

INSERT INTO habits (user_ID, habit, frequency, goal, units, streak)
Values
    (1, 'Steps', 1, 10000, 'Day', 3);

INSERT INTO habit_data (habit_ID, interval_start, interval_end, habit_amount, habit_achieved)
Values
    (1, '2021-12-12', '2021-12-13', 5000, false);


