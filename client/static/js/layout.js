const { logout, currentUser } = require('./auth')
const { renderLoginForm, renderRegisterForm } = require('./content')

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
            case '#today':
                renderToday(); break;
            default:
                render404(); break;
        }
    } else {
        window.location.hash = '#login';
    }
}

function createNavLink(route){
    const link = document.createElement('a');
    link.textContent = `${route[1].toUpperCase()}${route.substring(2)}`;
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