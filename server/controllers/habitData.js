const Habit = require("../models/Habit");
const User = require("../models/user");
const Habit_Data = require("../models/HabitData");

async function createAndOrUpdate(req, res) {
	let habit_id = req.body.habit_id;
	let amount = req.body.habit_amount;
	let habitDataObject = null;

	try {
		// Attempt to retrieve
		habitDataObject = await Habit_Data.readOneHabitData(habit_id, date);
	} catch (err) {
		// Does not exist, so create a new one
		const initialHabitData = {
			habit_id: habit_id,
			habit_date: getCurrentDate(),
			habit_amount: 0,
			habit_achieved: false
		};
		try {
			habitDataObject = await Habit_Data.create(initialHabitData);
		} catch (err) {
			res(501);
		}
	}

	let newAmount = habitDataObject.amount + amount;
	habitDataObject.update(newAmount);
	res(201);
}

// async function addNewDataEntry(req, res) {
//     try {
//         const habit = await Habit_Data.create(req.body);
//         res.status(201).json(habit)
//     } catch (err){
//         res.status(404).json({err})
//     }
// }

// async function displayAll(req, res) {
//     try {
//         const show = await habit.allUserHabits(req.body.user_id);
//         res.status(200).json(show)
//     } catch (err) {
//         res.status(404).json({err})
//     }
// }

// async function displayAllForOne(req, res) {
//     try {
//         const show = await hAbortSignal.OneUserHabit(req.body.user_id, req.params.id)
//     } catch(err) {
//         res.status(404).json({err})
//     }
// }

async function displayEverything(req, res) {
	try {
		const habits = await Habit_Data.everything;
		res.status(200).json(habits);
	} catch (err) {
		res.status(404).json({ err });
	}
}

// async function checkIfExistsIfNotCreate(req, res) {
//     try {
//         const habit_data = await Habit_Data.checkIfExistsIfNotCreate(req.body);
//         res.status(200).json(habit_data)
//     } catch (err) {
//         res.status(404).json({err})
//     }
// }

async function TodayHabit(req, res) {
	try {
		const habit_data = await Habit_Data.readOneHabitData(req.params.id);
		res.status(200).json(habit_data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function AllHabitHistory(req, res) {
	try {
		const habit_data = await Habit_Data.readHistoricalHabitData(req.params.id);
		res.status(200).json(habit_data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

function getCurrentDate() {
	let today = new Date().toISOString().slice(0, 10);
	return today;
}

async function AllTodayHabits(req, res) {
	try {
		const habit_data = await Habit_Data.AllTodayHabits;
		res.status(200).json(habit_data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function Homepage(req, res) {
	try {
		const results = await Habit_Data.homepage(req.params.id);
		res.status(200).json(results);
	} catch (err) {
		res.status(404).json({ err });
	}
}

module.exports = {
	createAndOrUpdate,
	displayEverything,
	TodayHabit,
	AllHabitHistory,
	AllTodayHabits,
	Homepage
};
