const express = require('express');
const router = express.Router();

const { create, displayAll, displayAHabit, destroy } = require('../controllers/habit')
const { verifyToken } = require('../middleware/auth')

// create habits 
router.post('/create', verifyToken, habitController.create);
// displays all users habits 
router.post('/', verifyToken, habitController.displayAll)
// display singluar habit
router.post('/:id', verifyToken, habitController.displayAHabit)
// delete singular habit
router.delete('/:id', verifyToken, habitController.destroy)






module.exports = router;