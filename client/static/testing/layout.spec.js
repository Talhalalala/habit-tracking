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
let content = require("../js/content.js");

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

		// it("creates a logout button if there is a user", () => {
		// 	const nav = document.createElement("nav");
		// 	const privateRoutes = [];
		// 	// const currentUser = jest.fn(() => "testuser");
		// 	jest.spyOn(auth, "currentUser").mockReturnValueOnce("testuser");
		// 	// localStorage.setItem("username", "testUsername");
		// 	app.updateNav();
		// 	expect(nav.children.length).toEqual(3);
		// 	// expect(currentUser).toHaveBeenCalled();
		// });
	});

	describe("updateMain", () => {
		it("is defined", () => {
			expect(app.updateMain).toBeDefined();
		});

		it("takes you to the login page by default", () => {
			app.updateMain();
			expect(window.location.hash).toEqual("#login");
		});

		// it("renders the login form", () => {
		// 	const renderLogin = jest.spyOn(content, "renderLoginForm");
		// 	// const renderLoginForm = jest.fn();
		// 	app.updateMain("#login");
		// 	expect(renderLogin).toHaveBeenCalled();
		// });
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
