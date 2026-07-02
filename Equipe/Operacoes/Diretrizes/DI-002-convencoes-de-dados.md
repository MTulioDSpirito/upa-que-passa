# DI-002 - Convenções de Dados

Fonte de verdade complementar ao `CLAUDE.md` da raiz do projeto — leia aquele primeiro. Isto cobre o que o `CLAUDE.md` não detalha: as regras que a Equipe de Conteúdo segue ao gerar dados novos.

## Escalas de nota

- Interno do site (`userScore`, `adminScore`, `worldAvg`, notas em `siteScores[]` exceto Metacritic): **0 a 10**, uma casa decimal.
- Metacritic: **0 a 100**. Sempre normalizar para exibição: `score > 10 ? score / 10 : score` (regra já existe em `CLAUDE.md`).
- Nunca escreva uma nota Metacritic diretamente em um campo 0-10 sem dividir por 10 primeiro.

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
