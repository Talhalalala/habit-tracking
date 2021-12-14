const db = require('../db_config/config');

const User = require('./User');

const Habit = require('./Habit');


class Habit_Data{
    constructor(data){
        this.data_id = data.habit_data_id
        this.habit_id = data.habit_id
        this.start = data.interval_start
        this.end = data.interval_end
        this.amount = data.habit_amount
        this.achieved = data.habit_achieved
    }
    
    static get everything() {
        return new Promise(async (res, rej) => {
            try {
                let result = await db.query(`SELECT habit_data_id, habit_id, interval_start::date, interval_end::date, habit_amount, habit_achieved from habit_data;`);
                let habits_data = result.rows.map(r => new Habit_Data(r))
                res(habits_data)
            } catch (err) {
                rej(`Error retrieving habits data: ${err}`)
            }
        })
    }

    static checkIfExistsIfNotCreate(habit_id, habit_amount) {

    }

    static checkHabitCurrentInterval(habit_id) {
        return new Promise (async (resolve, reject) => {
            try {
                let freq = await db.query('SELECT frequency FROM habits WHERE habit_ID = $1', [habit_id])
                
                const entry = await db.query('SELECT * FROM habit_data WHERE ')



                
                const { habit_amount, interval_start , interval_end} = habitData;
                let newHabitData = await db.query('INSERT INTO habit_data (interval_start, interval_end) VALUES (CURRENT_DATE, CURRENT_DATE + integer $1) ) ', [freq])
                let resp = new Habit_Data(newHabitData.rows[0])
                resolve(resp);
            } catch (err) {
                reject('Error in creating habit data')
            }
        })
    }



    static createHabitData(habitData){
        return new Promise (async (resolve, reject) => {
            try {

                let freq = await db.query('SELECT frequency FROM habits WHERE habit_ID = $1', [this.habit_id])
                const { habit_amount, interval_start , interval_end} = habitData;
                let newHabitData = await db.query('INSERT INTO habit_data (interval_start, interval_end) VALUES (CURRENT_DATE, CURRENT_DATE + integer $1) ) ', [freq])
                let resp = new Habit_Data(newHabitData.rows[0])
                resolve(resp);
            } catch (err) {
                reject('Error in creating habit data')
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

module.exports = Habit_Data



