let allWorks = [];     // creation d'une "sauvegarde" pour utiliser le tableau globalement

async function loadFilters(){
    const url = "http://localhost:5678/api/categories";
    const response = await fetch(url);
    const categories = await response.json();

    // faire apparaitre un bouton par categorie 
    // ajouter un pour "tous"
    // faire un add event sur les boutons au clique, avec showProjects(filtres en parametre ou rien pour tous)
    // changer la couleur du bouton du filtre selectionné

}

async function loadProjects() {      // charge les projets au demarrage
    const url = "http://localhost:5678/api/works"
    const response = await fetch(url);
    const works = await response.json();
    
    allWorks = works;
    // showProjects();
}

// function showProjects(){

// }

loadProjects().then(() => {
  console.log(allWorks);
});









// je fais une fonction pour aller chercher les projets (avec en parametres les filtres ou aucun parametre pour tous)
// au chargement la page charge tous les projets
// rajout d'un bouton "tous" pour faire une recherche sans categorie et tout faire apparaitre au clique
// quand on clique sur un bouton, ca vide la gallerie, et lance la fonction avec le filtre en parametre 
// le bouton selectionné change de couleur