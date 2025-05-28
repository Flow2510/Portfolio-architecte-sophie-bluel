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
    div.appendChild(allButton);
    
    categories.forEach(categorie => {
        const button = document.createElement('button');

        button.classList.add('filter');
        button.dataset.id = categorie.id;
        button.innerText = categorie.name;
        div.appendChild(button);
    });
    // faire apparaitre un bouton par categorie                                     OK
    // ajouter un bouton pour "tous"                                                OK
    // changer la couleur du bouton du filtre selectionné
    // faire un add event sur les boutons au clique, avec showProjects(filtres en parametre ou rien pour tous)
    
}

async function loadProjects() {      // charge les projets au demarrage
    const url = "http://localhost:5678/api/works"
    const response = await fetch(url);
    const works = await response.json();
    
    allWorks = works; // 'sauvegarde' dans la variable pour etre en portee globale
    // showProjects();
}

// function showProjects(){

// }
loadFilters();
loadProjects().then(() => {  // on attend que ca charge sinon ca a pas le temps de charger
  console.log(allWorks);
});









// je fais une fonction pour aller chercher les projets (avec en parametres les filtres ou aucun parametre pour tous)
// au chargement la page charge tous les projets
// rajout d'un bouton "tous" pour faire une recherche sans categorie et tout faire apparaitre au clique
// quand on clique sur un bouton, ca vide la gallerie, et lance la fonction avec le filtre en parametre 
// le bouton selectionné change de couleur