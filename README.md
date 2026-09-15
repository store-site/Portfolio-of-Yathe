# Portfolio — Stella Yathe

Site statique (HTML/CSS/JS vanilla) + Firebase (Firestore + Auth) pour la partie
admin. Même logique que le site Gency Store : la config Firebase publique
n'est pas un secret, la vraie protection ce sont les règles Firestore.

## 1. Créer le projet Firebase

1. [console.firebase.google.com](https://console.firebase.google.com) → nouveau projet.
2. **Firestore Database** → créer une base, mode production.
3. **Authentication** → onglet Sign-in method → activer **Email/Mot de passe**.
4. **Authentication** → onglet Users → ajouter un utilisateur avec ton email et un mot de passe. C'est le compte que tu utiliseras pour te connecter sur `/admin.html`.
5. Paramètres du projet (⚙️) → tes apps → ajouter une app Web → copier la config.

## 2. Remplacer les valeurs "REMPLACE_MOI"

- `js/firebase-init.js` → coller `firebaseConfig`, et remplacer `ADMIN_EMAIL` par ton email (celui créé à l'étape 4).
- `contact.html` → email, LinkedIn, téléphone.
- `js/admin.js` (tout en bas) → dans le bloc de règles Firestore, remplacer l'email.

## 3. Appliquer les règles de sécurité Firestore

Console Firebase → Firestore Database → onglet **Règles** → coller le bloc de
règles qui se trouve en commentaire tout en bas de `js/admin.js`, en y mettant
ton vrai email. **Sans cette étape, n'importe qui pourrait écrire dans ta
base.** L'écran de connexion seul ne protège rien côté serveur.

## 4. Ajouter ton CV

Place ton CV au format PDF dans `assets/cv.pdf` (le nom doit être exactement
celui-ci, ou alors mets à jour le lien dans `cv.html`).

## 5. Déployer sur GitHub Pages

1. Crée un repo GitHub, pousse ce dossier tel quel (structure conservée).
2. Repo → Settings → Pages → Source : branche `main`, dossier `/root`.
3. Ton site est en ligne à `https://ton-pseudo.github.io/nom-du-repo/`.

## 6. Publier un premier travail

Va sur `/admin.html`, connecte-toi avec ton mot de passe, onglet **Travaux**,
remplis le formulaire et clique sur Publier. Le contenu accepte un Markdown
très simple : `## titre`, `### sous-titre`, `**gras**`, `*italique*`, des
listes avec `- `, des citations avec `> `.

## Arborescence

```
portfolio/
├── index.html          accueil
├── travaux.html         liste des travaux, filtrable par catégorie
├── travail.html          page détail d'un travail (?id=...)
├── bibliotheque.html     ressources étudiées
├── cv.html                parcours + lien de téléchargement
├── contact.html          coordonnées
├── admin.html             panel privé (non lié depuis la nav publique)
├── css/
│   └── style.css          design system complet
├── js/
│   ├── firebase-init.js   config Firebase — à remplir
│   ├── data.js             lectures Firestore + rendu markdown léger
│   ├── render.js           header/footer partagés
│   └── admin.js            auth + CRUD admin
└── assets/
    └── cv.pdf              à ajouter
```
