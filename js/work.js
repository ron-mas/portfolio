const params = new URLSearchParams(location.search);
const slug = params.get("slug");

const index = WORKS_DATA.findIndex(
  work => work.slug === slug
);

const work = WORKS_DATA[index];


if (!work) {

  location.href = "../index.html";

} else {

  // --------------------------------
  // 基本情報
  // --------------------------------

  document.title = `${work.title} | Portfolio`;

  const titleElement = document.getElementById("work-title");

titleElement.textContent = work.title;

if (work.title.startsWith("「")) {
  titleElement.classList.add("has-opening-bracket");
}

  const overviewElement =
    document.getElementById("work-overview");


  if (work.overview) {

    overviewElement.textContent =
      work.overview;

  } else {

    overviewElement.remove();

    document
      .querySelector(".work-detail-card")
      ?.classList.add("no-overview");

  }


  document.getElementById("work-category").textContent =
    work.category
      .map(categoryLabel)
      .join(" / ");


  // --------------------------------
  // 作品情報
  // --------------------------------

  document.getElementById("info-year").textContent =
    work.yearLabel || "";

  document.getElementById("info-company").textContent =
    work.company || "";

  document.getElementById("info-tools").textContent =
    work.tools || "";

  document.getElementById("info-areas").textContent =
    work.areas || "";


  // --------------------------------
  // 前後の実績
  // --------------------------------

  // --------------------------------
// 前後の実績
// --------------------------------

function parseSortDate(value) {
  const [year, month] = String(value).split("/").map(Number);
  return year * 12 + month;
}

// 制作日の古い順に並べる
const sortedWorks = [...WORKS_DATA].sort((a, b) => {
  return parseSortDate(a.sortDate) - parseSortDate(b.sortDate);
});

// 現在の作品が制作順で何番目か取得
const sortedIndex = sortedWorks.findIndex(
  item => item.slug === slug
);

function detailUrl(item) {
  return `work.html?slug=${encodeURIComponent(item.slug)}`;
}

function setPager() {

  const prev =
    sortedIndex > 0
      ? sortedWorks[sortedIndex - 1]
      : null;

  const next =
    sortedIndex < sortedWorks.length - 1
      ? sortedWorks[sortedIndex + 1]
      : null;

  setBottom(
    "bottom-prev",
    prev
  );

  setBottom(
    "bottom-next",
    next
  );
}

function setBottom(id, item) {

  const element =
    document.getElementById(id);

  if (!element) return;

  if (!item) {
    element.style.visibility = "hidden";
    return;
  }

  element.href =
    detailUrl(item);

  const strong =
    element.querySelector("strong");

  if (strong) {
    strong.textContent =
      item.title;
  }
}

setPager();


  // --------------------------------
  // 本文読み込み
  // --------------------------------

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

      renderContent(
        data.content || []
      );

    })

    .catch(error => {

      console.error(error);

      const root =
        document.getElementById(
          "work-content"
        );


      if (root) {

        root.innerHTML =
          `<p>本文データを読み込めませんでした。</p>`;

      }

    });


  // --------------------------------
  // 本文表示
  // --------------------------------

  function renderContent(items) {

    const root =
      document.getElementById(
        "work-content"
      );


    if (!root) return;


    root.innerHTML = "";


    items.forEach(item => {


      // 見出し
      if (item.type === "heading") {

        const heading =
          document.createElement(
            "h2"
          );

        heading.textContent =
          item.text;

        root.appendChild(
          heading
        );

      }


      // テキスト
      if (item.type === "text") {

        const paragraph =
          document.createElement(
            "p"
          );

        paragraph.textContent =
          item.text;

        root.appendChild(
          paragraph
        );

      }


      // 画像
      if (item.type === "image") {

        const block =
          document.createElement(
            "figure"
          );

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


        root.appendChild(
          block
        );

      }


      // ギャラリー
      if (item.type === "gallery") {

        const block =
          document.createElement(
            "div"
          );


        const columns =
          item.columns || 3;


        block.className =
          `gallery cols-${columns}`;


        item.images.forEach(src => {

          const wrap =
            document.createElement(
              "div"
            );


          wrap.className =
            "image-wrap sample-overlay";


          wrap.innerHTML = `
            <img
              src="../assets/${slug}/${src}"
              alt=""
            >
          `;


          block.appendChild(
            wrap
          );

        });


        root.appendChild(
          block
        );

      }


      // 動画
      if (item.type === "video") {

        const block =
          document.createElement(
            "figure"
          );


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


        root.appendChild(
          block
        );

      }

    });

  }


  // --------------------------------
  // カテゴリ名
  // --------------------------------

  function categoryLabel(category) {

    return {
      illustration: "イラスト",
      advertising: "広告",
      web: "Web",
      goods: "グッズ"
    }[category] || category;

  }


  // --------------------------------
  // HTMLエスケープ
  // --------------------------------

  function escapeHtml(str) {

    return String(str).replace(
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

}

// ========================================
// Disable image context menu / dragging
// ========================================

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest("img")) {
    event.preventDefault();
  }
});

document.addEventListener("dragstart", (event) => {
  if (event.target.closest("img")) {
    event.preventDefault();
  }
});
