/* =========================================================
   login.js
   Gere l'authentification de la page Login
   ========================================================= */

const API_URL = "https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire";
const MAX_ATTEMPTS = 3;

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberBox = document.getElementById("rememberMe");
const loginBtn = document.getElementById("loginBtn");
const errorList = document.getElementById("errorList");

let attempts = 0;

// ---- Pre-remplissage si "Se rappeler de moi" a ete coche precedemment ----
window.addEventListener("DOMContentLoaded", () => {
  const remembered = JSON.parse(localStorage.getItem("rememberedUser") || "null");
  if (remembered) {
    usernameInput.value = remembered.username;
    passwordInput.value = remembered.password;
    rememberBox.checked = true;
  }
});

function afficherErreurs(messages) {
  errorList.innerHTML = "";
  messages.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    errorList.appendChild(li);
  });
}

function disableLoginButton() {
  loginBtn.disabled = true;
  loginBtn.textContent = "LOGIN (desactive)";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorList.innerHTML = "";

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // 1. Champs obligatoires
  const erreurs = [];
  if (!username) erreurs.push("Le nom d'utilisateur est obligatoire.");
  if (!password) erreurs.push("Le mot de passe est obligatoire.");

  if (erreurs.length > 0) {
    afficherErreurs(erreurs);
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Verification...";

  // 2. Requete fetch vers l'API pour verifier l'existence du compte
  fetch(API_URL)
    .then((res) => res.json())
    .then((users) => {
      const user = users.find(
        (u) => u.pseudo === username && u.MotDePasse === password
      );

      loginBtn.textContent = "LOGIN";

      if (user) {
        // ---- Authentification reussie ----
        if (rememberBox.checked) {
          localStorage.setItem(
            "rememberedUser",
            JSON.stringify({ username, password })
          );
        } else {
          localStorage.removeItem("rememberedUser");
        }

        // 1. On ajoute l'objet a sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));

        window.location.href = "layout.html";
      } else {
        attempts++;
        afficherErreurs([
          `Nom d'utilisateur ou mot de passe incorrect. (tentative ${attempts}/${MAX_ATTEMPTS})`,
        ]);

        if (attempts >= MAX_ATTEMPTS) {
          disableLoginButton();
          afficherErreurs([
            "Nombre maximum de tentatives atteint. Le bouton LOGIN est desactive.",
          ]);
        } else {
          loginBtn.disabled = false;
        }
      }
    })
    .catch((err) => {
      loginBtn.disabled = false;
      loginBtn.textContent = "LOGIN";
      afficherErreurs([
        "Erreur lors de la connexion au serveur. Veuillez reessayer.",
      ]);
      console.error(err);
    });
});
