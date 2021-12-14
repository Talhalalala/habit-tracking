const express = require('express');
const router = express.Router();

const { addNewDataEntry, displayAll, displayAll } = require('../controllers/habitData')
const { verifyToken } = require('../middleware/auth')

// post/update habits data
router.post('/:id', verifyToken, habitController.addNewDataEntry)
// display all habits data
router.post('/', verifyToken, habitController.displayAll)
// display all habits data
router.post('/:id', verifyToken, habitController.displayAll)


module.exports = router;