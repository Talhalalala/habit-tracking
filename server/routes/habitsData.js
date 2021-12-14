const express = require('express');
const router = express.Router();

const { createAndOrUpdate, displayEverything, TodayHabit, AllHabitHistory, AllTodayHabits, Homepage } = require('../controllers/habitData')
const { verifyToken } = require('../middleware/auth')

const Habit_Data = require('../models/HabitData')

// // post/update habits data
// router.post('/:id', verifyToken, addNewDataEntry)
// // display all habits data
// router.post('/', verifyToken, displayAll)
// // display all habits data for one habit
// router.post('/:id', verifyToken, displayAllForOne)

// Create new entry or update existing one in current interval
// router.post('/', verifyToken, checkIfExistsIfNotCreate)


// display all habits data table entries
router.get('/', displayEverything) // dev end-point used to show everything in habits data table 

// updates existing entry or creates new one
router.post('/', verifyToken, createAndOrUpdate);

// returns all habits for today if they exist or blank otherwise
// router.get('/today', AllTodayHabits) //Ignore this route

// returns todays record of the habit if it exists
router.get('/:id', TodayHabit)

// returns all the history on a given habit
router.get('/all/:id', AllHabitHistory)

// returns everything needed for homepage
router.get('/homepage/:id', Homepage) // Use this new Route for the homepage to load everything at once





module.exports = router;