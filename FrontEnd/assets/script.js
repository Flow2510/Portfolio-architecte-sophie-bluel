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
};

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
};

const modifyButton = document.querySelector('.portfolio__modify-wrapper');

if (modifyButton) {
    modifyButton.addEventListener('click', () => {
    document.querySelector('.modal__wrapper').style.display = "flex";
    funcs.showModalImg();
})
};

const modalClose = document.querySelector('.modal__icon-close');

if (modalClose) {
    modalClose.addEventListener('click', () => {
    document.querySelector('.modal__wrapper').style.display = "none";
    document.querySelector('.modal__gallery').innerHTML = "";
})
};

const modalButton = document.querySelector('.modal__button');

if (modalButton){
    modalButton.addEventListener('click', () => {
    document.querySelector('.add__section').style.display = 'block';
    document.querySelector('.modal__section').style.display = 'none';
    funcs.showOptions();
})
};

const addReturn = document.querySelector('.add__icon-return');

if (addReturn) {
    addReturn.addEventListener('click', () => {                                                 
    document.querySelector('.add__section').style.display = "none";
    document.querySelector('.modal__section').style.display = "block";     
    document.querySelector('.modal__gallery').innerHTML = "";
    funcs.showModalImg();
    funcs.resetAddForm();
})
};

const addClose = document.querySelector('.add__icon-close');

if(addClose) {                                                                               
    addClose.addEventListener('click', () => {
    document.querySelector('.modal__wrapper').style.display = "none";
    document.querySelector('.modal__gallery').innerHTML = "";
    funcs.resetAddForm();
    funcs.resetModal();
})
};

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
};

const imageInput = document.querySelector('.add__input-image');
const addImageButton = document.querySelector('.add__input-button');

if(addImageButton){
    addImageButton.addEventListener('click', (c) => {
        c.preventDefault();
        imageInput.click();
    })
}

if(imageInput) {
    imageInput.addEventListener('change', () => {
        const reader = new FileReader();  // filreader est une api native pour lire un fichier upload en local
        const file = imageInput.files[0];  // pour selectionner l'image (0 car l'index commence a 0) et pouvoir l'utiliser
        const preview = document.querySelector('.add__preview');
        
        reader.onload = (e) => {                                                // 4. Quand la lecture est terminée
        preview.style.backgroundImage = `url(${e.target.result})`;              // 5. On place la Data URL dans l'image
        preview.style.display = 'block';
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';

        document.querySelector('.add__label-image i').style.display = "none";
        document.querySelector('.add__label-image button').style.display = "none";
        document.querySelector('.add__label-image p').style.display = "none";
        document.querySelector('.add__label-image').style.padding = "0";
    };

        reader.readAsDataURL(file);                         //on lie l'image dans le reader
    });
}

const addFormButton = document.querySelector('.add__form-button');

if(addFormButton){                  // si le nom ou le input file sont vide on bloque l'envoi
    addFormButton.addEventListener('click', (c) => {
        c.preventDefault();
        const titleInput = document.querySelector('.add__input-title');
        const addLabel = document.querySelector('.add__label-image');
        const fileInput = document.querySelector('.add__input-image');
        
        if (titleInput.value.trim() === ""){
            titleInput.style.border = "1px solid red";
        } else {
            titleInput.style.border = "";
        }

        if (fileInput.files.length === 0){
            addLabel.style.border = "1px solid red";
        } else {
            addLabel.style.border = "";
        }

        if (fileInput.files.length > 0 && titleInput.value.trim() !== "" && token) {
            funcs.addImage();     //     si token, fichier, nom OK, on envoie au json
        }
    });
}