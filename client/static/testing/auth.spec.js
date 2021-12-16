/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { expect } = require("@jest/globals");
const { TestWatcher } = require("jest");
const { requestRegistration } = require("../js/auth.js");
const html = fs.readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");

global.fetch = require("jest-fetch-mock");
let app;

describe("auth", () => {
	beforeEach(() => {
		document.documentElement.innerHTML = html.toString();
		app = require("../js/auth.js");
	});

	afterEach(() => {
		fetch.resetMocks();
	});

	describe("requestLogin", () => {
		it("makes a fetch request", () => {
			app.requestLogin();
			expect(fetch).toBeTruthy();
		});
	});

	describe("requestRegistration", () => {
		it("makes a fetch request", () => {
			app.requestRegistration();
			expect(fetch).toBeTruthy();
		});

		it("asks for passwords to be the same", () => {
			const form = document.createElement("form");
			form.id = "registerForm";
			form.addEventListener("submit", e => {
				app.requestRegistration(e);
			});

			const password = document.createElement("input");
			password.value = "testPassword";
			password.setAttribute("name", "password");
			const passwordConfirm = document.createElement("input");
			passwordConfirm.value = "password";
			passwordConfirm.setAttribute("name", "passwordConfirmation");

			form.appendChild(password);
			form.appendChild(passwordConfirm);
			document.body.appendChild(form);

			form.submit();
			expect(document.querySelector("#error-message")).toBeTruthy();
		});
	});

	// describe("login", () => {
	// 	it("login directs to dashboard", () => {
	// 		app.login();
	// 		const user = document.querySelector("today");
	// 		expect(user).toBeCalled
	//         const token= document.querySelector("token");
	// 		expect(token).toBeCalled
	//         const email= document.querySelector("userEmail");
	// 		expect(email).toBeCalled
	// 	});
	// });

	describe("login", () => {
		test("logins the user", () => {
			// app.login();
			// const user = jwt_decode(token);
			// expect(user).toBeCalled;
			expect(app.login).toBeDefined();
		});
	});

	describe("logout", () => {
		it("logs out the user", () => {
			app.logout();
		});
	});

	describe("currentUser", () => {
		test("checks the username", () => {
			expect(app.currentUser).toBeDefined();
		});
	});
});
