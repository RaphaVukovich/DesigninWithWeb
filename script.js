
//VARIABLES ET TYPES DE DONNÉES 

const siteName = "Footlica";
const basePrice = 14.50; // prix de base de tous les maillots

let cartCount = 0; // on commence avec un panier vide


//CONDITIONS 

// exemple : est-ce que le panier est vide ?
if (cartCount === 0) {
  // console.log("Votre panier est vide.");
} else {
  // console.log(`Vous avez ${cartCount} article(s) dans votre panier.`);
}

// exemple : est-ce qu'un maillot est en promo ?
const soldCount = 1428;

if (soldCount > 1000) {
  // console.log("Bestseller !");
} else if (soldCount > 500) {
  // console.log("Populaire");
} else {
  // console.log("Nouveau");
}


//TABLEAUX ET OBJETS 

// tableau simple — les tailles disponibles
const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
// console.log(sizes);
// console.log(sizes[2]); // affiche "L"

// objet — un maillot avec toutes ses propriétés
const exampleJersey = {
  club: "Chelsea",
  season: "2025-26",
  price: 14.50,
  isNew: true
};
// console.log(exampleJersey.club); // affiche "Chelsea"
// console.log(exampleJersey.price); // affiche 14.5

// boucle sur le tableau de tailles
// sizes.forEach(size => {
//   console.log(size);


// CIBLER ET MODIFIER LA PAGE 

// on cible le compteur du panier dans le header
const cartCountEl = document.querySelector(".cart-count");

// on cible la barre de recherche
const searchInput = document.querySelector("#searchInput");

// on cible la grille où on va injecter les cartes
const container = document.querySelector("#grid");

// exemple de manipulation DOM (commenté, juste pour montrer)
// const logo = document.querySelector(".logo");
// logo.innerHTML = "Footlica 2.0";
// logo.style.color = "red";


// J'ai utilisé l'IA pour comprendre la syntaxe async/await et le try/catch
// je savais pas comment gérer les erreurs de réseau proprement

const myUrl = "dataset.json";

const getData = async (doStuffs) => {
  try {
    const response = await fetch(myUrl);

    if (!response.ok) {
      throw new Error("network response not ok: " + response.statusText);
    }

    const data = await response.json();
    doStuffs(data);

  } catch (error) {
    console.error("problème lors du chargement des données: " + error);
  }
};


//GÉNÉRER LES CARTES 
// J'ai utilisé l'IA pour m'aider à structurer le HTML dans un template literal
// je savais pas trop comment gérer le tag "NEW" de façon conditionnelle

getData((data) => {

  data.forEach(jersey => {

    // console.log(jersey.name); // pour vérifier que les données arrivent bien

    // le badge NEW n'apparaît que si isNew est true
    const tagHTML = jersey.isNew ? '<span class="tag">NEW</span>' : '';

    const card = `
      <div class="card"
           data-item="${jersey.id}"
           data-sold="${jersey.sold}"
           data-crumb="${jersey.crumb}">
        <div class="card-img">
          <img src="${jersey.image}" alt="${jersey.alt}" />
          ${tagHTML}
        </div>
        <div class="card-info">
          <p class="club">${jersey.club}</p>
          <p class="name">${jersey.name}</p>
          <div class="card-row">
            <span class="price">US$ ${jersey.price.toFixed(2)}</span>
            <button class="add-btn"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += card;
  });

  // une fois les cartes dans le DOM, on branche les événements
  attachCardListeners();
  attachSearchListener(data);

});


//RECHERCHE 
// J'ai utilisé l'IA pour comprendre filter() et includes()
// je savais pas qu'on pouvait filtrer un tableau comme ça en une ligne

function attachSearchListener(data) {

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    // on filtre les maillots dont le nom ou le club correspond à la recherche
    const filtered = data.filter(jersey => {
      return jersey.name.toLowerCase().includes(query) ||
             jersey.club.toLowerCase().includes(query);
    });

    // on vide la grille et on la remplit avec les résultats filtrés
    container.innerHTML = "";

    filtered.forEach(jersey => {
      const tagHTML = jersey.isNew ? '<span class="tag">NEW</span>' : '';
      const card = `
        <div class="card"
             data-item="${jersey.id}"
             data-sold="${jersey.sold}"
             data-crumb="${jersey.crumb}">
          <div class="card-img">
            <img src="${jersey.image}" alt="${jersey.alt}" />
            ${tagHTML}
          </div>
          <div class="card-info">
            <p class="club">${jersey.club}</p>
            <p class="name">${jersey.name}</p>
            <div class="card-row">
              <span class="price">US$ ${jersey.price.toFixed(2)}</span>
              <button class="add-btn"><i class="fas fa-plus"></i></button>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });

    attachCardListeners();
  });
}


// MODAL 
// J'ai utilisé l'IA pour générer la logique de calcul du prix en temps réel
// je comprenais pas bien comment récupérer le bouton "active" dynamiquement

const modal = document.getElementById("modal");
let currentBasePrice = basePrice;

function refreshPrice() {
  const sizeExtra    = parseFloat(document.querySelector(".size-row .opt-btn.active").dataset.extra);
  const sponsorExtra = parseFloat(document.querySelector(".sponsor-row .opt-btn.active").dataset.extra);
  const badgeExtra   = parseFloat(document.querySelector(".badge-row .opt-btn.active").dataset.extra);
  const total = currentBasePrice + sizeExtra + sponsorExtra + badgeExtra;
  document.getElementById("modalPrice").textContent = "US$ " + total.toFixed(2);
}

function openModal(card) {
  document.getElementById("modalImg").src          = card.querySelector(".card-img img").src;
  document.getElementById("modalName").textContent  = card.querySelector(".name").textContent;
  document.getElementById("modalCrumb").textContent = "Home > " + card.dataset.crumb;
  document.getElementById("modalMeta").textContent  = "Item " + card.dataset.item + " · ✔ Sold (" + card.dataset.sold + ")";
  currentBasePrice = parseFloat(card.querySelector(".price").textContent.replace("US$ ", ""));

  // reset des options à chaque ouverture
  [".size-row", ".sponsor-row", ".badge-row"].forEach(sel => {
    document.querySelectorAll(sel + " .opt-btn").forEach((btn, i) => {
      btn.classList.toggle("active", i === 2);
    });
  });

  refreshPrice();
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

// branche les clics sur les options de la modal (taille, patch, badge)
document.querySelectorAll(".opt-row").forEach(row => {
  row.querySelectorAll(".opt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      row.querySelectorAll(".opt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      refreshPrice();
    });
  });
});

document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

document.getElementById("modalAdd").addEventListener("click", () => {
  cartCount++;
  cartCountEl.textContent = cartCount;
  closeModal();
});


//ÉVÉNEMENTS SUR LES CARTES 
// cette fonction est appelée après chaque génération de cartes
// parce que les nouvelles cartes n'ont pas encore d'événements branchés

function attachCardListeners() {
  document.querySelectorAll(".card").forEach(card => {

    // clic sur la carte → ouvre la modal
    card.addEventListener("click", e => {
      if (e.target.closest(".add-btn")) return; // on ignore si c'est le bouton +
      openModal(card);
    });

    // clic sur le + → ajoute directement au panier
    card.querySelector(".add-btn").addEventListener("click", () => {
      cartCount++;
      cartCountEl.textContent = cartCount;
    });

  });
}
