const express = require('express');
const router = express.Router();

const { CheckIfExistsIfNotCreate, addNewDataEntry, displayAll, displayAllForOne, displayEverything } = require('../controllers/habitData')
const { verifyToken } = require('../middleware/auth')

const Habit_Data = require('../models/HabitData')

// // post/update habits data
// router.post('/:id', verifyToken, addNewDataEntry)
// // display all habits data
// router.post('/', verifyToken, displayAll)
// // display all habits data for one habit
// router.post('/:id', verifyToken, displayAllForOne)

// Create new entry or update existing one in current interval
router.post('/', verifyToken, checkIfExistsIfNotCreate)


// display all habits data table entries
router.get('/', displayEverything) // dev end-point used to show everything in habits data table 


router.post('/update', async (req, res) => {
    let habit_id = req.body.habit_id;
    let amount = req.body.habit_amount;
    let habitDataObject = null;

    try {
        // Attempt to retrieve
        habitDataObject = await readOneHabitData(habit_id, date);
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
            res(501);
        }
    }

    let newAmount = habitDataObject.amount + amount;
    habitDataObject.update(newAmount);
    res(201);
    
});

// Test everything


// DO LATER
function getCurrentDate(){
    return '10.10.2001'
}


module.exports = router;