/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { expect } = require("@jest/globals");
const html = fs.readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");

global.fetch = require("jest-fetch-mock");
let app;
let auth = require("../js/auth.js");
let { renderLoginForm } = require("../js/content.js");

describe("layout", () => {
	beforeEach(() => {
		document.documentElement.innerHTML = html.toString();
		app = require("../js/layout.js");
		// jest.mock("../js/content.js", () => ({
		// 	...jest.requireActual("../js/content.js"),
		// 	renderLoginForm: jest.fn()
		// }));
	});

	afterEach(() => {
		fetch.resetMocks();
		localStorage.clear();
	});

	describe("updateNav", () => {
		it("is defined", () => {
			expect(app.updateNav).toBeDefined();
		});
	});

	describe("updateMain", () => {
		it("is defined", () => {
			expect(app.updateMain).toBeDefined();
		});

		it("takes you to the login page by default", () => {
			app.updateMain();
			expect(window.location.hash).toEqual("#login");
		});

		it("renders the login form", () => {
			app.updateMain("#login");
			expect(document.querySelector("#loginForm")).toBeTruthy();
		});

		it("renders the register form", () => {
			app.updateMain("#register");
			expect(document.querySelector("#registerForm")).toBeTruthy();
		});

		it("renders the new habit form", () => {
			app.updateMain("#new");
			expect(document.querySelector("#newHabitForm")).toBeTruthy();
		});
	});

	describe("createNavLink", () => {
		it("creates a link", () => {
			expect(app.createNavLink("#test").textContent).toContain("Test");
		});
	});

	describe("updateContent", () => {
		it("is defined", () => {
			expect(app.updateContent).toBeDefined();
		});
	});
});
