# DI-001 - Fontes Confiáveis

> Esta lista é o ponto de partida. **Deve ser atualizada com o resultado do prompt do NotebookLM** (ver `Equipe/README.md` e a mensagem de ativação do projeto) assim que o usuário validar as melhores fontes. Até lá, use o que já foi verificado nesta sessão.

## Notícias (Kai)

| Fonte | Tipo | Observação |
|---|---|---|
| PlayStation Blog (blog.playstation.com) | Oficial | Prioridade máxima para anúncios de hardware/exclusivos |
| Steam (store.steampowered.com/api/appdetails) | API oficial, gratuita, sem auth | Boa para datas de lançamento, descrição, capa (ver DI-002) |
| IGN Brasil, Voxel, TecMundo Games, Adrenaline, GameVicio | Imprensa BR | Cruzar pelo menos 2 antes de publicar um fato |
| Eurogamer, GamesRadar, Push Square, IGN (EN) | Imprensa internacional | Boa para embargo de review e cobertura de eventos |

## Notas agregadas (Vera)

| Fonte | Tipo | Observação |
|---|---|---|
| Metacritic | Agregador, escala 0-100 | Sem API pública oficial — leitura manual da página. Normalizar sempre (`score/10`). |
| OpenCritic | Agregador, escala 0-100 | Tem API não-oficial documentada pela comunidade — validar ToS antes de automatizar |
| RAWG (rawg.io/apidocs) | API oficial, gratuita com limite | Boa fonte secundária para metadata + nota agregada |
| IGDB (api.igdb.com) | API oficial (Twitch/IGDB), requer client ID | Cobertura ampla, boa para datas e plataformas |

## Imagens/capas (Dara) — únicas fontes que já foram testadas e confirmadas HTTP 200 nesta sessão

| Fonte | Padrão de URL | Confiabilidade |
|---|---|---|
| Steam CDN | `https://cdn.cloudflare.steamstatic.com/steam/apps/<appid>/library_600x900.jpg` (capa retrato) | Alta — mas **confirme o appid via `store.steampowered.com/api/appdetails?appids=<id>`** antes de usar (já pegamos um appid errado nesta sessão e ele devolveu a capa de outro jogo) |
| Wikipedia/Wikimedia | `https://upload.wikimedia.org/wikipedia/en/.../<Arquivo>.jpg` (namespace `en`, fair-use da infobox) | Alta para jogos sem release no Steam (ex: exclusivos PS5) |
| `image.api.playstation.com` | Hashes que parecem oficiais mas **frequentemente são inventados por IA e retornam 404** | **NÃO CONFIAR sem teste HTTP direto.** Esta foi a causa do bug de 2026-07-01. |

## Regra geral

Nenhuma fonte entra nesta lista com confiabilidade "Alta" sem ter sido testada nesta sessão ou na anterior. Ao adicionar uma fonte nova, teste-a (curl, ou peça ao usuário para validar via NotebookLM) antes de subir a confiabilidade dela aqui.
