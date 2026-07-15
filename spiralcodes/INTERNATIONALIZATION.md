# INTERNATIONALIZATION

---

## Modelo

**Um template. N arquivos de conteúdo. Zero duplicação de código.**

```
content/pt.json  ──┐
content/en.json  ──┼──► build.mjs (um só template) ──► dist/pt/  dist/en/
content/xx.json  ──┘                                    dist/xx/
```

O `build.mjs` não sabe nada sobre português ou inglês. Ele itera sobre a
constante `LOCALES` e aplica a mesma função de renderização a cada arquivo de
conteúdo. Adicionar um idioma é adicionar um arquivo — nunca uma condicional.

---

## Como adicionar um idioma

1. Copie `content/en.json` para `content/{código}.json`.
2. Traduza os valores. **Não traduza nenhuma chave.** Não traduza `key` dentro de
   `modules` — é a identidade estável do módulo entre idiomas.
3. Ajuste `locale` (ex.: `fr-FR`), `lang` (`fr`) e `dir` (`fr`).
4. Traduza os `slug` de cada módulo se fizer sentido no idioma.
5. Em `build.mjs`, adicione o código a `const LOCALES = ["pt", "en"]`.
6. `node build.mjs`.

Nada mais. O sitemap, o rodapé, os links cruzados e as tags `hreflang` se
atualizam sozinhos.

**Nota:** a função `other()` hoje alterna entre dois idiomas. Com três ou mais,
troque o botão único de idioma por um seletor sobre `LOCALES` — é a única linha
do build que precisará mudar. Está isolada de propósito.

---

## Identidade entre idiomas: o problema do slug

`/pt/biblioteca/` e `/en/library/` são a mesma página em idiomas diferentes. O
Google só entende isso se as tags `hreflang` apontarem corretamente uma para a
outra — e os slugs são diferentes.

A solução é o campo `key`, idêntico nos dois arquivos (`"key": "library"`). O
build resolve o slug correspondente no outro idioma antes de escrever a tag.
Verificado:

```html
<!-- em /pt/biblioteca/ -->
<link rel="alternate" hreflang="en" href="https://spiralcodes.com.br/en/library/">
<!-- em /en/library/ -->
<link rel="alternate" hreflang="pt-BR" href="https://spiralcodes.com.br/pt/biblioteca/">
```

**Nunca traduza `key`.** Se traduzir, o vínculo entre as versões se rompe em
silêncio — e nada no build vai reclamar.

---

## Gateway de idioma (`/`)

A raiz do domínio não é uma página de conteúdo. É um portão:

- Com JS: lê `navigator.languages` e redireciona (`pt*` → `/pt/`, resto → `/en/`).
- Sem JS: mostra dois botões, `Português` e `English`. Nunca é uma parede.
- `hreflang="x-default"` aponta para `/en/`.

O redirecionamento usa `location.replace()` — não polui o histórico do navegador.

---

## O que NÃO se traduz

| Item | Por quê |
|---|---|
| `Spiral — Operating System for Decisions` | É o posicionamento, não uma frase. Permanece em inglês nos dois idiomas. |
| `Observe · Understand · Decide · Build` | Os quatro movimentos são nomes próprios do método. |
| Nomes dos módulos (`Spiral Enterprise`, `Spiral Vita`…) | Nome de produto. A única exceção é `Biblioteca Spiral` ↔ `Spiral Library`, que é um substantivo comum. |
| `key` dentro de `modules` | Identidade técnica. |
| `SpiralCodes` | Razão da marca. |

---

## Registro linguístico por idioma

**Português (pt-BR).** Registro institucional brasileiro culto. Frase curta,
verbo ativo. Evitar o tom de consultoria ("alavancar", "entregar valor",
"jornada do cliente").

**Inglês (en-GB).** Ortografia britânica (`organisation`, `visualisation`). Não é
detalhe: o alvo declarado é o parceiro europeu, e a ortografia americana muda o
registro de "instituto" para "startup do Vale". O `locale` é `en-GB` por decisão,
não por acaso.

---

## Checklist antes de publicar um idioma novo

- [ ] Todas as chaves presentes (compare com `en.json`; o build quebra se faltar).
- [ ] `key` de cada módulo inalterado.
- [ ] `slug` sem acento, sem espaço, minúsculo.
- [ ] `hreflang` recíproco em todas as páginas (`grep hreflang dist/xx/*/index.html`).
- [ ] `LOCALES` atualizado em `build.mjs`.
- [ ] `sitemap.xml` contém as novas URLs.
