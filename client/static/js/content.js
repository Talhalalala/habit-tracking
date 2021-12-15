const { requestLogin, requestRegistration, currentUser } = require("./auth");
const { getHabits, updateHabit, addHabit, removeHabit } = require("./requests");

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
	if (form) {
		form.remove(); //removes form
	}
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
				textContent: `Add ${habitData.units}`,

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
				await updateHabit(e, habitData);
				window.location.reload();
			} catch (err) {
				console.warn(err);
			}
		});
		postDiv.appendChild(form);
	}

	// delete habit button
	const deleteButton = document.createElement("button");
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
