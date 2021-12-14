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
		console.log("showing", show);
		res.status(200).json(show);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function displayAHabit(req, res) {
	try {
		const show = await Habit.OneUserHabit(req.body.user_id, req.params.id);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function destroy(req, res) {
	try {
		const habit = await User.OneUserHabit(req.body.user_id, req.params.id);
		const res = await habit.destroy;
		res.status(204).end();
	} catch (err) {
		res.status(404).json({ err });
	}
}

module.exports = { create, displayAll, displayAHabit, destroy };
