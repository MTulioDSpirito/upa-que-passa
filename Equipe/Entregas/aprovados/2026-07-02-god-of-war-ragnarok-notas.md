<!-- aprovado por Vic em 2026-07-02 (revisão editorial FT-001 passo 6, lote de atualização geral) -->

---
jogo: god-of-war-ragnarok
metacriticScore: 94
openCriticScore: 92
userScore: 8.3
siteScores:
  - site: IGN
    score: 10
    fonte_url: https://www.ign.com/articles/god-of-war-ragnarok-review
  - site: Metacritic
    score: 94
    fonte_url: https://www.metacritic.com/game/playstation-5/god-of-war-ragnarok
  - site: OpenCritic
    score: 92
    fonte_url: https://opencritic.com/game/12919/god-of-war-ragnarok
  - site: GameSpot
    score: 9
    fonte_url: https://www.gamespot.com/reviews/god-of-war-ragnarok-review-blood-sweat-and-tyrs/1900-6417993/
  - site: Push Square
    score: 10
    fonte_url: https://www.pushsquare.com/reviews/ps5/god-of-war-ragnarok
  - site: GamesRadar
    score: 90
    fonte_url: https://www.gamesradar.com/god-of-war-ragnarok-review/
worldAvg: 9.4
validacao_dara:
  data: "2026-07-02"
  schema: "ok - campos batem com Game (metacriticScore, openCriticScore, userScore, siteScores[].site/score/fonte_url, worldAvg). Sem imagem nesta atualizacao, nao aplicavel curl."
  aritmetica_worldAvg: "confirmada - media simples dos 6 valores em siteScores (Metacritic normalizado /10): (10+9.4+9.2+9+10+9)/6=9.433 -> 9.4, bate com o proposto"
  fontes: "todas as 6 entradas de siteScores citam fonte_url - ok"
  decisao_vic: "remocao da Eurogamer de siteScores respeitada (decisao ja aprovada por Vic 2026-07-02)"
  pendencia_bloqueante: "nenhuma"
  validado_por: "Dara"
---

## Reagregação 2026-07-02 (FT-001)

Ordem de coleta seguida: RAWG primeiro (`api.rawg.io/api/games/god-of-war-ragnarok`) — retornou `metacritic: null` para este slug, sem uso; caiu para leitura manual de Metacritic/OpenCritic (DI-001 v2, passo 2) e notas por veículo (passo 3).

### Valor antigo → novo

| Campo | Antigo (data.ts) | Novo | Fonte |
|---|---|---|---|
| `metacriticScore` | 94 | **94 (sem mudança)** | metacritic.com/game/playstation-5/god-of-war-ragnarok (141 críticas) |
| `openCriticScore` | 94 | **92** | opencritic.com/game/12919/god-of-war-ragnarok (248 críticas, "Mighty") |
| `userScore` | 9.2 | **8.3** | Metacritic User Score PS5 (16.648 avaliações, "Generally Favorable") |
| GameSpot (siteScores) | 10 | **9** | Conversão do roundup — GameSpot não deu nota perfeita; consenso de imprensa cita "9 e 9.5" para o jogo, thegamer.com converteu a nota da GameSpot em 4.5/5 no roundup comparativo |
| GamesRadar (siteScores) | 90 | **90 (sem mudança)** | 4.5/5 estrelas = 90/100, confirmado |
| IGN / Push Square (siteScores) | 10 / 10 | **sem mudança** | IGN "masterpiece" 10/10; Push Square 10/10 confirmados |

### Discrepância grave: Eurogamer

O `data.ts` atual lista `Eurogamer: 100` dentro de `siteScores`, mas **essa nota não existe**. A Eurogamer não usa escala numérica desde fevereiro de 2015 (usa selos Essential/Recommended/Avoid) e só voltou a pontuar jogos em maio de 2023 — com um sistema de 5 estrelas, não 0-100. A review da Eurogamer para God of War Ragnarök (novembro de 2022) deu o selo **"Recommended"** (não o selo mais alto, "Essential"), sem nota numérica.

**Recomendação para a Dara:** remover a entrada `Eurogamer: 100` de `siteScores` — não há forma de converter "Recommended" em nota 0-10 sem estimar, o que viola o princípio operacional da Vera ("nunca estime, nunca copie a nota de outro jogo"). Removi a Eurogamer do cálculo do `worldAvg` acima (6 fontes em vez de 7). Se a Equipe quiser manter uma linha "Eurogamer" no card, sugiro trocar `score` por um badge textual, não numérico — mas isso é decisão de produto, não da Vera.

### avgPlayTime (enriquecimento, não afeta notas)

RAWG retornou `playtime: 0` para este slug (sem dado útil). HowLongToBeat (via busca estruturada, não navegação direta): Main Story ≈ 23h, Main + Extras ≈ 31h22min, Completionist ≈ 55-60h. O valor atual em `data.ts` ("25-35 horas") é compatível com a faixa Main Story→Main+Extras, não há necessidade de mudança.
