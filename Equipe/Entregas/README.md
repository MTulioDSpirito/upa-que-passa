# Entregas — Fila de Sugestões da Equipe de Conteúdo

Aqui a Equipe (Kai, Vera, Theo) deixa rascunhos para os 5 admins revisarem. Ciclo de vida:

```
pendentes/   → Dara ainda não validou tecnicamente / Vic ainda não decidiu
aprovados/   → Vic aprovou o tom e os fatos, Dara validou schema e imagens — pronto pra um admin mesclar em data.ts
rejeitados/  → não vai ao site (comentário do motivo no topo do arquivo)
```

A página `/admin/sugestoes` no site lê `pendentes/` diretamente (via API route server-side) para os 5 admins verem o que a automação diária encontrou e decidirem manualmente o que entra. Mover um arquivo entre pastas (manual ou via subagente Vic) é o que muda o status.

Nomenclatura: `AAAA-MM-DD-<slug>.md` (notícia), `AAAA-MM-DD-<slug-jogo>-notas.md` (atualização de notas), `AAAA-MM-DD-<slug-jogo>-review.md` (review completa). Ver [[../Operacoes/Diretrizes/DI-002-convencoes-de-dados]].
