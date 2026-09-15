/* ============================================================
   FIREBASE INIT
   Remplace les valeurs ci-dessous par la config de TON projet
   Firebase (Console Firebase > Paramètres du projet > Tes apps
   > SDK setup and configuration > Config).
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAOBcdCdNAaPbjK3AryLhkUjORsH3Z0FA0",
  authDomain: "mon-portfolio-finance.firebaseapp.com",
  projectId: "mon-portfolio-finance",
  storageBucket: "mon-portfolio-finance.firebasestorage.app",
  messagingSenderId: "816253516121",
  appId: "1:816253516121:web:18414e6af1e70ae10e7448"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

/* Email autorisé à se connecter au panel admin.
   Remplace par ton adresse. */
const ADMIN_EMAIL = "stellayathe@gmail.com";
