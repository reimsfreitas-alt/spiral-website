# spiralcodes.com.br

Sede digital da SpiralCodes.

**Spiral — Operating System for Decisions.**

---

## Rodar

```bash
node build.mjs        # gera dist/ — 17 páginas, 2 idiomas
```

Nenhuma instalação. Nenhuma dependência. Node 18+.

Para ver localmente:

```bash
node build.mjs && python3 -m http.server 8000 --directory dist
# http://localhost:8000
```

## Publicar

Suba o conteúdo de `dist/` na raiz do domínio.

Vercel / Netlify / Cloudflare Pages:
- Build command: `node build.mjs`
- Output directory: `dist`

## Estrutura

```
content/pt.json          todo o texto em português
content/en.json          todo o texto em inglês
src/styles.css           o sistema de design inteiro
src/main.js              ~700 bytes de runtime
build.mjs                o gerador
dist/                    o site (gerado — não editar)
```

**Para mudar uma frase do site, edite o JSON e rode o build. Nunca edite `dist/`.**

## Documentação

| Documento | Quando ler |
|---|---|
| `ARCHITECTURE.md` | Antes de mexer no build ou no deploy. |
| `DESIGN_SYSTEM.md` | Antes de mexer em qualquer valor visual. |
| `BRAND_GUIDELINES.md` | Antes de escrever qualquer peça, aqui ou fora daqui. |
| `CONTENT_GUIDE.md` | Antes de editar o JSON. |
| `INTERNATIONALIZATION.md` | Antes de adicionar um idioma. |
| `ROADMAP.md` | **Toda segunda-feira.** |

## Contato

reimsfreitas@gmail.com
