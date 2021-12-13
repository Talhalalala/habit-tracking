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