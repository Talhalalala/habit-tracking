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
