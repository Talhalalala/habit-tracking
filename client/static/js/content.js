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
		{ tag: "label", textContent: "Email", attributes: { for: "email" } },
		{ tag: "input", attributes: { type: "email", name: "email" } },
		{ tag: "label", textContent: "Password", attributes: { for: "password" } },
		{ tag: "input", attributes: { type: "password", name: "password" } },
		{ tag: "input", attributes: { type: "submit", value: "Login" } }
	];
	const form = document.createElement("form");
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
		{ tag: "label", textContent: "Username", attributes: { for: "username" } },
		{ tag: "input", attributes: { type: "text", name: "username" } },
		{ tag: "label", textContent: "Email", attributes: { for: "email" } },
		{ tag: "input", attributes: { type: "email", name: "email" } },
		{ tag: "label", textContent: "Password", attributes: { for: "password" } },
		{ tag: "input", attributes: { type: "password", name: "password" } },
		{ tag: "label", textContent: "Confirm Password", attributes: { for: "passwordConfirmation" } },
		{ tag: "input", attributes: { type: "password", name: "passwordConfirmation" } },
		{ tag: "input", attributes: { type: "submit", value: "Create Account" } }
	];
	const form = document.createElement("form");
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
		{ tag: "label", textContent: "Habit Name", attributes: { for: "habit" } },
		{ tag: "input", attributes: { type: "text", name: "habit" } },
		{ tag: "label", textContent: "Frequency", attributes: { for: "frequency" } },
		{ tag: "input", attributes: { type: "text", name: "frequency" } },
		{ tag: "label", textContent: "Goal", attributes: { for: "goal" } },
		{ tag: "input", attributes: { type: "text", name: "goal" } },
		{ tag: "label", textContent: "Units", attributes: { for: "unit" } },
		{ tag: "input", attributes: { type: "text", name: "unit" } },
		{ tag: "input", attributes: { type: "submit", value: "Login" } }
	];

	const form = document.createElement("form");
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
