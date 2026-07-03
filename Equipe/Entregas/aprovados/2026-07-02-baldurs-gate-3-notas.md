<!-- aprovado por Vic em 2026-07-02 (revisão editorial FT-001 passo 6, lote de atualização geral) -->

---
jogo: baldurs-gate-3
metacriticScore: 96
openCriticScore: 96
userScore: 8.7
siteScores:
  - site: IGN
    score: 10
    fonte_url: https://www.forbes.com/sites/paultassi/2023/08/19/baldurs-gate-3-lands-an-ign-1010-metascore-has-ticked-down-to-tie-tears/
  - site: Metacritic
    score: 96
    fonte_url: https://www.metacritic.com/game/playstation-5/baldurs-gate-3/critic-reviews
  - site: OpenCritic
    score: 96
    fonte_url: https://opencritic.com/game/9136/baldurs-gate-3
  - site: GameSpot
    score: 10
    fonte_url: https://www.gamespot.com/reviews/baldurs-gate-3-review-let-freedom-reign/1900-6418131/
  - site: Eurogamer
    score: 80
    fonte_url: https://www.eurogamer.net/baldurs-gate-3-review
worldAvg: 9.4
validacao_dara:
  data: "2026-07-02"
  schema: "ok - campos batem com Game. Sem imagem nesta atualizacao, nao aplicavel curl."
  aritmetica_worldAvg: "confirmada - media dos 5 valores em siteScores (Metacritic /10, Eurogamer mantida aqui com 80=8.0): (10+9.6+9.6+10+8.0)/5=9.44 -> 9.4, bate com o proposto"
  diff_vs_datats: "conferido contra src/lib/data.ts atual (id 4) - valores 'antigo' batem"
  decisao_vic: "nota: a remocao da Eurogamer so foi aprovada para god-of-war-ragnarok; aqui a Eurogamer foi mantida com valor corrigido (80, de 4/5 estrelas) em vez de removida - consistente, nao e o mesmo caso"
  fontes: "todas as entradas de siteScores citam fonte_url - ok"
  pendencia_bloqueante: "nenhuma"
  validado_por: "Dara"
---

## Reagregação 2026-07-02 (FT-001)

RAWG (`api.rawg.io/api/games/baldurs-gate-3`) confirmou `metacritic: 97` — mas esse é o valor "congelado" do lançamento (PC, poucas reviews). Leitura manual direta da página Metacritic PS5 mostra **96** hoje, com 39 críticas (mais reviews entraram desde o lançamento e baixaram a média em 1 ponto). Fica registrada a divergência RAWG × Metacritic manual: usei a leitura manual por ser mais recente e específica da plataforma PS5, como manda DI-001 v2 (RAWG cai para leitura manual quando o valor não bate).

### Valor antigo → novo

| Campo | Antigo | Novo | Fonte |
|---|---|---|---|
| `metacriticScore` | 97 | **96** | metacritic.com/game/playstation-5/baldurs-gate-3/critic-reviews (39 críticas — RAWG ainda mostra 97, desatualizado) |
| `openCriticScore` | 96 | **96 (sem mudança)** | opencritic.com/game/9136/baldurs-gate-3 (166 críticas, "Mighty", 100 percentil) |
| `userScore` | 9.5 | **8.7** | Metacritic User Score PS5 (~1.419 avaliações, "Generally Favorable") — nota de usuário do PC é 9.1, mas usei a nota PS5 por ser o público-alvo do UQP |
| IGN / GameSpot (siteScores) | 10 / 100 (=10.0) | **sem mudança** | ambos confirmados 10/10 |
| Eurogamer (siteScores) | 100 (=10.0) | **80 (=8.0)** | Eurogamer mudou para sistema de 5 estrelas em maio/2023 (antes usava selos sem número) — deu **4/5 estrelas** para Baldur's Gate 3, não nota máxima. Há registro público de que a nota da Eurogamer "puxou para baixo" a média do Metacritic, o que corrobora o 4/5 (e não um 5/5) |

**Atenção:** essa é a segunda vez nesta reagregação (ver também `god-of-war-ragnarok`) que a Eurogamer aparece cadastrada com nota 100/10.0 no `data.ts` sem lastro real — recomendo à Dara revisar todas as entradas "Eurogamer" no catálogo, já que o site mudou de sistema de pontuação mais de uma vez (selos até 2015 → sem nota 2015-2023 → 5 estrelas desde mai/2023) e claramente alguém preencheu esses campos sem checar a fonte.

### avgPlayTime (enriquecimento, não afeta notas)

RAWG trouxe `playtime: 20 horas` — muito abaixo da realidade (HowLongToBeat, busca estruturada: Main Story ≈ 68-72h, Main+Extras ≈ 113-114h, Completionist ≈ 150-163h). **Não confiável.** O valor atual em `data.ts` ("80-200 horas") está mais alinhado com a realidade do jogo (Main+Extras até Completionist) e não precisa mudar.
