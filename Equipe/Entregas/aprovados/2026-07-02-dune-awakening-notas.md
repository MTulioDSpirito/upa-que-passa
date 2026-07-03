<!-- aprovado por Vic em 2026-07-02 (revisão editorial FT-001 passo 6) -->

---
jogo: Dune: Awakening
slug: dune-awakening
status_nota: PROVISÓRIA — versão PC (2025). PS5 ainda não lançou (previsto 22/09/2026 via PS Blog). Reagregar assim que embargo de review PS5 abrir.
metacriticScore: 78
metacriticScore_plataforma: PC
metacriticScore_fonte_url: https://www.metacritic.com/game/dune-awakening/
metacriticScore_amostra: 62 reviews de críticos ("Generally Favorable")
openCriticScore: 81
openCriticScore_plataforma: PC
openCriticScore_fonte_url: https://opencritic.com/game/18178/dune-awakening
openCriticScore_amostra: 66 reviews ("Strong", top 17%, 79% recomendam)
userScore: 6.1
userScore_fonte: Metacritic User Score (PC)
userScore_fonte_url: https://www.metacritic.com/game/dune-awakening/user-reviews/
userScore_amostra: 208 avaliações de usuários ("Mixed or Average")
userScore_alternativa_steam: 7.2
userScore_alternativa_steam_detalhe: "72% positivas (Mostly Positive), 45.991 reviews em inglês / 65.814 em todos os idiomas — checado direto na Steam Store em 2026-07-02"
userScore_alternativa_steam_fonte_url: https://store.steampowered.com/app/1172710/Dune_Awakening/
siteScores:
  - site: IGN
    score: 8
    fonte_url: https://www.ign.com/articles/dune-awakening-review
    nota_original: "8/10 (Travis Northup)"
  - site: GameSpot
    score: 7
    fonte_url: https://www.gamespot.com/reviews/dune-awakening-review/1900-6418381/
    nota_original: "7/10 (Cameron Koch) — 'To Tame A Land'"
  - site: Eurogamer
    score: 8
    fonte_url: https://www.eurogamer.net/dune-awakening-review
    nota_original: "4/5 (Connor Makar), normalizado score/5*10"
  - site: PC Gamer
    score: 8
    fonte_url: https://www.pcgamer.com/games/mmo/dune-awakening-review/
    nota_original: "80/100 (Christopher Livingston), normalizado score/10"
  - site: Push Square
    score: pendente
    fonte_url: null
    nota_original: "Push Square não publicou review — cobertura PS-only, PS5 ainda não lançou. Verificar novamente perto de 22/09/2026."
worldAvg: 7.8
worldAvg_formula: "média simples de IGN(8) + GameSpot(7) + Eurogamer(8) + PC Gamer(8) = 31/4 = 7.75, arredondado para 7.8 (Metacritic e OpenCritic ficam fora do worldAvg — são campos próprios, conforme AGENTS.md da Vera)"
validacao_dara:
  data: "2026-07-02"
  schema: "OK, com uma ressalva. metacriticScore (78) e openCriticScore (81) foram mantidos na escala nativa 0-100 — correto: conferi contra entradas existentes em src/lib/data.ts (ex.: God of War Ragnarök tem metacriticScore: 94 e openCriticScore: 94, ambos 0-100) e é a mesma convenção usada em todo o catálogo. userScore (6.1) e siteScores[] (IGN 8.0, GameSpot 7.0, Eurogamer 8.0, PC Gamer 8.0) estão corretamente normalizados para 0-10, com a conta de normalização documentada por item (Eurogamer 4/5→8.0, PC Gamer 80/100→8.0). worldAvg (7.8) confere com a média dos siteScores já normalizados. Nenhum campo ad-hoc entrou nos campos que vão para Game — os extras (metacriticScore_plataforma, _fonte_url, _amostra, etc.) são metadados de proveniência da Vera, não campos de types.ts, e não devem ser copiados ao objeto Game no merge. RESSALVA: 'status_nota' (aviso de nota provisória baseada na versão PC) não tem campo correspondente em Game (types.ts) — não há lugar estruturado para marcar isso no site hoje. Sinalizando para Vic decidir: usar tags (ex. 'nota provisória — versão PC') ou aguardar Theo escrever o aviso no texto editorial da review. Isso NÃO bloqueia o merge da ficha técnica/notas em si, só precisa de uma decisão de produto antes de publicar a página do jogo."
  urls_testadas:
    - url: "https://media.rawg.io/media/games/593/593c074cdf1ea15b8c9a2513676020e6.jpg"
      status: 200
      obs: "capa candidata (background_image). Confirmado via RAWG detail API (id 840775, slug dune-awakening, name 'Dune: Awakening') que esta é a background_image oficial do jogo certo — bate exatamente com o que a Vera extraiu."
    - url: "https://media.rawg.io/media/screenshots/e87/e8772839436dd66bebeef5eb69398539.jpg"
      status: 200
      obs: "screenshot 1 (short_screenshots[]). Confirmado via RAWG search API que pertence ao resultado id 840775 'Dune: Awakening' (não confundido com 'Phoenotopia: Awakening' ou 'Shadows: Awakening', que também aparecem na busca)."
    - url: "https://media.rawg.io/media/screenshots/add/add325dc8cc03cc370aaaf5c7dd126f6.jpg"
      status: 200
      obs: "screenshot 2 (short_screenshots[]). Mesma confirmação de propriedade do jogo via RAWG search API."
  capa_final_recomendada: "https://media.rawg.io/media/games/593/593c074cdf1ea15b8c9a2513676020e6.jpg"
  gallery_recomendada:
    - "https://media.rawg.io/media/screenshots/e87/e8772839436dd66bebeef5eb69398539.jpg"
    - "https://media.rawg.io/media/screenshots/add/add325dc8cc03cc370aaaf5c7dd126f6.jpg"
  pendencias: "avgPlayTime pendente (sinalizado pela Vera, campo opcional em Game — NÃO bloqueia); decisão de produto sobre como marcar 'nota provisória (versão PC)' no site (ver ressalva de schema acima); userScore oficial a decidir entre Metacritic User (6.1, usado no rascunho) e Steam Review % (7.2, alternativa documentada) — decisão de Vic/Vera, não uma questão de schema."
---

## Resumo e avisos importantes

**Estas notas são inteiramente da versão PC (lançada em 10/06/2025).** A versão PS5 de Dune: Awakening só chega em 22/09/2026 (data confirmada por Kai via PS Blog — prioridade absoluta sobre a data da RAWG em caso de divergência, conforme DI-001 v2). Não existe nenhuma crítica de PS5 ainda; Push Square, que é o site PlayStation-only da nossa lista, ainda não cobriu o jogo por esse motivo. **Recomendo que a ficha no site marque essas notas como "nota provisória (baseada na versão PC)"** até o lançamento PS5 e reagregação.

## Fontes consultadas, na ordem do contrato (DI-001 v2)

### 1. RAWG API (fonte primária de ficha técnica)

- Busca: `https://api.rawg.io/api/games?key=<RAWG_API_KEY>&search=dune%20awakening` → encontrado `slug: dune-awakening`, `id: 840775`.
- Detalhe: `https://api.rawg.io/api/games/dune-awakening?key=<RAWG_API_KEY>`.
- **Importante:** o campo `metacritic` da RAWG veio `null` para este jogo — não é a fonte confiável de nota aqui. Caí para o passo 2 do contrato (leitura manual do Metacritic), como previsto na DI-001 v2 ("sem chave/sem dado, caia para o passo 2" — aqui a chave existe mas o dado está ausente).
- RAWG confirmou: `released: 2025-06-10` (PC), `developers: Funcom`, `publishers: Funcom`, `genres: Action, Adventure, RPG, Massively Multiplayer`, `platforms: PC, PlayStation 5, Xbox Series S/X`.

### 2. Metacritic (leitura manual, fallback)

- https://www.metacritic.com/game/dune-awakening/ — Critic Score **78/100** (PC), 62 reviews, "Generally Favorable".
- User Score **6.1/10**, 208 avaliações, "Mixed or Average".

### 3. OpenCritic

- https://opencritic.com/game/18178/dune-awakening — **81/100** (Top Critic Average), 66 críticas, classificação "Strong", top 17%, 79% recomendam.
- Confirmei também as notas individuais via https://opencritic.com/game/18178/dune-awakening/reviews, que bateram com a leitura direta de cada site (ver abaixo).

### 4. Notas por veículo (siteScores)

| Site | Nota original | Normalizado (0-10) | Fonte |
|---|---|---|---|
| IGN | 8/10 | 8.0 | https://www.ign.com/articles/dune-awakening-review |
| GameSpot | 7/10 | 7.0 | https://www.gamespot.com/reviews/dune-awakening-review/1900-6418381/ |
| Eurogamer | 4/5 | 8.0 | https://www.eurogamer.net/dune-awakening-review |
| PC Gamer | 80/100 | 8.0 | https://www.pcgamer.com/games/mmo/dune-awakening-review/ |
| Push Square | — | pendente | Ainda não coberto (jogo PS-only site, aguardando lançamento PS5) |

Observação de coleta: `eurogamer.net` bloqueia o WebFetch direto (403/inacessível ao user-agent do Claude) e não está liberado no WebSearch por domínio. A nota 4/5 e a URL da review foram confirmadas cruzando duas fontes independentes: (a) resultado de busca orgânica e (b) o agregador OpenCritic, que lista a review individual da Eurogamer com crítico (Connor Makar), nota e URL. Como as duas bateram exatamente, considero a nota confiável apesar de não ter lido a página original diretamente.

### 5. userScore

Duas fontes possíveis, com leitura levemente divergente — **registro as duas, não escondo a discrepância**:

- **Metacritic User Score: 6.1/10** (208 avaliações, "Mixed or Average") — usei esta como `userScore` principal por ser a métrica de usuário mais consolidada e comparável ao resto do site.
- **Steam Review %: 72% positivas → 7.2/10** ("Mostly Positive", checado direto em store.steampowered.com em 2026-07-02, 45.991 reviews em inglês / 65.814 em todos os idiomas).

**Discrepância:** 6.1 (Metacritic User) vs 7.2 (Steam) — diferença de 1.1 ponto. Isso é coerente com a narrativa pública do jogo: o Steam teve uma virada de "Mostly Negative" para "Very Positive" e depois estabilizou perto de "Mostly Positive" nas semanas após o lançamento (matérias da PC Gamer e outros veículos descrevem essa montanha-russa de sentimento nas primeiras semanas). O Metacritic User Score tende a capturar mais reviews da fase de lançamento turbulenta, o que pode explicar a nota mais baixa. Sugiro à Dara/Vic decidir se preferem Steam (mais volume, mais recente) ou Metacritic User (mais alinhado ao padrão já usado nos outros jogos do site) como `userScore` oficial — deixei os dois documentados no frontmatter (`userScore` e `userScore_alternativa_steam`).

### 6. avgPlayTime — PENDENTE, sinalizando

Tentei acessar `howlongtobeat.com` via WebFetch (uso pontual, conforme DI-001 v2) e recebi bloqueio de acesso. Busca no Google por "Dune Awakening howlongtobeat" não retornou a página oficial do HLTB com as três labels padronizadas (Main Story / Main + Extras / Completionist) — só matérias de terceiros (Game Rant, Kotaku) com estimativas soltas e sem categorização consistente (ex.: "menos de 30h para rush", "40-50h de conteúdo principal", "100h+ para completar tudo"). Como o jogo é um MMO de sobrevivência sem "final" tradicional, é bem possível que o HLTB nem tenha uma entrada padronizada de Main Story para ele.

**Não estimei o campo** — por princípio ("uma nota sem fonte é pior que nenhuma nota", mesma regra vale para tempo de jogo). `avgPlayTime` fica como **"pendente"** no rascunho. Sinalizando para Vic/Theo: se decidirem publicar mesmo assim, sugiro tentar acesso ao HLTB via navegador com login manual, ou usar o texto solto do Game Rant/Kotaku apenas como texto editorial da review do Theo (nunca como campo estruturado).

## Ficha técnica (RAWG + verificação cruzada)

- **developer:** Funcom (RAWG; co-desenvolvimento de sistemas por YAGER, confirmado via yager.de — https://yager.de/2024/01/24/yager-supports-funcom-with-the-co-development-of-dune-awakening/)
- **publisher:** Funcom (RAWG)
- **releaseDate (PC):** 2025-06-10 (RAWG, confere com Metacritic e OpenCritic)
- **releaseDate (PS5):** 2026-09-22 — **fonte: PS Blog, via Kai (FT-001)**. RAWG não tem essa data separada por plataforma no payload consultado; conforme DI-001 v2, PS Blog vence qualquer divergência de data. Não há divergência real aqui, só ausência do dado por plataforma na RAWG.
- **genres (RAWG, original):** Action, Adventure, RPG, Massively Multiplayer
- **genres (sugestão de tradução para `data.ts`, convenção do site):** Ação, Aventura, RPG, MMO
- **engine:** Unreal Engine 5 (não veio no payload da RAWG; confirmado via GDC/State of Unreal 2024 e declaração do Chief Creative Officer Joel Bylos — Funcom usa Lumen e Nanite) — https://dev.epicgames.com/community/learning/tutorials/EpMd/unreal-engine-dune-awakening-by-funcom-state-of-unreal-gdc-2024
- **avgPlayTime:** pendente (ver seção 6 acima)
- **platforms (RAWG):** PC, PlayStation 5, Xbox Series S/X

## Imagens candidatas (NÃO VERIFICADAS — trabalho da Dara, SOP-003)

Extraídas do payload de busca da RAWG (`background_image` e `short_screenshots[]`). Nenhuma URL abaixo passou por teste HTTP/curl — é responsabilidade da Dara validar cada uma antes de usar em `cover`/`gallery[]`:

- `https://media.rawg.io/media/games/593/593c074cdf1ea15b8c9a2513676020e6.jpg` (background_image / capa candidata)
- `https://media.rawg.io/media/screenshots/e87/e8772839436dd66bebeef5eb69398539.jpg`
- `https://media.rawg.io/media/screenshots/add/add325dc8cc03cc370aaaf5c7dd126f6.jpg`

## Discrepâncias registradas (resumo)

1. **RAWG não trouxe `metacritic`** para este jogo (campo null) — não é confiabilidade zero da RAWG, é ausência pontual de dado; caí para leitura manual do Metacritic, como o próprio contrato prevê.
2. **Metacritic User Score (6.1) vs Steam Review % (7.2)** — diferença de 1.1 ponto, provavelmente por causa da volatilidade das reviews Steam nas primeiras semanas de lançamento. Ambos documentados; sugiro decisão de Vic/Dara sobre qual vira o `userScore` oficial.
3. **Push Square sem cobertura** — não é discrepância de nota, é ausência (site PS-only, jogo ainda não lançou no PS5). Sinalizo para reagregação em/após 22/09/2026.
4. **avgPlayTime pendente** — sem fonte confiável estruturada (HLTB bloqueado, sem página padronizada encontrada). Não estimado.
5. Todas as notas de crítica (Metacritic 78, OpenCritic 81, IGN 8, GameSpot 7, Eurogamer 8, PC Gamer 8) são da **versão PC** — nenhuma é da versão PS5, que ainda não existe. Isso não é uma discrepância entre fontes, é uma limitação estrutural que precisa aparecer como aviso no site (`status_nota` no frontmatter).
