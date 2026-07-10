/* =========================================================
   app.js
   Coeur de l'application (Layout) :
   - Garde d'authentification
   - Construction du menu (NavigationBar horizontale + Index verticale)
   - Routeur base sur le hash de l'URL
   - Rendu de toutes les pages (Accueil, VoirMonProfile, ModifierCouleur,
     ListeUtilisateurs, DetailsUtilisateur, ModifierUtilisateur,
     AjouterUtilisateur, MesDemandes, GererDemandes)
   ========================================================= */

const API_URL = "https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire";

/* ---------------------------------------------------------
   1. GARDE D'AUTHENTIFICATION
   --------------------------------------------------------- */
let currentUser = JSON.parse(sessionStorage.getItem("user") || "null");

if (!currentUser) {
  window.location.href = "index.html";
}

// Applique la couleur de fond lue depuis le stockage client
function appliquerCouleurFond() {
  document.body.style.backgroundColor = currentUser.couleur || "#f4f6f5";
}
appliquerCouleurFond();

/* ---------------------------------------------------------
   2. HEADER SECTION
   --------------------------------------------------------- */
document.getElementById("userFullName").textContent =
  `${currentUser.prenom || ""} ${currentUser.nom || ""}`.trim();

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
});

/* ---------------------------------------------------------
   3. MENU (NavigationBar + Index)
   --------------------------------------------------------- */
const menuAdmin = [
  { hash: "#accueil", label: "Accueil" },
  { hash: "#profil", label: "Voir Mon Profile" },
  { hash: "#couleur", label: "Modifier Couleur" },
  { hash: "#utilisateurs", label: "Liste Utilisateurs" },
  { hash: "#ajouter", label: "Ajouter Utilisateur" },
  { hash: "#gererdemandes", label: "Gerer Demandes" },
];

const menuVisiteur = [
  { hash: "#accueil", label: "Accueil" },
  { hash: "#profil", label: "Voir Mon Profile" },
  { hash: "#couleur", label: "Modifier Couleur" },
  { hash: "#mesdemandes", label: "Mes Demandes" },
];

function getMenu() {
  return currentUser.admin === true || currentUser.admin === "true"
    ? menuAdmin
    : menuVisiteur;
}

function renderMenus() {
  const menu = getMenu();
  const currentHash = window.location.hash || "#accueil";

  const navBar = document.getElementById("navBarMenu");
  const indexMenu = document.getElementById("indexMenu");
  navBar.innerHTML = "";
  indexMenu.innerHTML = "";

  menu.forEach((item) => {
    const activeClass = currentHash.startsWith(item.hash) ? "active" : "";

    const liNav = document.createElement("li");
    liNav.innerHTML = `<a href="${item.hash}" class="${activeClass}">${item.label}</a>`;
    navBar.appendChild(liNav);

    const liIndex = document.createElement("li");
    liIndex.innerHTML = `<a href="${item.hash}" class="${activeClass}">${item.label}</a>`;
    indexMenu.appendChild(liIndex);
  });
}

/* ---------------------------------------------------------
   4. ROUTEUR
   --------------------------------------------------------- */
const contentSection = document.getElementById("contentSection");

function router() {
  renderMenus();
  const hash = window.location.hash || "#accueil";
  const [route, param1, param2] = hash.replace("#", "").split("/");

  switch (route) {
    case "accueil":
      renderAccueil();
      break;
    case "profil":
      renderProfil();
      break;
    case "couleur":
      renderCouleur();
      break;
    case "utilisateurs":
      if (!isAdmin()) return accesRefuse();
      if (param1 === "details" && param2) renderDetailsUtilisateur(param2);
      else if (param1 === "modifier" && param2) renderModifierUtilisateur(param2);
      else renderListeUtilisateurs();
      break;
    case "ajouter":
      if (!isAdmin()) return accesRefuse();
      renderAjouterUtilisateur();
      break;
    case "mesdemandes":
      if (isAdmin()) return accesRefuse();
      renderMesDemandes();
      break;
    case "gererdemandes":
      if (!isAdmin()) return accesRefuse();
      renderGererDemandes();
      break;
    default:
      renderAccueil();
  }
}

function isAdmin() {
  return currentUser.admin === true || currentUser.admin === "true";
}

function accesRefuse() {
  contentSection.innerHTML = `
    <div class="card">
      <h2>Acces refuse</h2>
      <p>Vous n'avez pas les droits necessaires pour acceder a cette page.</p>
    </div>`;
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);

/* ---------------------------------------------------------
   5. PAGE : ACCUEIL
   --------------------------------------------------------- */
function renderAccueil() {
  contentSection.innerHTML = `
    <div class="card">
      <h2>Bienvenue, ${currentUser.prenom} ${currentUser.nom} !</h2>
      <p>Vous etes connecte(e) en tant que <strong>${
        isAdmin() ? "Administrateur" : "Visiteur"
      }</strong>.</p>
      <p>Utilisez le menu ci-dessus (ou a gauche) pour naviguer dans l'application.</p>
    </div>`;
}

/* ---------------------------------------------------------
   6. PAGE : VOIR MON PROFILE (lecture seule)
   --------------------------------------------------------- */
function renderProfil() {
  const champs = [
    ["Nom", currentUser.nom],
    ["Prenom", currentUser.prenom],
    ["Pseudo", currentUser.pseudo],
    ["Age", currentUser.age],
    ["Email", currentUser.email],
    ["Pays", currentUser.Pays],
    ["Devise", currentUser.Devise],
    ["Couleur", currentUser.couleur],
    ["Administrateur", isAdmin() ? "Oui" : "Non"],
    ["ID", currentUser.id],
  ];

  contentSection.innerHTML = `
    <div class="card">
      <h2>Mon Profil</h2>
      <div class="info-grid">
        ${champs
          .map(
            ([label, value]) => `
          <div class="info-item">
            <div class="label">${label}</div>
            <div class="value">${value ?? "-"}</div>
          </div>`
          )
          .join("")}
      </div>
    </div>`;
}

/* ---------------------------------------------------------
   7. PAGE : MODIFIER COULEUR
   --------------------------------------------------------- */
function renderCouleur() {
  const age = Number(currentUser.age);

  if (!isAdmin() && age < 15) {
    contentSection.innerHTML = `
      <div class="card">
        <h2>Modifier ma couleur</h2>
        <div class="message-box">
          Vous devez avoir au moins 15 ans pour modifier votre couleur preferee.
        </div>
      </div>`;
    return;
  }

  const couleurs = ["red", "blue", "green", "maroon", "black", "orange", "purple", "pink", "yellow"];

  contentSection.innerHTML = `
    <div class="card">
      <h2>Modifier ma couleur</h2>
      <p>Couleur actuelle : <strong>${currentUser.couleur}</strong></p>
      <div class="field" style="max-width:260px;">
        <label for="selectCouleur">Nouvelle couleur</label>
        <select id="selectCouleur">
          ${couleurs
            .map(
              (c) =>
                `<option value="${c}" ${c === currentUser.couleur ? "selected" : ""}>${c}</option>`
            )
            .join("")}
        </select>
      </div>
      <button class="btn-sm btn-add" id="validerCouleurBtn">Valider</button>
      <div id="couleurMsg" style="margin-top:12px;"></div>
    </div>`;

  document.getElementById("validerCouleurBtn").addEventListener("click", () => {
    const nouvelleCouleur = document.getElementById("selectCouleur").value;
    const msgDiv = document.getElementById("couleurMsg");

    fetch(`${API_URL}/${currentUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...currentUser, couleur: nouvelleCouleur }),
    })
      .then((res) => res.json())
      .then((updated) => {
        currentUser.couleur = nouvelleCouleur;
        sessionStorage.setItem("user", JSON.stringify(currentUser));
        appliquerCouleurFond();
        msgDiv.innerHTML = `<div class="message-box">Couleur mise a jour avec succes !</div>`;
      })
      .catch((err) => {
        msgDiv.innerHTML = `<div class="message-box">Erreur lors de la mise a jour.</div>`;
        console.error(err);
      });
  });
}

/* ---------------------------------------------------------
   8. PAGE : LISTE UTILISATEURS (Admin uniquement) - CRUD
   --------------------------------------------------------- */
function renderListeUtilisateurs() {
  contentSection.innerHTML = `
    <div class="card">
      <h2>Liste des Utilisateurs</h2>
      <div id="listeContainer">Chargement...</div>
    </div>`;

  fetch(API_URL)
    .then((res) => res.json())
    .then((users) => {
      const rows = users
        .map(
          (u) => `
        <tr>
          <td>${u.id}</td>
          <td>${u.nom}</td>
          <td>${u.prenom}</td>
          <td>${u.pseudo}</td>
          <td>${u.admin === true || u.admin === "true" ? "Oui" : "Non"}</td>
          <td class="action-icons">
            <a href="#utilisateurs/details/${u.id}" class="view" title="Voir">&#128065;</a>
            <a href="#utilisateurs/modifier/${u.id}" class="edit" title="Modifier">&#9998;</a>
            <button class="delete" title="Supprimer" onclick="supprimerUtilisateur('${u.id}')">&#128465;</button>
          </td>
        </tr>`
        )
        .join("");

      document.getElementById("listeContainer").innerHTML = `
        <table class="data-table">
          <thead>
            <tr><th>ID</th><th>Nom</th><th>Prenom</th><th>Pseudo</th><th>Admin</th><th>Actions</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`;
    })
    .catch((err) => {
      document.getElementById("listeContainer").innerHTML =
        "Erreur lors du chargement de la liste.";
      console.error(err);
    });
}

function supprimerUtilisateur(id) {
  if (!confirm("Confirmer la suppression de cet utilisateur ?")) return;

  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(() => renderListeUtilisateurs())
    .catch((err) => console.error(err));
}

/* ---------------------------------------------------------
   9. PAGE : DETAILS UTILISATEUR
   --------------------------------------------------------- */
function renderDetailsUtilisateur(id) {
  contentSection.innerHTML = `
    <div class="card">
      <h2>Details Utilisateur</h2>
      <div id="detailsContainer">Chargement...</div>
      <button class="btn-sm btn-back" style="margin-top:16px;" onclick="window.location.hash='#utilisateurs'">Retour</button>
    </div>`;

  fetch(`${API_URL}/${id}`)
    .then((res) => res.json())
    .then((u) => {
      const champs = [
        ["Nom", u.nom],
        ["Prenom", u.prenom],
        ["Pseudo", u.pseudo],
        ["Age", u.age],
        ["Email", u.email],
        ["Pays", u.Pays],
        ["Devise", u.Devise],
        ["Couleur", u.couleur],
        ["Admin", u.admin === true || u.admin === "true" ? "Oui" : "Non"],
        ["ID", u.id],
      ];

      document.getElementById("detailsContainer").innerHTML = `
        <div class="info-grid">
          ${champs
            .map(
              ([label, value]) => `
            <div class="info-item">
              <div class="label">${label}</div>
              <div class="value">${value ?? "-"}</div>
            </div>`
            )
            .join("")}
        </div>`;
    })
    .catch((err) => {
      document.getElementById("detailsContainer").innerHTML =
        "Erreur lors du chargement des details.";
      console.error(err);
    });
}

/* ---------------------------------------------------------
   10. PAGE : MODIFIER UTILISATEUR
   --------------------------------------------------------- */
function renderModifierUtilisateur(id) {
  contentSection.innerHTML = `
    <div class="card">
      <h2>Modifier Utilisateur</h2>
      <div id="formContainer">Chargement...</div>
    </div>`;

  fetch(`${API_URL}/${id}`)
    .then((res) => res.json())
    .then((u) => {
      document.getElementById("formContainer").innerHTML = `
        <form id="editForm">
          <div class="field-row">
            <div class="field"><label>Nom</label><input type="text" id="editNom" value="${u.nom || ""}" required></div>
            <div class="field"><label>Prenom</label><input type="text" id="editPrenom" value="${u.prenom || ""}" required></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Pseudo</label><input type="text" id="editPseudo" value="${u.pseudo || ""}" required></div>
            <div class="field"><label>Age</label><input type="number" id="editAge" value="${u.age || ""}" required></div>
          </div>
          <div class="field-row">
            <div class="field"><label>Email</label><input type="email" id="editEmail" value="${u.email || ""}" required></div>
            <div class="field"><label>Pays</label><input type="text" id="editPays" value="${u.Pays || ""}" required></div>
          </div>
          <div class="checkbox-field" style="color:var(--text-dark);">
            <input type="checkbox" id="editAdmin" ${u.admin === true || u.admin === "true" ? "checked" : ""}>
            <label for="editAdmin">Administrateur</label>
          </div>
          <button type="submit" class="btn-sm btn-edit">Enregistrer</button>
          <button type="button" class="btn-sm btn-back" onclick="window.location.hash='#utilisateurs'">Annuler</button>
          <div id="editMsg" style="margin-top:12px;"></div>
        </form>`;

      document.getElementById("editForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const maj = {
          ...u,
          nom: document.getElementById("editNom").value,
          prenom: document.getElementById("editPrenom").value,
          pseudo: document.getElementById("editPseudo").value,
          age: document.getElementById("editAge").value,
          email: document.getElementById("editEmail").value,
          Pays: document.getElementById("editPays").value,
          admin: document.getElementById("editAdmin").checked,
        };

        fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(maj),
        })
          .then((res) => res.json())
          .then(() => {
            window.location.hash = "#utilisateurs";
          })
          .catch((err) => {
            document.getElementById("editMsg").innerHTML =
              "Erreur lors de la mise a jour.";
            console.error(err);
          });
      });
    })
    .catch((err) => {
      document.getElementById("formContainer").innerHTML =
        "Erreur lors du chargement de l'utilisateur.";
      console.error(err);
    });
}

/* ---------------------------------------------------------
   11. PAGE : AJOUTER UTILISATEUR
   --------------------------------------------------------- */
function renderAjouterUtilisateur() {
  contentSection.innerHTML = `
    <div class="card">
      <h2>Ajouter un Utilisateur</h2>
      <form id="addForm">
        <div class="field-row">
          <div class="field"><label>Nom</label><input type="text" id="addNom" required></div>
          <div class="field"><label>Prenom</label><input type="text" id="addPrenom" required></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Pseudo</label><input type="text" id="addPseudo" required></div>
          <div class="field"><label>Age</label><input type="number" id="addAge" required></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Email</label><input type="email" id="addEmail" required></div>
          <div class="field"><label>Mot de passe</label><input type="password" id="addMdp" required></div>
        </div>
        <div class="checkbox-field" style="color:var(--text-dark);">
          <input type="checkbox" id="addAdmin">
          <label for="addAdmin">Administrateur</label>
        </div>
        <button type="submit" class="btn-sm btn-add">Ajouter</button>
        <div id="addMsg" style="margin-top:12px;"></div>
      </form>
    </div>`;

  document.getElementById("addForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const nouvel = {
      nom: document.getElementById("addNom").value,
      prenom: document.getElementById("addPrenom").value,
      pseudo: document.getElementById("addPseudo").value,
      age: document.getElementById("addAge").value,
      email: document.getElementById("addEmail").value,
      MotDePasse: document.getElementById("addMdp").value,
      admin: document.getElementById("addAdmin").checked,
      couleur: "green",
      Devise: "MAD",
      Pays: "Maroc",
      avatar: "",
      photo: "",
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nouvel),
    })
      .then((res) => res.json())
      .then(() => {
        window.location.hash = "#utilisateurs";
      })
      .catch((err) => {
        document.getElementById("addMsg").innerHTML =
          "Erreur lors de l'ajout de l'utilisateur.";
        console.error(err);
      });
  });
}

/* ---------------------------------------------------------
   12. DEMANDES (stockees en localStorage - partagees)
   --------------------------------------------------------- */
function getDemandes() {
  return JSON.parse(localStorage.getItem("demandes") || "[]");
}
function saveDemandes(demandes) {
  localStorage.setItem("demandes", JSON.stringify(demandes));
}

function badgeStatut(etat) {
  const labels = { attente: "En attente", approuvee: "Approuvee", rejetee: "Rejetee" };
  return `<span class="badge-status ${etat}">${labels[etat]}</span>`;
}

/* ----- 12.a MesDemandes (Visiteur) ----- */
function renderMesDemandes() {
  contentSection.innerHTML = `
    <div class="card">
      <h2>Ajouter une demande</h2>
      <form id="demandeForm">
        <div class="field">
          <label>Titre</label>
          <input type="text" id="demandeTitre" required>
        </div>
        <div class="field">
          <label>Description</label>
          <textarea id="demandeDescription" rows="3" required style="width:100%;padding:10px;border-radius:6px;border:1px solid var(--border);"></textarea>
        </div>
        <button type="submit" class="btn-sm btn-add">Envoyer la demande</button>
      </form>
    </div>
    <div class="card">
      <h2>Mes Demandes</h2>
      <div id="mesDemandesListe"></div>
    </div>`;

  document.getElementById("demandeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const titre = document.getElementById("demandeTitre").value.trim();
    const description = document.getElementById("demandeDescription").value.trim();
    if (!titre || !description) return;

    const demandes = getDemandes();
    demandes.push({
      id: Date.now().toString(),
      titre,
      description,
      auteurId: currentUser.id,
      auteurNom: `${currentUser.prenom} ${currentUser.nom}`,
      etat: "attente",
    });
    saveDemandes(demandes);
    renderMesDemandes();
  });

  afficherMesDemandes();
}

function afficherMesDemandes() {
  const mesDemandes = getDemandes().filter((d) => d.auteurId === currentUser.id);
  const container = document.getElementById("mesDemandesListe");

  if (mesDemandes.length === 0) {
    container.innerHTML = "<p>Vous n'avez encore soumis aucune demande.</p>";
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead><tr><th>Titre</th><th>Description</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>
        ${mesDemandes
          .map(
            (d) => `
          <tr>
            <td>${d.titre}</td>
            <td>${d.description}</td>
            <td>${badgeStatut(d.etat)}</td>
            <td>
              ${
                d.etat === "attente"
                  ? `<button class="btn-sm btn-cancel" onclick="annulerDemande('${d.id}')">Annuler</button>`
                  : "-"
              }
            </td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}

function annulerDemande(id) {
  const demandes = getDemandes().filter((d) => d.id !== id);
  saveDemandes(demandes);
  afficherMesDemandes();
}

/* ----- 12.b GererDemandes (Admin) ----- */
function renderGererDemandes() {
  contentSection.innerHTML = `
    <div class="card">
      <h2>Gerer les Demandes</h2>
      <div id="gererDemandesListe"></div>
    </div>`;
  afficherGererDemandes();
}

function afficherGererDemandes() {
  const demandes = getDemandes();
  const container = document.getElementById("gererDemandesListe");

  if (demandes.length === 0) {
    container.innerHTML = "<p>Aucune demande n'a ete soumise pour le moment.</p>";
    return;
  }

  container.innerHTML = `
    <table class="data-table">
      <thead><tr><th>Auteur</th><th>Titre</th><th>Description</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>
        ${demandes
          .map(
            (d) => `
          <tr>
            <td>${d.auteurNom}</td>
            <td>${d.titre}</td>
            <td>${d.description}</td>
            <td>${badgeStatut(d.etat)}</td>
            <td>
              <button class="btn-sm btn-approve" onclick="changerEtatDemande('${d.id}', 'approuvee')">Approuver</button>
              <button class="btn-sm btn-reject" onclick="changerEtatDemande('${d.id}', 'rejetee')">Rejeter</button>
            </td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}

function changerEtatDemande(id, nouvelEtat) {
  const demandes = getDemandes();
  const demande = demandes.find((d) => d.id === id);
  if (demande) demande.etat = nouvelEtat;
  saveDemandes(demandes);
  afficherGererDemandes();
}
