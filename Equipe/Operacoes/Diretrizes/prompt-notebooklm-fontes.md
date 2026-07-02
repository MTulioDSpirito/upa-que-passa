# Prompt para o NotebookLM — Levantamento de Fontes (site inteiro)

Cole no NotebookLM para validar/expandir [[DI-001-fontes-confiaveis]]. Depois de rodar, atualize DI-001-fontes-confiaveis.md com o resultado e distribua as fontes novas para os contratos de Kai, Vera, Theo e Dara.

> Escopo: este prompt cobre **todas as seções do site** (catálogo de jogos, notícias, notas, reviews, mídia, preços/marketplace e hardware), não só notícias. As categorias abaixo mapeiam 1:1 para os campos de `src/lib/types.ts`.

```
Você é um pesquisador especializado em curadoria de fontes para um portal
brasileiro de jogos de PS5 chamado "Upa que Passa". O portal tem 5 seções que
precisam ser alimentadas diariamente por um pipeline automatizado de agentes:
catálogo de jogos (ficha técnica completa), notícias, notas agregadas de
crítica, reviews autorais e um marketplace de compra/venda/troca de jogos
entre usuários brasileiros.

Preciso de uma lista definitiva de fontes confiáveis, organizada nas 8
categorias abaixo. Para CADA fonte, informe:

- Nome e URL base
- Tipo de acesso (RSS, API oficial, scraping permitido pelos Termos de Uso,
  agregador, leitura manual)
- Se tem API pública/gratuita: autenticação exigida, rate limit, formato
- Idioma (priorize fontes BRASILEIRAS; complemente com internacionais)
- Confiabilidade editorial (oficial > imprensa estabelecida > agregador >
  conteúdo de usuários)
- Restrições legais relevantes (ToS sobre scraping/automação, direitos de
  imagem, atribuição obrigatória)

CATEGORIAS:

1. NOTÍCIAS de PS5 — lançamentos, patches/atualizações, eventos (State of
   Play, TGA, gamescom), DLCs e indústria. Ex. de partida: PlayStation Blog
   oficial (EN e PT-BR), IGN Brasil, Voxel, TecMundo Games, Adrenaline,
   GameVicio, Flow Games, Eurogamer, GamesRadar, Push Square. Indique quais
   têm RSS funcional.

2. FICHA TÉCNICA de jogos — desenvolvedora, publicadora, engine, data de
   lançamento, plataformas, gêneros, número máximo de jogadores,
   online/offline. Ex.: IGDB API, RAWG API, Steam API (appdetails),
   PlayStation Store, MobyGames, Wikipedia/Wikidata. Qual cobre melhor
   exclusivos de PS5 que não existem no Steam?

3. IDIOMAS, DUBLAGEM PT-BR e CLASSIFICAÇÃO ETÁRIA — onde confirmar com
   segurança se um jogo tem legendas/dublagem em português do Brasil, e a
   classificação indicativa oficial (ClassInd/Ministério da Justiça no
   Brasil; ESRB/PEGI como fallback). Existe base consultável do ClassInd?

4. TEMPO MÉDIO DE JOGO — HowLongToBeat é a referência: tem API ou o ToS
   permite scraping? Alternativas (PSNProfiles, dados da própria PSN)?

5. NOTAS DE CRÍTICA — agregadas (Metacritic, OpenCritic) e por veículo
   individual (IGN, GameSpot, Eurogamer etc., para exibir "nota por site").
   Para cada uma: API oficial? Leitura manual? O ToS permite republicar a
   nota com atribuição? Como obter também a nota de usuários?

6. REVIEWS COMPLETAS (insumo editorial) — fontes de análises aprofundadas
   (texto/vídeo) para embasar reviews autorais sobre gráficos, gameplay,
   história, trilha sonora, performance (modos qualidade/desempenho no PS5),
   IA, multiplayer, conteúdo e replay. Inclua fontes técnicas tipo Digital
   Foundry para a parte de performance.

7. MÍDIA — capas, screenshots e trailers com URLs ESTÁVEIS, sem hotlink
   protection, testáveis via HTTP (preciso que um GET retorne 200 de forma
   permanente). Ex.: Steam CDN (cdn.cloudflare.steamstatic.com),
   Wikipedia/Wikimedia Commons, press kits oficiais de publishers, canais
   oficiais no YouTube para trailers embedáveis. O que é seguro juridicamente
   para um portal de notícias usar com atribuição (fair use / press kit)?

8. PREÇOS E MERCADO BR — preço oficial na PS Store Brasil, histórico de
   promoções (ex.: PSPrices, PS Deals, Deku Deals — cobrem a loja BR?) e
   referências de preço de jogos físicos usados no Brasil (para sugerir
   preço justo no marketplace). Além disso: anúncios oficiais de hardware
   e acessórios PS5 da Sony com preço em reais.

FORMATO DA RESPOSTA:
- Uma tabela markdown por categoria, ordenada por confiabilidade.
- Marque explicitamente as fontes cujo acesso automatizado diário é
  permitido e gratuito.
- Feche com uma recomendação priorizada: as 8 a 12 fontes que eu deveria
  integrar PRIMEIRO no pipeline diário, indicando qual categoria cada uma
  resolve e qual é o risco (legal ou técnico) de cada escolha.
```

## Como distribuir o resultado

| Categoria do prompt | Agente que consome | Campos de `types.ts` alimentados |
|---|---|---|
| 1 (notícias), 8 (hardware) | Kai | `NewsArticle.*` |
| 2, 3, 4 (ficha técnica) | Kai/Dara | `Game.developer/publisher/engine/releaseDate/platforms/genres/avgPlayTime/languages/dubbing/ageRating/maxPlayers/online/offline` |
| 5 (notas) | Vera | `Game.metacriticScore/openCriticScore/userScore/siteScores/worldAvg` |
| 6 (reviews) | Theo | `Review.scores/pros/cons/conclusion` |
| 7 (mídia) | Dara (verificação HTTP obrigatória — SOP-003) | `Game.cover/gallery/trailer`, `NewsArticle.cover` |
| 8 (preços) | Kai/Vera | `Game.suggestedPrice`, referência para `Listing.price` |
