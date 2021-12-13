(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
async function requestLogin(e) {
	e.preventDefault();
	try {
		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
		};
		const r = await fetch(`http://localhost:3000/auth/login`, options); //Change route depending on server side guys
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
	localStorage.setItem("userId", user.user_ID);
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

// function renderHomepage(){
//     const title = document.createElement('h2')
//     title.textContent = "Get yourself and your habits on track"
//     main.appendChild(title)
// }

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
	let data = await getHabits(currentUser());
	const feed = document.createElement("section");
	feed.id = "feed";
	if (data.err) {
		return;
	}

	data.forEach(renderHabits);
	main.appendChild(feed);
}

const renderHabits = habitData => {
	const post = document.createElement("div");
	post.className = "post";
	const habit = document.createElement("h3");
	const frequency = document.createElement("p");
	habit.textContent = habitData.habitName;
	frequency.textContent = `Every ${habitData.frequency} days`;
	const fields = [
		{ tag: "label", textContent: `Amount (${habitData.frequency})`, attributes: { for: "amount" } },
		{ tag: "input", attributes: { type: "text", name: "amount" } },
		{ tag: "input", attributes: { type: "submit", value: "Log Data" } }
	];
	const form = document.createElement("form");
	form.id = habitData.habit_ID;
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
	main.appendChild(form);
	post.appendChild(user);
	post.appendChild(body);
	feed.appendChild(post);
};

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
			attributes: { for: "unit", class: "label" }
		},
		{ tag: "input", attributes: { type: "text", name: "unit", class: "input" } },
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

module.exports = { renderLoginForm, renderRegisterForm, renderHabits, renderToday, renderNewHabit };

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
		logoutBtn = document.createElement("button");
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

async function getHabits(username) {
	try {
		const options = {
			headers: new Headers({ Authorization: localStorage.getItem("token") })
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
			headers: new Headers({ Authorization: localStorage.getItem("token") })
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
		const userId = localStorage.getItem("userId");
		const options = {
			method: "POST",
			headers: new Headers({
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify({ user_ID: userId, habit_ID: habitId, amount: value })
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
		const options = {
			method: "POST",
			headers: new Headers({
				Authorization: localStorage.getItem("token"),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
		};
		const r = await fetch(`url..`, options);
		const data = await r.json();
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
