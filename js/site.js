const PASSWORD = "1201";

const passwordScreen = document.getElementById("password-screen");
const site = document.getElementById("site");
const form = document.getElementById("password-form");
const input = document.getElementById("password");
const error = document.getElementById("password-error");


// ========================================
// Password
// ========================================

if (sessionStorage.getItem("portfolio-auth") === "ok") {
  unlock();
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (input.value === PASSWORD) {
    sessionStorage.setItem("portfolio-auth", "ok");
    unlock();
  } else {
    error.textContent = "パスワードが正しくありません。";
  }
});


function unlock() {
  document.body.classList.remove("locked");

  if (passwordScreen) {
    passwordScreen.hidden = true;
  }

  if (site) {
    site.hidden = false;
  }

  renderWorks();
}


// ========================================
// Works
// ========================================

function renderWorks() {
  const grid = document.getElementById("works-grid");

  if (!grid || !Array.isArray(WORKS_DATA)) {
    return;
  }

  let category = "all";
  let order = "new";


  function update() {
    let items = [...WORKS_DATA];


    // --------------------------------
    // Category filter
    // --------------------------------

    if (category !== "all") {
      items = items.filter(
        work => work.category.includes(category)
      );
    }


    // --------------------------------
    // Sort
    // --------------------------------

    items.sort((a, b) => {

      const dateA = a.sortDate || "";
      const dateB = b.sortDate || "";

      if (order === "new") {
        return dateB.localeCompare(dateA);
      }

      return dateA.localeCompare(dateB);
    });


    // --------------------------------
    // Render
    // --------------------------------

    grid.innerHTML = items.map(work => `
      <a
        class="work-card"
        href="works/work.html?slug=${encodeURIComponent(work.slug)}"
      >

        <div class="thumb">
          <img
            src="${work.thumbnail}"
            alt=""
          >
        </div>

        <div class="card-info">
          <h2>
            ${escapeHtml(work.title)}
          </h2>
        </div>

      </a>
    `).join("");
  }


  // --------------------------------
  // Category buttons
  // --------------------------------

  document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".filter")
        .forEach(item => {
          item.classList.remove("is-active");
        });

      button.classList.add("is-active");

      category =
        button.dataset.category || "all";

      update();
    });

  });


  // --------------------------------
  // Sort
  // --------------------------------

  document
    .getElementById("sort")
    ?.addEventListener("change", event => {

      order = event.target.value;

      update();

    });


  update();
}


// ========================================
// Category label
// ========================================

function categoryLabel(category) {

  return {
    illustration: "イラスト",
    advertising: "広告",
    web: "Web",
    goods: "グッズ"
  }[category] || category;

}


// ========================================
// Escape HTML
// ========================================

function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character])
  );

}
