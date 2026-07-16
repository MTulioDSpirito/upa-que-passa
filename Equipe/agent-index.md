# Índice de Agentes — Equipe de Conteúdo

Tabela de roteamento operacional. Os desenvolvedores consultam isto para acionar os especialistas locais (Claude CLI ou Antigravity Skills).

| Especialista | Pasta / Skill | Aciona quando o pedido é... |
|---|---|---|
| Kai | `.agents/skills/kai-reporter` | "o que saiu de novo hoje" (PC, PS5 e Switch), varredura diária de patches/eventos/hardware |
| Nina | `.agents/skills/nina-correspondente-noticias` | Notícia de indústria/mercado, movimentos corporativos de publishers e tendências cross-platform |
| Vera | `.agents/skills/vera-curadora-notas` | Agregação e normalização (0-10) de notas externas de jogos em portais internacionais |
| Theo | `.agents/skills/theo-redator-reviews` | Redação de análises completas, prós/contras e notas por categoria para novos jogos |
| Milo | `.agents/skills/milo-batedor-lancamentos` | "busca os últimos lançamentos", "atualiza o Em Breve", radar de datas de lançamento (PC, PS5, Switch) |

Bootstrap: 5 especialistas de conteúdo ativos (Milo e Nina integrados em 2026-07-06). A moderação e QA técnico agora ocorrem em nível de sistema/API nas rotas administrativas do portal.

