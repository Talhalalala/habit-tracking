const db = require('../db_config/config');

const User = require('./User');

const Habit = require('./Habit');


class Habit_Data{
    constructor(data){
        this.habit_id = data.habit_ID
        this.data_id = data.habit_data_id
        this.start = data.interval_start
        this.end = data.interval_end
        this.amount = data.habit_amount
        this.achieved = data.habit_achieved
    }

    static createHabitData(habitData){
        return new Promise (async (resolve, reject) => {
            try {
                let freq = await db.query('SELECT frequency FROM habits WHERE habit_ID = $1', [this.habit_id])
                const { interval_start , interval_end} = habitData;
                let newHabitData = await db.query('INSERT INTO habit_data (interval_start, interval_end) VALUES (CURRENT_DATE, CURRENT_DATE + integer $1) ) ', [freq])
            } catch {
                
            }
        })
    }
    
//     static increaseAmount(habit_data_id){
//         return new Promise(async (resolve, reject) => {
//             try {
//                 let result = await 
//             }
//         })
//     }

}



