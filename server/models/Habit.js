const db = require("../db_config/config");

const User = require("./User");

class Habit {
	constructor(data) {
		this.habit_id = data.habit_id;
		this.id = data.user_id;
		this.habit = data.habit;
		this.frequency = data.frequency;
		this.goal = data.goal;
		this.units = data.units;
		this.streak = data.streak;
	}

	// function to display all users active habits
	static allUserHabits(user_id) {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(`SELECT * from habits where user_ID = $1;`, [user_id]);
				let habits = result.rows.map(r => new Habit(r));
				res(habits);
			} catch (err) {
				rej(`Error retrieving habits: ${err}`);
			}
		});
	}

	static OneUserHabit(user_id, habit_id) {
		return new Promise(async (resolve, reject) => {
			try {
				let result = await db.query("SELECT * from habits where habit_ID = $1 AND user_ID = $2;", [
					habit_id,
					user_id
				]);
				let habit = result.rows.map(r => new Habit(r));
				resolve(habit);
			} catch (err) {
				reject(`Error retrieving the habit: ${err}`);
			}
		});
	}

	// function to allow users to add new habits
	// remind frontend to send user_ID
	// looks good
	static create(habitData) {
		return new Promise(async (resolve, reject) => {
			try {
				const { habit, frequency, goal, units, user_id } = habitData;
				let newHabit = await db.query(
					"INSERT INTO habits (habit, frequency, goal, units, user_ID) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
					[habit, frequency, goal, units, user_id]
				);
				let r = new Habit(newHabit.rows[0]);
				resolve(r);
			} catch (err) {
				reject("Habit could not be created");
			}
		});
	}

	static get everything() {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(`SELECT * from habits;`);
				let habits = result.rows.map(r => new Habit(r));
				res(habits);
			} catch (err) {
				rej(`Error retrieving habits: ${err}`);
			}
		});
	}

	get destroy() {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await db.query("DELETE FROM habits WHERE habit_id = $1 RETURNING user_ID", [
					this.habit_id
				]);
				resolve(`Habit ${result.habit} was deleted`);
			} catch (err) {
				reject("Habit could not be deleted");
			}
		});
	}
}

module.exports = Habit;
