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

function formatDate(value) {
  if (!value) return "Atualizado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function createNewsRow(item) {
  const tagClass = categoryColors[item.category] || "";
  return `
    <a class="news-row" href="${item.url}" target="_blank" rel="noreferrer">
      <img src="${item.image}" alt="" loading="lazy" />
      <div>
        <span class="tag ${tagClass}">${item.tag || item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <small>${formatDate(item.publishedAt)} • ${item.source}</small>
      </div>
    </a>
  `;
}

function createStoryCard(item) {
  const tagClass = categoryColors[item.category] || "";
  return `
    <a class="story-card" href="${item.url}" target="_blank" rel="noreferrer">
      <img src="${item.image}" alt="" loading="lazy" />
      <div>
        <span class="tag ${tagClass}">${item.tag || item.category}</span>
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
    const items = Array.isArray(data.items) ? data.items : [];

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

renderLiveContent();
