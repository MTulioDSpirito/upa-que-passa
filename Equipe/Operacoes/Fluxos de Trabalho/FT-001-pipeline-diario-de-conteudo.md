# FT-001 — Pipeline Diário de Conteúdo

- **Tipo:** Fluxo de Trabalho — composição multi-agente recorrente.
- **Donos:** Vic (orquestração e aprovação), Dara (validação técnica e merge)
- **Gatilho:** início de sessão diária, ou pedido explícito "roda o pipeline de hoje" / "atualiza o site com as novidades"

## Propósito

Transformar o que aconteceu no mundo PS5 nas últimas 24h em conteúdo publicado no site — sem nunca publicar um fato não verificado ou uma URL morta.

## Coreografia

### Passo 1 — Vic abre a sessão

Vic confere `Equipe/tarefas/abertas/` e `em-andamento/` primeiro — nada fica esquecido entre sessões.

### Passo 2 — Kai varre

Kai consulta [[../Diretrizes/DI-001-fontes-confiaveis]], busca o que é novo (lançamentos, patches, eventos, hardware), triangula com 2+ fontes, escreve rascunhos de notícia em `Entregas/AAAA-MM-DD-<slug>.md`.

### Passo 3 — Vera agrega notas (se aplicável)

Para todo jogo novo mencionado por Kai, ou qualquer jogo com nota desatualizada, Vera busca notas externas e escreve `Entregas/AAAA-MM-DD-<slug>-notas.md`.

### Passo 4 — Theo escreve review (se aplicável)

Se houver lançamento novo relevante (jogo em destaque, exclusivo PS5, nota alta), Theo escreve a review completa em `Entregas/AAAA-MM-DD-<slug>-review.md`.

### Passo 5 — Dara valida tudo

Para cada rascunho em `Entregas/` do dia:
1. Valida schema contra `types.ts`.
2. Roda `curl` em toda URL nova (ver [[../SOPs/SOP-003-verificar-imagem]]).
3. Se algo falhar, devolve ao especialista responsável com o motivo específico — não corrige o conteúdo editorial sozinha.

### Passo 6 — Vic revisa e aprova

Vic lê os rascunhos validados, confere tom e precisão, aprova ou pede ajuste.

### Passo 7 — Dara mescla

Dara escreve as entradas aprovadas em `src/lib/data.ts`, roda `npm run build` e `npm run lint`, confirma tudo verde.

### Passo 8 — Vic fecha o dia

Vic resume para o usuário: o que foi publicado, o que ficou pendente (vira tarefa em `Equipe/tarefas/abertas/` se não terminou), quantas URLs foram verificadas/rejeitadas.

## O que este fluxo NÃO faz

- Não roda sozinho sem uma sessão de LLM aberta — ver [[../Diretrizes/DI-003-backend-e-admins]] para o que falta para automação real 24/7.
- Não publica nada sem os dois portões (Dara técnico + Vic editorial).
- Não decide arquitetura de backend — isso é uma decisão de engenharia separada, não deste pipeline de conteúdo.
