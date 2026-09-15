/* ============================================================
   ADMIN PANEL
   Connexion mot de passe seul (email = ADMIN_EMAIL, défini dans
   firebase-init.js). CRUD sur les collections "travaux" et "biblio".
   Cette page n'est jamais linkée depuis la nav publique : c'est
   la seule "protection" en plus de l'auth Firebase. Les règles de
   sécurité Firestore doivent aussi restreindre l'écriture à
   ADMIN_EMAIL (voir note en bas de fichier).
   ============================================================ */

const loginView = document.getElementById("login-view");
const adminView = document.getElementById("admin-view");

/* ---------- AUTH ---------- */

auth.onAuthStateChanged(user => {
  if (user && user.email === ADMIN_EMAIL) {
    loginView.classList.add("hidden");
    adminView.classList.remove("hidden");
    loadTravauxAdmin();
    loadBiblioAdmin();
  } else {
    loginView.classList.remove("hidden");
    adminView.classList.add("hidden");
    if (user) auth.signOut(); // connecté mais pas le bon compte
  }
});

document.getElementById("login-btn").addEventListener("click", async () => {
  const password = document.getElementById("login-password").value;
  const status = document.getElementById("login-status");
  status.textContent = "";
  try {
    await auth.signInWithEmailAndPassword(ADMIN_EMAIL, password);
  } catch (e) {
    status.textContent = "Mot de passe incorrect.";
    status.className = "status-msg err";
  }
});

document.getElementById("login-password").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("login-btn").click();
});

document.getElementById("logout-btn").addEventListener("click", () => auth.signOut());

/* ---------- TABS ---------- */

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-travaux").classList.toggle("hidden", btn.dataset.tab !== "travaux");
    document.getElementById("tab-biblio").classList.toggle("hidden", btn.dataset.tab !== "biblio");
  });
});

/* ---------- TRAVAUX CRUD ---------- */

function resetTravauxForm() {
  document.getElementById("travaux-id").value = "";
  document.getElementById("travaux-title").value = "";
  document.getElementById("travaux-category").value = "concept";
  document.getElementById("travaux-date").value = new Date().toISOString().slice(0, 10);
  document.getElementById("travaux-excerpt").value = "";
  document.getElementById("travaux-tags").value = "";
  document.getElementById("travaux-content").value = "";
  document.getElementById("travaux-published").checked = true;
  document.getElementById("travaux-form-title").textContent = "Nouveau travail";
  document.getElementById("travaux-status").textContent = "";
}
resetTravauxForm();

document.getElementById("travaux-cancel-btn").addEventListener("click", resetTravauxForm);

document.getElementById("travaux-save-btn").addEventListener("click", async () => {
  const id = document.getElementById("travaux-id").value;
  const status = document.getElementById("travaux-status");
  const data = {
    title: document.getElementById("travaux-title").value.trim(),
    category: document.getElementById("travaux-category").value,
    date: document.getElementById("travaux-date").value,
    excerpt: document.getElementById("travaux-excerpt").value.trim(),
    tags: document.getElementById("travaux-tags").value.split(",").map(t => t.trim()).filter(Boolean),
    content: document.getElementById("travaux-content").value,
    published: document.getElementById("travaux-published").checked
  };

  if (!data.title) {
    status.textContent = "Le titre est obligatoire.";
    status.className = "status-msg err";
    return;
  }

  try {
    if (id) {
      await db.collection("travaux").doc(id).update(data);
    } else {
      await db.collection("travaux").add(data);
    }
    status.textContent = "Enregistré.";
    status.className = "status-msg ok";
    resetTravauxForm();
    loadTravauxAdmin();
  } catch (e) {
    status.textContent = "Erreur d'enregistrement : " + e.message;
    status.className = "status-msg err";
  }
});

async function loadTravauxAdmin() {
  const container = document.getElementById("travaux-list-admin");
  try {
    const snap = await db.collection("travaux").orderBy("date", "desc").get();
    if (snap.empty) {
      container.innerHTML = '<p class="empty-state">Aucun travail créé pour le moment.</p>';
      return;
    }
    container.innerHTML = snap.docs.map(doc => {
      const d = doc.data();
      return `
        <div class="item-row">
          <div>
            <strong>${d.title}</strong>
            <div class="meta">${formatDate(d.date)} · ${CATEGORIES[d.category] || d.category}${d.published ? "" : " · brouillon"}</div>
          </div>
          <div class="actions">
            <button data-edit="${doc.id}">Modifier</button>
            <button data-delete="${doc.id}">Supprimer</button>
          </div>
        </div>
      `;
    }).join("");

    container.querySelectorAll("[data-edit]").forEach(btn => {
      btn.addEventListener("click", () => editTravail(btn.dataset.edit));
    });
    container.querySelectorAll("[data-delete]").forEach(btn => {
      btn.addEventListener("click", () => deleteTravail(btn.dataset.delete));
    });
  } catch (e) {
    container.innerHTML = '<p class="empty-state">Erreur de chargement.</p>';
    console.error(e);
  }
}

async function editTravail(id) {
  const doc = await db.collection("travaux").doc(id).get();
  const d = doc.data();
  document.getElementById("travaux-id").value = id;
  document.getElementById("travaux-title").value = d.title || "";
  document.getElementById("travaux-category").value = d.category || "concept";
  document.getElementById("travaux-date").value = d.date || "";
  document.getElementById("travaux-excerpt").value = d.excerpt || "";
  document.getElementById("travaux-tags").value = (d.tags || []).join(", ");
  document.getElementById("travaux-content").value = d.content || "";
  document.getElementById("travaux-published").checked = d.published !== false;
  document.getElementById("travaux-form-title").textContent = "Modifier — " + d.title;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteTravail(id) {
  if (!confirm("Supprimer ce travail définitivement ?")) return;
  await db.collection("travaux").doc(id).delete();
  loadTravauxAdmin();
}

/* ---------- BIBLIO CRUD ---------- */

function resetBiblioForm() {
  document.getElementById("biblio-id").value = "";
  document.getElementById("biblio-title").value = "";
  document.getElementById("biblio-author").value = "";
  document.getElementById("biblio-progress").value = "";
  document.getElementById("biblio-order").value = "0";
  document.getElementById("biblio-notes").value = "";
  document.getElementById("biblio-published").checked = true;
  document.getElementById("biblio-form-title").textContent = "Nouvelle ressource";
  document.getElementById("biblio-status").textContent = "";
}
resetBiblioForm();

document.getElementById("biblio-cancel-btn").addEventListener("click", resetBiblioForm);

document.getElementById("biblio-save-btn").addEventListener("click", async () => {
  const id = document.getElementById("biblio-id").value;
  const status = document.getElementById("biblio-status");
  const data = {
    title: document.getElementById("biblio-title").value.trim(),
    author: document.getElementById("biblio-author").value.trim(),
    progress: document.getElementById("biblio-progress").value.trim(),
    order: Number(document.getElementById("biblio-order").value) || 0,
    notes: document.getElementById("biblio-notes").value,
    published: document.getElementById("biblio-published").checked
  };

  if (!data.title) {
    status.textContent = "Le titre est obligatoire.";
    status.className = "status-msg err";
    return;
  }

  try {
    if (id) {
      await db.collection("biblio").doc(id).update(data);
    } else {
      await db.collection("biblio").add(data);
    }
    status.textContent = "Enregistré.";
    status.className = "status-msg ok";
    resetBiblioForm();
    loadBiblioAdmin();
  } catch (e) {
    status.textContent = "Erreur d'enregistrement : " + e.message;
    status.className = "status-msg err";
  }
});

async function loadBiblioAdmin() {
  const container = document.getElementById("biblio-list-admin");
  try {
    const snap = await db.collection("biblio").orderBy("order", "asc").get();
    if (snap.empty) {
      container.innerHTML = '<p class="empty-state">Aucune ressource créée pour le moment.</p>';
      return;
    }
    container.innerHTML = snap.docs.map(doc => {
      const d = doc.data();
      return `
        <div class="item-row">
          <div>
            <strong>${d.title}</strong>
            <div class="meta">${d.author || ""}${d.published ? "" : " · brouillon"}</div>
          </div>
          <div class="actions">
            <button data-edit="${doc.id}">Modifier</button>
            <button data-delete="${doc.id}">Supprimer</button>
          </div>
        </div>
      `;
    }).join("");

    container.querySelectorAll("[data-edit]").forEach(btn => {
      btn.addEventListener("click", () => editBiblio(btn.dataset.edit));
    });
    container.querySelectorAll("[data-delete]").forEach(btn => {
      btn.addEventListener("click", () => deleteBiblio(btn.dataset.delete));
    });
  } catch (e) {
    container.innerHTML = '<p class="empty-state">Erreur de chargement.</p>';
    console.error(e);
  }
}

async function editBiblio(id) {
  const doc = await db.collection("biblio").doc(id).get();
  const d = doc.data();
  document.getElementById("biblio-id").value = id;
  document.getElementById("biblio-title").value = d.title || "";
  document.getElementById("biblio-author").value = d.author || "";
  document.getElementById("biblio-progress").value = d.progress || "";
  document.getElementById("biblio-order").value = d.order || 0;
  document.getElementById("biblio-notes").value = d.notes || "";
  document.getElementById("biblio-published").checked = d.published !== false;
  document.getElementById("biblio-form-title").textContent = "Modifier — " + d.title;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteBiblio(id) {
  if (!confirm("Supprimer cette ressource définitivement ?")) return;
  await db.collection("biblio").doc(id).delete();
  loadBiblioAdmin();
}

/* ============================================================
   RÈGLES DE SÉCURITÉ FIRESTORE À CONFIGURER
   (Console Firebase > Firestore Database > Règles)

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /travaux/{doc} {
         allow read: if resource.data.published == true;
         allow write: if request.auth != null && request.auth.token.email == "REMPLACE_MOI@gmail.com";
       }
       match /biblio/{doc} {
         allow read: if resource.data.published == true;
         allow write: if request.auth != null && request.auth.token.email == "REMPLACE_MOI@gmail.com";
       }
     }
   }

   Sans ça, admin.js peut techniquement écrire mais N'IMPORTE QUI
   qui connaît l'URL de ton projet Firebase pourrait aussi écrire
   dans la base sans même se connecter. Ces règles sont ce qui
   protège réellement tes données, pas juste l'écran de connexion.
   ============================================================ */
