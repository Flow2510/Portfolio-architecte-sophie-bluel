let allWorks = [];     // creation d'une "sauvegarde" pour utiliser le tableau globalement

export async function loadFilters(){
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

export async function loadProjects() {      // fonction pour charger les projets au demarrage
    const url = "http://localhost:5678/api/works"
    const response = await fetch(url);
    const works = await response.json();
    
    allWorks = works; // 'sauvegarde' dans la variable pour etre en portee globale
    showProjects();
}

export function showProjects(works = allWorks){
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

export async function showModalImg () {
    const url = "http://localhost:5678/api/works"
    const response = await fetch(url);
    const works = await response.json();

    for (let work of works) {
        const modalGallery = document.querySelector('.modal__gallery');
        const div = document.createElement('div');
        div.classList.add('gallery__wrapper');
        div.innerHTML = `<i class="gallery__icon fa-solid fa-trash-can"></i>`;
        div.style.background = `url("${work.imageUrl}")`;  // bien mettre ${} sinon affiche que la premiere image avec work.imageUrl
        div.style.backgroundSize = "cover";
        div.style.backgroundPosition = 'center';
        modalGallery.appendChild(div);
        
        // galleryIcon = document.querySelector('.gallery__icon');
        // galleryIcon.addEventListener('click', () => {
        //         est ce que je peux supprimer sans supprimer definitivement ? a voir avec mentor
        // })
    }
}

export async function showOptions() {
    const url = "http://localhost:5678/api/categories";
    const response = await fetch(url);
    const categories = await response.json();
    const select = document.querySelector('.add__select');

    select.innerHTML = "";

    for (let categorie of categories) {
        const option = document.createElement('option');
        option.classList.add('add__select-option');
        option.innerText = `${categorie.name}`;
        select.appendChild(option);
    }
}

export function resetAddForm() {
    document.querySelector('.add__label-image i').style.display = "block";
    document.querySelector('.add__label-image button').style.display = "block";
    document.querySelector('.add__label-image p').style.display = "block";
    document.querySelector('.add__preview').style.display = "none";
    document.querySelector('.add__label-image').style.padding = "";
    document.querySelector('.add__input-title').style.border = "";
    document.querySelector('.add__label-image').style.border = "";
    document.querySelector('.add__form').reset();
}

export function resetModal() {
    document.querySelector('.modal__section').style.display = "block";
    document.querySelector('.add__section').style.display = "none";
}

const userData = new FormData();            // on fait un nouveau tableau pour stocker l'ajout au json
const titleInput = document.querySelector('.add__input-title');
const fileInput = document.querySelector('.add__input-image');
const select = document.querySelector('.add__select');
userData.append("image", fileInput.files[0]);   // ajout au tableau des valeurs des inputs
userData.append("title", titleInput.value);
userData.append("category", select.value)

export function addImage() {
    fetch('http://localhost:5678/api/works', {          //  on fait une requete post a l'api
        method: "POST",
        headers: {                                        
            "Accept": "application/json"
        },
        body: userData
    })
    
    .then(response => {
        if (!response.ok) throw new Error(`Erreur lors de l'envoi`);
        return response.json();
    })
    
    .then(data => {
        console.log("Réponse de l'API :", data);
    })
    
    .catch(error => {
        console.error("Erreur :", error);
    });
}