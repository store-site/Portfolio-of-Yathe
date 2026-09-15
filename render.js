/* ============================================================
   RENDER — header / footer partagés + comportements communs
   ============================================================ */

const NAV_ITEMS = [
  { href: "index.html", label: "Accueil" },
  { href: "travaux.html", label: "Travaux" },
  { href: "bibliotheque.html", label: "Bibliothèque" },
  { href: "cv.html", label: "CV" },
  { href: "contact.html", label: "Contact" }
];

function renderHeader(activePage) {
  const links = NAV_ITEMS.map(item => {
    const current = item.href === activePage ? ' aria-current="page"' : "";
    return `<li><a href="${item.href}"${current}>${item.label}</a></li>`;
  }).join("");

  document.getElementById("site-header").innerHTML = `
    <div class="wrap">
      <a class="brand" href="index.html">Stella Yathe<span>.</span></a>
      <nav>
        <ul class="nav-links" id="nav-links">${links}</ul>
      </nav>
      <button class="nav-toggle" id="nav-toggle" aria-label="Menu">MENU</button>
    </div>
  `;

  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.textContent = nav.classList.contains("open") ? "FERMER" : "MENU";
  });
}

function renderFooter() {
  const year = new Date().getFullYear();
  document.getElementById("site-footer").innerHTML = `
    <div class="wrap">
      <span>© ${year} Stella Yathe — Corporate Finance, ICN Business School</span>
      <span class="row">
        <a href="contact.html">Contact</a>
      </span>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";
  renderHeader(page);
  renderFooter();
});
