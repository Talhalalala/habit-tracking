/**
 * @jest-environment jsdom
 */

 const fs = require("fs");
 const path = require("path");
 const { expect } = require("@jest/globals");
 const html = fs.readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");
 
 global.fetch = require("jest-fetch-mock");
 let app;
 
 describe("auth.js", () => {
     beforeEach(() => {
         document.documentElement.innerHTML = html.toString();
         app = require("../js/auth.js");
     });
 
     afterEach(() => {
         fetch.resetMocks();
     });

    /*test('requestsLogin calls fetch', async ()=>{
        await requests.requestLogin({});
        expect(fetch).toHaveBeenCalled();
    }) */
    describe("requestLogin", () => {
		it("makes a fetch request", () => {
			app.requestLogin({});
			expect(fetch).toHaveBeenCalled();
		});
	

    describe("requestRegistration", () => {
		it("makes a fetch request", () => {
			app.requestRegistration({});
			expect(fetch).toHaveBeenCalled();
		});
	}); 

    });
    

})
 