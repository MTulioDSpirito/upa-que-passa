# DI-001 - Fontes Confiáveis (v2)

> Atualizada em **2026-07-02** com o resultado da pesquisa no NotebookLM. Todos os status HTTP citados abaixo foram testados via `curl` em 2026-07-02 — mantendo a regra da casa: **nenhuma fonte ganha confiabilidade "Alta" sem teste real**. Fontes marcadas "requer chave" dependem da tarefa [[../../tarefas/abertas/tsk-2026-07-02-001-chaves-de-api]].

## 1. Notícias e monitoramento (Kai)

### Feeds RSS verificados (todos HTTP 200 em 2026-07-02) — varredura diária

| Fonte | URL do feed | Tipo | Observação |
|---|---|---|---|
| PlayStation Blog (EN) | `https://blog.playstation.com/feed/` | Oficial | **Prioridade máxima.** Anúncios de hardware, exclusivos, State of Play. |
| PlayStation Blog (PT-BR) | `https://blog.br.playstation.com/feed/` | Oficial | Versão brasileira — preferir para citações em português e preços em R$. |
| IGN Brasil | `https://br.ign.com/feed.xml` | Imprensa BR | Cobertura ampla em português. |
| IGN (EN) | `https://feeds.feedburner.com/ign/all` | Imprensa internacional | Embargo de reviews, eventos. |
| Adrenaline | `https://www.adrenaline.com.br/feed/` | Imprensa BR | Bom para hardware. |
| TecMundo (inclui Voxel) | `https://rss.tecmundo.com.br/feed` | Imprensa BR | O feed dedicado do Voxel deu **404** — usar o feed geral do TecMundo e filtrar games. |
| Push Square | `https://www.pushsquare.com/feeds/latest` | Imprensa internacional | Especializado em PlayStation. |
| Eurogamer | `https://www.eurogamer.net/feed` | Imprensa internacional | Reviews e análises de referência. |

**Regra de triangulação continua valendo:** fato de imprensa precisa de 2 fontes independentes; fato vindo do PS Blog oficial basta 1.

### Agregadores (requer chave)

| Fonte | Tipo | Observação |
|---|---|---|
| News API (`newsapi.org`) | Agregador tech | Para uma futura seção "Radar Tech". Plano gratuito: **100 req/dia, delay de 24h nas notícias, só para desenvolvimento**. Testado sem chave: 401 (auth obrigatória). Só vale para pauta atrasada, não para furo. |

## 2. Metadados, fichas técnicas e tempo de jogo (Vera + Kai)

> **Diretriz de ficha técnica:** a **RAWG API é a fonte primária** para dados engessados (gêneros, desenvolvedora, publicadora, data de lançamento, nota Metacritic agregada). A **HowLongToBeat** enriquece com tempo de jogo. **Se RAWG e PS Blog discordarem numa data de lançamento, o PS Blog tem prioridade absoluta.**

| Fonte | Tipo | Status testado | Observação |
|---|---|---|---|
| RAWG API (`api.rawg.io/api/games`) | Banco de dados primário (350k+ jogos) | **200 testada com chave** (2026-07-02, busca "astro bot" retornou o jogo correto) | Chave em `RAWG_API_KEY` no `.env` da raiz (local apenas — a rotina na nuvem não tem acesso). ToS exige atribuição ("dados de RAWG") e proíbe uso em concorrente direto. Traz `metacritic` e `released` no payload. **Screenshots: usar o campo `short_screenshots` do payload de busca** — o endpoint dedicado `/games/<slug>/screenshots` respondeu 200 mas com `results` vazio no tier gratuito. |
| Steam appdetails (`store.steampowered.com/api/appdetails?appids=<id>`) | API oficial, sem auth | **200** (2026-07-02) | Continua sendo a fonte sem-fricção para descrição, data e capa de jogos multiplataforma. |
| HowLongToBeat (`howlongtobeat.com`) | Tempo de jogo | **403 para bots**; 200 com User-Agent de navegador (2026-07-02) | **Não tem API oficial** — os "wrappers" da comunidade fazem scraping. O site bloqueia curl puro. Uso pontual via WebFetch/navegação, nunca automação em volume. Mapear labels: *Main Story* → História Principal, *Main + Extras* → História + Extras, *Completionist* → 100%/Platina. |
| IGDB API (`api.igdb.com/v4`) | Banco de dados secundário (Twitch) | não testado (requer OAuth2) | Redundância quando a RAWG falhar (ex.: datas de indies). Requer Client-ID Twitch + token OAuth2 — ver tarefa de chaves. |
| PSN-API (lib JS `psn-api`) | Biblioteca de troféus/perfil | não testado | Para futuros widgets de troféus (`getUserTrophyProfileSummary()`). Requer token NPSSO de uma conta PSN logada. **Fora do pipeline diário por enquanto.** |

## 3. Notas agregadas (Vera)

| Fonte | Tipo | Status testado | Observação |
|---|---|---|---|
| Metacritic **via RAWG** | Campo `metacritic` do payload da RAWG | **ativa — chave validada 2026-07-02** | Caminho preferido para automação — evita scraping do Metacritic. Escala 0-100: normalizar sempre (`score/10`). |
| Metacritic (site) | Agregador, leitura manual | — | Fallback quando a RAWG não tiver a nota. Sem API pública; não automatizar scraping. |
| OpenCritic | Agregador 0-100 | API pública retornou **400** (2026-07-02) | O acesso oficial hoje é via RapidAPI (tem tier gratuito limitado). Até obter chave, leitura manual da página com citação da URL. |
| Notas por veículo (IGN, GameSpot, Eurogamer, Push Square…) | Leitura manual das reviews | feeds testados 200 (seção 1) | Alimentam `siteScores[]` — sempre com `fonte_url` da review. |
| Steam Review % / Metacritic User Score | Nota de usuários | — | Alimentam `userScore`, normalizado 0-10. |

## 4. Imagens, capas e screenshots (Dara)

> **Continua proibido:** `image.api.playstation.com` sem teste HTTP — foi a causa do bug de 404 de 2026-07-01. Toda URL é hostil até provar o contrário ([[../SOPs/SOP-003-verificar-imagem]]).

| Fonte | Confiabilidade | Observação / padrão de URL |
|---|---|---|
| Steam CDN | Alta (testada) | `https://cdn.cloudflare.steamstatic.com/steam/apps/<appid>/library_600x900.jpg` — **confirmar o appid** via appdetails antes (já pegamos capa de outro jogo com appid errado). |
| RAWG API / `media.rawg.io` | **Alta (testada 2026-07-02)** | Host `media.rawg.io` confirmado HTTP 200 (capa do Astro Bot). Extrair de `background_image` e `short_screenshots[]` do payload de busca — o endpoint `/screenshots` vem vazio no tier gratuito. Excelente para `gallery[]`. Cada URL individual ainda passa pelo curl da Dara (a regra não tem exceção). |
| Wikipedia/Wikimedia | Alta (testada) | `https://upload.wikimedia.org/wikipedia/en/...` — fair-use de infobox para exclusivos Sony fora do Steam. |
| IGDB `/covers` | Média-Alta | Capas boas, mas atrás do OAuth da Twitch. Usar quando RAWG/Steam falharem. |
| `image.api.playstation.com` | **PROIBIDA sem teste** | Hashes plausíveis frequentemente inventados por IA → 404. |

## 5. Distribuição e automação de publicação (fora do pipeline editorial)

Ferramentas apontadas pela pesquisa para **depois** que o conteúdo está no ar — nenhuma delas substitui o fluxo Vic → Dara:

| Ferramenta | Função | Decisão atual |
|---|---|---|
| RSS.app | Monitorar feeds (1h grátis / 15min pago) | **Desnecessária para ingestão** — os feeds da seção 1 foram testados e são acessíveis direto, de graça. Só reavaliar se alguma fonte importante não tiver RSS público. |
| IFTTT | Applets para repostar no Discord/X quando sair review nova | Opcional, decisão do usuário. Não interfere no pipeline. |
| Sai by Simular | "Operador autônomo" que pesquisa, gera imagem e posta rascunho | **Não adotar** — o papel dele já é coberto pela própria Equipe (Kai/Vera/Theo/Dara) com regras de verificação mais rígidas. |

## Regra geral (atualizada)

1. **RAWG para dados engessados** (data, publisher, gêneros, nota Metacritic); **HowLongToBeat para tempo de jogo**; **PS Blog vence qualquer discrepância de data**.
2. Nenhuma fonte entra com confiabilidade "Alta" sem teste HTTP nesta sessão ou anterior (status e data anotados na tabela).
3. Chaves de API ficam no `.env` da raiz (gitignorado), nunca em arquivos versionados — nomes das variáveis na tarefa [[../../tarefas/abertas/tsk-2026-07-02-001-chaves-de-api]].
4. Fonte nova só sobe de confiabilidade aqui depois de testada (curl ou validação do usuário).
