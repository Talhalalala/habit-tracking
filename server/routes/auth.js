const express = require('express');
const router = express.Router();

const { register, login, showUsers, destroy } = require('../controllers/user');
const { verifyToken } = require('../middleware/auth');


router.post('/register', register)
router.post('/login', login)
router.delete('/:id', verifyToken, destroy)
router.get('/', showUsers) //dev endpoint, used for testing purposes

module.exports = router