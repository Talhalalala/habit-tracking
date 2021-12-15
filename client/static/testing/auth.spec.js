/**
 * @jest-environment jsdom
 */

 const fs = require("fs");
 const path = require("path");
 const { expect } = require("@jest/globals");
const { requestRegistration } = require("../js/auth.js");
 const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
 
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

    test('requestsLogin calls fetch', async ()=>{
        await requests.requestLogin({});
        expect(fetch).toHaveBeenCalled();
    })
    
    

})
 