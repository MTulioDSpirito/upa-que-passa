<!-- aprovado por Vic em 2026-07-02 (revisão editorial FT-001 passo 6, lote de atualização geral) -->

---
jogo: spider-man-2
metacriticScore: 90
openCriticScore: 88
userScore: 8.6
siteScores:
  - site: IGN
    score: 8
    fonte_url: https://n4g.com/news/2570985/marvels-spider-man-2-review-ign
  - site: Metacritic
    score: 90
    fonte_url: https://www.metacritic.com/game/marvels-spider-man-2/
  - site: OpenCritic
    score: 88
    fonte_url: https://opencritic.com/game/15052/marvels-spider-man-2
  - site: GameSpot
    score: 8
    fonte_url: https://www.gamespot.com/reviews/marvels-spider-man-2-review-web-warriors/1900-6418134/
  - site: Push Square
    score: 8
    fonte_url: https://www.pushsquare.com/reviews/ps5/marvels-spider-man-2
worldAvg: 8.4
validacao_dara:
  data: "2026-07-02"
  schema: "ok - campos batem com Game. Sem imagem nesta atualizacao, nao aplicavel curl."
  aritmetica_worldAvg: "confirmada - media dos 5 valores em siteScores (Metacritic /10): (8+9.0+8.8+8+8)/5=8.36 -> 8.4, bate com o proposto"
  diff_vs_datats: "conferido linha a linha contra src/lib/data.ts atual (id 2) - todos os valores 'antigo' no rascunho batem com o que esta hoje em producao"
  fontes: "todas as entradas de siteScores citam fonte_url - ok"
  pendencia_bloqueante: "nenhuma"
  validado_por: "Dara"
---

## Reagregação 2026-07-02 (FT-001)

RAWG (`api.rawg.io/api/games/marvels-spider-man-2`) não trouxe `metacritic` preenchido, mas trouxe `playtime: 26h` (nota abaixo). Notas em si vieram de leitura manual Metacritic/OpenCritic + veículos, conforme DI-001 v2.

### Valor antigo → novo

| Campo | Antigo | Novo | Fonte |
|---|---|---|---|
| `metacriticScore` | 90 | **90 (sem mudança)** | metacritic.com/game/marvels-spider-man-2 (145 críticas) |
| `openCriticScore` | 91 | **88** | opencritic.com/game/15052/marvels-spider-man-2 (211 críticas, "Mighty") |
| `userScore` | 8.9 | **8.6** | Metacritic User Score (11.292 avaliações, "Generally Favorable") |
| IGN (siteScores) | 9 | **8** | IGN deu 8/10 — não achei a nota antiga bater com a review real |
| GameSpot (siteScores) | 90 (=9.0) | **8** | GameSpot review "Web Warriors" — 8/10 |
| Push Square (siteScores) | 90 (=9.0) | **8** | Push Square review — 8/10 |

Todas as notas por veículo caíram em relação ao que estava cadastrado — não é review-bombing nem mudança editorial, é correção: os valores de `data.ts` não batiam com as reviews publicadas originalmente (IGN, GameSpot e Push Square deram 8/10, não 9/10 como estava registrado).

### avgPlayTime (enriquecimento, não afeta notas)

RAWG trouxe `playtime: 26 horas (média)` — mais específico que o atual "18-25 horas" mas na mesma faixa. HowLongToBeat (busca estruturada): Main Story ≈ 15-20h, Main+Extras ≈ 23.4h, Completionist ≈ 27-35h. Sugiro manter "18-25 horas" (bate com Main Story) ou considerar ajustar para refletir Main+Extras — decisão de produto, não fiz a troca aqui.
