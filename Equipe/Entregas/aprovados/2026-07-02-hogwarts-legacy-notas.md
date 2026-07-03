<!-- aprovado por Vic em 2026-07-02 (revisão editorial FT-001 passo 6, lote de atualização geral) -->

---
jogo: hogwarts-legacy
metacriticScore: 84
openCriticScore: 84
userScore: 8.1
siteScores:
  - site: IGN
    score: 9
    fonte_url: https://x.com/Okami13_/status/1622554511561695233
  - site: Metacritic
    score: 84
    fonte_url: https://www.metacritic.com/game/playstation-5/hogwarts-legacy
  - site: OpenCritic
    score: 84
    fonte_url: https://opencritic.com/game/13898/hogwarts-legacy
worldAvg: 8.6
validacao_dara:
  data: "2026-07-02"
  schema: "ok - campos batem com Game. Sem imagem nesta atualizacao, nao aplicavel curl."
  aritmetica_worldAvg: "confirmada - media dos 3 valores em siteScores (Metacritic /10): (9+8.4+8.4)/3=8.6, bate com o proposto"
  diff_vs_datats: "conferido contra src/lib/data.ts atual (id 5) - valores 'antigo' batem"
  fontes: "todas as entradas de siteScores citam fonte_url - ok"
  pendencia_bloqueante: "nenhuma"
  validado_por: "Dara"
---

## Reagregação 2026-07-02 (FT-001)

RAWG (`api.rawg.io/api/games/hogwarts-legacy`) retornou `metacritic: null` para este slug — sem uso; segui para leitura manual (DI-001 v2, passo 2).

### Valor antigo → novo

| Campo | Antigo | Novo | Fonte |
|---|---|---|---|
| `metacriticScore` | 84 | **84 (sem mudança)** | metacritic.com/game/playstation-5/hogwarts-legacy (96 críticas) |
| `openCriticScore` | 84 | **84 (sem mudança)** | opencritic.com/game/13898/hogwarts-legacy (179 críticas, "Mighty", 88% recomendam) |
| `userScore` | 8.8 | **8.1** | Metacritic User Score PS5 (6.783 avaliações, "Generally Favorable") |
| IGN (siteScores) | 85 (=8.5) | **9** | round-up de lançamento (KAMI/X, com fonte cruzada de PSU-10, PowerUp-9, WellPlayed-9, GameRant-4.5/5, PushSquare-8, VGC-4/5) mostra IGN deu **9/10**, não 8.5/10 como estava cadastrado |
| `worldAvg` | 8.4 | **8.6** | recalculado |

A queda do `userScore` (8.8 → 8.1) é consistente com o histórico do jogo: Hogwarts Legacy teve boicotes e controvérsia pública (ligada à autora de Harry Potter) que geraram um volume relevante de reviews negativas de usuários ao longo do tempo — vale mencionar isso ao Theo se ele for escrever/atualizar a review, já que é uma explicação editorial relevante para a discrepância crítica × usuário.

### avgPlayTime (enriquecimento, não afeta notas)

RAWG trouxe `playtime: 30 horas`, dentro da faixa atual. HowLongToBeat (busca estruturada): Main Story ≈ 26.5h, Main+Extra ≈ 24-48h, Completionist ≈ 67.5h. O valor atual em `data.ts` ("30-60 horas") é compatível com Main+Extra→Completionist; não há necessidade de mudança.
