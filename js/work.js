const params = new URLSearchParams(location.search);
const slug = params.get("slug");
const index = WORKS_DATA.findIndex(w => w.slug === slug);
const work = WORKS_DATA[index];

if (!work) {
  location.href = "../../index.html";
}

document.title = `${work.title} | Portfolio`;
document.getElementById("work-title").textContent = work.title;
document.getElementById("work-overview").textContent = work.overview;
document.getElementById("work-category").textContent = work.category.map(categoryLabel).join(" / ");

document.getElementById("info-year").textContent = work.yearLabel;
document.getElementById("info-company").textContent = work.company;
document.getElementById("info-tools").textContent = work.tools;
document.getElementById("info-areas").textContent = work.areas;
document.getElementById("info-roles").textContent = work.roles;
document.getElementById("info-categories").textContent = work.category.map(categoryLabel).join("・");

document.getElementById("more-info").addEventListener("click", () => {
  const card = document.querySelector(".info-card");
  const button = document.getElementById("more-info");
  card.classList.toggle("is-open");
  button.innerHTML = card.classList.contains("is-open") ? "閉じる ↑" : "もっと見る ↓";
});

function detailUrl(i) {
  return `work.html?slug=${encodeURIComponent(WORKS_DATA[i].slug)}`;
}

function setPager() {
  const prev = index > 0 ? WORKS_DATA[index - 1] : null;
  const next = index < WORKS_DATA.length - 1 ? WORKS_DATA[index + 1] : null;

  setLink("prev-link", prev ? detailUrl(index - 1) : null);
  setLink("next-link", next ? detailUrl(index + 1) : null);
  setBottom("bottom-prev", prev, index - 1);
  setBottom("bottom-next", next, index + 1);
}
function setLink(id, href) {
  const el = document.getElementById(id);
  if (!href) { el.style.visibility = "hidden"; return; }
  el.href = href;
}
function setBottom(id, item, i) {
  const el = document.getElementById(id);
  if (!item) { el.style.visibility = "hidden"; return; }
  el.href = detailUrl(i);
    el.querySelector("strong").textContent = item.title;
}
setPager();

fetch(`../${slug}/content.json`)
  .then(r => r.json())
  .then(data => renderContent(data.content))
  .catch(() => {
    document.getElementById("work-content").innerHTML = `<p>本文データを読み込めませんでした。</p>`;
  });

function renderContent(items) {
  const root = document.getElementById("work-content");
  items.forEach(item => {
    if (item.type === "heading") {
      const h = document.createElement("h2");
      h.textContent = item.text;
      root.appendChild(h);
    }
    if (item.type === "text") {
      const p = document.createElement("p");
      p.textContent = item.text;
      root.appendChild(p);
    }
    if (item.type === "image") {
      const block = document.createElement("figure");
      block.className = "content-image";
      block.innerHTML = `<div class="image-wrap ${item.sample === false ? "" : "sample-overlay"}"><img src="../assets/${slug}/${item.src}" alt=""></div>${item.caption ? `<figcaption class="caption">${escapeHtml(item.caption)}</figcaption>` : ""}`;
      root.appendChild(block);
    }
    if (item.type === "gallery") {
      const block = document.createElement("div");
      const cols = item.columns || 3;
      block.className = `gallery cols-${cols}`;
      item.images.forEach(src => {
        const wrap = document.createElement("div");
        wrap.className = "image-wrap sample-overlay";
          wrap.innerHTML = `<img src="../assets/${slug}/${src}" alt="">`;
        block.appendChild(wrap);
      });
      root.appendChild(block);
    }
  });
}
function categoryLabel(c) {
  return {illustration:"イラスト", advertising:"広告", web:"Web", goods:"グッズ"}[c] || c;
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
