const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());

const authRoutes = require('./routes/auth')
// const habitRoutes = require('./routes/habits')
server.use('/auth', authRoutes)
// server.use('/habit', habitRoutes)

server.get('/', (req, res) => res.send('Hello'))

module.exports = server;
