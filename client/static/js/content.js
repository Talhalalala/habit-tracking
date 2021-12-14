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
