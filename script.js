const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
    }
  });
}

const categoryColors = {
  Futebol: "tag--green",
  Games: "tag--blue",
  Vídeos: "tag--blue",
  Social: "tag--pink"
};

const icons = {
  news: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-13Z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  football: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m9.5 9 2.5-1.8L14.5 9l-1 3h-3l-1-3ZM7 14.5l3.5-2.5M17 14.5 13.5 12M12 21v-4M4.5 9.5 8 10M19.5 9.5 16 10"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3V9Z"/></svg>',
  gamepad: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9h10a5 5 0 0 1 4.7 6.7l-.5 1.4a2.6 2.6 0 0 1-4.4.9L15 16H9l-1.8 2a2.6 2.6 0 0 1-4.4-.9l-.5-1.4A5 5 0 0 1 7 9Z"/><path d="M8 12v3M6.5 13.5h3M16.5 13h.01M18.5 15h.01"/></svg>',
  music: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11v3a2 2 0 0 0 2 2h3l8 4V5L8 9H5a2 2 0 0 0-2 2Z"/><path d="M19 9a4 4 0 0 1 0 7"/></svg>',
  spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M17 7.3h.01"/></svg>'
};

const categoryIcons = {
  Futebol: "football",
  Games: "gamepad",
  Vídeos: "play",
  Social: "instagram",
  Música: "music",
  "Sul de Minas": "map",
  "Três Corações": "pin"
};

const categoryImages = {
  Futebol: "./assets/thumb-football.svg",
  Games: "./assets/thumb-games.svg",
  Vídeos: "./assets/thumb-video.svg",
  Social: "./assets/thumb-social.svg",
  Música: "./assets/thumb-social.svg",
  "Sul de Minas": "./assets/thumb-city.svg",
  "Três Corações": "./assets/thumb-city.svg"
};

function icon(name) {
  return `<span class="jr-icon">${icons[name] || icons.news}</span>`;
}

function iconForText(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes("três") || normalized.includes("corações")) return "pin";
  if (normalized.includes("sul")) return "map";
  if (normalized.includes("futebol")) return "football";
  if (normalized.includes("vídeo")) return "play";
  if (normalized.includes("game") || normalized.includes("música")) return "gamepad";
  if (normalized.includes("publi") || normalized.includes("divulgue")) return "megaphone";
  return "news";
}

function enhanceStaticIcons() {
  document.querySelectorAll(".nav a").forEach((link) => {
    if (link.querySelector("svg")) return;
    link.insertAdjacentHTML("afterbegin", icon(iconForText(link.textContent || "")));
  });

  document.querySelectorAll(".quick-access a span").forEach((node) => {
    node.innerHTML = icons[iconForText(node.parentElement?.textContent || "")] || icons.news;
    node.classList.add("jr-icon");
  });

  document.querySelectorAll(".mini-card i").forEach((node) => {
    node.innerHTML = icons[iconForText(node.parentElement?.textContent || "")] || icons.news;
    node.classList.add("jr-icon");
  });
}

function formatDate(value) {
  if (!value) return "Atualizado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function createNewsRow(item) {
  const tagClass = categoryColors[item.category] || "";
  const tagIcon = categoryIcons[item.category] || iconForText(item.tag || item.category || "");
  const image = categoryImages[item.category] || item.image || "./assets/thumb-news.svg";
  return `
    <a class="news-row" href="${item.url}" target="_blank" rel="noreferrer">
      <img src="${image}" alt="" loading="lazy" onerror="this.src='./assets/thumb-news.svg'" />
      <div>
        <span class="tag ${tagClass}">${icon(tagIcon)}${item.tag || item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <small>${formatDate(item.publishedAt)} • ${item.source}</small>
      </div>
    </a>
  `;
}

function createStoryCard(item) {
  const tagClass = categoryColors[item.category] || "";
  const tagIcon = categoryIcons[item.category] || iconForText(item.tag || item.category || "");
  const image = categoryImages[item.category] || item.image || "./assets/thumb-news.svg";
  return `
    <a class="story-card" href="${item.url}" target="_blank" rel="noreferrer">
      <img src="${image}" alt="" loading="lazy" onerror="this.src='./assets/thumb-news.svg'" />
      <div>
        <span class="tag ${tagClass}">${icon(tagIcon)}${item.tag || item.category}</span>
        <h3>${item.title}</h3>
      </div>
    </a>
  `;
}

async function renderLiveContent() {
  const containers = document.querySelectorAll("[data-content-list]");
  if (!containers.length) return;

  try {
    const response = await fetch("./data/content.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    const items = Array.isArray(data.items)
      ? [...data.items].sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0))
      : [];

    containers.forEach((container) => {
      const filter = container.dataset.contentList;
      const layout = container.dataset.contentLayout || "row";
      const limit = Number(container.dataset.contentLimit || 6);
      const filtered = filter === "Todos"
        ? items
        : items.filter((item) => item.category === filter || item.tag === filter);

      container.innerHTML = filtered
        .slice(0, limit)
        .map((item) => layout === "card" ? createStoryCard(item) : createNewsRow(item))
        .join("");
    });

    document.querySelectorAll("[data-updated-at]").forEach((node) => {
      node.textContent = `Atualizado em ${formatDate(data.updatedAt)}`;
    });
  } catch (error) {
    console.warn("Não foi possível carregar o conteúdo automático.", error);
  }
}

enhanceStaticIcons();
renderLiveContent();
