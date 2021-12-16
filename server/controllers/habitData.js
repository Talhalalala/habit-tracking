const Habit = require("../models/Habit");
const User = require("../models/user");
<<<<<<< HEAD
const Habit_Data = require('../models/HabitData')

async function createAndOrUpdate (req, res) {
    let habit_id = req.body.habit_id;
    let amount = req.body.habit_amount;
    let habitDataObject = null;

    try {
        // Attempt to retrieve
        habitDataObject = await Habit_Data.readOneHabitData(habit_id);
    } catch (err){
        // Does not exist, so create a new one
        const initialHabitData = {
            habit_id: habit_id,
            habit_date: getCurrentDate(),
            habit_amount: 0,
            habit_achieved: false
        };
        try{
            habitDataObject = await Habit_Data.create(initialHabitData);
        } catch (err){
            res.status(501);
        }
    }

    let newAmount = habitDataObject.amount + amount;
    habitDataObject.update(newAmount);
    try{
        await Habit_Data.checkGoalAchieved(habit_id)
    } catch(err){
        res(501)
    }
    res(201);
=======
const Habit_Data = require("../models/HabitData");

async function createAndOrUpdate(req, res) {
	try {
		let requestAmount = req.body.habit_amount;
		let requestHabitId = req.body.habit_id;
		let exists = await Habit_Data.readOneHabitData(requestHabitId);
		if (exists.length !== 0) {
			let update = await Habit_Data.update(requestAmount, exists.data_id);
		} else {
			let create = await Habit_Data.create(requestHabitId, requestAmount);
		}
		Habit_Data.checkGoalAchieved(requestHabitId);
		res.status(201).json(create);
	} catch (err) {
		res.status(501);
	}
>>>>>>> 0049af3834f79febab8bccd0150d1d9002dd212e
}

async function displayEverything(req, res) {
	try {
		const habits = await Habit_Data.everything;
		res.status(200).json(habits);
	} catch (err) {
		res.status(404).json({ err });
	}
}

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

async function Homepage(req, res) {
	try {
		let results = await Habit_Data.homepage(req.params.id);
		const streakSet = results.forEach(async habit => await Habit_Data.checkStreak(habit.habit_id));
		results = await Habit_Data.homepage(req.params.id);
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
	Homepage
};
