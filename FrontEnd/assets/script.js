let allWorks = [];     // creation d'une "sauvegarde" pour utiliser le tableau globalement

async function loadFilters(){
    const url = "http://localhost:5678/api/categories";
    const response = await fetch(url);
    const categories = await response.json();

    const portfolio = document.querySelector('#portfolio');
    const gallery = document.querySelector('.gallery');
    const div = document.createElement('div');
    
    
    div.classList.add('filters');
    portfolio.insertBefore(div, gallery)

    const allButton = document.createElement('button');
    allButton.innerText = 'Tous';
    allButton.classList.add('filter');
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

    filters.forEach(filter => {        
        filter.addEventListener('click', () => {
            filters.forEach(f => {
                f.classList.remove('selected');
            })

            gallery.innerHTML = "";
            filter.classList.add('selected');
            showProjects();
        })
    })


    // faire apparaitre un bouton par categorie                                                     OK
    // ajouter un bouton pour "tous"                                                                OK
    // changer la couleur du bouton du filtre selectionné                                           OK
    // faire un add event sur les boutons au clique, avec showProjects                              OK
    // faire en sorte que showProjects prenne en compte le parametre de l'id du bouton
    
}

async function loadProjects() {      // charge les projets au demarrage
    const url = "http://localhost:5678/api/works"
    const response = await fetch(url);
    const works = await response.json();
    
    allWorks = works; // 'sauvegarde' dans la variable pour etre en portee globale
    showProjects();
}

function showProjects(){
    for (let work of allWorks) {
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

loadFilters().then(() => {  // on attend que ca charge sinon ca a pas le temps de charger
  loadProjects();
});









// je fais une fonction pour aller chercher les projets (avec en parametres les filtres ou aucun parametre pour tous)
// au chargement la page charge tous les projets
// rajout d'un bouton "tous" pour faire une recherche sans categorie et tout faire apparaitre au clique
// quand on clique sur un bouton, ca vide la gallerie, et lance la fonction avec le filtre en parametre 
// le bouton selectionné change de couleur