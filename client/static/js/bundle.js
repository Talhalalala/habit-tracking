(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
async function requestLogin(e){
    e.preventDefault();
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
        }
        const r = await fetch(`http://localhost:3000/auth/login`, options) //Change route depending on server side guys
        const data = await r.json()
        if (!data.success) { throw new Error('Login not authorised'); }
        login(data.token);
    } catch (err) {
        console.warn(err);
    }
}

async function requestRegistration(e) {
    e.preventDefault();
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
        }
        const r = await fetch(`http://localhost:3000/auth/register`, options)
        const data = await r.json()
        if (data.err){ throw Error(data.err) }
        requestLogin(e);
    } catch (err) {
        console.warn(err);
    }
}

function login(token){
    const user = jwt_decode(token);
    localStorage.setItem("token", token);
    localStorage.setItem("username", user.username);
    localStorage.setItem("userEmail", user.email);
    window.location.hash = '#feed';
}

function logout(){
    localStorage.clear();
    window.location.hash = '#login';
}

function currentUser(){
    const username = localStorage.getItem('username')
    return username;
}

module.exports = { requestLogin, requestRegistration, login, logout, currentUser }
},{}],2:[function(require,module,exports){
const { requestLogin, requestRegistration } = require('./auth')

const main = document.querySelector('main');

function renderHomepage(){
    const logo = document.createElement('img');
    logo.id = 'logo';
    logo.src = 'https://res.cloudinary.com/getfutureproof/image/upload/v1595323029/futureproof_logotype_withBleed_huge_kl2rol.png';
    logo.alt = 'futureproof logo'
    main.appendChild(logo);
}


function renderLoginForm() {
    const fields = [
        { tag: 'label', textContent:'Email', attributes: { for: 'email' }},
        { tag: 'input', attributes: { type: 'email', name: 'email' } },
        { tag: 'label', textContent:'Password', attributes: { for: 'password' }},
        { tag: 'input', attributes: { type: 'password', name: 'password' } },
        { tag: 'input', attributes: { type: 'submit', value: 'Login' } }
    ]
    const form = document.createElement('form');
    fields.forEach(f => {
        let field = document.createElement(f.tag);
        if (f.textContent) { field.textContent = f.textContent }
        Object.entries(f.attributes).forEach(([a, v]) => {
            field.setAttribute(a, v);
            form.appendChild(field);
        })
    })
    form.addEventListener('submit', requestLogin)
    main.appendChild(form);
}

function renderRegisterForm() {
    const fields = [
        { tag: 'label', textContent:'Username', attributes: { for: 'username' }},
        { tag: 'input', attributes: { type: 'text', name: 'username' } },
        { tag: 'label', textContent:'Email', attributes: { for: 'email' }},
        { tag: 'input', attributes: { type: 'email', name: 'email' } },
        { tag: 'label', textContent:'Password', attributes: { for: 'password' }},
        { tag: 'input', attributes: { type: 'password', name: 'password' } },
        { tag: 'label', textContent:'Confirm Password', attributes: { for: 'passwordConfirmation' }},
        { tag: 'input', attributes: { type: 'password', name: 'passwordConfirmation' } },
        { tag: 'input', attributes: { type: 'submit', value: 'Create Account' } }
    ]
    const form = document.createElement('form');
    fields.forEach(f => {
        let field = document.createElement(f.tag);
        if (f.textContent) { field.textContent = f.textContent }
        Object.entries(f.attributes).forEach(([a, v]) => {
            field.setAttribute(a, v);
            form.appendChild(field);
        })
    })
    form.addEventListener('submit', requestRegistration)
    main.appendChild(form);
}

module.exports = { renderHomepage, renderLoginForm, renderRegisterForm }
},{"./auth":1}],3:[function(require,module,exports){
const { logout, currentUser } = require('./auth')
const { renderHomepage, renderLoginForm, renderRegisterForm } = require('./content')

const nav = document.querySelector('nav');
const main = document.querySelector('main');

const publicRoutes = ['#login', '#register'];
const privateRoutes = [];

window.addEventListener('hashchange', updateContent);

function updateNav(){
    nav.innerHTML = '';
    let links;
    let logoutBtn;
    if (currentUser()){
        links = privateRoutes.map(createNavLink);
        logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = logout;
        nav.appendChild(logoutBtn);
    } else {
        links = publicRoutes.map(createNavLink);
    }
    links.forEach(l => nav.insertBefore(l, logoutBtn))
}

function updateMain(path) {
    main.innerHTML = '';
    if (path) {
        switch(path){
            case '#login':
                renderLoginForm(); break;
            case '#register':
                renderRegisterForm(); break;
            default:
                render404(); break;
        }
    } else {
        renderHomepage();
    }
}

function createNavLink(route){
    const link = document.createElement('a');
    link.textContent = route === '#' ? 'Home' : `${route[1].toUpperCase()}${route.substring(2)}`;
    link.href = route;
    return link;
}

function updateContent(){
    const path = window.location.hash;
    if (privateRoutes.includes(path) && !currentUser()){
        window.location.hash = '#';
    } else if (!privateRoutes.includes(path) && currentUser()) {
        window.location.hash = '#feed';
    } else {
        updateNav();
        updateMain(path);
    }
}

updateContent();
},{"./auth":1,"./content":2}],4:[function(require,module,exports){

},{}]},{},[1,2,3,4]);
