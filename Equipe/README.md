# Equipe de Conteúdo — Upa que Passa

Uma pasta de markdown que organiza como uma equipe de agentes de IA pesquisa, escreve, valida e publica conteúdo diário para o site (jogos, notas, notícias, reviews) — inspirada na arquitetura do WeWiki (`C:\Users\mtden\Downloads\WeWiki-Alunos-main`), adaptada de "conhecimento pessoal" para "operação editorial de um portal gamer".

## Como usar

### Manual (dentro de uma sessão do Claude Code)

1. Abra este projeto (`C:\Users\mtden\upa`) no Claude Code.
2. Invoque um especialista diretamente pelo subagente: `@kai-reporter`, `@vera-curadora-notas`, `@theo-redator-reviews`, `@dara-arquiteta-dados`, `@vic-editor-chefe` — cada um em `.claude/agents/`. Ou cole `Equipe/AGENTS.md` como primeira mensagem e converse com o Vic, que roteia.
3. Peça coisas como: *"Kai, veja o que saiu de notícia de PS5 hoje"*, *"Vera, atualiza a nota do Baldur's Gate 3"*, *"Theo, escreve a review do Alan Wake 2"*, *"Dara, valida esse rascunho antes de eu aprovar"*.

### Automático (todo dia, na nuvem)

Existe um agente agendado (`RemoteTrigger` id `trig_018q9aogsE5hLed31mjrpvgK`, https://claude.ai/code/routines) que roda **sozinho, todo dia às 8:07 (horário de São Paulo)**, contra o repositório privado `https://github.com/MTulioDSpirito/upa-que-passa`. Ele assume os papéis de Kai e Vera, pesquisa na web, escreve rascunhos em `Equipe/Entregas/pendentes/` e faz commit/push. **Isso roda na nuvem, não na sua máquina — o repositório local pode ficar desatualizado.** Rode `git pull` antes de abrir `/admin/sugestoes` se quiser ver o que a automação de hoje encontrou.

Os 5 admins (login em `/admin/login`, ver [[Operacoes/Diretrizes/DI-003-backend-e-admins]]) revisam a fila em `/admin/sugestoes`: aprovam (o arquivo vai para `Entregas/aprovados/`, mas **ainda precisa de um humano transformar isso numa entrada de `data.ts`** seguindo os SOPs) ou rejeitam.

## O que isso NÃO é

- Não publica sozinho no site. A automação diária só produz rascunhos — a Dara (humana ou subagente, sob aprovação de um admin) ainda mescla manualmente em `src/lib/data.ts`, com verificação de imagem via `curl` obrigatória (ver [[Operacoes/SOPs/SOP-003-verificar-imagem]]).
- Não roda no seu computador local — a automação diária é um agente na nuvem, isolado, com seu próprio checkout git. Ele não vê seus arquivos locais nem seu banco SQLite local.
- Não substitui o CLAUDE.md da raiz do projeto — aquele arquivo continua sendo a fonte de verdade sobre como o *código* do site funciona. Esta pasta é sobre como o *conteúdo* é produzido.

## Mapa rápido

- `AGENTS.md` — contrato raiz, leia primeiro.
- `agent-index.md` — tabela de roteamento.
- `<Nome> - <Papel>/AGENTS.md` — um contrato por especialista.
- `Operacoes/SOPs/` — procedimentos passo a passo.
- `Operacoes/Fluxos de Trabalho/` — o pipeline diário completo.
- `Operacoes/Diretrizes/` — fontes confiáveis, convenções de dados, estado do backend.
- `tarefas/` — trabalho pendente entre sessões.
- `Entregas/` — rascunhos prontos esperando aprovação.
