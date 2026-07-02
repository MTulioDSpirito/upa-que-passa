# Equipe de Conteúdo — Upa que Passa

Uma pasta de markdown que organiza como uma equipe de agentes de IA pesquisa, escreve, valida e publica conteúdo diário para o site (jogos, notas, notícias, reviews) — inspirada na arquitetura do WeWiki (`C:\Users\mtden\Downloads\WeWiki-Alunos-main`), adaptada de "conhecimento pessoal" para "operação editorial de um portal gamer".

## Como usar

1. Abra este projeto (`C:\Users\mtden\upa`) no Claude Code.
2. Cole o conteúdo de `Equipe/AGENTS.md` como primeira mensagem (ou peça "ative a equipe de conteúdo").
3. O modelo assume a identidade do Vic (Editor-Chefe) e roteia pedidos para Kai, Vera, Theo ou Dara.
4. Peça coisas como: *"Kai, veja o que saiu de notícia de PS5 hoje"*, *"Vera, atualiza a nota do Baldur's Gate 3"*, *"Theo, escreve a review do Alan Wake 2"*, *"Dara, valida esse rascunho antes de eu aprovar"*.

## O que isso NÃO é

- Não é um cron job automático rodando sozinho no seu computador. É um protocolo que qualquer sessão de LLM (Claude Code, etc.) segue quando você pede para o time trabalhar. Automação real 24/7 (rodar sem você abrir uma sessão) exige infraestrutura própria — servidor, agendador, backend — que ainda não existe neste projeto. Ver [[Operacoes/Diretrizes/DI-003-backend-e-admins]].
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
