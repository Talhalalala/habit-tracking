const habit = require('../models/Habit');

async function create (req, res) {
    try {
        const habit = await Habit.create(req.body);
        res.status(201).json(habit)
    } catch (err){
        res.status(404).json({err})
    }
};

async function destory (req, res) {
    try {
        const habit = await Habit.findById(req.params.id);
        const resp = await habit.destroy();
        res.status(204).end();
    } catch (err) {
        res.status(404).json({err})
    }
};

async function history (req, res) {
    try {
        const user = await Habit.findById(req.params.id);
        const resp = await habit.history();
        res.status(200).end();
    } catch (err) {
        res.status(404).json({err})
    }
};

async function show (req, res) {
    try {
        const display = await habit.findById(req.params.id);
        res.status(200).json(display)
    } catch (err) {
        res.status(404).json({err})
    }
};


module.exports = { create, destroy }