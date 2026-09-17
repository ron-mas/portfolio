const params = new URLSearchParams(location.search);
const slug = params.get("slug");

const index = WORKS_DATA.findIndex(w => w.slug === slug);
const work = WORKS_DATA[index];

if (!work) {
  location.href = "../index.html";
} else {

  // ----------------------------
  // 基本情報
  // ----------------------------

  document.title = `${work.title} | Portfolio`;

  document.getElementById("work-title").textContent =
    work.title;

  document.getElementById("work-overview").textContent =
    work.overview || "";

  document.getElementById("work-category").textContent =
    work.category.map(categoryLabel).join(" / ");

  document.getElementById("info-year").textContent =
    work.yearLabel || "";

  document.getElementById("info-company").textContent =
    work.company || "";

  document.getElementById("info-tools").textContent =
    work.tools || "";

  document.getElementById("info-areas").textContent =
    work.areas || "";

  document.getElementById("info-roles").textContent =
    work.roles || "";

  document.getElementById("info-categories").textContent =
    work.category.map(categoryLabel).join("・");


  // ----------------------------
  // もっと見る
  // ----------------------------

  const moreInfoButton =
    document.getElementById("more-info");

  if (moreInfoButton) {
    moreInfoButton.addEventListener("click", () => {
      const card =
        document.querySelector(".info-card");

      if (!card) return;

      card.classList.toggle("is-open");

      moreInfoButton.innerHTML =
        card.classList.contains("is-open")
          ? "閉じる ↑"
          : "もっと見る ↓";
    });
  }


  // ----------------------------
  // 前後の実績
  // ----------------------------

  function detailUrl(i) {
    return `work.html?slug=${encodeURIComponent(
      WORKS_DATA[i].slug
    )}`;
  }

  function setPager() {
    const prev =
      index > 0
        ? WORKS_DATA[index - 1]
        : null;

    const next =
      index < WORKS_DATA.length - 1
        ? WORKS_DATA[index + 1]
        : null;

    setLink(
      "prev-link",
      prev ? detailUrl(index - 1) : null
    );

    setLink(
      "next-link",
      next ? detailUrl(index + 1) : null
    );

    setBottom(
      "bottom-prev",
      prev,
      index - 1
    );

    setBottom(
      "bottom-next",
      next,
      index + 1
    );
  }

  function setLink(id, href) {
    const el =
      document.getElementById(id);

    if (!el) return;

    if (!href) {
      el.style.visibility = "hidden";
      return;
    }

    el.href = href;
  }

  function setBottom(id, item, i) {
    const el =
      document.getElementById(id);

    if (!el) return;

    if (!item) {
      el.style.visibility = "hidden";
      return;
    }

    el.href = detailUrl(i);

    const strong =
      el.querySelector("strong");

    if (strong) {
      strong.textContent =
        item.title;
    }
  }

  setPager();


  // ----------------------------
  // 本文データ読み込み
  // ----------------------------

  fetch(`./${slug}/content.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(
          `content.json の読み込みに失敗しました: ${response.status}`
        );
      }

      return response.json();
    })
    .then(data => {
      renderContent(data.content || []);
    })
    .catch(error => {
      console.error(error);

      const root =
        document.getElementById("work-content");

      if (root) {
        root.innerHTML =
          `<p>本文データを読み込めませんでした。</p>`;
      }
    });


  // ----------------------------
  // 本文表示
  // ----------------------------

  function renderContent(items) {
    const root =
      document.getElementById("work-content");

    if (!root) return;

    root.innerHTML = "";

    items.forEach(item => {

      // --------------------------
      // 見出し
      // --------------------------

      if (item.type === "heading") {
        const h =
          document.createElement("h2");

        h.textContent =
          item.text;

        root.appendChild(h);
      }


      // --------------------------
      // テキスト
      // --------------------------

      if (item.type === "text") {
        const p =
          document.createElement("p");

        p.textContent =
          item.text;

        root.appendChild(p);
      }


      // --------------------------
      // 画像
      // --------------------------

      if (item.type === "image") {
        const block =
          document.createElement("figure");

        block.className =
          "content-image";

        const imageClass =
          item.sample === false
            ? "image-wrap"
            : "image-wrap sample-overlay";

        block.innerHTML = `
          <div class="${imageClass}">
            <img
              src="../assets/${slug}/${item.src}"
              alt=""
            >
          </div>

          ${
            item.caption
              ? `
                <figcaption class="caption">
                  ${escapeHtml(item.caption)}
                </figcaption>
              `
              : ""
          }
        `;

        root.appendChild(block);
      }


      // --------------------------
      // ギャラリー
      // --------------------------

      if (item.type === "gallery") {
        const block =
          document.createElement("div");

        const cols =
          item.columns || 3;

        block.className =
          `gallery cols-${cols}`;

        item.images.forEach(src => {

          const wrap =
            document.createElement("div");

          wrap.className =
            "image-wrap sample-overlay";

          wrap.innerHTML = `
            <img
              src="../assets/${slug}/${src}"
              alt=""
            >
          `;

          block.appendChild(wrap);
        });

        root.appendChild(block);
      }


      // --------------------------
      // 動画
      // --------------------------

      if (item.type === "video") {
        const block =
          document.createElement("figure");

        block.className =
          "content-video";

        const videoClass =
          item.sample === false
            ? "video-wrap"
            : "video-wrap sample-overlay";

        block.innerHTML = `
          <div class="${videoClass}">
            <video
              controls
              playsinline
              preload="metadata"
            >
              <source
                src="../assets/${slug}/${item.src}"
                type="video/mp4"
              >
            </video>
          </div>

          ${
            item.caption
              ? `
                <figcaption class="caption">
                  ${escapeHtml(item.caption)}
                </figcaption>
              `
              : ""
          }
        `;

        root.appendChild(block);
      }

    });
  }


  // ----------------------------
  // カテゴリ名
  // ----------------------------

  function categoryLabel(c) {
    return {
      illustration: "イラスト",
      advertising: "広告",
      web: "Web",
      goods: "グッズ"
    }[c] || c;
  }


  // ----------------------------
  // HTMLエスケープ
  // ----------------------------

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

}
