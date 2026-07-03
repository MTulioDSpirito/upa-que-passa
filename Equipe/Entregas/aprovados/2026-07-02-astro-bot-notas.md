<!-- aprovado por Vic em 2026-07-02 (revisão editorial FT-001 passo 6, lote de atualização geral) -->

---
jogo: "Astro Bot"
slug: astro-bot
tipo: jogo-novo
status: novo-cadastro
data_pesquisa: 2026-07-02
pesquisado_por: Vera

metacriticScore: 94
metacriticScore_fonte: "https://www.metacritic.com/game/astro-bot/ (leitura manual - RAWG trouxe metacritic: null para este jogo)"
openCriticScore: 94
openCriticScore_fonte: "https://opencritic.com/game/17118/astro-bot (Top Critic Average, 188 reviews - conferido 2026-07-02)"
userScore: 9.0
userScore_fonte: "Metacritic User Score (PS5), baseado em 6166 avaliacoes - https://www.metacritic.com/game/astro-bot/ - usado por ser exclusivo PS5 sem pagina Steam, conforme instrucao"

siteScores:
  - site: "IGN"
    score: 9.0
    nota_original: "9/10"
    fonte_url: "https://opencritic.com/game/17118/astro-bot"
  - site: "GameSpot"
    score: 9.0
    nota_original: "9/10"
    fonte_url: "https://www.gamespot.com/reviews/astro-bot-review-fly-me-to-the-moon/1900-6418277/"
  - site: "Eurogamer"
    score: 10.0
    nota_original: "5/5"
    fonte_url: "https://opencritic.com/game/17118/astro-bot"
  - site: "Push Square"
    score: 10.0
    nota_original: "10/10"
    fonte_url: "https://www.pushsquare.com/reviews/ps5/astro-bot"

worldAvg: 9.5

developer: "Team Asobi"
publisher: "Sony Interactive Entertainment"
engine: "Motor proprietario da Team Asobi (descrito pela propria equipe como 'completamente reformulado' em relacao ao usado em Astro's Playroom; nenhum nome publico de engine foi divulgado)"
releaseDate: "2024-09-06"
releaseDate_fonte: "PS Blog - https://blog.playstation.com/2024/05/30/astro-bot-arrives-on-ps5-september-6/ (RAWG concorda: released 2024-09-06)"
genres: ["Ação", "Plataforma"]
genres_fonte: "RAWG API (genres: Platformer, Action) traduzido"
platforms: ["PS5"]
avgPlayTime: "pendente"
avgPlayTime_obs: "HowLongToBeat bloqueou o fetch direto nesta sessao (WebFetch recusou howlongtobeat.com). Fontes secundarias (GamesRadar, TheGamer, dev em entrevista) citam faixas entre 9,5 e 12-15h so para historia principal, mas sem confirmacao direta na HLTB nao é seguro registrar um numero - deixando pendente por regra do contrato."

imagens_candidatas:
  background_image: "https://media.rawg.io/media/games/b19/b19cdd6be95ffffd63fdd2d1fbac057a.jpg"
  short_screenshots:
    - "https://media.rawg.io/media/games/b19/b19cdd6be95ffffd63fdd2d1fbac057a.jpg"
  obs_imagens: "RAWG so retornou 1 imagem no short_screenshots para este slug (sem screenshots adicionais no tier gratuito). NAO verificadas via curl - isso é trabalho da Dara antes de qualquer URL entrar em data.ts."

rawg_source: "https://api.rawg.io/api/games/astro-bot?key=<RAWG_API_KEY> - confirmado que o resultado bate com o jogo certo (nome, slug, ano, plataforma PS5)"
validacao_dara:
  data: "2026-07-02"
  schema: "parcial - campos de nota/ficha que sao escopo da Vera (developer, publisher, engine, releaseDate, genres, platforms, metacriticScore, openCriticScore, userScore, siteScores, worldAvg) batem com os tipos de Game. FALTAM campos obrigatorios de Game que nao sao escopo da Vera: id, cover (recomendado abaixo), description, synopsis, suggestedPrice, online, offline, maxPlayers, languages, subtitles, dubbing, ageRating, links. Esses precisam vir de Kai antes do merge (step 7) - nao e um problema deste rascunho, so uma pendencia de dependencia."
  rawg_confirmacao: "GET https://api.rawg.io/api/games/astro-bot -> name: 'Astro Bot', released: '2024-09-06', developers: ASOBI, publishers: Sony Interactive Entertainment, platforms: PlayStation 5. Bate com o jogo. background_image retornado pela RAWG e identico ao citado no rascunho."
  urls_testadas:
    - url: "https://media.rawg.io/media/games/b19/b19cdd6be95ffffd63fdd2d1fbac057a.jpg"
      status: 200
      uso: "unica imagem disponivel (background_image = short_screenshots[0], RAWG screenshots_count=0 para este slug)"
  capa_gallery_recomendada:
    cover: "https://media.rawg.io/media/games/b19/b19cdd6be95ffffd63fdd2d1fbac057a.jpg"
    gallery: []
    obs: "So ha 1 imagem verificada disponivel na RAWG para este jogo (screenshots_count: 0). Nao ha imagem extra para popular gallery[] sem duplicar a cover. Se Kai/Vic quiserem mais imagens para a galeria, buscar via Steam CDN (nao ha pagina Steam - exclusivo PS5) ou PS Blog/Wikimedia, com curl individual antes de aceitar."
  decisao_vic: "nao aplicavel a este jogo (sem decisao editorial pendente registrada para Astro Bot)"
  avgPlayTime: "'pendente' (string literal) nao e um valor valido para o campo opcional avgPlayTime - recomendo omitir o campo inteiramente no merge (campo e opcional) em vez de escrever a string 'pendente', ate a HLTB ser confirmada"
  pendencia_bloqueante: "sim - faltam campos de Kai (description, synopsis, suggestedPrice, links, etc.) para completar o objeto Game; nao e um erro da Vera, e uma dependencia de outro entregavel"
  validado_por: "Dara"
---

## Observações e discrepâncias — Astro Bot

**Notas agregadas — sem discrepância relevante.** Metacritic (94) e OpenCritic (94) coincidem exatamente. As 4 notas por veículo em `siteScores[]` são unanimemente altas (9-10), sem outlier.

**Discrepância documentada (não resolvida "no olho"):** no lançamento (setembro de 2024), a imprensa (ex.: Gematsu, via post no X de 2024-09-06) noticiou o OpenCritic score como **95**. A consulta ao vivo da página do OpenCritic nesta sessão (2026-07-02) mostra **94**, agora baseado em 188 reviews (mais que os ~150-180 do lançamento). Isso é o fenômeno normal de "score drift" — a nota muda conforme mais reviews entram no agregador ao longo do tempo. Estou registrando **94** por ser a leitura mais atual e com mais reviews agregadas, mas o número de lançamento (95) fica documentado aqui para auditoria.

**Limite de fonte:** as notas de IGN e Eurogamer foram obtidas via agregação da própria página do OpenCritic (que reproduz o score de cada veículo), não por fetch direto do artigo em ign.com/eurogamer.net — o fetch direto para `eurogamer.net` retornou 403 nesta sessão, e não encontrei URL indexada e estável para a review da IGN. Os números (IGN 9/10, Eurogamer 5/5) foram cross-checados contra pelo menos duas fontes independentes de busca (thegamer.com round-up e opencritic.com), então a regra de triangulação de 2 fontes foi respeitada — só não há link direto do artigo original da IGN/Eurogamer para citar como `fonte_url`.

**RAWG:** o campo `metacritic` do payload da RAWG veio `null` para este jogo (apesar de a DI-001 v2 registrar que a chave está ativa) — Metacritic foi coletado manualmente como fallback, conforme previsto no método (passo 2).

**`avgPlayTime` pendente:** HowLongToBeat bloqueou o WebFetch direto nesta sessão ("Claude Code is unable to fetch from howlongtobeat.com"). Não estimei a partir de fontes secundárias — ver regra do contrato ("se não conseguir, pendente").
