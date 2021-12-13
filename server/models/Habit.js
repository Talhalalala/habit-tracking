const db = require('../db_config/config');

const User = require('./User');

class habit {
    constructor(data){
        this.username = data.username
        this.habit = data.habit 
        this.frequency = data.frequency
        this.goal = data.goal
        this.units = data.units
        this.streak = data.streak
        this.long_streak = data.long_streak
    }

    static allUserHabits(user_id){
        return new Promise(async (res, rej) => {
            try {
                let result = await db.query(`SELECT * from habits  where user_ID = 1$`,
                                            [user_id]);
                let habits = result.rows.map(r => new habit(r))
                res(habits)
            } catch (err) {
                rej(`Error retrieving habits: ${err}`)
            }
        })
    }

    

    static create(habitData){
        return new Promise (async (resolve, reject) => {
            try {
                const { habit, frequency, goal, units, user_ID} = habitData;
                let newHabit = await db.query('INSERT INTO habits (habit, frequency, goal, units, user_ID) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
                                            [ habit, frequency, goal, units, user_ID ]);
                resolve(newHabit.rows[0]);
            } catch (err) {
                reject('Habit could not be created');
            }
        })
    };

    

}

module.exports = habit;

