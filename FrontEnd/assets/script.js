import * as funcs from './functions.js';

const token = localStorage.getItem("token");

if (token) {
    const loginTextIndex = document.querySelector('.header__li-login');
    const loginText = document.querySelector('.header__nav-login');

    if (loginTextIndex) {
        loginTextIndex.innerText = 'logout';
        loginTextIndex.addEventListener('click', (c) => {
            c.preventDefault();
            localStorage.removeItem('token');
            location.reload();
        });
    }

    if (loginText) {
        loginText.innerText = 'logout';

        loginText.addEventListener('click', () => {
            localStorage.removeItem('token');
            location.reload();
        });
    }
}

const gallery = document.querySelector('.gallery');

if (gallery){
    funcs.loadFilters().then(() => {  // on attend que loadFilters a fini de charger sinon loadProject charge casi en meme temps et ca bug
        funcs.loadProjects().then(() => {
            if (token){
                document.querySelector('.portfolio__modify-wrapper').style.display = "flex";
                document.querySelector('.header__modify-wrapper').style.display = "flex";
            }
        });
    });
}

document.querySelector('.portfolio__modify-wrapper').addEventListener('click', () => {
    document.querySelector('.modal__wrapper').style.display = "flex";
    funcs.showModalImg();
})

document.querySelector('.modal__icon-close').addEventListener('click', () => {
    document.querySelector('.modal__wrapper').style.display = "none";
    document.querySelector('.modal__gallery').innerHTML = "";
})

document.querySelector('.modal__button').addEventListener('click', () => {
    document.querySelector('.add__section').style.display = 'block';
    document.querySelector('.modal__section').style.display = 'none';
    funcs.showOptions();
})

document.querySelector('.add__icon-return').addEventListener('click', () => {
    document.querySelector('.add__section').style.display = "none";
    document.querySelector('.modal__section').style.display = "block";
    document.querySelector('.modal__gallery').innerHTML = "";
    funcs.showModalImg();
})

document.querySelector('.add__icon-close').addEventListener('click', () => {
    document.querySelector('.modal__wrapper').style.display = "none";
    document.querySelector('.modal__gallery').innerHTML = "";
})

const form = document.querySelector('.section__form');

if (form) {
    form.addEventListener('submit', async (s) => {  //sans async on peut pas utiliser await pour arttendre les reponses
    s.preventDefault(); // on empeche l'envoi du formulaire

    const email = document.querySelector('#section__input-email').value;
    const password = document.querySelector('#section__input-password').value;

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {                  // si la reponse est bonne sa return true / code '200' (veut dire succes), donc = .ok
        localStorage.setItem("token", data.token);  //enregistrement en local du token
        document.querySelector('.section__form').reset(); 
        window.location.href = 'index.html';
    } 
    
    if (!response.ok){
        form.reset();
        document.querySelector('.section__error').style.display = "block";
    }
});
}