# DI-002 - Convenções de Dados

Fonte de verdade complementar ao `CLAUDE.md` da raiz do projeto — leia aquele primeiro. Isto cobre o que o `CLAUDE.md` não detalha: as regras que a Equipe de Conteúdo segue ao gerar dados novos.

## Escalas de nota

- Interno do site (`userScore`, `adminScore`, `worldAvg`, notas em `siteScores[]` exceto Metacritic): **0 a 10**, uma casa decimal.
- Metacritic: **0 a 100**. Sempre normalizar para exibição: `score > 10 ? score / 10 : score` (regra já existe em `CLAUDE.md`).
- Nunca escreva uma nota Metacritic diretamente em um campo 0-10 sem dividir por 10 primeiro.

## Tempo de jogo (`avgPlayTime`)

Fonte: HowLongToBeat (ver DI-001 v2 — uso pontual, o site bloqueia bots). Labels mapeadas: *Main Story* → História Principal, *Main + Extras* → História + Extras, *Completionist* → 100%/Platina. O campo `avgPlayTime` do `Game` é uma string no formato já usado em `data.ts`: `"25-35 horas"` (faixa entre História Principal e História + Extras). O detalhamento das três labels vai na Ficha Técnica da review do Theo, não no campo.

## Datas de lançamento

RAWG é a fonte primária de `releaseDate`, mas **o PlayStation Blog tem prioridade absoluta em caso de divergência** (regra da DI-001 v2). Formato: ISO `AAAA-MM-DD`.

## Slugs

kebab-case, minúsculo, sem acento (mesma regra do WeWiki, `DI-001-convencoes-de-nomeacao`). Ex: `baldurs-gate-3`, não `Baldur's_Gate_3`.

## Toda URL precisa de verificação HTTP antes de entrar em `data.ts`

Não é opcional, não é "parece confiável então tudo bem". Ver [[../SOPs/SOP-003-verificar-imagem]]. Isso vale para `cover`, `gallery[]`, `photos[]`, `avatar`, e qualquer imagem de notícia.

## Citação de fontes

Todo rascunho em `Entregas/` cita a URL de onde o fato/nota veio. Isso não vai para o site (o site não mostra "fonte: X"), mas fica no rascunho para Vic e Dara auditarem antes de aprovar.

## Onde cada tipo de conteúdo entra

| Tipo | Array em `data.ts` | Quem produz | Quem mescla |
|---|---|---|---|
| Jogo novo | `GAMES` | Kai (achou) + Vera (notas) | Dara |
| Notícia | `NEWS` | Kai | Dara |
| Review completa | `REVIEWS` | Theo | Dara |
| Atualização de nota de jogo existente | campo em `GAMES` | Vera | Dara |
| Anúncio de marketplace (fictício/exemplo) | `LISTINGS` | Fora do escopo da Equipe de Conteúdo — é dado de usuário simulado, não editorial |

## Build/lint como critério de aceite

Nenhum merge de Dara é considerado concluído sem `npm run build` passando sem erro. `npm run lint` pode manter os 64 warnings pré-existentes documentados em `CLAUDE.md`, mas conteúdo novo não pode introduzir warning novo.
