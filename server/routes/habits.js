const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit')


// create habits 
router.post('/', habitController.create);

// Delete habits
router.delete('/:id', habitController.destory);

// history of all habit data 
router.get('/history', habitController.history);

// homepage 
router.get('/homepage', habitController.display);

module.exports = router;