<!-- aprovado por Vic em 2026-07-05 (leva: 2 reviews de catalogo + 3 jogos novos) -->

---
jogo: "Stellar Blade"
slug: stellar-blade
tipo: jogo-novo
status: novo-cadastro
data_pesquisa: 2026-07-05
pesquisado_por: Vera

metacriticScore: 82
metacriticScore_fonte: "https://www.metacritic.com/game/stellar-blade/ (PS5) - fetch direto deu timeout nesta sessao; nota triangulada por busca (Forbes, ComicBook.com, GameSpew - todas citam Metascore 82)"
openCriticScore: 81
openCriticScore_fonte: "https://opencritic.com/game/16510/stellar-blade (Top Critic Average, 173 criticas, selo 'Strong', 86o percentil - conferido 2026-07-05)"
openCriticScore_obs: "Uma busca anterior (antes da leitura direta da pagina) trouxe 82 tambem para o OpenCritic, citado em materia de imprensa. A leitura ao vivo da pagina hoje mostra 81 - diferenca de 1 ponto e normal (mais criticas entraram no agregador desde o lancamento, abril/2024); uso 81 por ser a leitura mais atual e direta da fonte."
userScore: 9.2
userScore_fonte: "Metacritic User Score (PS5), ~2.598 avaliacoes - https://www.metacritic.com/game/stellar-blade/user-reviews/ - citado por Forbes, ComicBook.com, GameSpew, PushSquare como o maior user score de um jogo PS5 publicado pela Sony ate a data. NAO estranhar a distancia grande entre nota de critica (82) e nota de usuario (92): e um fenomeno real e bem documentado, nao erro de captura."

siteScores:
  - site: "IGN"
    score: 7.0
    nota_original: "7/10"
    fonte_url: "https://www.ign.com/articles/stellar-blade-review"
  - site: "GameSpot"
    score: 8.0
    nota_original: "8/10"
    fonte_url: "https://www.gamespot.com/reviews/stellar-blade-review-nier-as-it-can-get/1900-6418215/"
  - site: "Eurogamer"
    score: 8.0
    nota_original: "4/5 (recomendado)"
    fonte_url: "https://www.eurogamer.net/stellar-blade-review"
  - site: "Push Square"
    score: 8.0
    nota_original: "8/10"
    fonte_url: "https://www.pushsquare.com/reviews/ps5/stellar-blade"
  - site: "Metacritic"
    score: 8.2
    nota_original: "82/100"
    fonte_url: "https://www.metacritic.com/game/stellar-blade/"
  - site: "OpenCritic"
    score: 8.1
    nota_original: "81/100"
    fonte_url: "https://opencritic.com/game/16510/stellar-blade"

worldAvg: 7.9
worldAvg_calculo: "(7.0+8.0+8.0+8.0+8.2+8.1)/6 = 47.3/6 = 7.8833... -> 7.9"

developer: "SHIFT UP"
publisher: "Sony Interactive Entertainment (PlayStation Publishing LLC)"
developer_publisher_fonte: "RAWG API (endpoint de detalhes, slug legado 'project-eve-tba') - developers: SHIFT UP, publishers: PlayStation Publishing; cruzado com Wikipedia, Gematsu e PlayStation.com"
engine: "Unreal Engine 4 (build 4.26)"
engine_fonte: "https://80.lv/articles/the-pc-version-of-stellar-blade-will-be-powered-by-unreal-eninge-4-26 - confirmado tambem pela wccftech e gamegpu na cobertura do port para PC"
releaseDate: "2024-04-26"
releaseDate_fonte: "PS Blog (https://blog.playstation.com/2024/01/31/stellar-blade-arrives-only-on-ps5-april-26/) - RAWG concorda (released: 2024-04-26). Sem divergencia."
genres: ["Ação", "Aventura", "RPG"]
genres_fonte: "RAWG API (genres: Action, Adventure, Role-Playing Games (RPG)) traduzido"
platforms: ["PS5", "PC"]
platforms_fonte: "RAWG API + confirmacao de imprensa (port para PC saiu em 2025-06-11). NAO inclui Nintendo Switch 2: porte foi anunciado na Nintendo Direct de junho/2026 para lancamento ainda em 2026, mas sem data fechada e ainda nao disponivel na data desta pesquisa (2026-07-05) - ver observacao abaixo."
rawg_slug_obs: "ALERTA: a RAWG cadastra este jogo sob o slug legado 'project-eve-tba' (nome de trabalho original do jogo antes de ser renomeado para 'Stellar Blade' em 2022) em vez de 'stellar-blade'. O campo 'name' do payload confirma 'Stellar Blade' e todos os outros dados (developer, released, genres) batem com o jogo certo - tratando como o mesmo registro, mas documentando a inconsistencia de slug para quem for reusar essa API depois."
avgPlayTime: "pendente"
avgPlayTime_obs: "HowLongToBeat bloqueou o fetch direto nesta sessao. Fontes secundarias (GameRant, GameSpot, GamesRadar, NME, Beebom) divergem bastante so para Historia Principal (12-16h em algumas, 17-22h em outras, ~20-25h em outras ainda) - divergencia grande demais para triangular com seguranca, mantenho pendente por regra do contrato."

imagens_candidatas:
  background_image: "https://media.rawg.io/media/games/fbd/fbdef5455da4c4033bed896e1540f6a1.jpg"
  short_screenshots:
    - "https://media.rawg.io/media/screenshots/0c9/0c98c2913de0c48b57a49aacff794096.jpg"
    - "https://media.rawg.io/media/screenshots/c5e/c5e5c6f19c0642b20e113b49a994e442.jpg"
    - "https://media.rawg.io/media/screenshots/b22/b22c889fa194ddf811c528eb215bfcb5.jpg"
  obs_imagens: "NAO verificadas via curl - RAWG trouxe 7 screenshots no total no payload de busca (sob o slug legado 'project-eve-tba'), selecionei 3 alem do background_image. Verificacao HTTP e trabalho da Dara (SOP-003) antes de qualquer URL entrar em data.ts."

rawg_source: "Busca por 'Stellar Blade' na RAWG retornou o jogo certo pelo campo 'name', mas com slug 'project-eve-tba' (ver rawg_slug_obs acima) - confirmei manualmente via GET /games/project-eve-tba?key=<RAWG_API_KEY> que os dados (developer SHIFT UP, released 2024-04-26, genres Action/Adventure/RPG) batem com Stellar Blade antes de aceitar o resultado."
---

## Observações e discrepâncias — Stellar Blade

**Distância grande entre nota de crítica (82) e nota de usuário (9.2/10) — não é erro.** Isso é amplamente documentado pela imprensa (Forbes, ComicBook.com, GameSpew, Push Square) como o maior user score de um jogo publicado pela Sony no PS5 até a data, apesar da crítica ter sido "apenas" mediana-alta (82 no Metacritic, "Strong" no OpenCritic). Registrei os dois números como estão, sem tentar suavizar a diferença.

**RAWG cadastra o jogo sob um slug errado/legado.** A busca por "Stellar Blade" retorna um resultado cujo campo `name` diz corretamente "Stellar Blade", mas o `slug` é `project-eve-tba` — o nome de trabalho do jogo antes do anúncio oficial em 2022 (era conhecido como "Project Eve"). Confirmei manualmente que os demais dados batem (desenvolvedora SHIFT UP, data de lançamento 2024-04-26, gêneros) antes de aceitar o registro — instrução do contrato de "confirmar cada resultado pelo nome/slug" quase pegou um mismatch aqui, mas o restante do payload confirma que é o jogo certo.

**OpenCritic: 81 vs 82.** Uma busca anterior (matéria de imprensa) citava 82 para o OpenCritic; a leitura ao vivo da própria página hoje mostra 81. Diferença de 1 ponto, provavelmente por mais críticas terem entrado no agregador desde o lançamento (abril/2024) até agora. Usei 81 por ser a leitura direta e mais atual da fonte primária, documentando o número antigo aqui.

**Nintendo Switch 2:** port anunciado na Nintendo Direct de junho/2026 para lançamento "ainda em 2026", mas sem data fechada e sem disponibilidade até a data desta pesquisa — por isso não entrou em `platforms`. Vale o Kai/Vic acompanharem para atualizar quando sair.

**`avgPlayTime` pendente:** HowLongToBeat bloqueou o fetch direto de novo. As faixas de fontes secundárias variam demais (12h a 25h só para história principal) para eu triangular com confiança — mantive pendente em vez de estimar.

**RAWG trouxe `metacritic: null`** para este jogo também — mesmo padrão dos outros dois jogos desta entrega.
