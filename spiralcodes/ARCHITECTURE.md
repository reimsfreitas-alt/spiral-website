# ARCHITECTURE

Sede digital da SpiralCodes — `spiralcodes.com.br`

---

## 1. Decisão central: gerador estático próprio, sem framework

O site é gerado por um único script Node (`build.mjs`) que lê JSON e escreve HTML.
Não há React, não há Next, não há build tool, não há `node_modules`.

**Por quê.**
Um site institucional que deve durar décadas não pode depender de um ecossistema
que se reescreve a cada dezoito meses. Toda dependência é uma dívida futura de
manutenção que alguém terá de pagar — provavelmente alguém que não estará aqui
para perguntar por que ela existe. O critério aplicado foi o do próprio Tratado:
*construir com folga, com simplicidade e com a possibilidade de reparo.*

O resultado é HTML estático puro. Se, em 2040, o Node não existir mais, os
arquivos em `dist/` continuam servindo. O gerador é conveniência; o site é o
artefato.

**O que se perde.** Nenhum hot-reload, nenhum ecossistema de plugins.
**O que se ganha.** Zero vulnerabilidades transitivas, zero lock-in, tempo de
build em milissegundos, e um site que qualquer engenheiro entende em vinte minutos.

---

## 2. Fluxo de build

```
content/pt.json  ─┐
content/en.json  ─┤
                  ├──► build.mjs ──► dist/
src/styles.css   ─┤                   ├── index.html          (gateway de idioma)
src/main.js      ─┘                   ├── pt/  index + 7 módulos
                                      ├── en/  index + 7 módulos
                                      ├── assets/  styles.css · main.js · mark.svg · og.png
                                      ├── sitemap.xml
                                      └── robots.txt
```

Comando único:

```bash
node build.mjs
```

17 páginas. Nenhuma instalação prévia.

---

## 3. Separação conteúdo / apresentação

**Regra dura: nenhum texto de conteúdo vive no código.**

Todo texto está em `content/{locale}.json`. O `build.mjs` conhece a *forma* das
páginas; nunca o seu conteúdo. Isso tem três consequências:

1. Reinaldo pode reescrever qualquer frase do site sem tocar em HTML ou CSS.
2. Um novo idioma é um novo arquivo JSON — nada mais.
3. Um novo módulo é um objeto novo no array `modules` — a home, o rodapé, o
   sitemap e a página do módulo se atualizam sozinhos.

---

## 4. Modelo de dados

O array `modules` é a espinha dorsal. Cada módulo declara:

| Campo | Função |
|---|---|
| `key` | Identidade estável entre idiomas (nunca traduzida). É o que permite o `hreflang` correto quando os slugs divergem (`/pt/biblioteca/` ↔ `/en/library/`). |
| `slug` | URL, traduzida por idioma. |
| `layer` | `org` \| `person` \| `transmission` — agrupa os módulos na home. |
| `movement` | `Observe` \| `Understand` \| `Decide` \| `Build` — ancora cada módulo no método. |
| `related` | Lista de `key`s. Gera os links cruzados. É o que impede o site de parecer um catálogo de produtos soltos. |

**Esta última decisão é a mais importante do documento.** O comando institucional
exigia que os módulos nunca parecessem produtos independentes. Isso não foi
resolvido com uma frase de marketing: foi resolvido com um grafo. Cada módulo é
um nó, e o site *renderiza as arestas*. A conexão é estrutural, não retórica.

---

## 5. Roteamento e URLs

- `/` → gateway. Detecta o idioma do navegador e redireciona. Sem JS, oferece dois
  botões. Nunca é indexado como conteúdo duplicado (`x-default` aponta para `/en/`).
- `/pt/` e `/en/` → home de cada idioma.
- `/{locale}/{slug}/` → página de módulo. Barra final obrigatória; cada página é
  um `index.html` dentro da própria pasta, o que funciona em qualquer host estático
  sem regra de rewrite.

Nenhuma URL depende de configuração de servidor. O site funciona idêntico em
Vercel, Netlify, Cloudflare Pages, S3 ou Hostinger.

---

## 6. SEO e dados estruturados

Cada página emite:

- `<title>` e `description` próprios, vindos do JSON;
- `canonical` absoluto;
- `hreflang` para `pt-BR`, `en` e `x-default`, com o slug correto de cada idioma;
- Open Graph completo + Twitter Card (`summary_large_image`, 1200×630);
- JSON-LD `schema.org/Organization` com nome, slogan, e-mail, endereço e idiomas;
- `sitemap.xml` e `robots.txt` gerados a partir da mesma lista de URLs do build —
  impossível ficarem dessincronizados.

---

## 7. Performance

| Decisão | Consequência |
|---|---|
| HTML estático, sem hidratação | Sem JS bloqueante. First paint é o próprio HTML. |
| CSS único, ~14 KB | Uma requisição. Sem CSS-in-JS, sem purga, sem crítico inlinado. |
| JS de runtime: ~700 bytes | Um `IntersectionObserver`. Nada mais. |
| Zero scripts de terceiros | Sem analytics, sem tag manager, sem pixel. Sem banner de cookie, porque não há cookie. |
| SVG gerado no build | O logotipo e o herói não custam nenhum download de imagem. |

**Única dependência externa:** Google Fonts (3 famílias).
**Débito técnico conhecido, com prazo:** ver `ROADMAP.md` — self-hosting das fontes
é o item que fecha a última dependência de terceiros e a última fuga de dados de visitante.

---

## 8. Acessibilidade (meta: WCAG 2.1 AA)

- Link "ir para o conteúdo" como primeiro elemento focável.
- Landmarks semânticos: `header`, `nav[aria-label]`, `main`, `footer`.
- `:focus-visible` com contorno dourado de 2px e offset — nunca removido.
- Hierarquia de títulos sem saltos (`h1` único por página).
- `prefers-reduced-motion` respeitado: a espiral aparece desenhada, os blocos
  aparecem opacos. Nada se move.
- Contraste: texto `--ink` sobre `--paper` = 15.8:1. Secundário `--slate` = 6.1:1.
  Dourado `--gold` sobre `--paper` = 4.6:1 — usado apenas em texto de rótulo
  (≥ 14px bold / 18px regular), dentro do limite AA para texto grande.

---

## 9. Deploy

```bash
node build.mjs          # gera dist/
# publicar o conteúdo de dist/ na raiz do domínio
```

Vercel / Netlify / Cloudflare Pages:
- Build command: `node build.mjs`
- Output directory: `dist`
- Nenhuma variável de ambiente.

---

## 10. O que este site deliberadamente NÃO faz

- Não coleta e-mail. Não há formulário. O contato é um `mailto:` direto, e a
  resposta vem de uma pessoa. Formulário é uma promessa de resposta automatizada;
  a Spiral não faz essa promessa.
- Não rastreia visitantes.
- Não tem blog, feed, nem "últimas notícias". O site é uma sede, não um canal.
- Não tem pop-up, exit-intent, contador regressivo ou prova social.

Cada uma dessas ausências é uma decisão, não um atraso.
