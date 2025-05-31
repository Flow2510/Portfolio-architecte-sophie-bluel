let allWorks = [];     // creation d'une "sauvegarde" pour utiliser le tableau globalement


async function loadFilters(){
    const url = "http://localhost:5678/api/categories";
    const response = await fetch(url);
    const categories = await response.json();
    const gallery = document.querySelector('.gallery');
    const portfolio = document.querySelector('#portfolio');
    const div = document.createElement('div');
    
    div.classList.add('filters_container');
    portfolio.insertBefore(div, gallery)

    const allButton = document.createElement('button');
    allButton.innerText = 'Tous';
    allButton.classList.add('all_filter');
    allButton.classList.add('selected');
    div.appendChild(allButton);
    
    categories.forEach(categorie => {
        const button = document.createElement('button');

        button.classList.add('filter');
        button.dataset.id = categorie.id;
        button.innerText = categorie.name;
        div.appendChild(button);
    });

    const filters = document.querySelectorAll('.filter')

    allButton.addEventListener('click', () => {
        filters.forEach(f => {
            f.classList.remove('selected');   
        })
        allButton.classList.add('selected');
        gallery.innerHTML = "";
        showProjects();
    })

    filters.forEach(filter => {        
        filter.addEventListener('click', () => {
            filters.forEach(f => {
                f.classList.remove('selected');   
            })
            allButton.classList.remove('selected');
            gallery.innerHTML = "";
            filter.classList.add('selected');

            const categoryId = parseInt(filter.dataset.id); // Ne marche pas sans parseInt, CONVERTIT LA CHAINE EN NOMBRE
            const filteredWorks = allWorks.filter(work => work.categoryId === categoryId); //pour chaque work, on verifie si il a la bonne categorie, si oui on le met dans le nouveau tableau

            showProjects(filteredWorks);
        })
    })
    

    // faire apparaitre un bouton par categorie                                                     OK
    // ajouter un bouton pour "tous"                                                                OK
    // changer la couleur du bouton du filtre selectionné                                           OK
    // faire un add event sur les boutons au clique, avec showProjects                              OK
    // faire en sorte que showProjects prenne en compte le parametre de l'id du bouton              OK
}

async function loadProjects() {      // charge les projets au demarrage
    const url = "http://localhost:5678/api/works"
    const response = await fetch(url);
    const works = await response.json();
    
    allWorks = works; // 'sauvegarde' dans la variable pour etre en portee globale
    showProjects();
}

function showProjects(works = allWorks){
    for (let work of works) {
        const gallery = document.querySelector('.gallery');
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figCaption = document.createElement('figcaption')

        img.src = work.imageUrl;
        img.alt = work.title;
        figCaption.innerText = work.title;
        figure.appendChild(img);
        figure.appendChild(figCaption);
        gallery.appendChild(figure);
    }
}

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
    loadFilters().then(() => {  // on attend que loadFilters a fini de charger sinon loadProject charge casi en meme temps et ca bug
    loadProjects();
    });
}

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
        window.location.href = 'index.html';  // ne marche pas bien, car arrete le JS du coup, a voir comment je fait
    } 
    
    if (!response.ok){
        form.reset();
        document.querySelector('.section__error').style.display = "block";
    }
});
}