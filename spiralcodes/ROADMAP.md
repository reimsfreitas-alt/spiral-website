# ROADMAP

---

## Estado real, hoje

| Ativo | Estado |
|---|---|
| Sede institucional (`spiralcodes.com.br`) | **Construída.** 17 páginas, 2 idiomas, pronta para deploy. |
| Spiral Vision | Em produção. |
| Spiral Ledger | Em produção. Integração Vision/Ledger operacional. |
| Spiral Enterprise | Construído. Dois blocos vermelhos abertos no teste de estresse: agendamento do `feed-dli` e propagação do `LEDGER_TOKEN`. |
| Spiral Vita | App Android, v1.5.1, pacote de publicação pronto. |
| Spiral Elf | Em desenvolvimento. |
| Spiral Dojo | Landing construída. Formação não iniciada. |
| Biblioteca Spiral | 6 obras. Catálogo consolidado. |
| **Pipeline comercial** | **Zero.** Nenhuma reunião realizada. Nenhuma conversa iniciada. |

A última linha é a única que importa nesta fase, e este documento é organizado
em torno dela.

---

## Fase 0 — A única fase que existe agora

**Objetivo: sair de zero conversas para a primeira conversa real.**

O site não é o objetivo. O site é o cartão de entrada. Ele só produz valor no
instante em que é *enviado a alguém* que decide.

- [ ] **Deploy em `spiralcodes.com.br`.** Um dia de trabalho. Não mais.
- [ ] **Fechar os dois blocos vermelhos do Enterprise** (`feed-dli`, `LEDGER_TOKEN`).
      Nenhuma demonstração pode ser marcada antes disso.
- [ ] **Escolher 10 alvos** do mapa de 100 (logística, portos, ferrovias). Dez.
      Não cem. Dez nomes, com nome e sobrenome de pessoa, não de empresa.
- [ ] **Enviar 10 mensagens.** Uma frase de contexto, um link para
      `/pt/spiral-enterprise/`, uma pergunta. Sem anexo. Sem deck.
- [ ] **Marcar 1 conversa.** Não uma venda — uma conversa.
- [ ] **Rodar 1 piloto** sob o Termo Comercial de Piloto já escrito.

**Critério de saída da Fase 0:** um piloto assinado. Enquanto isso não acontecer,
nada abaixo desta linha deve receber uma hora de trabalho.

---

## O risco estrutural, nomeado

A Spiral produz artefatos intelectuais com uma facilidade incomum. Tratado, cânone,
white paper, romance, painel executivo, landing, e agora uma sede institucional
completa — tudo isso existe, e tudo isso é bom.

**Nada disso gerou uma reunião ainda.**

Existe um padrão a vigiar: cada vez que o contato com o mercado se aproxima, um
novo artefato aparece e adia o contato — legitimamente, porque o artefato é
mesmo necessário, e é mesmo bem-feito. É a forma mais elegante possível de
procrastinação, e a mais difícil de detectar, porque produz trabalho real.

O antídoto não é parar de construir. É **subordinar a construção ao contato**:
nenhum artefato novo entra na fila enquanto a Fase 0 não fechar.

Este parágrafo está dentro do repositório, versionado, de propósito. Ele deve
incomodar toda vez que alguém abrir este arquivo.

---

## Fase 1 — Depois do primeiro piloto (e não antes)

**Do site:**
- [ ] Self-hosting das fontes (fecha a última dependência de terceiros e a última
      fuga de dados de visitante para o Google). ~2h.
- [ ] Auditoria Lighthouse em ambiente real. Meta: 100/100/100/100.
- [ ] Página `/{locale}/instituicao/` — a doutrina em página própria, hoje resumida
      na home.
- [ ] Página da Biblioteca com download real dos PDFs.

**Do produto:**
- [ ] Estudo de caso do piloto — o primeiro número real de DLI medido em campo.
      Este documento vale mais do que os seis livros somados, do ponto de vista
      comercial. É o que converte a segunda conversa.
- [ ] Spiral Vita na Play Store.

---

## Fase 2 — Depois do segundo cliente

- [ ] Terceiro idioma (`/es`) — o custo é um arquivo JSON.
- [ ] Spiral Elf em desenvolvimento ativo.
- [ ] Spiral Dojo: primeira turma.
- [ ] Materialização do módulo Meet, se e somente se um cliente pedir.

---

## Fase 3 — Longo prazo (relógio longo)

- [ ] Transformar o critério em algo que caminhe sem o fundador — o teste declarado
      em *O Construtor de Séculos*. Sucessão de julgamento, não de cargo.
- [ ] Abrir a Biblioteca como acervo permanente.
- [ ] Formalizar a instituição para além da empresa.

---

## Regra de priorização

Antes de adicionar qualquer item a este roadmap:

> **Isto aproxima ou afasta a primeira conversa comercial?**

Se afasta — mesmo que seja excelente, mesmo que seja necessário, mesmo que seja
belo — ele vai para a Fase 1.
