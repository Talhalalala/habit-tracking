const Habit = require('../models/Habit');

async function create (req, res) {
    try {
        const habit = await Habit.create(req.body);
        res.status(201).json(habit)
    } catch (err){
        res.status(404).json({err})
    }
};



async function display (req, res) {
    try {
        const show = await habit.allUserHabits(req.params.id);
        res.status(200).json(show)
    } catch (err) {
        res.status(404).json({err})
    }
};


module.exports = { create, display }