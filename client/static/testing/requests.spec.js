/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const { expect } = require("@jest/globals");
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

global.fetch = require("jest-fetch-mock");
let app;

describe("requests", () => {
	beforeEach(() => {
		document.documentElement.innerHTML = html.toString();
		app = require("../js/requests.js");
	});

	afterEach(() => {
		fetch.resetMocks();
	});
});
