<!-- aprovado por Vic em 2026-07-02 (revisão editorial FT-001 passo 6, lote de atualização geral) -->

---
jogo: "Ghost of Yōtei"
slug: ghost-of-yotei
tipo: jogo-novo
status: novo-cadastro
data_pesquisa: 2026-07-02
pesquisado_por: Vera

metacriticScore: 86
metacriticScore_fonte: "https://www.metacritic.com/game/ghost-of-yotei/critic-reviews/ (leitura manual - RAWG trouxe metacritic: null) - 86, baseado em 139 critic reviews, conferido 2026-07-02"
openCriticScore: 87
openCriticScore_fonte: "https://opencritic.com/game/18449/ghost-of-yotei (Top Critic Average, 165 reviews - conferido 2026-07-02)"
userScore: 8.1
userScore_fonte: "Metacritic User Score (PS5), baseado em 3453 avaliacoes - https://www.metacritic.com/game/ghost-of-yotei/ - usado por ser exclusivo PS5 sem pagina Steam, conforme instrucao"

siteScores:
  - site: "IGN"
    score: 8.0
    nota_original: "8/10"
    fonte_url: "https://opencritic.com/game/18449/ghost-of-yotei"
  - site: "GameSpot"
    score: 9.0
    nota_original: "9/10"
    fonte_url: "https://www.gamespot.com/reviews/ghost-of-yotei-review-lone-wolf/1900-6418414/"
  - site: "Eurogamer"
    score: 6.0
    nota_original: "3/5"
    fonte_url: "https://opencritic.com/game/18449/ghost-of-yotei"
  - site: "Push Square"
    score: 9.0
    nota_original: "9/10"
    fonte_url: "https://www.pushsquare.com/reviews/ps5/ghost-of-yotei"

worldAvg: 8.0

developer: "Sucker Punch Productions"
publisher: "Sony Interactive Entertainment"
engine: "Motor interno proprietario da Sucker Punch (o mesmo usado em Ghost of Tsushima, evoluido para PS5) - nome publico da engine NAO confirmado. Uma fonte não-jornalística (thejimquisition, satirica) usou o nome 'Onryō Engine', mas NAO encontrei confirmacao oficial (PS Blog, Sucker Punch) para esse nome - por isso NAO usei esse nome no campo."
engine_fonte: "https://80.lv/articles/sucker-punch-breaks-down-tech-that-brought-ghost-of-y-tei-s-world-to-life + https://blog.playstation.com/2025/10/23/ghost-of-yotei-tech-deep-dive/ (confirmam engine proprietaria, mas sem nome divulgado)"
releaseDate: "2025-10-02"
releaseDate_fonte: "PS Blog - https://blog.playstation.com/2025/04/23/ghost-of-yotei-comes-to-playstation-5-on-october-2/ (RAWG concorda: released 2025-10-02)"
genres: ["Ação", "RPG"]
genres_fonte: "RAWG API (genres: Action, RPG) traduzido - OBS: a maior parte da imprensa (IGN, GameSpot etc.) descreve o jogo como 'ação-aventura em mundo aberto', nao como RPG puro. Mantive o genero literal da RAWG por ser a fonte primaria definida na DI-001 v2, mas fica marcado para Vic revisar se 'RPG' é a categorizacao correta para o catalogo do site."
platforms: ["PS5"]
avgPlayTime: "pendente"
avgPlayTime_obs: "HowLongToBeat bloqueou o fetch direto nesta sessao. Fontes secundarias sao muito inconsistentes entre si (de ~10h a ~25h so para historia principal, dependendo da dificuldade/site), o que reforca a decisao de nao estimar - deixando pendente."

imagens_candidatas:
  background_image: "https://media.rawg.io/media/games/30b/30b195c2321d763f807366967ffad793.jpg"
  short_screenshots:
    - "https://media.rawg.io/media/screenshots/910/9109032812e26d6d4715fbde46ec9c3c.jpg"
    - "https://media.rawg.io/media/screenshots/dfe/dfefb1a5ad7c0eedf9481609025aece5.jpg"
    - "https://media.rawg.io/media/screenshots/864/86425464c5b85b956b3c8819a37e77e4.jpg"
  obs_imagens: "NAO verificadas via curl - isso é trabalho da Dara antes de qualquer URL entrar em data.ts. RAWG trouxe 5 screenshots no total para este slug; selecionei as 3 primeiras."

rawg_source: "https://api.rawg.io/api/games/ghost-of-yotei?key=<RAWG_API_KEY> - confirmado que o resultado bate com o jogo certo (nome, slug, ano, plataforma PS5). ATENCAO: o payload da RAWG trouxe esrb_rating = 'Adults Only', o que é quase certamente um erro de dado da RAWG (o jogo é classificado 18 anos pela ESRB como 'Mature', nao 'Adults Only' - categoria bem diferente e rara). NAO usei esse campo no rascunho por falta de confianca na fonte para este dado especifico."
validacao_dara:
  data: "2026-07-02"
  schema: "parcial - mesmo caso dos outros 2 jogos novos: campos de escopo da Vera batem com Game, faltam id, cover, description, synopsis, suggestedPrice, online, offline, maxPlayers, languages, subtitles, dubbing, ageRating, links (escopo de Kai, pendente para step 7)."
  rawg_confirmacao: "GET https://api.rawg.io/api/games/ghost-of-yotei -> name: 'Ghost of Yotei' (alternative_names inclui 'Ghost of Yōtei'), released: '2025-10-02', developers: Sucker Punch Productions, publishers: Sony Computer Entertainment, platforms: PlayStation 5. Bate com o jogo. esrb_rating confirmado como 'Adults Only' no payload bruto - a decisao de Vera de nao usar esse campo esta correta e alinhada a instrucao do Vic de ignorar esse esrb. background_image e os 3 screenshots citados foram conferidos contra /games/ghost-of-yotei/screenshots - todos pertencem a este jogo."
  urls_testadas:
    - url: "https://media.rawg.io/media/games/30b/30b195c2321d763f807366967ffad793.jpg"
      status: 200
      uso: "background_image"
    - url: "https://media.rawg.io/media/screenshots/910/9109032812e26d6d4715fbde46ec9c3c.jpg"
      status: 200
    - url: "https://media.rawg.io/media/screenshots/dfe/dfefb1a5ad7c0eedf9481609025aece5.jpg"
      status: 200
    - url: "https://media.rawg.io/media/screenshots/864/86425464c5b85b956b3c8819a37e77e4.jpg"
      status: 200
  capa_gallery_recomendada:
    cover: "https://media.rawg.io/media/games/30b/30b195c2321d763f807366967ffad793.jpg"
    gallery:
      - "https://media.rawg.io/media/screenshots/910/9109032812e26d6d4715fbde46ec9c3c.jpg"
      - "https://media.rawg.io/media/screenshots/dfe/dfefb1a5ad7c0eedf9481609025aece5.jpg"
      - "https://media.rawg.io/media/screenshots/864/86425464c5b85b956b3c8819a37e77e4.jpg"
    obs: "todas as 4 URLs retornaram 200 e foram confirmadas como pertencentes a este jogo via endpoint de screenshots da RAWG - aprovadas para uso"
  decisao_vic: "NAO RESPEITADA no rascunho atual - genres esta como [\"Ação\", \"RPG\"] (literal da RAWG), mas a decisao editorial do Vic e genres = [\"Ação\", \"Aventura\"] (sem RPG). Vera ja sinalizou essa duvida no rascunho antes da decisao do Vic ser tomada, entao nao e erro dela - so precisa ser corrigido no merge (step 7), Dara nao vai reescrever o campo aqui pois isso e conteudo editorial. esrb 'Adults Only' foi corretamente ignorado/omitido, conforme decisao do Vic."
  avgPlayTime: "'pendente' (string literal) nao e um valor valido - recomendo omitir o campo (opcional) ate confirmacao HLTB, mesma observacao dos outros 2 jogos"
  pendencia_bloqueante: "sim - (1) faltam campos de Kai para completar o objeto Game; (2) campo genres do rascunho diverge da decisao do Vic e precisa ser corrigido para [\"Ação\", \"Aventura\"] antes do merge"
  validado_por: "Dara"
---

## Observações e discrepâncias — Ghost of Yōtei

**Discrepância de nota documentada (score drift):** matérias de lançamento (24-25/09/2025 — comicbook.com, Forbes, toy-people.com) noticiaram Metacritic **87** e OpenCritic **89**. A consulta ao vivo desta sessão (2026-07-02, ~9 meses depois do lançamento) mostra Metacritic **86** (139 reviews) e OpenCritic **87** (165 reviews) — ambos caíram 1-2 pontos conforme mais reviews entraram no agregador. Registrei os números atuais (mais reviews = amostra mais completa), mas os números de lançamento ficam documentados aqui para auditoria, sem escolher um "no olho".

**Eurogamer é um outlier claro para baixo:** 3/5 (=6.0 normalizado) contra um consenso "Mighty"/"Generally Favorable" nos outros veículos (IGN 8, GameSpot 9, Push Square 9). A manchete da própria Eurogamer no X ("simple pleasures and missed opportunities") e a review completa (segundo agregação do OpenCritic e round-ups) criticam especificamente as sidequests e o mundo aberto "datado" — não é erro de leitura minha, é uma crítica genuinamente mais dura. Isso puxa o `worldAvg` (8.0) visivelmente para baixo comparado ao `openCriticScore` (8.7 normalizado).

**Gênero "RPG" merece revisão editorial:** a RAWG classifica Ghost of Yōtei como Action + RPG, mas a cobertura de imprensa trata o jogo como ação-aventura em mundo aberto (like Ghost of Tsushima), não RPG no sentido tradicional (sem árvore de habilidades tipo RPG clássico, sem stats de personagem). Segui a fonte primária definida na diretriz (RAWG), mas sinalizei explicitamente — é uma decisão para o Vic confirmar antes de ir para `data.ts`.

**Campo ESRB descartado:** a RAWG retornou `esrb_rating: "Adults Only"` para este jogo, o que é quase certamente errado (é uma classificação etária rara e bem mais restritiva que o "Mature 17+" que a imprensa reporta para o jogo). Não incluí esse dado no rascunho porque não confio nele sem uma segunda fonte confirmando — nenhuma nota sem fonte confiável, inclusive fichas técnicas.

**Nome da engine não confirmado oficialmente** — ver campo `engine` acima. Não usei o nome "Onryō Engine" por vir de fonte não-jornalística/satírica sem confirmação cruzada.

**`avgPlayTime` pendente:** mesma limitação dos outros dois jogos — HowLongToBeat bloqueou o fetch direto nesta sessão.
