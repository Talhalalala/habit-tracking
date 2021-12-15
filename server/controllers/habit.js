const Habit = require("../models/Habit");

async function create(req, res) {
	try {
		const habit = await Habit.create(req.body);
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

async function displayAHabit(req, res) {
	try {
		const show = await Habit.OneUserHabit(req.params.id);
		res.status(200).json(show);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function destroy(req, res) {
	try {
		console.log("destroying");
		const habit = await Habit.OneUserHabit(req.params.id);
		console.log("habit", habit, habit.destroy);
		const resp = await habit.destroy();
		console.log("response", resp);
		console.log("destroyed");
		res.status(204).end();
	} catch (err) {
		console.log("error");
		res.status(404).json({ err });
	}
}

// async function destroy(req, res) {
// 	try {
// 		const book = await Book.findById(parseInt(req.params.id));
// 		const resp = book.destroy();
// 		res.status(204).end();
// 	} catch (err) {
// 		res.status(404).json({ err });
// 	}
// }

// dev function used to show every entry in habits
async function displayEverything(req, res) {
	try {
		const habits = await Habit.everything;
		res.status(200).json(habits);
	} catch (err) {
		res.status(404).json({ err });
	}
}

module.exports = { create, displayAll, displayAHabit, destroy, displayEverything };
