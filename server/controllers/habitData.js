const Habit = require("../models/Habit");
const User = require("../models/user");
const Habit_Data = require("../models/HabitData");

async function addNewDataEntry(req, res) {
	try {
		const habit = await Habit_Data.create(req.body);
		res.status(201).json(habit);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function displayAll(req, res) {
	try {
		const show = await Habit.allUserHabits(req.body.user_id);
		res.status(200).json(show);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function displayAllForOne(req, res) {
	try {
		const show = await Habit.OneUserHabit(req.body.user_id, req.params.id);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function displayEverything(req, res) {
	try {
		const habits = await Habit_Data.everything;
		res.status(200).json(habits);
	} catch (err) {
		res.status(404).json({ err });
	}
}

module.exports = { addNewDataEntry, displayAll, displayAllForOne, displayEverything };
