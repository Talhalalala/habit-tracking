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
const { getHabits, getInfoAboutHabit, updateHabit, addHabit } = require("./requests");

const main = document.querySelector("main");

function renderLoginForm() {
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

function renderRegisterForm() {
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

async function renderToday() {
	let userId = localStorage.getItem("userId");
	let data = await getHabits(userId);
	const feed = document.createElement("section");
	feed.id = "feed";
	main.appendChild(feed);
	console.log(data);
	if (data.err) {
		return;
	}
	data.forEach(renderHabits);
}

function renderHabits(habitData) {
	const feed = document.querySelector("#feed");
	const post = document.createElement("div");
	post.className = "post";
	post.setAttribute("name", `${habitData.habit_id}`);
	const habit = document.createElement("h3");
	const goal = document.createElement("p");
	habit.textContent = habitData.habit;
	if (habitData.frequency === 1) {
		goal.textContent = `Goal: ${habitData.goal} ${habitData.units} every day`;
	} else {
		goal.textContent = `Goal: ${habitData.goal} ${habitData.units} every ${habitData.frequency} days`;
	}

	const moreinfobutton = createMoreInfoButton(habitData.habit_id);

	post.appendChild(habit);
	post.appendChild(goal);
	post.appendChild(moreinfobutton);
	feed.appendChild(post);
}

function createMoreInfoButton(id) {
	const moreinfobutton = document.createElement("button");
	moreinfobutton.addEventListener("click", moreInfoAboutHabit);
	moreinfobutton.setAttribute("class", `${id}`);
	moreinfobutton.textContent = "More Info";
	return moreinfobutton;
}

async function moreInfoAboutHabit(e) {
	e.preventDefault();
	const habitId = e.target.classList[0];
	const userId = localStorage.getItem("userId");
	const habitData = await getInfoAboutHabit(habitId, userId);
	console.log("habit data", habitData);
	e.target.remove();
	makeHabitInformationForm(habitData[0]);
}

function showlessInfoAboutHabit(e) {
	e.preventDefault();
	const habitId = e.target.classList[0];
	const postDiv = document.querySelector(`div[name='${habitId}']`);
	const form = document.querySelector(`form[class='${habitId}']`);
	form.remove(); //removes form
	const moreInfo = createMoreInfoButton(habitId);
	postDiv.appendChild(moreInfo);
	e.target.remove(); //removes button
}

function makeHabitInformationForm(habitData) {
	const postDiv = document.querySelector(`div[name='${habitData.habit_id}']`);
	const fields = [
		{
			tag: "label",
			textContent: `Amount (${habitData.frequency})`,
			attributes: { for: "amount" }
		},
		{ tag: "input", attributes: { type: "text", name: "amount" } },
		{ tag: "input", attributes: { type: "submit", value: "Log Data" } }
	];
	const form = document.createElement("form");
	form.setAttribute("class", `${habitData.habit_id}`);
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
	form.addEventListener("submit", updateHabit);
	postDiv.appendChild(form);

	//show less button
	const showlessinfobutton = document.createElement("button");
	showlessinfobutton.addEventListener("click", showlessInfoAboutHabit);
	showlessinfobutton.setAttribute("class", `${habitData.habit_id}`);
	showlessinfobutton.textContent = "Less Info";

	postDiv.appendChild(showlessinfobutton);
}

function renderNewHabit() {
	const fields = [
		{ tag: "label", textContent: "Habit to track:", attributes: { for: "habit", class: "label" } },
		{ tag: "input", attributes: { type: "text", name: "habit", class: "input" } },
		{
			tag: "label",
			textContent: "Complete every _ days:",
			attributes: { for: "frequency", class: "label" }
		},
		{ tag: "input", attributes: { type: "text", name: "frequency", class: "input" } },
		{
			tag: "label",
			textContent: "Complete _ times every cycle:",
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
	form.addEventListener("submit", addHabit);
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
const privateRoutes = ["#today", "#new"];

window.addEventListener("hashchange", updateContent);

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
			case "#today":
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
		window.location.hash = "#today";
	} else {
		updateNav();
		updateMain(path);
	}
}

updateContent();

},{"./auth":1,"./content":2}],4:[function(require,module,exports){
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

},{"./auth":1}]},{},[1,2,3,4]);
