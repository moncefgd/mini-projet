/* =========================================================
   createAccount.js
   Gere la creation d'un nouveau compte utilisateur
   ========================================================= */

const API_URL = "https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire";

const form = document.getElementById("createAccountForm");
const errorList = document.getElementById("errorList");
const createBtn = document.getElementById("createBtn");

function afficherErreurs(messages) {
  errorList.innerHTML = "";
  messages.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    errorList.appendChild(li);
  });
}

function motDePasseValide(mdp) {
  // >= 8 caracteres, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractere special
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(mdp);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const erreurs = [];

  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const age = document.getElementById("age").value.trim();
  const pseudo = document.getElementById("pseudo").value.trim();
  const email = document.getElementById("email").value.trim();
  const couleur = document.getElementById("couleur").value;
  const pays = document.getElementById("pays").value.trim();
  const devise = document.getElementById("devise").value.trim();
  const avatar = document.getElementById("avatar").value.trim();
  const photo = document.getElementById("photo").value.trim();
  const admin = document.getElementById("admin").checked;
  const motDePasse = document.getElementById("motDePasse").value;
  const confirmMotDePasse = document.getElementById("confirmMotDePasse").value;

  // 1. Tous les champs sont obligatoires
  if (!nom) erreurs.push("Le nom est obligatoire.");
  if (!prenom) erreurs.push("Le prenom est obligatoire.");
  if (!age) erreurs.push("L'age est obligatoire.");
  if (!pseudo) erreurs.push("Le pseudo est obligatoire.");
  if (!email) erreurs.push("L'email est obligatoire.");
  if (!couleur) erreurs.push("La couleur preferee est obligatoire.");
  if (!pays) erreurs.push("Le pays est obligatoire.");
  if (!devise) erreurs.push("La devise est obligatoire.");
  if (!avatar) erreurs.push("L'avatar est obligatoire.");
  if (!photo) erreurs.push("La photo est obligatoire.");
  if (!motDePasse) erreurs.push("Le mot de passe est obligatoire.");
  if (!confirmMotDePasse) erreurs.push("La confirmation du mot de passe est obligatoire.");

  // 2. Regles du mot de passe
  if (motDePasse && !motDePasseValide(motDePasse)) {
    erreurs.push(
      "Le mot de passe doit contenir au moins 8 caracteres, une majuscule, une minuscule, un chiffre et un caractere special."
    );
  }

  // 3. Confirmation du mot de passe
  if (motDePasse && confirmMotDePasse && motDePasse !== confirmMotDePasse) {
    erreurs.push("Les mots de passe ne correspondent pas.");
  }

  if (erreurs.length > 0) {
    afficherErreurs(erreurs);
    return;
  }

  const nouvelUtilisateur = {
    nom,
    age,
    admin,
    MotDePasse: motDePasse,
    pseudo,
    prenom,
    couleur,
    Devise: devise,
    Pays: pays,
    avatar,
    email,
    photo,
  };

  createBtn.disabled = true;
  createBtn.textContent = "Creation en cours...";

  // 4. Requete fetch POST vers l'API
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nouvelUtilisateur),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Echec de la creation du compte.");
      return res.json();
    })
    .then(() => {
      // 5. Succes -> redirection vers la page d'authentification
      window.location.href = "index.html";
    })
    .catch((err) => {
      createBtn.disabled = false;
      createBtn.textContent = "CREER LE COMPTE";
      afficherErreurs([
        "Une erreur est survenue lors de la creation du compte. Veuillez reessayer.",
      ]);
      console.error(err);
    });
});
