# Mini-Projet JavaScript – M105

Institut Specialise de Technologie Appliquee Hay Salam
Filiere : Developpement Digital – Formateur : Khalid MZIBRA

## Description

Application web JavaScript "vanilla" (HTML/CSS/JS, sans framework) implementant :

- Authentification (Login / CreateAccount) avec l'API mock
  `https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire`
- Stockage du compte connecte dans `sessionStorage`
- Un Layout applicatif (Header / NavigationBar / Index / Content / Footer)
- Deux menus dynamiques selon le role (Admin / Visiteur)
- CRUD complet des utilisateurs (Liste, Details, Modifier, Ajouter, Supprimer)
- Modification de la couleur preferee (avec regle d'age < 15 ans)
- Module de gestion des demandes (creation, annulation, approbation, rejet)

## Structure du projet

```
├── index.html            Page de connexion (Login)
├── createAccount.html    Page de creation de compte
├── layout.html           Application principale (SPA) apres connexion
├── css/
│   └── style.css         Feuille de style unique
├── js/
│   ├── login.js          Logique de la page Login
│   ├── createAccount.js  Logique de la page CreateAccount
│   └── app.js            Layout, routeur (hash) et toutes les pages
└── README.md
```

## Lancer le projet en local

Aucune dependance ni build n'est necessaire : ouvrez simplement `index.html`
dans un navigateur, ou servez le dossier avec un petit serveur local, par exemple :

```bash
npx serve .
# ou
python3 -m http.server 8080
```

Puis ouvrez `http://localhost:8080/index.html`.

## Hebergement sur GitHub / Deploiement

1. Creer un nouveau depot GitHub et y pousser le contenu de ce dossier.
2. Deployer gratuitement avec **GitHub Pages** :
   - Settings > Pages > Source: branche `main`, dossier `/root`.
   - L'application sera accessible via `https://<votre-utilisateur>.github.io/<repo>/index.html`.
3. Alternative : Netlify ou Vercel (glisser-deposer le dossier ou lier le depot GitHub).

## Comptes de test

Utilisez la page **Create an account** pour creer un compte (Admin ou Visiteur),
puis connectez-vous via **Login**. Les donnees sont stockees sur l'API mockapi.io
fournie dans l'enonce.

## Notes d'implementation

- Les demandes (section E) sont stockees dans `localStorage` (cle `demandes`)
  car l'API fournie ne propose pas cette ressource. Elles sont partagees entre
  tous les utilisateurs du meme navigateur, ce qui permet a l'admin de les gerer.
- Le routeur applicatif (`layout.html`) utilise le hash de l'URL (`#accueil`,
  `#profil`, `#couleur`, `#utilisateurs`, `#utilisateurs/details/:id`,
  `#utilisateurs/modifier/:id`, `#ajouter`, `#mesdemandes`, `#gererdemandes`)
  pour simuler des pages separees a l'interieur de la zone "Content Section".
