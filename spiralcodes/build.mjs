/* =========================================================================
   SPIRALCODES — STATIC BUILD
   One template. Two locales. Zero runtime dependencies.

   Run:  node build.mjs
   Out:  dist/  (deploy this folder as-is)
   ========================================================================= */

import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, "dist");
const SITE = "https://spiralcodes.com.br";
const EMAIL = "reimsfreitas@gmail.com";
const LOCALES = ["pt", "en"];

/* ---------------------------------------------------------------------------
   THE SIGNATURE — a logarithmic spiral, plotted from the equation itself.
   r(θ) = a · e^(bθ).  This is not an ornament borrowed from a stock library;
   it is the curve the method is named after, computed at build time.
--------------------------------------------------------------------------- */
function spiralPath({ a = 1.1, b = 0.155, turns = 4.25, cx = 200, cy = 200, samples = 900 } = {}) {
  const pts = [];
  const thetaMax = turns * 2 * Math.PI;
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * thetaMax;
    const r = a * Math.exp(b * t);
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  }
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

// The four movements, marked on the curve at one full turn apart.
// Same point of the cycle, one level out. That is the whole thesis.
function spiralNodes({ a = 1.1, b = 0.155, cx = 200, cy = 200 } = {}) {
  return [1, 2, 3, 4].map((turn) => {
    const t = turn * 2 * Math.PI;
    const r = a * Math.exp(b * t);
    return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) };
  });
}

function spiralSVG() {
  const d = spiralPath();
  const nodes = spiralNodes()
    .map((n) => `<circle class="spiral-node" cx="${n.x.toFixed(2)}" cy="${n.y.toFixed(2)}" r="3.2" />`)
    .join("\n      ");
  return `<svg class="hero__spiral" viewBox="0 0 400 400" role="img" aria-labelledby="spiral-title">
      <title id="spiral-title">Espiral logarítmica r(θ) = a · e^(bθ)</title>
      <line class="spiral-axis" x1="200" y1="30" x2="200" y2="370" />
      <line class="spiral-axis" x1="30" y1="200" x2="370" y2="200" />
      <path class="spiral-curve" d="${d}" />
      ${nodes}
    </svg>`;
}

const MARK = `<svg class="mark__glyph" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2">
      <path d="${spiralPath({ a: 0.35, b: 0.19, turns: 3.1, cx: 12, cy: 12, samples: 240 })}" />
    </svg>`;

/* --------------------------------------------------------------------------- */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const other = (lang) => (lang === "pt" ? "en" : "pt");

function moduleHref(c, key, depth) {
  const m = c.modules.find((x) => x.key === key);
  const up = "../".repeat(depth);
  return `${up}${m.slug}/`;
}

/* --- Shell ---------------------------------------------------------------- */

function shell({ c, alt, body, path, title, description, depth }) {
  const up = depth === 0 ? "./" : "../".repeat(depth);
  const assets = depth === 0 ? "../assets/" : "../".repeat(depth) + "assets/";
  const canonical = `${SITE}/${c.dir}/${path}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SpiralCodes",
    alternateName: "Spiral",
    url: SITE,
    email: EMAIL,
    slogan: "Operating System for Decisions",
    description: c.meta.description,
    address: { "@type": "PostalAddress", addressLocality: "Belo Horizonte", addressCountry: "BR" },
    knowsLanguage: ["pt-BR", "en"],
  };

  return `<!doctype html>
<html lang="${c.locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="keywords" content="${esc(c.meta.keywords)}">
<meta name="author" content="SpiralCodes">
<meta name="theme-color" content="#F7F5F1">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="pt-BR" href="${SITE}/pt/${path}">
<link rel="alternate" hreflang="en" href="${SITE}/en/${path}">
<link rel="alternate" hreflang="x-default" href="${SITE}/en/${path}">
<link rel="icon" href="${assets}mark.svg" type="image/svg+xml">

<meta property="og:type" content="website">
<meta property="og:site_name" content="SpiralCodes">
<meta property="og:locale" content="${c.locale.replace("-", "_")}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/assets/og.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;450&display=swap">
<link rel="stylesheet" href="${assets}styles.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(c.nav.skip)}</a>

<header class="masthead">
  <div class="frame masthead__inner">
    <a class="mark" href="${up}" aria-label="SpiralCodes">
      ${MARK}
      <span class="mark__word">Spiral</span>
    </a>
    <nav class="masthead__nav" aria-label="${esc(c.nav.primary)}">
      <a href="${up}#method">${esc(c.nav.method)}</a>
      <a href="${up}#modules">${esc(c.nav.modules)}</a>
      <a href="${up}#institution">${esc(c.nav.institution)}</a>
      <a href="${up}#contact">${esc(c.nav.contact)}</a>
      <a class="masthead__lang" href="/${alt.dir}/${path}" hreflang="${alt.lang}">${esc(c.nav.switchLabel)}</a>
    </nav>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="colophon">
  <div class="frame">
    <div class="colophon__top">
      <div>
        <div class="colophon__word">SpiralCodes</div>
        <div class="colophon__tagline">${esc(c.footer.tagline)}</div>
      </div>
      <nav class="colophon__links" aria-label="${esc(c.nav.footerNav)}">
        ${c.modules.map((m) => `<a href="${up}${m.slug}/">${esc(m.name)}</a>`).join("\n        ")}
      </nav>
    </div>
    <div class="colophon__bottom">
      <span>© ${new Date().getFullYear()} ${esc(c.footer.rights)}</span>
      <span class="colophon__closing">${esc(c.footer.closing)}</span>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
    </div>
  </div>
</footer>

<script src="${assets}main.js" defer></script>
</body>
</html>`;
}

/* --- Home ----------------------------------------------------------------- */

function home(c, alt) {
  const layer = (id) => c.modules.filter((m) => m.layer === id);

  const body = `
<section class="hero">
  <div class="frame hero__grid">
    <div>
      <p class="label hero__eyebrow">${esc(c.hero.eyebrow)}</p>
      <h1 class="hero__title">${esc(c.hero.title)}</h1>
      <p class="hero__subtitle">${esc(c.hero.subtitle)}</p>
      <p class="hero__lead">${esc(c.hero.lead)}</p>
      <a class="hero__cta" href="#method">${esc(c.hero.cta)} <span aria-hidden="true">→</span></a>
    </div>
    <figure class="hero__figure">
      ${spiralSVG()}
      <figcaption class="hero__equation">${esc(c.hero.equationCaption)}</figcaption>
    </figure>
  </div>
</section>

<section class="section" id="thesis">
  <div class="frame section__grid">
    <p class="label">${esc(c.thesis.label)}</p>
    <div data-reveal>
      <h2 class="section__title">${esc(c.thesis.title)}</h2>
      <div class="thesis__body">
        ${c.thesis.body.map((p) => `<p>${esc(p)}</p>`).join("\n        ")}
      </div>
    </div>
  </div>
</section>

<section class="section section--ink" id="method">
  <div class="frame section__grid">
    <p class="label">${esc(c.method.label)}</p>
    <div>
      <div class="section__head" data-reveal>
        <h2 class="section__title">${esc(c.method.title)}</h2>
        <p class="lead">${esc(c.method.lead)}</p>
      </div>
      <ol class="movements">
        ${c.method.steps
          .map(
            (s) => `<li class="movement" data-reveal>
          <span class="movement__num">${esc(s.num)}</span>
          <h3 class="movement__name">${esc(s.name)}</h3>
          <p class="movement__body">${esc(s.body)}</p>
        </li>`
          )
          .join("\n        ")}
      </ol>
    </div>
  </div>
</section>

<section class="section" id="modules">
  <div class="frame section__grid">
    <p class="label">${esc(c.modulesSection.label)}</p>
    <div>
      <div class="section__head" data-reveal>
        <h2 class="section__title">${esc(c.modulesSection.title)}</h2>
        <p class="lead">${esc(c.modulesSection.lead)}</p>
      </div>
      ${c.modulesSection.layers
        .map(
          (l) => `<div class="layer">
        <div class="layer__head">
          <h3 class="layer__name">${esc(l.name)}</h3>
          <p class="layer__note">${esc(l.note)}</p>
        </div>
        ${layer(l.id)
          .map(
            (m) => `<a class="module-card" href="${m.slug}/" data-reveal>
          <span class="module-card__name">${esc(m.name)}</span>
          <span class="module-card__tagline">${esc(m.tagline)}</span>
          <span class="module-card__movement">${esc(m.movement)}</span>
        </a>`
          )
          .join("\n        ")}
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>

<section class="section section--ink" id="connections">
  <div class="frame section__grid">
    <p class="label">${esc(c.connections.label)}</p>
    <div>
      <div class="section__head" data-reveal>
        <h2 class="section__title">${esc(c.connections.title)}</h2>
        <p class="lead">${esc(c.connections.lead)}</p>
      </div>
      ${c.connections.chains
        .map(
          (ch) => `<div class="circuit" data-reveal>
        <p class="circuit__name">${esc(ch.name)}</p>
        <p class="circuit__path">${ch.path
          .map((n) => esc(n))
          .join(' <span class="circuit__arrow" aria-hidden="true">——&gt;</span> ')}</p>
      </div>`
        )
        .join("\n      ")}
      <p class="circuit__note">${esc(c.connections.note)}</p>
    </div>
  </div>
</section>

<section class="section" id="institution">
  <div class="frame section__grid">
    <p class="label">${esc(c.institution.label)}</p>
    <div>
      <div class="section__head" data-reveal>
        <h2 class="section__title">${esc(c.institution.title)}</h2>
      </div>
      <div class="institution__body" data-reveal>
        ${c.institution.body.map((p) => `<p>${esc(p)}</p>`).join("\n        ")}
      </div>
      <ul class="principles">
        ${c.institution.principles.map((p) => `<li data-reveal><span>${esc(p)}</span></li>`).join("\n        ")}
      </ul>
    </div>
  </div>
</section>

<section class="section section--ink" id="contact">
  <div class="frame section__grid">
    <p class="label">${esc(c.contact.label)}</p>
    <div data-reveal>
      <h2 class="section__title">${esc(c.contact.title)}</h2>
      <p class="lead">${esc(c.contact.lead)}</p>
      <a class="contact__email" href="mailto:${EMAIL}">${EMAIL}</a>
    </div>
  </div>
</section>`;

  return shell({
    c,
    alt,
    body,
    path: "",
    title: c.meta.title,
    description: c.meta.description,
    depth: 0,
  });
}

/* --- Module page ---------------------------------------------------------- */

function modulePage(c, alt, m) {
  const layerName = c.modulesSection.layers.find((l) => l.id === m.layer).name;
  const t = c.modulePage;

  const catalog = m.books
    ? `
<section class="section">
  <div class="frame section__grid">
    <p class="label">${esc(t.catalogLabel)}</p>
    <div class="catalog">
      ${m.books
        .map(
          (b) => `<article class="catalog__item" data-reveal>
        <h3 class="catalog__title">${esc(b.title)}</h3>
        <p class="catalog__subtitle">${esc(b.subtitle)}</p>
        <p class="catalog__kind">${esc(b.kind)} · ${esc(b.year)}</p>
      </article>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
    : "";

  const body = `
<section class="page-head">
  <div class="frame">
    <a class="page-head__back" href="../#modules">← ${esc(t.back)}</a>
    <h1 class="page-head__title">${esc(m.name)}</h1>
    <p class="page-head__tagline">${esc(m.tagline)}</p>
    <div class="meta">
      <div class="meta__item">
        <span class="meta__key">${esc(t.movementLabel)}</span>
        <span class="meta__value">${esc(m.movement)}</span>
      </div>
      <div class="meta__item">
        <span class="meta__key">${esc(t.layerLabel)}</span>
        <span class="meta__value">${esc(layerName)}</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="frame section__grid">
    <p class="label">${esc(t.functionsLabel)}</p>
    <div>
      <p class="lead" data-reveal style="margin-bottom:3rem">${esc(m.lead)}</p>
      <ul class="functions">
        ${m.functions.map((f) => `<li data-reveal><span>${esc(f)}</span></li>`).join("\n        ")}
      </ul>
      <div class="status" data-reveal>
        <span class="status__key">${esc(t.instrumentLabel)}</span>
        <p>${esc(m.instrument)}</p>
      </div>
    </div>
  </div>
</section>
${catalog}
<section class="section">
  <div class="frame section__grid">
    <p class="label">${esc(t.relatedLabel)}</p>
    <nav class="related">
      ${m.related
        .map((k) => {
          const r = c.modules.find((x) => x.key === k);
          return `<a href="../${r.slug}/">${esc(r.name)}</a>`;
        })
        .join("\n      ")}
    </nav>
  </div>
</section>

<section class="section section--ink" id="contact">
  <div class="frame section__grid">
    <p class="label">${esc(c.contact.label)}</p>
    <div data-reveal>
      <h2 class="section__title">${esc(c.contact.title)}</h2>
      <p class="lead">${esc(c.contact.lead)}</p>
      <a class="contact__email" href="mailto:${EMAIL}">${EMAIL}</a>
    </div>
  </div>
</section>`;

  const altModule = alt.modules.find((x) => x.key === m.key);

  return shell({
    c,
    alt: { ...alt, dir: alt.dir },
    body,
    path: `${m.slug}/`,
    title: `${m.name} — ${m.tagline} | SpiralCodes`,
    description: m.lead,
    depth: 1,
  }).replace(
    `href="/${alt.dir}/${m.slug}/"`,
    `href="/${alt.dir}/${altModule.slug}/"`
  ).replaceAll(
    `${SITE}/${other(c.lang)}/${m.slug}/`,
    `${SITE}/${other(c.lang)}/${altModule.slug}/`
  );
}

/* --- Root: language gateway ----------------------------------------------- */

const gateway = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Spiral — Operating System for Decisions</title>
<meta name="description" content="An integrated system for improving human and organisational decisions.">
<link rel="canonical" href="${SITE}/">
<link rel="alternate" hreflang="pt-BR" href="${SITE}/pt/">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="x-default" href="${SITE}/en/">
<link rel="icon" href="/assets/mark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
  :root { --ink:#0E0F10; --paper:#F7F5F1; --gold:#A47C3A; --rule:#E1DCD4; --slate:#5C6166; }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100svh; display:grid; place-items:center;
         background:var(--paper); color:var(--ink); font-family:"IBM Plex Mono",monospace; padding:2rem; }
  .gate { text-align:center; }
  .gate h1 { font-family:"EB Garamond",serif; font-weight:400; font-size:clamp(3rem,10vw,5rem);
             margin:0 0 .25rem; letter-spacing:-.02em; }
  .gate p { font-size:.78rem; letter-spacing:.14em; text-transform:uppercase; color:var(--gold); margin:0 0 3rem; }
  .gate nav { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
  .gate a { border:1px solid var(--rule); padding:.9rem 1.75rem; color:var(--slate);
            font-size:.78rem; letter-spacing:.12em; text-transform:uppercase; text-decoration:none;
            transition:border-color .25s, color .25s; }
  .gate a:hover, .gate a:focus-visible { border-color:var(--gold); color:var(--ink); outline:none; }
</style>
<script>
  (function () {
    try {
      var pt = (navigator.languages || [navigator.language || "en"]).some(function (l) {
        return String(l).toLowerCase().indexOf("pt") === 0;
      });
      location.replace(pt ? "/pt/" : "/en/");
    } catch (e) {}
  })();
</script>
</head>
<body>
  <div class="gate">
    <h1>Spiral</h1>
    <p>Operating System for Decisions</p>
    <nav>
      <a href="/pt/">Português</a>
      <a href="/en/">English</a>
    </nav>
  </div>
</body>
</html>`;

/* --- Assets ---------------------------------------------------------------- */

const markSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A47C3A" stroke-width="1.2">
  <path d="${spiralPath({ a: 0.35, b: 0.19, turns: 3.1, cx: 12, cy: 12, samples: 240 })}" />
</svg>`;

const ogSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#0E0F10"/>
  <g stroke="#A47C3A" fill="none" stroke-width="1.4">
    <path d="${spiralPath({ a: 3, b: 0.15, turns: 4.4, cx: 940, cy: 315, samples: 700 })}"/>
  </g>
  <text x="90" y="300" font-family="EB Garamond, Georgia, serif" font-size="120" fill="#F7F5F1">Spiral</text>
  <text x="94" y="360" font-family="IBM Plex Mono, monospace" font-size="24" letter-spacing="4" fill="#C6A96B">OPERATING SYSTEM FOR DECISIONS</text>
  <line x1="90" y1="420" x2="620" y2="420" stroke="#2C2F32"/>
  <text x="90" y="470" font-family="IBM Plex Mono, monospace" font-size="18" letter-spacing="3" fill="#6B7176">OBSERVE · UNDERSTAND · DECIDE · BUILD</text>
</svg>`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

/* --- Run ------------------------------------------------------------------- */

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(join(DIST, "assets"), { recursive: true });

  const content = {};
  for (const l of LOCALES) {
    content[l] = JSON.parse(await readFile(join(ROOT, "content", `${l}.json`), "utf8"));
  }

  const urls = [`${SITE}/`];

  for (const l of LOCALES) {
    const c = content[l];
    const alt = content[other(l)];

    await mkdir(join(DIST, c.dir), { recursive: true });
    await writeFile(join(DIST, c.dir, "index.html"), home(c, alt));
    urls.push(`${SITE}/${c.dir}/`);

    for (const m of c.modules) {
      await mkdir(join(DIST, c.dir, m.slug), { recursive: true });
      await writeFile(join(DIST, c.dir, m.slug, "index.html"), modulePage(c, alt, m));
      urls.push(`${SITE}/${c.dir}/${m.slug}/`);
    }
  }

  await writeFile(join(DIST, "index.html"), gateway);
  await writeFile(join(DIST, "robots.txt"), robots);
  await writeFile(join(DIST, "assets", "mark.svg"), markSVG);
  await writeFile(join(DIST, "assets", "og.svg"), ogSVG);
  await cp(join(ROOT, "src", "styles.css"), join(DIST, "assets", "styles.css"));
  await cp(join(ROOT, "src", "main.js"), join(DIST, "assets", "main.js"));

  // static/ holds binaries the build cannot generate (og.png). Copied verbatim.
  await cp(join(ROOT, "static"), join(DIST, "assets"), { recursive: true, force: true });

  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq></url>`)
  .join("\n")}
</urlset>
`;
  await writeFile(join(DIST, "sitemap.xml"), sitemap);

  console.log(`✓ ${urls.length} pages built → dist/`);
  urls.forEach((u) => console.log(`  ${u}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
