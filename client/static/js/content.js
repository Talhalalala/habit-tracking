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

// displays the basic information about a habit the user is tracking - the name, goal, and if they have a streak
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
	goal.textContent = `Goal: ${habitData.goal} ${habitData.units.toLowerCase()} every day`;
	if (habitData.streak) {
		streak.textContent = `You are on a ${habitData.streak} day streak! Keep it up!`;
	} else {
		streak.textContent = "You haven't achieved this goal recently!";
	}

	const moreinfobutton = createMoreInfoButton(habitData, post);

	post.appendChild(habit);
	post.appendChild(goal);
	post.appendChild(streak);
	post.appendChild(moreinfobutton);
	feed.appendChild(post);
}

// creates a button that will display more information about the habit
function createMoreInfoButton(habitData, post) {
	const moreinfobutton = document.createElement("button");
	moreinfobutton.addEventListener("click", e => {
		e.preventDefault();
		e.target.remove();
		const form = makeHabitInformationDiv(habitData);
		post.appendChild(form);
		const showLessInfoButton = createLessInfoButton(habitData);
		post.appendChild(showLessInfoButton);
	});
	moreinfobutton.setAttribute("class", `${habitData.habit_id} show-button more`);
	moreinfobutton.textContent = "More Info";
	return moreinfobutton;
}

// creates the button to stop displaying the extra info about the habit
function createLessInfoButton(habitData) {
	const showLessInfoButton = document.createElement("button");
	showLessInfoButton.addEventListener("click", e => {
		e.preventDefault();
		showlessInfoAboutHabit(e, habitData);
	});
	showLessInfoButton.setAttribute("class", `show-button less`);
	showLessInfoButton.textContent = "Less Info";
	return showLessInfoButton;
}

// removes the div containing the update info form, habit history button and delete habit button
function showlessInfoAboutHabit(e, habitData) {
	e.preventDefault();
	const postDiv = document.querySelector(`div[name='${habitData.habit_id}']`);
	const habitId = habitData.habit_id;
	const habitInfoDiv = document.querySelector(`div[name='${habitId}'] .habit-info`);
	habitInfoDiv.remove();
	const moreInfo = createMoreInfoButton(habitData, postDiv);
	postDiv.appendChild(moreInfo);
	e.target.remove(); //removes button
}

// creates a div containing more information about the habit
function makeHabitInformationDiv(habitData) {
	const habitInfoDiv = document.createElement("div");
	habitInfoDiv.classList.add("habit-info");

	// if the user has met the goal for the day, just display a success message
	if (habitData.habit_achieved) {
		const success = document.createElement("p");
		success.setAttribute("class", "habit-details");
		success.textContent = "Amazing! You've hit your goal today!";
		habitInfoDiv.appendChild(success);
	} else {
		// else creates a form for a user to add any progress towards the habit
		const habitInfo = document.createElement("p");
		habitInfo.setAttribute("class", "habit-details");
		let habitAmount = habitData.habit_amount ? habitData.habit_amount : 0;
		habitInfo.textContent = `You are currently at ${habitAmount} ${habitData.units.toLowerCase()} today.`;
		habitInfoDiv.appendChild(habitInfo);

		const fields = [
			{
				tag: "label",
				textContent: `Add ${habitData.units.toLowerCase()}`,

				attributes: { for: "amount", class: "add-units-label" }
			},
			{ tag: "input", attributes: { type: "text", name: "habit_amount", class: "habit-amount" } },
			{ tag: "input", attributes: { type: "submit", value: "Log Data", class: "log-data" } }
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
				await updateHabit(e, habitData); //fetch request to update the habit progress in the database
			} catch (err) {
				console.warn(err);
			}
		});
		habitInfoDiv.appendChild(form);
	}

	const buttonsDiv = document.createElement("div");
	buttonsDiv.classList.add("habit-info-buttons");

	// create habit history button
	const historyButton = createHabitHistoryButton(habitData);
	buttonsDiv.append(historyButton);

	// create delete habit button
	const deleteButton = createDeleteHabitButton(habitData);
	buttonsDiv.appendChild(deleteButton);

	habitInfoDiv.appendChild(buttonsDiv);

	return habitInfoDiv;
}

function createDeleteHabitButton(habitData) {
	const deleteButton = document.createElement("button");
	deleteButton.setAttribute("class", "delete-habit");
	deleteButton.addEventListener("click", async e => {
		try {
			e.preventDefault();
			await removeHabit(habitData.habit_id); // fetch request to remove the habit from the database
			window.location.reload();
		} catch (err) {
			console.warn(err);
		}
	});
	deleteButton.textContent = "Delete habit";
	return deleteButton;
}

// creates a button that will display historical information about days the user has previously added data for the habit
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

// displays the historical information for a particular habit
async function showHistory(habitData) {
	const habitInfoDiv = document.querySelector(`div[name='${habitData.habit_id}'] > .habit-info`);
	const deleteButton = document.querySelector(`div[name='${habitData.habit_id}'] .delete-habit`);
	const buttonsDiv = document.querySelector(
		`div[name='${habitData.habit_id}'] .habit-info-buttons`
	);
	const history = await getHistory(habitData.habit_id); // fetches the history of the habit
	console.log(history);
	const div = document.createElement("div");
	div.setAttribute("class", "history-div");
	if (history.err) {
		const message = document.createElement("p");
		message.classList.add("no-history");
		message.textContent = "You have not tracked any data for this habit yet, start now!";
		div.appendChild(message);
	} else {
		history.forEach(data => {
			const historyElement = createHistoryElement(data, habitData);
			div.appendChild(historyElement);
		});
	}
	//hide history button will remove the history and display again the show history button
	const hideHistoryButton = document.createElement("button");
	hideHistoryButton.setAttribute("class", "habit-history");
	hideHistoryButton.textContent = "Hide habit history";
	hideHistoryButton.addEventListener("click", e => {
		e.preventDefault();
		div.remove();
		hideHistoryButton.remove();
		const historyButton = createHabitHistoryButton(habitData);
		buttonsDiv.insertBefore(historyButton, deleteButton); // displays the history in the correct place in the html
	});
	buttonsDiv.insertBefore(hideHistoryButton, deleteButton);
	habitInfoDiv.insertBefore(div, buttonsDiv);
}

// creates a single history element with the information for one day of the habit
function createHistoryElement(data, habitData) {
	const date = data.date.split("T")[0].split("-"); // gets only the relevant date information and splits it into year, month, day
	const achieved = data.achieved
		? "Well done! You hit your goal!"
		: "You didn't quite hit your goal on this day";
	const div = document.createElement("div");
	div.classList.add("history-item");
	const datePara = document.createElement("p");
	datePara.classList.add("history-date");
	const textPara = document.createElement("p");
	datePara.textContent = `${date[2]}/${date[1]}/${date[0]}`;
	textPara.textContent = `${data.amount} ${habitData.units.toLowerCase()}. ${achieved}`;
	div.classList.add(`achieved-${data.achieved}`); // class will be 'achieved-false' or 'achieved-true'
	div.appendChild(datePara);
	div.appendChild(textPara);
	return div;
}

// renders a form to create a new habit
function renderNewHabit() {
	const main = document.querySelector("main");
	const fields = [
		{ tag: "label", textContent: "Habit to track:", attributes: { for: "habit", class: "label" } },
		{
			tag: "input",
			attributes: { type: "text", name: "habit", class: "input", placeholder: "Eg. Drinking water" }
		},
		{
			tag: "label",
			textContent: "Daily goal:",
			attributes: { for: "goal", class: "label" }
		},
		{
			tag: "input",
			attributes: { type: "text", name: "goal", class: "input", placeholder: "Eg. 8" }
		},
		{
			tag: "label",
			textContent: "The goal is measured in:",
			attributes: { for: "units", class: "label" }
		},
		{
			tag: "input",
			attributes: { type: "text", name: "units", class: "input", placeholder: "Eg. cups" }
		},
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
			console.log("adding");
			const data = await addHabit(e); // adds the habit to the database for that user
			if (data.err) {
				// if the habit is not added, displays a message checking the user has entered their goal as a number
				const message = document.createElement("p");
				message.id = "error-message";
				message.textContent =
					"Something went wrong, please make sure your goal is entered as a number";
				const submitButton = document.querySelector(".submit");
				const form = document.querySelector("#newHabitForm");
				form.insertBefore(message, submitButton);
			} else {
				window.location.hash = "#habits";
			}
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
	makeHabitInformationDiv
};
