/* ============================================================
   DATA LAYER
   Toutes les lectures Firestore pour les pages publiques.
   Collections : "travaux" et "biblio".
   Un document n'est visible publiquement que si published == true.
   ============================================================ */

const CATEGORIES = {
  concept: "Concept",
  analyse: "Analyse d'entreprise",
  rapport: "Rapport annuel",
  transaction: "Transaction"
};

async function getTravaux(categoryFilter = null) {
  let query = db.collection("travaux").where("published", "==", true).orderBy("date", "desc");
  const snap = await query.get();
  let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (categoryFilter) items = items.filter(i => i.category === categoryFilter);
  return items;
}

async function getTravailById(id) {
  const doc = await db.collection("travaux").doc(id).get();
  if (!doc.exists || doc.data().published !== true) return null;
  return { id: doc.id, ...doc.data() };
}

async function getBiblio() {
  const snap = await db.collection("biblio").where("published", "==", true).orderBy("order", "asc").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/* Convertit un contenu écrit en Markdown léger (##, **, -, >) en HTML.
   Volontairement simple : pas de dépendance externe. */
function renderMarkdownLite(text) {
  if (!text) return "";
  const lines = text.split("\n");
  let html = "";
  let inList = false;
  for (let raw of lines) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h2>${inlineFormat(line.slice(3))}</h2>`;
    } else if (line.startsWith("### ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h3>${inlineFormat(line.slice(4))}</h3>`;
    } else if (line.startsWith("> ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<blockquote>${inlineFormat(line.slice(2))}</blockquote>`;
    } else if (line.startsWith("- ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inlineFormat(line.slice(2))}</li>`;
    } else if (line === "") {
      if (inList) { html += "</ul>"; inList = false; }
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p>${inlineFormat(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

function inlineFormat(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
