import { writeFile, readFile } from "node:fs/promises";

const now = new Date();
const today = now.toISOString().slice(0, 10);

const fallback = JSON.parse(await readFile("data/content.json", "utf8"));

const sources = {
  cbf: "https://www.cbf.com.br/selecao-brasileira/noticias/selecao-masculina/a/selecao-sera-convocada-por-ancelotti-para-copa-do-mundo-nesta-segunda-feira",
  prefeitura: "https://www.trescoracoes.mg.gov.br/",
  empregos: "https://trescoracoes.mg.gov.br/empregatrescoracoes",
  g1SulDeMinas: "https://g1.globo.com/mg/sul-de-minas/",
  eiNerdRss: "https://www.youtube.com/feeds/videos.xml?channel_id=UCt_4wzTQqmcUvemNkeO0plA",
  playstation: "https://blog.playstation.com/feed/",
  xbox: "https://news.xbox.com/en-us/feed/"
};

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "JrNewsBot/1.0 (+https://owagnerjrr.github.io/jrnews/)"
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

function strip(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(text, pattern, fallbackValue) {
  const match = text.match(pattern);
  return strip(match?.[1] || fallbackValue);
}

async function buildItems() {
  const items = [];

  try {
    const html = await fetchText(sources.prefeitura);
    const clean = strip(html);
    const title = firstMatch(clean, /(Três Corações recebe o programa “?Onde Nascem os Craques”?)/i, "Três Corações recebe o programa Onde Nascem os Craques");
    items.push({
      title,
      summary: "Destaque do portal oficial da Prefeitura de Três Corações monitorado pelo Jr News.",
      category: "Três Corações",
      source: "Prefeitura de Três Corações",
      url: sources.prefeitura,
      publishedAt: today,
      image: "./assets/thumb-city.svg",
      tag: "Cidade"
    });

    if (clean.includes("Oportunidade Jovem 2026")) {
      items.push({
        title: "Programa Oportunidade Jovem 2026 aparece entre as notícias da cidade",
        summary: "A Prefeitura informa seleção de jovens para formação profissional e estágio supervisionado.",
        category: "Três Corações",
        source: "Prefeitura de Três Corações",
        url: sources.prefeitura,
        publishedAt: today,
        image: "./assets/thumb-city.svg",
        tag: "Juventude"
      });
    }
  } catch (error) {
    console.warn(error.message);
  }

  try {
    const html = await fetchText(sources.empregos);
    const clean = strip(html);
    const vacancies = ["Professor", "Vendedor", "Auxiliar de Logística", "Analista de Marketing"]
      .filter((term) => clean.includes(term))
      .join(", ");
    items.push({
      title: "Três Corações + Emprego atualiza oportunidades locais",
      summary: vacancies ? `A plataforma municipal lista vagas como ${vacancies}.` : "A plataforma municipal conecta candidatos e empresas de Três Corações.",
      category: "Sul de Minas",
      source: "Prefeitura de Três Corações",
      url: sources.empregos,
      publishedAt: today,
      image: "./assets/thumb-city.svg",
      tag: "Emprego"
    });
  } catch (error) {
    console.warn(error.message);
  }

  try {
    const rss = await fetchText(sources.eiNerdRss);
    const title = firstMatch(rss, /<entry>[\s\S]*?<title>([\s\S]*?)<\/title>/i, "Vídeo novo do Ei Nerd");
    const url = firstMatch(rss, /<entry>[\s\S]*?<link[^>]+href="([^"]+)"/i, "https://www.youtube.com/channel/UCt_4wzTQqmcUvemNkeO0plA");
    items.push({
      title,
      summary: "Atualização automática via RSS do canal Ei Nerd para a área de cultura pop, filmes, séries, animes e games.",
      category: "Vídeos",
      source: "YouTube / Ei Nerd",
      url,
      publishedAt: today,
      image: "./assets/thumb-video.svg",
      tag: "YouTube"
    });
  } catch (error) {
    console.warn(error.message);
  }

  try {
    const rss = await fetchText(sources.playstation);
    const title = firstMatch(rss, /<item>[\s\S]*?<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i, "Novidades do PlayStation Blog");
    const url = firstMatch(rss, /<item>[\s\S]*?<link>([\s\S]*?)<\/link>/i, "https://blog.playstation.com/");
    items.push({
      title,
      summary: "Atualização oficial monitorada pelo Jr News para a editoria de games.",
      category: "Games",
      source: "PlayStation Blog",
      url,
      publishedAt: today,
      image: "./assets/thumb-games.svg",
      tag: "PlayStation"
    });
  } catch (error) {
    console.warn(error.message);
  }

  try {
    const rss = await fetchText(sources.xbox);
    const title = firstMatch(rss, /<item>[\s\S]*?<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i, "Novidades do Xbox Wire");
    const url = firstMatch(rss, /<item>[\s\S]*?<link>([\s\S]*?)<\/link>/i, "https://news.xbox.com/en-us/");
    items.push({
      title,
      summary: "Atualização oficial monitorada pelo Jr News para Game Pass, Xbox, PC e estúdios Microsoft.",
      category: "Games",
      source: "Xbox Wire",
      url,
      publishedAt: today,
      image: "./assets/thumb-games.svg",
      tag: "Xbox"
    });
  } catch (error) {
    console.warn(error.message);
  }

  items.push(...fallback.items);

  const unique = new Map();
  for (const item of items.filter(Boolean)) {
    unique.set(`${item.category}:${item.title}`, item);
  }

  return [...unique.values()].slice(0, 18);
}

const payload = {
  updatedAt: now.toISOString(),
  editorNote: "Atualizado automaticamente pelo GitHub Actions às 7h de Brasília.",
  items: await buildItems()
};

await writeFile("data/content.json", `${JSON.stringify(payload, null, 2)}\n`);
