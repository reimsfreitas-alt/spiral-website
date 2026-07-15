# CONTENT GUIDE

Como escrever e editar o conteúdo do site sem tocar em código.

---

## Onde o conteúdo vive

`content/pt.json` e `content/en.json`. Só aí. Nenhuma frase do site existe em
outro lugar.

Depois de editar:

```bash
node build.mjs
```

---

## Anatomia de um módulo

```json
{
  "key": "enterprise",           // NUNCA mudar. NUNCA traduzir.
  "slug": "spiral-enterprise",   // URL. Pode diferir por idioma.
  "layer": "org",                // org | person | transmission
  "name": "Spiral Enterprise",
  "tagline": "Decisão corporativa medida.",     // UMA frase. Ponto final.
  "movement": "Decide",          // Observe | Understand | Decide | Build
  "lead": "…",                   // 2 frases. O problema, e o que o módulo faz nele.
  "functions": ["…", "…"],       // 4 itens. Cada um começa com o substantivo.
  "instrument": "…",             // O ESTADO REAL. Ver abaixo.
  "related": ["vision", "ledger"] // keys de outros módulos.
}
```

---

## As cinco regras de escrita

### 1. Uma frase, um sentido

`tagline` é uma frase. Não uma frase com vírgula e mais uma ideia pendurada.
Se precisa de dois sentidos, o módulo não está claro ainda.

### 2. O substantivo primeiro

Cada item de `functions` começa nomeando a coisa, depois explica:

> ✓ "Latência decisória: o tempo entre um evento de decisão e a ação que o realiza."
> ✗ "Nós ajudamos você a entender melhor quanto tempo leva para decidir."

O leitor está escaneando. Dê a ele o substantivo antes da explicação.

### 3. O campo `instrument` diz a verdade

Este é o campo mais importante do JSON, e o mais fácil de corromper.

> ✓ "Em desenvolvimento."
> ✓ "Em produção. Integração Vision/Ledger operacional."
> ✓ "Instrumento passivo. Não interfere no processo."
> ✗ "Em breve, com recursos revolucionários."
> ✗ (omitir o campo porque o produto ainda não existe)

Um site que declara honestamente o que ainda não existe compra credibilidade para
tudo o que declara que existe. É o inverso do reflexo natural — e é o ativo.

### 4. Sem superlativo, sem exclamação, sem emoji

Se uma frase precisa de "!" para funcionar, ela não funciona.

### 5. Verbo ativo, presente

> ✓ "Mede o intervalo."
> ✗ "É medido o intervalo." / "Foi projetado para medir."

---

## Vocabulário controlado

Termos que só têm um significado neste site. Nunca sinonimizar.

| Termo | Significa exatamente |
|---|---|
| **Latência decisória** | O tempo entre um evento de decisão e a ação correspondente, pareados por chave de idempotência. Nada além disso. |
| **Movimento** | Um dos quatro: Observe, Understand, Decide, Build. |
| **Camada** | Uma das três: organizacional, pessoal, transmissão. |
| **Critério** | A forma de julgar que sobrevive ao produto. |
| **Instituição** | Uma estrutura que transmite orientação através do tempo. |
| **Instrumento** | Um módulo, visto pelo que ele mede ou faz. |

**Termos banidos** (mortos em auditoria anterior por serem inverificáveis):
"viscosidade decisória", "energia organizacional", "campo", "ressonância" fora do
contexto declarado do Meet, e qualquer metáfora emprestada da física que não possa
ser falseada com um número.

---

## Adicionar um livro à Biblioteca

Em `modules[key=library].books`:

```json
{
  "title": "…",
  "subtitle": "…",
  "kind": "Tratado fundacional | Ensaio | Ensaio institucional | Ficção",
  "year": "2026"
}
```

A página do módulo Biblioteca renderiza o catálogo sozinha. Adicione o mesmo livro
nos dois idiomas, com o título traduzido se houver tradução — e apenas se houver.
Não invente títulos em inglês para obras que só existem em português.

---

## Adicionar um módulo novo

1. Novo objeto no array `modules`, nos **dois** arquivos, com o mesmo `key`.
2. Declare `related` no módulo novo **e** adicione o `key` dele nos `related` dos
   módulos com que ele conversa — o grafo precisa de arestas nos dois sentidos.
3. `node build.mjs`. A home, o rodapé, o sitemap e a página nova aparecem sozinhos.

---

## O teste final, antes de publicar qualquer frase

Leia em voz alta e pergunte:

> Um executivo cético, com trinta anos de carreira, leria isto e pensaria
> *"aqui tem método"* — ou *"aqui tem alguém tentando me vender algo"*?

Se for a segunda, corte adjetivos até virar a primeira.
