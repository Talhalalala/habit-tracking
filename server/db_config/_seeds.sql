INSERT INTO users (username, email, hpassword) 
Values
    ('example1', 'exampleemail1@email.com', 'examplepassword'),
    ('example2', 'exampleemail2@email.com', 'examplepassword');

INSERT INTO habits (user_id, habit, goal, units, streak)
Values
    (1, 'Walking', 10000, 'Steps', 3),
    (1, 'Reading', 20, 'Pages', 5),
    (2, 'Running', 5000, 'Metres', 1);

INSERT INTO habit_data (habit_id, habit_date, habit_amount, habit_achieved)
Values
    (1, '2021-12-14', 5000, false),
    (1, '2021-12-13', 7000, false),
    (1, '2021-12-12', 11000, true),
    (2, '2021-12-14', 21, true),
    (2, '2021-12-13', 20, true),
    (3, '2021-12-14', 5200, true),
    (3, '2021-12-13', 4500, false);


