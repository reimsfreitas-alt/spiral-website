# DESIGN SYSTEM

Todo valor visual do site é declarado uma vez, em `:root`, dentro de
`src/styles.css`. Nada é codificado direto em uma regra. Se um valor não está
aqui, ele não deve existir no CSS.

---

## Cor

| Token | Hex | Papel |
|---|---|---|
| `--ink` | `#0E0F10` | Preto profundo. Texto principal e seções graves. Não é `#000` — o preto puro vibra na tela e cansa a leitura longa. |
| `--ink-soft` | `#1B1D1F` | Superfícies elevadas sobre fundo escuro. |
| `--paper` | `#F7F5F1` | Warm white. O fundo institucional. Levemente quente para não parecer clínico. |
| `--paper-lift` | `#FFFFFF` | Branco puro. Usado só em hover e no bloco de estado. |
| `--gold` | `#A47C3A` | Dourado discreto sobre fundo claro. É **latão, não brilho** — dessaturado de propósito. |
| `--gold-soft` | `#C6A96B` | O mesmo dourado, clareado para sobreviver sobre `--ink`. |
| `--slate` | `#5C6166` | Texto secundário. |
| `--rule` | `#E1DCD4` | Fio de 1px sobre `--paper`. |
| `--rule-dark` | `#2C2F32` | Fio de 1px sobre `--ink`. |

**Regra do dourado.** O dourado nunca preenche uma área. Ele aparece em três
lugares e só neles: (1) rótulos mono, (2) fios de 1px, (3) a curva da espiral.
No instante em que o dourado virar um botão sólido ou um gradiente, o site vira
uma startup. Ele é acento, não superfície.

---

## Tipografia

Três vozes, três funções. Nunca se cruzam.

| Papel | Família | Uso |
|---|---|---|
| Display | **EB Garamond** | Títulos, nomes de módulos, princípios, o wordmark. Uma serifa humanista europeia, escolarmente séria. Escolhida *contra* Playfair e Fraunces, que já carregam o sotaque do design gerado por máquina. |
| Corpo | **IBM Plex Sans** | Parágrafos, leads. Uma grotesca desenhada por uma empresa de engenharia para documentação técnica. É exatamente o registro certo: precisa, sem carisma, confiável. |
| Utilidade | **IBM Plex Mono** | Rótulos, metadados, numerais dos movimentos, a equação. |

**Por que mono para os rótulos.** Não é estética retrô. A Spiral *mede* coisas —
latência, P90, taxa de censura. A monoespaçada é a tipografia dos instrumentos.
Toda vez que o site nomeia uma estrutura (`MÉTODO`, `MÓDULOS`, `CONEXÕES`,
`Movimento`, `Camada`, `Estado`), ele fala com a voz do instrumento, não com a
voz do vendedor. A mono é a linguagem do registro; a serifa é a linguagem do
critério; a sans é a linguagem da explicação.

### Escala

Fluida, com `clamp()`. Sem breakpoints de tipografia.

```
--step--1  0.78 → 0.84 rem   rótulos, metadados
--step-0   1.00 → 1.075 rem  corpo
--step-1   1.20 → 1.45 rem   lead
--step-2   1.50 → 2.00 rem   nome de módulo, nome de movimento
--step-3   2.00 → 3.20 rem   título de seção
--step-4   2.75 → 5.75 rem   título de página / herói
```

Pesos permitidos: `300` (lead), `350` (corpo), `400` (display, mono), `450/500`
(ênfase, rótulos). Nada acima de 500. **Não existe negrito neste site.** A
hierarquia vem de tamanho, cor e espaço — nunca de peso. Negrito é o recurso de
quem não confia na própria estrutura.

---

## Layout

- Frame: `1180px` máximo, com gutter fluido de `1.25rem` a `4rem`.
- Grade de seção: `170px | 1fr`. A coluna estreita da esquerda carrega **só o
  rótulo mono**. Esse vazio é o elemento mais caro do site e o mais importante:
  é o que faz a página parecer um relatório de instituto, não uma landing page.
  Abaixo de 780px a grade colapsa para uma coluna e o rótulo vira cabeçalho.
- Medida de leitura: `62ch`. Nunca ultrapassar.
- Espaçamento vertical entre seções: `--section-y`, de `4.5rem` a `9rem`.
- Raio de borda: **zero**, em todo o site. Nada aqui tem canto arredondado.
- Sombra: **nenhuma**. A separação é feita por fio de 1px e por cor de fundo.

---

## Assinatura

**A espiral logarítmica, plotada a partir da própria equação, desenhada no
carregamento da página.**

Ela não é um SVG de biblioteca. O `build.mjs` calcula `r(θ) = a · e^(bθ)` em 900
amostras e escreve o `path`. Os quatro pontos marcados na curva estão a uma volta
completa de distância um do outro — o mesmo ângulo, um nível acima. É a tese
inteira do método, desenhada, sem uma palavra.

A animação de `stroke-dashoffset` leva 2.6 segundos. É lenta de propósito. Um
visitante apressado não vê o desenho terminar — e essa é a primeira coisa que o
site diz sobre a Spiral.

**Esta é a única ousadia visual do site.** Tudo em volta é silêncio disciplinado.
Não adicionar uma segunda.

---

## Movimento

| Onde | O quê | Duração |
|---|---|---|
| Espiral do herói | Traço desenhado + 4 nós que aparecem em sequência | 2600ms |
| Blocos de seção | Fade + 18px de subida ao entrar na viewport | 900ms, escalonado em até 280ms |
| Cartão de módulo | Fundo clareia, conteúdo recua 1.25rem para dentro | 300ms |
| CTA do herói | O espaço entre texto e seta aumenta | 300ms |

Curva única: `cubic-bezier(0.22, 0.61, 0.36, 1)`. Desaceleração longa, sem
overshoot. Nada quica neste site.

`prefers-reduced-motion: reduce` desliga tudo. A espiral aparece já desenhada; os
blocos aparecem já opacos. Ninguém perde conteúdo por recusar movimento.

---

## Componentes

| Classe | O que é | Regra |
|---|---|---|
| `.label` | Rótulo mono dourado | Só nomeia. Nunca vende. |
| `.lead` | Parágrafo de abertura | Máximo `62ch`, peso 300. |
| `.movement` | Um dos quatro movimentos | Os numerais I–IV **só existem porque a ordem é real**. Se a sequência deixasse de ser sequência, os numerais sairiam. |
| `.module-card` | Linha de módulo na home | Nome / promessa / movimento. Três colunas, três informações. Nenhuma faz o trabalho da outra. |
| `.circuit` | Cadeia de conexão | Renderiza as arestas do grafo de módulos. |
| `.principles` | Lista de princípios | Serifa, um por linha, travessão dourado. |
| `.status` | Estado do módulo | Filete dourado à esquerda. Diz a verdade sobre o que existe e o que não existe. |

---

## Regra de Chanel

Antes de adicionar qualquer coisa a este site, remova uma.

O que já foi cortado e não deve voltar: gradientes, sombras, ícones ilustrativos,
fotos de banco de imagens, badges de tecnologia, contadores animados, depoimentos,
logos de clientes, botões preenchidos, cantos arredondados, negrito.
