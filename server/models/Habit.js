const db = require('../db_config/config');
const SQL = require('sql-template-strings');

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

    static get all (){
        return new Promise(async (res, rej) => {
            try {
                let result = await db.run(SQL`SELECT habits.*, users.username as username
                                                    FROM habits
                                                    JOIN users ON habits.user_id = users.id;`);
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
                const { habit, frequency, goal, units, username} = habitData;
                // let user = await User.find(??);
                let newHabit = await db.query('INSERT INTO habits (habit, frequency, goal, units) VALUES ($1, $2, $3, $4) RETURNING *;'
                                            [ habit, frequency, goal, units ]);
                resolve (result.rows[0]);
            } catch (err) {
                reject ('Habit could not be created');
            }
        })
    };

    destroy(){
        return new Promise(async(resolve, reject) => {
            try {
                const newHabit = await db.query('DELETE FROM habits WHERE id = $1 RETURNING habit_ID', [this.id]);
                const user = await User.findById(result.rows[0].user_ID);
                const habits = await user.habits; 
                if(!habits.length){await user.destroy()}
                resolve('Habit was deleted')
            } catch (err) {
                reject('Habit could not be deleted')  
            }      
        })
    }

    static get history() {
        return new Promise(async(resolve, reject) => {
            try {
                let result = await db.query(SQL `SELECT habit_data.* users.username as username
                                                    FROM habit_data
                                                    JOIN users ON habit_data.user_id = users.id;`);
                let habits = result.rows.map(r => new habit(r))
                res(habits)
            } catch (err) {
                reject(`Error retrieving habits: ${err}`)
            }
        })
    
    }

    static update(new) {
        return new Promise(async(resolve, reject) => {
            try
        })
    }
}



module.exports = habit;

