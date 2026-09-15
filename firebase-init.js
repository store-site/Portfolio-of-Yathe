/* ============================================================
   FIREBASE INIT
   Remplace les valeurs ci-dessous par la config de TON projet
   Firebase (Console Firebase > Paramètres du projet > Tes apps
   > SDK setup and configuration > Config).
   C'est la même logique que pour le site Gency Store : cette
   config est publique par design, ce n'est pas un secret.
   ============================================================ */

const firebaseConfig = {
  apiKey: "REMPLACE_MOI",
  authDomain: "REMPLACE_MOI.firebaseapp.com",
  projectId: "REMPLACE_MOI",
  storageBucket: "REMPLACE_MOI.appspot.com",
  messagingSenderId: "REMPLACE_MOI",
  appId: "REMPLACE_MOI"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

/* Email autorisé à se connecter au panel admin.
   Remplace par ton adresse. */
const ADMIN_EMAIL = "REMPLACE_MOI@gmail.com";
