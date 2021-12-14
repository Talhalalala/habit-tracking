const { logout } = require("./auth");

async function getHabits(id) {
	try {
		const options = {
			method: "POST",
			headers: new Headers({
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify({ user_id: id })
		};
		const response = await fetch("http://localhost:3000/habit", options); // get correct route to get names of all habits
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

async function getInfoAboutHabit(habitId, userId) {
	try {
		const options = {
			method: "POST",
			headers: new Headers({
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify({ user_id: userId })
		};
		const response = await fetch(`http://localhost:3000/habit/${habitId}`, options); // get correct route to get details of the habit
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

async function updateHabit(e) {
	try {
		e.preventDefault();
		const habitId = e.target.id;
		const value = e.target.value;
		const userId = localStorage.getItem("userId");
		const options = {
			method: "POST",
			headers: new Headers({
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify({ user_id: userId, habit_id: habitId, amount: value })
		};
		const response = await fetch("URL", options); //get route for updating the habit
		const data = await response.json();
		if (data.err) {
			console.warn(data.err);
		}
		return data;
	} catch (err) {
		console.warn(err);
	}
}

async function addHabit(e) {
	try {
		e.preventDefault();
		console.log("adding habit");
		const bodyObject = Object.fromEntries(new FormData(e.target));
		bodyObject["user_id"] = localStorage.getItem("userId");
		console.log("body", bodyObject);
		const options = {
			method: "POST",
			headers: new Headers({
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify(bodyObject)
		};
		const r = await fetch(`http://localhost:3000/habit/create`, options);
		const data = await r.json();
		console.log("data", data);
		if (data.err) {
			console.warn(data.err);
		}
		return data;
	} catch (err) {
		console.warn(err);
	}
}

module.exports = { getHabits, updateHabit, getInfoAboutHabit, addHabit };
