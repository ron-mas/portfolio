const PASSWORD = "portfolio"; // TODO: change this password

const passwordScreen = document.getElementById("password-screen");
const site = document.getElementById("site");
const form = document.getElementById("password-form");
const input = document.getElementById("password");
const error = document.getElementById("password-error");

if (sessionStorage.getItem("portfolio-auth") === "ok") {
  unlock();
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value === PASSWORD) {
    sessionStorage.setItem("portfolio-auth", "ok");
    unlock();
  } else {
    error.textContent = "パスワードが正しくありません。";
  }
});

function unlock() {
  document.body.classList.remove("locked");
  passwordScreen.hidden = true;
  site.hidden = false;
  renderWorks();
}

function renderWorks() {
  const grid = document.getElementById("works-grid");

  if (!grid) return;

  let category = "all";
  let order = "new";

  function update() {
    let items = [...WORKS_DATA];

    if (category !== "all") {
      items = items.filter(w => w.category.includes(category));
    }

    items.sort((a, b) =>
      order === "new"
        ? b.year - a.year
        : a.year - b.year
    );

    grid.innerHTML = items.map(w => `
      <a
        class="work-card"
        href="works/work.html?slug=${encodeURIComponent(w.slug)}"
      >
        <div class="thumb">
          <img src="${w.thumbnail}" alt="">
        </div>

        <div class="card-info">
          <h2>${escapeHtml(w.title)}</h2>

          <div class="meta">
            <span class="category-pill">
              ${categoryLabel(w.category[0])}
            </span>

            <span>${escapeHtml(w.yearLabel || w.year)}</span>
          </div>
        </div>
      </a>
    `).join("");
  }

  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter")
        .forEach(x => x.classList.remove("is-active"));

      btn.classList.add("is-active");

      category = btn.dataset.category;

      update();
    });
  });

  document.getElementById("sort")?.addEventListener("change", (e) => {
    order = e.target.value;
    update();
  });

  update();
}

function categoryLabel(c) {
  return {
    illustration: "イラスト",
    advertising: "広告",
    web: "Web",
    goods: "グッズ"
  }[c] || c;
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    m => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m])
  );
}
