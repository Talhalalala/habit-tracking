
const express = require('express');
const router = express.Router();

const { register, login, showUsers } = require('../controllers/user')

router.post('/register', register)
router.post('/login', login)
router.get('/', showUsers) //dev endpoint, used for testing purposes

module.exports = router