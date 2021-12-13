const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());

const authRoutes = require('./routes/auth')
// const habitRoutes = require('./routes/habits')
// server.use('/books', authRoutes)
// server.use('/authors', habitRoutes)

server.get('/', (req, res) => res.send('Hello'))

module.exports = server;
