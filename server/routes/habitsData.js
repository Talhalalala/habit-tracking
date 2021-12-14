const express = require('express');
const router = express.Router();

const { addNewDataEntry, displayAll, displayAllForOne } = require('../controllers/habitData')
const { verifyToken } = require('../middleware/auth')

// post/update habits data
router.post('/:id', verifyToken, habitController.addNewDataEntry)
// display all habits data
router.post('/', verifyToken, habitController.displayAll)
// display all habits data for one habit
router.post('/:id', verifyToken, habitController.displayAllForOne)


module.exports = router;