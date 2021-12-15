const db = require("../db_config/config");

const User = require("./User");

const Habit = require("./Habit");

class Habit_Data {
	constructor(data) {
		this.data_id = data.habit_data_id;
		this.habit_id = data.habit_id;
		this.date = data.habit_date;
		this.amount = data.habit_amount;
		this.achieved = data.habit_achieved;
	}

	static create(habitDataData) {
		return new Promise(async (res, rej) => {
			try {
				const { habit_id, habit_date, habit_amount, habit_achieved } = habitDataData;
				let newHabitData = await db.query(
					"INSERT INTO habit_data (habit_id, habit_date, habit_amount, habit_achieve) VALUES ($1, $2, $3, $4) RETURNING *;",
					[habit_id, habit_date, habit_amount, habit_achieved]
				);
				let r = new Habit_Data(newHabitData.rows[0]);
				resolve(r);
			} catch (err) {
				rej("Error, failed to create new habit data");
			}
		});
	}

	static homepage(user_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query(
					"SELECT habits.*, habit_data.habit_data_id, habit_data.habit_date, habit_data.habit_amount, habit_data.habit_achieved from habits LEFT JOIN (SELECT habit_data.* FROM habit_data WHERE habit_data.habit_date = CURRENT_DATE) AS habit_data ON habits.habit_id = habit_data.habit_id WHERE habits.user_id = $1 ORDER BY habit_data.habit_date DESC;",
					[user_id]
				);
				// 'SELECT habits.*, habit_data.* FROM habits LEFT JOIN habit_data ON habits.habit_id = habit_data.habit_id WHERE habits.user_id = $1 ORDER BY habit_data.habit_date DESC;'
				res(results.rows);
			} catch (err) {
				rej(`Error retrieving homepage habit data: ${err}`);
			}
		});
	}

	// Read all data for one habit (history)
	static readHistoricalHabitData(habit_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query("SELECT * FROM habit_data where habit_id = $1;", [habit_id]);
				if (results.rows.length) {
					let habitEvents = results.rows.map(r => new Habit_Data(r));
					res(habitEvents);
				} else {
					throw "No historical data found for given habit";
				}
			} catch (err) {
				rej(`Error retrieving historical habit data: ${err}`);
			}
		});
	}

	// Read one habit data
	static readOneHabitData(habit_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query(
					"SELECT * from habit_data where habit_id = $1 AND habit_date = CURRENT_DATE;",
					[habit_id]
				);
				if (results.rows.length) {
					let event = new Habit_Data(results.rows[0]);
					res(event);
				} else {
					throw "No habit_data found for the given habit_id and date";
				}
			} catch (err) {
				rej(`Error retrieving one event data: ${err}`);
			}
		});
	}

	// Update habitData
	update(habit_amount) {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(
					`UPDATE habit_data SET habit_amount = $1 WHERE habit_data_id = $2 RETURNING *;`,
					[habit_amount, this.data_id]
				);
			} catch (err) {
				rej(`Error updating one event data: ${err}`);
			}
		});
	}

	// static get AllTodayHabits() {
	//     return new Promise(async (res, rej) => {
	//         try {
	//             let result = await db.query('SELECT habit_data.*, habits.goal AS goal,  ')

	//             // let result = await db.query(`SELECT * from habit_data;`);
	//             // let habits_data = result.rows.map(r => new Habit_Data(r))
	//             // res(habits_data)
	//         } catch (err) {
	//             rej(`Error retrieving habits data: ${err}`)
	//         }
	//     })
	// }

	static get everything() {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(`SELECT * from habit_data;`);
				let habits_data = result.rows.map(r => new Habit_Data(r));
				res(habits_data);
			} catch (err) {
				rej(`Error retrieving habits data: ${err}`);
			}
		});
	}

	// static checkIfExistsIfNotCreate(habit_id, habit_amount) {
	//     return new Promise (async (resolve, reject) => {
	//         try {
	//             let exists = Habit_Data.checkHabitCurrentInterval(habit_id)
	//             if (exists) {
	//                 const update = await db.query('UPDATE habit_data SET habit_amount = habit_amount + $1 WHERE habit_data_id = $2 RETURNING *;', [habit_amount, exists.habit_data_id])
	//                 let res = new Habit_Data(update.rows[0])
	//             } else {
	//                 let freq = await db.query('SELECT frequency FROM habits WHERE habit_id = $1', [habit_id])
	//                 const create = await db.query('INSERT INTO habit_data (habit_id, interval_start, interval_end, habit_amount) VALUES ($1, CURRENT_DATE, CURRENT_DATE + interval '1 day' * $2 , $3) RETURNING *;',[habit_id, freq, habit_amount])
	//                 let res = new Habit_Data(create.rows[0])
	//             }
	//             res.checkGoalReached
	//             resolve(res)
	//         } catch (err) {
	//             reject('Error in checking/creating in habit data table')
	//         }
	//     })
	// }

	// static checkHabitCurrentInterval(habit_id) {
	//     return new Promise (async (resolve, reject) => {
	//         try {
	//             let freq = await db.query('SELECT frequency FROM habits WHERE habit_id = $1', [habit_id])
	//             const entry = await db.query('SELECT * FROM habit_data WHERE habit_id = $1 AND interval_end < $2', [habit_id, freq])
	//             let res = new Habit_Data(entry.rows[0])
	//             resolve(res)
	//         } catch (err) {
	//             reject('Error in searching for current habit interval')
	//         }
	//     })
	// }

	// get checkGoalReached() {
	//     return new Promise (async (resolve, reject) => {
	//         try {
	//             const goal = await db.query('SELECT goal FROM habits WHERE habit_id = $1', [this.habit_id])
	//             if (this.amount >= goal) {
	//                 await db.query('UPDATE habit_data SET habit_achieved = true WHERE habit_data_id = $1', [this.data_id])
	//             }
	//         } catch (err) {
	//             reject('Error in updating goal reached for habit')
	//         }
	//     })
	// }

	// static createHabitData(habitData){
	//     return new Promise (async (resolve, reject) => {
	//         try {

	//             let freq = await db.query('SELECT frequency FROM habits WHERE habit_ID = $1', [this.habit_id])
	//             const { habit_amount, interval_start , interval_end} = habitData;
	//             let newHabitData = await db.query('INSERT INTO habit_data (interval_start, interval_end) VALUES (CURRENT_DATE, CURRENT_DATE + integer $1) ) ', [freq])
	//             let resp = new Habit_Data(newHabitData.rows[0])
	//             resolve(resp);
	//         } catch (err) {
	//             reject('Error in creating habit data')
	//         }
	//     })
	// }

	//     static increaseAmount(habit_data_id){
	//         return new Promise(async (resolve, reject) => {
	//             try {
	//                 let result = await
	//             }
	//         })
	//     }
}

module.exports = Habit_Data;
