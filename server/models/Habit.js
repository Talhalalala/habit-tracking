const db = require('../db_config/config');
const SQL = require('sql-template-strings');

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
}

module.exports = habit

