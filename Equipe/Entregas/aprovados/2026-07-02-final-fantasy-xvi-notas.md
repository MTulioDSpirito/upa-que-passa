<!-- aprovado por Vic em 2026-07-02 (revisão editorial FT-001 passo 6, lote de atualização geral) -->

---
jogo: final-fantasy-xvi
metacriticScore: 87
openCriticScore: 87
userScore: 8.4
siteScores:
  - site: IGN
    score: 9
    fonte_url: https://gamefaqs.gamespot.com/boards/300958-final-fantasy-xvi/80484790
  - site: Metacritic
    score: 87
    fonte_url: https://www.metacritic.com/game/final-fantasy-xvi/
  - site: OpenCritic
    score: 87
    fonte_url: https://opencritic.com/game/14516/final-fantasy-xvi
  - site: GameSpot
    score: 9
    fonte_url: https://www.gamespot.com/reviews/final-fantasy-16-review-on-its-own-terms/1900-6418081/
worldAvg: 8.9
validacao_dara:
  data: "2026-07-02"
  schema: "ok - campos batem com Game. Sem imagem nesta atualizacao, nao aplicavel curl."
  aritmetica_worldAvg: "confirmada - media dos 4 valores em siteScores (Metacritic /10): (9+8.7+8.7+9)/4=8.85 -> 8.9, bate com o proposto"
  diff_vs_datats: "conferido contra src/lib/data.ts atual (id 3) - valores 'antigo' batem"
  fontes: "todas as entradas de siteScores citam fonte_url - ok"
  pendencia_bloqueante: "nenhuma"
  validado_por: "Dara"
---

## Reagregação 2026-07-02 (FT-001)

RAWG (`api.rawg.io/api/games/final-fantasy-xvi`) trouxe `metacritic: 88` — **não bate** com a nota manual confirmada (87, tanto na leitura direta da página quanto em fonte de imprensa terciária). Por DI-001 v2, RAWG é primário para ficha técnica, mas a leitura manual do Metacritic é o fallback e, em caso de conflito direto no próprio número da nota, priorizei a leitura manual da página (mais específica: 87 confirmado na página PS5 e na página geral, com 146 críticas).

### Valor antigo → novo

| Campo | Antigo | Novo | Fonte |
|---|---|---|---|
| `metacriticScore` | 87 | **87 (sem mudança)** | metacritic.com/game/final-fantasy-xvi (146 críticas) — RAWG divergiu (88), não usado |
| `openCriticScore` | 87 | **87 (sem mudança)** | opencritic.com/game/14516/final-fantasy-xvi (206 críticas, "Mighty") |
| `userScore` | 8.6 | **8.4** | Metacritic User Score (10.171 avaliações, "Generally Favorable") |
| IGN (siteScores) | 9 | **9 (sem mudança)** | confirmado 9/10 |
| GameSpot (siteScores) | 80 (=8.0) | **9** | GameSpot deu "Superb" = 9/10, não 8/10 como estava cadastrado |
| `worldAvg` | 8.7 | **8.9** | recalculado com os 4 valores acima |

### avgPlayTime (enriquecimento, não afeta notas)

RAWG trouxe `playtime: 16 horas` — muito abaixo do que qualquer fonte de HowLongToBeat indica (a busca estruturada aponta Main Story ≈ 35h, Main+Extras ≈ 45-55h, Completionist ≈ 70-90h), então **não é confiável**, provavelmente reflete dado incompleto da comunidade RAWG. O valor atual em `data.ts` ("35-50 horas") já está alinhado com Main Story → Main+Extras do HLTB; não há necessidade de mudança.
