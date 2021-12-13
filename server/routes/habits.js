const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit')


// create habits 
router.post('/', habitController.create);

// displays all users habits 
router.get('/', habitController)







module.exports = router;