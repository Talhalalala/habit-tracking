const { logout } = require("./auth");

async function getHabits(username) {
    try {
        const options = {
            headers: new Headers({"Authorization": localStorage.getItem("token")})
        };
        const response = await fetch("http://localhost:3000/URL", options); // get correct route to get names of all habits
        const data = await response.json();
        if (data.err) {
            console.warn(data.err);
            logout();
        }
        return data;
    } catch (err) {
        console.warn(err);
    }
}

async function getInfoAboutHabit(id) {
    try {
        const options = {
            headers: new Headers({"Authorization": localStorage.getItem("token")})
        };
        const response = await fetch("http://localhost:3000/URL", options); // get correct route to get details of the habit
        const data = await response.json();
        if (data.err) {
            console.warn(data.err);
            logout();
        }
    } catch (err) {
        console.warn(err);
    }
}

async function updateHabit(e) {
    try {
        e.preventDefault();
        const habitId = e.target.id;
        const value = e.target.value;
        const userEmail = localStorage.getItem("userEmail")
        const options = {
            method: "POST",
            headers: new Headers({"Authorization": localStorage.getItem("token"), "Content-Type": "application/json"}),
            body: JSON.stringify({email: userEmail, habit_ID: habitId, amount: value})
        }
        const response = await fetch("URL", options); //get route
        const data = await response.json();
        if (data.err) {
            console.warn(data.err)
        }
        return data;
    } catch (err) {
        console.warn(err)
    }
}

module.exports = { getHabits, updateHabit, getInfoAboutHabit };