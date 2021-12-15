(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
async function requestLogin(e) {
	e.preventDefault();
	try {
		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
		};
		const r = await fetch(`http://localhost:3000/auth/login`, options);
		const data = await r.json();
		if (!data.success) {
			throw new Error("Login not authorised");
		}
		login(data.token);
	} catch (err) {
		console.warn(err);
	}
}

async function requestRegistration(e) {
	e.preventDefault();
	try {
		const password = document.querySelector("[name='password']").value;
		const passwordConfirm = document.querySelector("[name='passwordConfirmation']").value;
		if (password === passwordConfirm) {
			const options = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
			};
			const r = await fetch(`http://localhost:3000/auth/register`, options);
			const data = await r.json();
			if (data.err) {
				throw Error(data.err);
			}
			requestLogin(e);
		} else {
			const main = document.querySelector("main");
			const message = document.createElement("p");
			message.textContent = "Please make sure the password and password comfirmation match";
			main.appendChild(message);
		}
	} catch (err) {
		console.warn(err);
	}
}

function login(token) {
	const user = jwt_decode(token);
	localStorage.setItem("token", token);
	localStorage.setItem("username", user.username);
	localStorage.setItem("userEmail", user.email);
	localStorage.setItem("userId", user.userId);
	window.location.hash = "#today";
}

function logout() {
	localStorage.clear();
	window.location.hash = "#login";
}

function currentUser() {
	const username = localStorage.getItem("username");
	return username;
}

module.exports = { requestLogin, requestRegistration, login, logout, currentUser };

},{}],2:[function(require,module,exports){
const { requestLogin, requestRegistration, currentUser } = require("./auth");
const { getHabits, updateHabit, addHabit, removeHabit, getHistory } = require("./requests");

// generates the login form
function renderLoginForm() {
	const main = document.querySelector("main");
	const fields = [
		{ tag: "label", textContent: "Email:", attributes: { for: "email", class: "label" } },
		{ tag: "input", attributes: { type: "email", name: "email", class: "input" } },
		{ tag: "label", textContent: "Password:", attributes: { for: "password", class: "label" } },
		{ tag: "input", attributes: { type: "password", name: "password", class: "input" } },
		{ tag: "input", attributes: { type: "submit", value: "Login", class: "submit" } }
	];
	const form = document.createElement("form");
	form.id = "loginForm";
	form.setAttribute("class", "authForm");
	fields.forEach(f => {
		let field = document.createElement(f.tag);
		if (f.textContent) {
			field.textContent = f.textContent;
		}
		Object.entries(f.attributes).forEach(([a, v]) => {
			field.setAttribute(a, v);
			form.appendChild(field);
		});
	});
	form.addEventListener("submit", requestLogin);
	main.appendChild(form);
}

// generates the register form
function renderRegisterForm() {
	const main = document.querySelector("main");
	const fields = [
		{ tag: "label", textContent: "Username", attributes: { for: "username", class: "label" } },
		{ tag: "input", attributes: { type: "text", name: "username", class: "input" } },
		{ tag: "label", textContent: "Email", attributes: { for: "email", class: "label" } },
		{ tag: "input", attributes: { type: "email", name: "email", class: "input" } },
		{ tag: "label", textContent: "Password", attributes: { for: "password", class: "label" } },
		{ tag: "input", attributes: { type: "password", name: "password", class: "input" } },
		{
			tag: "label",
			textContent: "Confirm Password",
			attributes: { for: "passwordConfirmation", class: "label" }
		},
		{
			tag: "input",
			attributes: { type: "password", name: "passwordConfirmation", class: "input" }
		},
		{ tag: "input", attributes: { type: "submit", value: "Create Account", class: "submit" } }
	];
	const form = document.createElement("form");
	form.id = "registerForm";
	form.setAttribute("class", "authForm");
	fields.forEach(f => {
		let field = document.createElement(f.tag);
		if (f.textContent) {
			field.textContent = f.textContent;
		}
		Object.entries(f.attributes).forEach(([a, v]) => {
			field.setAttribute(a, v);
			form.appendChild(field);
		});
	});
	form.addEventListener("submit", requestRegistration);
	main.appendChild(form);
}

// shows all the habits a user is tracking and displays a message if they are tracking none
async function renderToday() {
	const main = document.querySelector("main");
	let userId = localStorage.getItem("userId");
	let data = await getHabits(userId);
	const feed = document.createElement("section");
	feed.id = "feed";
	main.appendChild(feed);
	if (data.err) {
		return;
	}
	if (data.length === 0) {
		const noHabits = document.createElement("h3");
		noHabits.setAttribute("class", "no-habits");
		noHabits.textContent = "You aren't tracking any habits yet! Click 'New' to start tracking";
		feed.appendChild(noHabits);
	} else {
		data.forEach(renderHabits);
	}
}

function renderHabits(habitData) {
	const feed = document.querySelector("#feed");
	const post = document.createElement("div");
	post.className = "post";
	post.setAttribute("name", `${habitData.habit_id}`);
	const habit = document.createElement("h3");
	const goal = document.createElement("p");
	const streak = document.createElement("p");
	goal.setAttribute("class", "goal-button");
	streak.setAttribute("class", "streak-button");
	habit.textContent = `${habitData.habit[0].toUpperCase()}${habitData.habit.substring(1)}`;
	habit.setAttribute("class", "habit-class");
	goal.textContent = `Goal: ${habitData.goal} ${habitData.units} every day`;
	if (habitData.streak) {
		streak.textContent = `You are on a ${habitData.streak} day streak! Keep it up!`;
	} else {
		streak.textContent = "You haven't achieved this goal recently!";
	}

	const moreinfobutton = createMoreInfoButton(habitData);

	post.appendChild(habit);
	post.appendChild(goal);
	post.appendChild(streak);
	post.appendChild(moreinfobutton);
	feed.appendChild(post);
}

function createMoreInfoButton(habitData) {
	const moreinfobutton = document.createElement("button");
	moreinfobutton.addEventListener("click", e => {
		e.preventDefault();
		e.target.remove();
		makeHabitInformationForm(habitData);
	});
	moreinfobutton.setAttribute("class", `${habitData.habit_id}`);
	moreinfobutton.textContent = "More Info";
	return moreinfobutton;
}

function showlessInfoAboutHabit(e, habitData) {
	e.preventDefault();
	const habitId = habitData.habit_id;
	const postDiv = document.querySelector(`div[name='${habitId}']`);
	const form = document.querySelector(`form[name='${habitId}']`);
	const infoPara = document.querySelector(`div[name='${habitId}'] > .habit-details`); //" > finds a child class"
	const deleteButton = document.querySelector(`div[name='${habitId}'] > .delete-habit`);
	if (form) {
		form.remove(); //removes form
	}
	deleteButton.remove();
	infoPara.remove();
	const moreInfo = createMoreInfoButton(habitData);
	postDiv.appendChild(moreInfo);
	e.target.remove(); //removes button
}

function makeHabitInformationForm(habitData) {
	const postDiv = document.querySelector(`div[name='${habitData.habit_id}']`);
	if (habitData.habit_achieved) {
		const success = document.createElement("p");
		success.setAttribute("class", "habit-details");
		success.textContent = "Amazing! You've hit your goal!";
		postDiv.appendChild(success);
	} else {
		const habitInfo = document.createElement("p");
		habitInfo.setAttribute("class", "habit-details");
		let habitAmount = habitData.habit_amount ? habitData.habit_amount : 0;
		habitInfo.textContent = `You are currently at ${habitAmount} ${habitData.units} today.`;
		postDiv.appendChild(habitInfo);

		const fields = [
			{
				tag: "label",
				textContent: `Add ${habitData.units.toLowerCase()}`,

				attributes: { for: "amount" }
			},
			{ tag: "input", attributes: { type: "text", name: "habit_amount" } },
			{ tag: "input", attributes: { type: "submit", value: "Log Data" } }
		];
		const form = document.createElement("form");
		form.setAttribute("class", `addlitre`);
		form.setAttribute("name", `${habitData.habit_id}`);
		fields.forEach(f => {
			let field = document.createElement(f.tag);
			if (f.textContent) {
				field.textContent = f.textContent;
			}
			Object.entries(f.attributes).forEach(([a, v]) => {
				field.setAttribute(a, v);
				form.appendChild(field);
			});
		});
		form.addEventListener("submit", async e => {
			try {
				e.preventDefault();
				window.location.reload();
				await updateHabit(e, habitData);
			} catch (err) {
				console.warn(err);
			}
		});
		postDiv.appendChild(form);
	}

	// habit history button
	const historyButton = createHabitHistoryButton(habitData);
	postDiv.append(historyButton);

	// delete habit button
	const deleteButton = document.createElement("button");
	deleteButton.setAttribute("class", "delete-habit");
	deleteButton.addEventListener("click", async e => {
		try {
			e.preventDefault();
			await removeHabit(habitData.habit_id);
			window.location.reload();
		} catch (err) {
			console.warn(err);
		}
	});
	deleteButton.textContent = "Delete habit";
	postDiv.appendChild(deleteButton);

	//show less button
	const showlessinfobutton = document.createElement("button");
	showlessinfobutton.addEventListener("click", e => {
		e.preventDefault();
		showlessInfoAboutHabit(e, habitData);
	});
	showlessinfobutton.setAttribute("class", `show-button`);
	showlessinfobutton.textContent = "Less Info";

	postDiv.appendChild(showlessinfobutton);
}

function createHabitHistoryButton(habitData) {
	const historyButton = document.createElement("button");
	historyButton.setAttribute("class", "habit-history");
	historyButton.addEventListener("click", async e => {
		try {
			e.preventDefault();
			e.target.remove();
			await showHistory(habitData);
		} catch (err) {
			console.warn(err);
		}
	});
	historyButton.textContent = "Show habit history";
	return historyButton;
}

async function showHistory(habitData) {
	const postDiv = document.querySelector(`div[name='${habitData.habit_id}']`);
	const deleteButton = document.querySelector(`div[name='${habitData.habit_id}'] > .delete-habit`);
	const history = await getHistory(habitData.habit_id);
	const div = document.createElement("div");
	div.setAttribute("class", "history-div");
	history.forEach(data => {
		const histEl = createHistoryElement(data, habitData);
		div.appendChild(histEl);
	});
	const hideHistoryButton = document.createElement("button");
	hideHistoryButton.textContent = "Hide habit history";
	hideHistoryButton.addEventListener("click", e => {
		e.preventDefault();
		div.remove();
		const historyButton = createHabitHistoryButton(habitData);
		postDiv.insertBefore(historyButton, deleteButton);
	});
	div.appendChild(hideHistoryButton);
	postDiv.insertBefore(div, deleteButton);
}

function createHistoryElement(data, habitData) {
	const habitDiv = document.createElement("div");
	habitDiv.classList.add(`achieved-${data.achieved}`); // class will be 'achieved-false' or 'achieved-true'
	const datePara = document.createElement("p");
	datePara.textContent = `${data.date.split("T")[0]}:`;
	const amountPara = document.createElement("p");
	amountPara.textContent = `${data.amount} ${habitData.units.toLowerCase()}`;
	habitDiv.appendChild(datePara);
	habitDiv.appendChild(amountPara);
	return habitDiv;
}

function renderNewHabit() {
	const main = document.querySelector("main");
	const fields = [
		{ tag: "label", textContent: "Habit to track:", attributes: { for: "habit", class: "label" } },
		{ tag: "input", attributes: { type: "text", name: "habit", class: "input" } },
		{
			tag: "label",
			textContent: "Daily goal:",
			attributes: { for: "goal", class: "label" }
		},
		{ tag: "input", attributes: { type: "text", name: "goal", class: "input" } },
		{
			tag: "label",
			textContent: "The goal is measured in:",
			attributes: { for: "units", class: "label" }
		},
		{ tag: "input", attributes: { type: "text", name: "units", class: "input" } },
		{ tag: "input", attributes: { type: "submit", value: "Add habit", class: "submit" } }
	];

	const form = document.createElement("form");
	form.id = "newHabitForm";
	form.setAttribute("class", "authForm");
	fields.forEach(f => {
		let field = document.createElement(f.tag);
		if (f.textContent) {
			field.textContent = f.textContent;
		}
		Object.entries(f.attributes).forEach(([a, v]) => {
			field.setAttribute(a, v); //attribute-value
			form.appendChild(field);
		});
	});
	form.addEventListener("submit", async e => {
		try {
			e.preventDefault();
			await addHabit(e);
			window.location.hash = "#habits";
		} catch (err) {
			console.warn(err);
		}
	});
	main.appendChild(form);
}

module.exports = {
	renderLoginForm,
	renderRegisterForm,
	renderHabits,
	renderToday,
	renderNewHabit,
	makeHabitInformationForm
};

},{"./auth":1,"./requests":4}],3:[function(require,module,exports){
const { logout, currentUser } = require("./auth");
const { renderLoginForm, renderRegisterForm, renderToday, renderNewHabit } = require("./content");

const nav = document.querySelector("nav");
const main = document.querySelector("main");

const publicRoutes = ["#login", "#register"];
const privateRoutes = ["#habits", "#new"];

window.addEventListener("hashchange", updateContent); //allows for multiple url pages to open (see updatemain function)

function updateNav() {
	nav.innerHTML = "";
	let links;
	let logoutBtn;
	if (currentUser()) {
		links = privateRoutes.map(createNavLink);
		logoutBtn = document.createElement("a");
		logoutBtn.setAttribute("class", "navLink");
		logoutBtn.textContent = "Logout";
		logoutBtn.onclick = logout;
		nav.appendChild(logoutBtn);
	} else {
		links = publicRoutes.map(createNavLink);
	}
	links.forEach(l => nav.insertBefore(l, logoutBtn));
}

function updateMain(path) {
	main.innerHTML = "";
	if (path) {
		switch (path) {
			case "#login":
				renderLoginForm();
				break;
			case "#register":
				renderRegisterForm();
				break;
			case "#habits":
				renderToday();
				break;
			case "#new":
				renderNewHabit();
				break;
			default:
				render404();
				break;
		}
	} else {
		window.location.hash = "#login";
	}
}

function createNavLink(route) {
	const link = document.createElement("a");
	link.setAttribute("class", "navLink");
	link.textContent = `${route[1].toUpperCase()}${route.substring(2)}`;
	link.href = route;
	return link;
}

function updateContent() {
	const path = window.location.hash;
	if (privateRoutes.includes(path) && !currentUser()) {
		window.location.hash = "#login";
	} else if (!privateRoutes.includes(path) && currentUser()) {
		window.location.hash = "#habits";
	} else {
		updateNav();
		updateMain(path);
	}
}

updateContent();

module.exports = { updateNav, updateMain, createNavLink, updateContent };

},{"./auth":1,"./content":2}],4:[function(require,module,exports){
const { logout } = require("./auth");

async function getHabits(id) {
	try {
		const options = {
			headers: new Headers({
				Authorization: localStorage.getItem("token")
			})
		};
		const response = await fetch(`http://localhost:3000/habitdata/homepage/${id}`, options); // get correct route to get names of all habits
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

async function updateHabit(e, habitData) {
	try {
		const bodyObject = Object.fromEntries(new FormData(e.target));
		bodyObject["habit_id"] = habitData.habit_id;
		// const userId = localStorage.getItem("userId");
		const options = {
			method: "POST",
			headers: new Headers({
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify(bodyObject)
		};
		const response = await fetch("http://localhost:3000/habitdata/", options); //get route for updating the habit
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
		const bodyObject = Object.fromEntries(new FormData(e.target));
		bodyObject["user_id"] = localStorage.getItem("userId");
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
		if (data.err) {
			console.warn(data.err);
		}
		return data;
	} catch (err) {
		console.warn(err);
	}
}

async function removeHabit(id) {
	try {
		const options = {
			method: "DELETE",
			headers: new Headers({
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json"
			})
		};
		await fetch(`http://localhost:3000/habit/${id}`, options);
	} catch (err) {
		console.warn(err);
	}
}

async function getHistory(id) {
	try {
		const options = {
			headers: new Headers({
				Authorization: localStorage.getItem("token")
			})
		};
		const response = await fetch(`http://localhost:3000/habitdata/all/${id}`, options); // get correct route to get names of all habits
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

module.exports = { getHabits, updateHabit, addHabit, removeHabit, getHistory };

},{"./auth":1}]},{},[1,2,3,4]);
