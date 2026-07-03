<!-- aprovado por Vic em 2026-07-02 (revisão editorial FT-001 passo 6, lote de atualização geral) -->

---
jogo: alan-wake-2
metacriticScore: 89
openCriticScore: 89
userScore: 8.5
siteScores:
  - site: IGN
    score: 90
    fonte_url: https://gamefaqs.gamespot.com/boards/344537-alan-wake-ii/80603451
  - site: Metacritic
    score: 89
    fonte_url: https://www.metacritic.com/game/alan-wake-ii/
  - site: OpenCritic
    score: 89
    fonte_url: https://opencritic.com/game/15022/alan-wake-2
  - site: GameSpot
    score: 100
    fonte_url: https://www.gamespot.com/reviews/alan-wake-2-review-a-miracle-illuminated/1900-6418143/
worldAvg: 9.2
validacao_dara:
  data: "2026-07-02"
  schema: "ok - campos batem com Game. Sem imagem nesta atualizacao, nao aplicavel curl."
  aritmetica_worldAvg: "confirmada - media dos 4 valores em siteScores (Metacritic /10): (9.0+8.9+8.9+10.0)/4=9.2, bate com o proposto"
  diff_vs_datats: "conferido contra src/lib/data.ts atual (id 6) - valores 'antigo' batem"
  fontes: "todas as entradas de siteScores citam fonte_url - ok"
  pendencia_bloqueante: "nenhuma"
  validado_por: "Dara"
---

## Reagregação 2026-07-02 (FT-001)

RAWG (`api.rawg.io/api/games/alan-wake-2`) retornou `metacritic: null` — sem uso; leitura manual conforme DI-001 v2.

### Valor antigo → novo

| Campo | Antigo | Novo | Fonte |
|---|---|---|---|
| `metacriticScore` | 89 | **89 (sem mudança)** | metacritic.com/game/alan-wake-ii (71 críticas) |
| `openCriticScore` | 89 | **89 (sem mudança)** | opencritic.com/game/15022/alan-wake-2 (175 críticas, "Mighty", 93% recomendam) |
| `userScore` | 8.8 | **8.5** | Metacritic User Score (4.543 avaliações, "Generally Favorable") |
| IGN (siteScores) | 90 (=9.0) | **90/9.0 (sem mudança)** | confirmado 9/10 |
| GameSpot (siteScores) | 90 (=9.0) | **100 (=10.0)** | GameSpot deu nota máxima 10/10 ("A Miracle Illuminated"), não 9/10 como estava cadastrado |
| `worldAvg` | 8.9 | **9.2** | recalculado |

### avgPlayTime (enriquecimento, não afeta notas)

RAWG trouxe `playtime: 0` (sem dado útil). HowLongToBeat (busca estruturada): Main Story ≈ 12-14.5h, Main+Extra ≈ 20-24h, Completionist ≈ 28-30h. O valor atual em `data.ts` ("15-20 horas") está alinhado com a faixa Main Story→Main+Extra; não há necessidade de mudança.
