const express = require('express');
const router = express.Router();

const { addNewDataEntry, displayAll, displayAllForOne, displayEverything } = require('../controllers/habitData')
const { verifyToken } = require('../middleware/auth')

// // post/update habits data
// router.post('/:id', verifyToken, addNewDataEntry)
// // display all habits data
// router.post('/', verifyToken, displayAll)
// // display all habits data for one habit
// router.post('/:id', verifyToken, displayAllForOne)

// display all habits data table entries
router.get('/', displayEverything) // dev end-point used to show everything in habits data table 

module.exports = router;