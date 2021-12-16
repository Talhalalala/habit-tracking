/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { expect } = require("@jest/globals");
const { showlessInfoAboutHabit } = require("../js/content.js");
const html = fs.readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");

global.fetch = require("jest-fetch-mock");
let app;

describe("content", () => {
	beforeEach(() => {
		document.documentElement.innerHTML = html.toString();
		app = require("../js/content.js");
	});

	afterEach(() => {
		fetch.resetMocks();
		localStorage.clear();
	});

	describe("renderLoginForm", () => {
		it("is defined", () => {
			expect(app.renderLoginForm).toBeDefined();
		});

		it("creates a login form", () => {
			app.renderLoginForm();
			const form = document.querySelector("#loginForm");
			expect(form).toBeTruthy();
		});
	});

	describe("renderRegisterForm", () => {
		it("is defined", () => {
			expect(app.renderRegisterForm).toBeDefined();
		});

		it("creates a register form", () => {
			app.renderRegisterForm();
			const form = document.querySelector("#registerForm");
			expect(form).toBeTruthy();
		});
	});

	describe("renderToday", () => {
		it("is defined", () => {
			expect(app.renderToday).toBeDefined();
		});

		// it("creates a habits section", () => {
		// 	localStorage.setItem("userId", "1");
		// 	app.renderToday();
		// 	const section = document.querySelector("#feed");
		// 	expect(section).toBeTruthy();
		// });
	});

	describe("renderHabits", () => {
		it("is defined", () => {
			expect(app.renderHabits).toBeDefined();
		});

		it("creates a habit section with a streak", () => {
			const habitData = { habit_id: 1, habit: "test habit", goal: 3, streak: 1, units: "units" };
			const feed = document.createElement("section");
			feed.id = "feed";
			document.body.appendChild(feed);
			app.renderHabits(habitData);
			expect(document.querySelector("div[name='1']")).toBeTruthy();
			expect(document.querySelector(".streak-button").textContent).toContain(
				"You are on a 1 day streak! Keep it up!"
			);
		});

		it("creates a habit section with a streak", () => {
			const habitData = { habit_id: 1, habit: "test habit", goal: 3, streak: 0, units: "units" };
			const feed = document.createElement("section");
			feed.id = "feed";
			document.body.appendChild(feed);
			app.renderHabits(habitData);
			expect(document.querySelector("div[name='1']")).toBeTruthy();
			expect(document.querySelector(".streak-button").textContent).toContain(
				"You haven't achieved this goal recently!"
			);
		});
	});

	describe("createMoreInfoButton", () => {
		it("is defined", () => {
			expect(app.createMoreInfoButton).toBeDefined();
		});

		it("creates a button", () => {
			const habitData = { habit_id: 1 };
			const post = document.createElement("div");
			const button = app.createMoreInfoButton(habitData, post);
			expect(button.textContent).toContain("More Info");
			expect(button.classList[0]).toContain("1");
		});
	});

	describe("createLessInfoButton", () => {
		it("is defined", () => {
			expect(app.createLessInfoButton).toBeDefined();
		});

		it("creates a button", () => {
			const habitData = {};
			const button = app.createLessInfoButton(habitData);
			expect(button.textContent).toContain("Less Info");
		});
	});

	describe("showLessInfoAboutHabit", () => {
		it("is defined", () => {
			expect(app.showlessInfoAboutHabit).toBeDefined();
		});

		it("removes the button", () => {
			const button = document.createElement("button");
			const post = document.createElement("div");
			post.setAttribute("name", "1");
			const info = document.createElement("div");
			info.classList.add("habit-info");
			post.appendChild(info);
			button.id = "button";
			const habitData = { habit_id: 1 };
			button.addEventListener("click", e => {
				showlessInfoAboutHabit(e, habitData);
			});
			document.body.append(post);
			document.body.append(button);
			button.click();
			expect(document.querySelector("#button")).toBeFalsy();
		});
	});

	describe("makeHabitInformationDiv", () => {
		it("displays a success message if the habit has been achieved", () => {
			const habitData = { habit_amount: 1, units: "units", habit_id: 1, habit_achieved: true };
			const div = app.makeHabitInformationDiv(habitData);
			document.body.appendChild(div);
			expect(document.querySelector(".habit-details").textContent).toContain(
				"Amazing! You've hit your goal today!"
			);
		});

		it("creates a form if the habit is not achieved", () => {
			const habitData = { habit_amount: 1, units: "Units", habit_id: 1, habit_achieved: false };
			const div = app.makeHabitInformationDiv(habitData);
			document.body.appendChild(div);
			expect(document.querySelector("form[name='1']")).toBeTruthy();
			expect(document.querySelector(".habit-details").textContent).toContain(
				"You are currently at 1 units today."
			);
		});
	});

	describe("createDeleteHabitButton", () => {
		it("is defined", () => {
			expect(app.createDeleteHabitButton).toBeDefined();
		});

		it("creates a button", () => {
			const habitData = { habit_id: 1 };
			const button = app.createDeleteHabitButton(habitData);
			expect(button.textContent).toContain("Delete habit");
		});
	});

	describe("showHistory", () => {
		it("is defined", () => {
			expect(app.showHistory).toBeDefined();
		});

		it("makes a fetch request", () => {
			const habitData = { habit_id: 1 };
			app.showHistory(habitData);
			expect(fetch).toHaveBeenCalled();
		});
	});

	describe("createHistoryElement", () => {
		it("is defined", () => {
			expect(app.createHistoryElement).toBeDefined();
		});

		it("creates a div with the history information in and a success message", () => {
			const data = { date: "2021-12-16", achieved: true, amount: 1 };
			const habitData = { units: "Units" };
			const div = app.createHistoryElement(data, habitData);
			document.body.append(div);
			expect(document.querySelector(".history-date").textContent).toContain("16/12/2021");
			expect(document.querySelector(".history-item").textContent).toContain(
				"1 units. Well done! You hit your goal!"
			);
		});

		it("creates a div with the history information in and a failure message", () => {
			const data = { date: "2021-12-16", achieved: false, amount: 1 };
			const habitData = { units: "Units" };
			const div = app.createHistoryElement(data, habitData);
			document.body.append(div);
			expect(document.querySelector(".history-date").textContent).toContain("16/12/2021");
			expect(document.querySelector(".history-item").textContent).toContain(
				"1 units. You didn't quite hit your goal on this day"
			);
		});
	});

	describe("renderNewHabit", () => {
		it("is defined", () => {
			expect(app.renderNewHabit).toBeDefined();
		});

		it("creates a form", () => {
			app.renderNewHabit();
			expect(document.querySelector("#newHabitForm")).toBeTruthy();
		});
	});
});
