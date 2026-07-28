# Auditoria completa — Upa que Passa (2026-07-28)

Continuação da auditoria de 2026-07-27 (código React/Next, performance, SEO, banco/Prisma, acessibilidade WCAG 2.2, segurança). Segurança e SEO já foram fechadas (ver `security_hardening_upa` na memória do Claude e o commit `3b75d7c`/`0dcbf1f`). Este documento cobre as 4 frentes restantes, re-auditadas nesta sessão com 4 subagentes de pesquisa em paralelo (read-only, nada foi alterado ainda).

Escopo: site público (`src/app/**` exceto `/admin`) + camada de dados (`prisma/schema.prisma`, `src/lib/admin*.ts`, `src/app/api/**`).

---

## 1. Performance

**1.1 — [RESOLVIDO 2026-07-28] Reescrita da tabela inteira a cada edição/exclusão no admin (games, news, reviews) — maior impacto**
`games/route.ts` (PUT), `news/route.ts` (PUT/DELETE) e `reviews/route.ts` (PUT/DELETE + `syncGameAdminScore`, usada pelas 3 rotas) trocados de read-all→mutar-em-memória→write-all pra `prisma.X.update()`/`prisma.X.delete()` diretos, mirados pelo `id`. Extraído um mapper compartilhado (`mapGame`/`mapNews`/`mapReview`) em `src/lib/admin{Games,News,Reviews}.ts` pra não triplicar a conversão Prisma→app-type que antes vivia inline nas rotas.

**Bug extra descoberto e corrigido no caminho:** testando o `PUT` de reviews pela UI real do admin, o formulário retornava 400 sempre — `src/app/admin/_components/reviews/ReviewsTab.tsx` montava o payload de salvar com nomes de campo errados (`slug`, `excerpt`, `content`, `scoreGraphics`...) em vez dos campos reais do formulário (`text`, `conclusion`, `scores`, `overallScore`). Isso quebrava **completamente** criar/editar review pela UI — bug do colaborador introduzido em 20/07 (commit `728bae4`), sem relação com esta refatoração, mas travava o teste. Corrigido: `cleanPayload` agora usa os nomes de campo corretos.

**Nota de processo:** ao validar o fix acima chamando a API diretamente (antes do formulário estar corrigido), sobrescrevi por engano o texto real da review do Nioh 3 com dado de teste truncado. Percebido na hora — o modal de edição ainda estava aberto no navegador com os valores originais em memória (nunca fechado), então recuperei o texto/prós/contras/conclusão originais do DOM e restaurei via um novo PUT. Confirmado depois, com o formulário já corrigido, que editar a review pela UI real (sem alterar nada, só salvar) preserva o conteúdo perfeitamente — `textLen`, `prosCount`, `consCount`, `conclusionLen` e `overallScore` idênticos ao original em todas as checagens.

Build/lint sem regressão em cada etapa (244 problemas, melhorou de 248).

**1.2 — `useFetchData` invalida cache HTTP em toda requisição**
`src/hooks/useFetchData.ts:23-25` acrescenta `?_t=${Date.now()}` em toda URL — usado por `useAllGames`/`useAllNews`/`useAllReviews`/`useAllYoutubeVideos`. Isso anula o header `Cache-Control: s-maxage=60` que `/api/admin/games` já define.
*Fix:* remover o timestamp; confiar no `Cache-Control` existente (ou trocar por SWR/React Query).

**1.3 — `AdminPanelLayout` busca a tabela de jogos inteira independente da aba ativa**
`src/app/admin/AdminPanelLayout.tsx:61` chama `useAllGames()` incondicionalmente, mesmo em abas que nunca usam `allGames` (Youtube, Comments, Admin Users, Password Resets).
*Fix:* buscar só quando `activeSection` precisar, ou passar flag `skip` pro hook.

**1.4 — `PerfilClient` busca o catálogo inteiro de jogos só pra achar os favoritos**
`src/app/perfil/PerfilClient.tsx:31,34` — `useAllGames()` traz tudo pra filtrar poucos `favoriteGameIds`, mesmo a página já sendo majoritariamente server-rendered.
*Fix:* resolver os jogos favoritos no servidor (`prisma.game.findMany({ where: { id: { in: favoriteGameIds } } })`) e passar como prop.

**1.5 — `/buscar` também busca jogos+notícias inteiros no client**
`src/app/buscar/SearchPageContent.tsx:35-38` — `cache: "no-store"` + filtro `.includes()` no client. Funciona na escala atual, mas não escala.
*Fix (não urgente):* mover a filtragem pro servidor via `/api/search?q=` com `contains`/`take`, quando o catálogo crescer.

**1.6 — Imagens estáticas locais usando `<img>` em vez de `next/image`**
`BrandHeader.tsx:18-22,32-36` (banner/logo — provável elemento LCP, aparece em toda página pública), `LoadingScreen.tsx:21-24`, `AboutUs.tsx:74-77` (7 fotos locais da equipe). Diferente do caso já documentado no CLAUDE.md (imagens *externas*, que exigem `remotePatterns`) — essas são locais (`public/`), então `next/image` é ganho grátis: lazy loading, `sizes` responsivo, conversão pra AVIF/WebP.
*Fix:* trocar essas 3 por `next/image`, com `priority` no banner/logo do `BrandHeader` (provável LCP).

**1.7 — `readAdminGames`/`readAdminNews`/`readAdminReviews` ainda sem paginação (já conhecido)**
Confirmado que continua sem `select`/`take`. Na escala atual (dezenas a poucas centenas de linhas) é barato isoladamente, mas o custo se multiplica com 1.1–1.4 acima, que disparam esse mesmo scan completo repetidas vezes.

*Não sinalizado como problema:* nenhum loop N+1 nas rotas de API fora do padrão 1.1; nenhuma lib pesada (chart/data/lodash) importada no client.

---

## 2. Banco de dados / Prisma

**2.1 — [RESOLVIDO 2026-07-28] `Comment.gameId` sem índice — maior caminho de leitura pública sem cobertura**
`prisma/schema.prisma`. Diferente de `Review`, `Comment` não tinha `@@index([gameId])`. Adicionado `@@index([gameId])` em `Comment`. Bundle com o item 2.4 (`@@index([commentId])` em `CommentReaction`) na mesma migration `20260728193646_add_comment_indexes`. `prisma generate`/`migrate dev`/build todos limpos.

**2.2 — `SugestaoAgente` sem paginação — cresce sem limite (5 agentes inserem diariamente)**
`src/app/api/admin/entregas/route.ts:11-20` carrega a tabela inteira com join toda vez que a fila de revisão abre.
*Fix:* paginar ou pelo menos filtrar PENDING com `take`; considerar `@@index([status, createdAt])` composto.

**2.3 — `ArticleViewLog` sem retenção/limpeza — a tabela que mais cresce no sistema**
`prisma/schema.prisma:203-210`. 1 linha por (artigo, IP) a cada 30 min, sem nenhum cron/rota que apague linhas antigas.
*Fix:* job periódico de limpeza (ex.: linhas com mais de 90 dias) + `@@index([viewedAt])` pra suportar a limpeza barata.

**2.4 — [RESOLVIDO 2026-07-28, parcial] `CommentReaction.commentId` sem índice independente**
Adicionado `@@index([commentId])` em `CommentReaction` (mesma migration do item 2.1). `Favorite.gameId` continua sem índice independente — baixo volume, não priorizado agora.

**2.5 — `PasswordResetToken` sem limpeza de tokens expirados-mas-nunca-usados**
Boa higiene no geral (`forgot-password`/`reset-password` já limpam nos próprios fluxos), mas nada varre globalmente tokens que expiraram sem uso. Baixo risco (tem `@@index([email])`), mas vale um sweep periódico.

**2.6 — `readAdminReviews`/`getMergedAdminNews` sem cache no dashboard admin**
`src/app/api/admin/dashboard/stats/route.ts:30,36` — usa só `.length`/soma de `.views`, mas paga o custo do `findMany` completo (ver 1.7) a cada visita ao dashboard.

**Confirmado correto, sem ação necessária:** singleton do Prisma (`src/lib/prisma.ts`) bem implementado; zero SQL raw no projeto (sem risco de injection); `onDelete: Cascade` consistente em todas as FKs; 10 migrations revisadas sem drift ou edição manual arriscada.

---

## 3. Acessibilidade (WCAG 2.2) — primeira auditoria desse tipo no projeto

### Bloqueantes

**3.1 — Inputs de texto perdem todo indicador de foco (2.4.7 Focus Visible)**
`SearchModal.tsx:75`, `AuthModal.tsx:99`, `ReviewClient.tsx:680` (textarea de comentário) usam `focus:outline-none` sem substituto. A regra global em `globals.css:50-57` só cobre `button, a, [role="button"]`, não `input`/`textarea`.
*Fix:* `focus-visible:ring-2 focus-visible:ring-purple-500` nesses inputs.

**3.2/3.3 — [RESOLVIDO 2026-07-28, com correção de escopo] `AuthModal` não é usado em lugar nenhum do app**
Descoberto ao investigar: `AuthModal.tsx` não tem nenhum import/renderização em `src/` (confirmado via grep) — o colaborador removeu seu uso em 20/07/2026 (commit `728bae4`) quando migrou login/cadastro pras páginas dedicadas `/login` e `/cadastrar`. É código morto; corrigir o modal seria esforço desperdiçado. O equivalente real (as duas páginas ao vivo) tinha um problema *mais grave* que o relatório original não pegou: `<label>` sem associação `htmlFor`/`id` com os `<input>` em ambos os formulários (nickname/e-mail/senha/console) — leitor de tela não anunciava o nome do campo (WCAG 1.3.1/4.1.2). Corrigido em `src/app/login/page.tsx` e `src/app/cadastrar/page.tsx`: `htmlFor`/`id` em todos os campos, `aria-label`/`aria-pressed` nos botões de mostrar/ocultar senha, e reforço do indicador de foco (`focus:ring-2`) no `/cadastrar` pra ficar consistente com o `/login`. Testado ao vivo: autofill do Chrome passou a reconhecer os campos corretamente (efeito colateral da associação correta), `find` confirmou nome acessível "Mostrar senha" nos dois toggles, zero erros de console. Build/lint sem regressão (250 problemas, mesmo baseline). *(Foco-trap/Escape/backdrop do relatório original não se aplicam — não são modais, são páginas inteiras.)*

### Maiores

- **3.4** Alt text genérico nas capturas de tela (`"Screenshot 1"`) — `ReviewClient.tsx:853`.
- **3.5** Gauges de nota (Metacritic/comunidade) não expõem rótulo+número como unidade pra leitor de tela — `ReviewClient.tsx:357-422`. Fix: `role="img" aria-label="Metacritic: 78 de 100"`.
- **3.6** Hierarquia de heading inconsistente na sidebar da review — `ReviewClient.tsx` (~900, ~930).
- **3.7** Sem link "pular para o conteúdo" (2.4.1) — `layout.tsx`/`SiteShell.tsx:20`.
- **3.8** Botões de mostrar/ocultar senha sem nome acessível — `AuthModal.tsx:218-224,286-292`, `login/page.tsx:125-131`.
- **3.9** Seletor de nota 1-10 sem rótulo/estado selecionado — `ReviewClient.tsx:657-674`. Fix: `role="radiogroup"` + `aria-pressed`.

### Menores

- **3.10** Botão de compartilhar só com `title`, sem `aria-label` (inconsistente com o botão de favoritar do `GameCard.tsx:122`) — `ReviewClient.tsx:441`.
- **3.11** Texto pequeno de baixo contraste (`text-gray-500/600` em 10px sobre fundo escuro, ~3.9:1, abaixo do AA 4.5:1) — `ReviewClient.tsx:531,297`. Fix: subir pra `text-gray-400`.
- **3.12** Dropdown de notificações sem `aria-expanded`/`aria-haspopup` — `Navbar.tsx:175-201`.
- **3.13** Hambúrguer mobile tem `aria-label` mas não `aria-expanded` — `Navbar.tsx:152-158`.
- **3.14** Asteriscos de campo obrigatório lidos como "asterisco" (faltando `aria-hidden`) — `AuthModal.tsx:245,260,275`.
- **3.15** SVGs decorativos dos gauges não marcados `aria-hidden` — `ReviewClient.tsx:363,386,408`.

**Pontos positivos confirmados:** `ScoreBadge.tsx` já expõe notas como texto real (não só cor); `SearchModal.tsx` já usa Radix Dialog com foco correto; `Footer.tsx` já tem `aria-label`s; `<html lang="pt-BR">` correto na raiz.

---

## 4. Qualidade de código React/Next

**4.1 — [RESOLVIDO 2026-07-28] `MarketplaceFeatured` recebia `activeListings` mas nunca usava**
Investigando antes de corrigir: a seção é um teaser proposital — sempre mostra `EXAMPLE_LISTINGS` borrado com cadeado, rotulado "Exemplos ilustrativos", independente de login/dado real (não é uma prévia que deveria refletir anúncios de verdade). Então o prop `activeListings?: any[]` e o cálculo `LISTINGS.filter(...).slice(0,3)` em `page.tsx` eram só plumbing morto, não um bug de dado fake sendo mostrado por engano. Removido: a prop/interface do componente e o import/cálculo/passagem em `page.tsx`. Zero mudança visual (confirmado ao vivo). Build limpo; lint melhorou (250→248, removeu o `any[]`).

**4.2 — [RESOLVIDO 2026-07-28] Falha de rede desloga o usuário silenciosamente**
`src/hooks/useUserSession.ts` — o `.catch()` de erro de rede não seta mais `null` (que corresponde ao mesmo estado de "não logado"); agora deixa o estado como `undefined` (carregando), sem afirmar falsamente que o usuário está deslogado. Confirmado que nenhum dos 6 consumidores (`ReviewClient`, `NewsInteractions`, `Navbar`, `GameCard`, `MarketplaceFeatured`, `PerfilClient`) distingue `undefined` de `null` — só fazem `!currentUser`, então o comportamento de gating fica idêntico, só corrige o caso de falso-deslogado. Build/lint sem regressão.

**4.3 — `BrandHeader` duplica checagem que o único chamador já faz**
`SiteShell.tsx:11-16` já decide `isAdmin` e só renderiza `<BrandHeader />` quando não é admin. `BrandHeader.tsx:6-12` reimplementa a mesma checagem por dentro (código morto — nunca dispara) e é só por isso que o componente é `"use client"`.
*Fix:* remover a checagem interna e o `"use client"` — vira server component puro, zero mudança visual.

**4.4 — `any` no boundary Prisma↔app pode corromper dado silenciosamente**
`src/lib/adminGames.ts:32,37,74,79,108,113` — `links`/`siteScores` (colunas `Json`) castados direto pra array tipado sem checagem de formato, tanto na leitura quanto nas 3 vias de escrita. Se uma linha tiver JSON mal formado (schema legado, ou escrita ruim vinda do pipeline de agentes), não quebra na borda — propaga silenciosamente um formato errado até `getScoreColor`/consumidores de `siteScores[].score`, bem longe da causa.
*Fix:* guarda de runtime simples (`Array.isArray(x) ? x : []`) em vez do cast cego.

**4.5 — `useFetchData` (hook novo do colaborador) só foi adotado pela metade**
`useAllGames`/`useAllNews`/`useAllReviews` já usam, mas `useAdminUsers.ts:12-33`, `ReviewClient.tsx` (3 blocos ~91-130) e `NewsInteractions.tsx` (2 blocos, 11-27 e 44-54) continuam reimplementando o mesmo `fetch().then(ok?json:null).then(setState).catch(()=>{})` manualmente.

**4.6 — Busca de usuários admin sem debounce**
`src/app/admin/_hooks/useAdminUsers.ts:12-33` — `search` como dependência direta do `useEffect`, dispara 1 requisição por tecla, sem cancelamento — respostas fora de ordem podem sobrescrever o resultado mais recente com um mais antigo.
*Fix:* debounce de ~300ms antes de entrar no array de dependências.

**4.7 — `catch` vazio no POST de contagem de views, não só nos GETs**
`NewsInteractions.tsx:14-26` — se o POST de `/api/noticias/view` falhar, o `sessionStorage` nunca é setado (está dentro do `.then`), então a mesma notícia tenta de novo a cada reload, sem backoff nem sinal pro usuário. Severidade baixa, mas vale documentar se é "fire-and-forget" proposital.

**4.8 — Botões do `ContactBox` sem handler nenhum**
`src/app/marketplace/[id]/ListingInteractions.tsx:53-83` — "Conversar pelo WhatsApp" (linha 69), "Chat Interno" (72) e "Salvar Anúncio" (78) não têm `onClick`. Usuário clica e nada acontece.
*Fix:* implementar os handlers ou marcar como "em breve" visualmente.

**4.9 — Efeito do carrossel da home reinicia em vez de só pausar**
`src/components/home/TrendingStrip.tsx:31-45` — `useEffect` com `[slideCount, isPaused]` recria o `setInterval` do zero a cada hover, então passar o mouse repetidamente reseta a contagem de 6s em vez de continuar de onde parou.

---

## Resumo e prioridade sugerida

| # | Item | Frente | Esforço | Impacto |
|---|------|--------|---------|---------|
| 1 | Migrar `AuthModal` pro Radix Dialog (3.2/3.3) | Acessibilidade | Médio | Alto — bloqueia teclado/leitor de tela no login |
| 2 | Ativar `activeListings` real no `MarketplaceFeatured` (4.1) | Código | Baixo | Alto — dado fake na home |
| 3 | `Comment.gameId` + índice (2.1) | Banco | Baixo | Alto — leitura pública mais quente sem índice |
| 4 | `useUserSession` não deslogar em erro de rede (4.2) | Código | Baixo | Alto — bug de sessão intermitente |
| 5 | Trocar `PUT`/`DELETE` admin de read-all/write-all pra update pontual (1.1) | Performance | Médio-Alto | Alto, cresce com o catálogo |
| 6 | Handlers do `ContactBox` no marketplace (4.8) | Código | Baixo | Médio — feature quebrada visível |
| 7 | Remover cache-busting do `useFetchData` (1.2) | Performance | Baixo | Médio |
| 8 | Limpeza/retenção do `ArticleViewLog` (2.3) | Banco | Baixo | Médio, cresce sozinho |
| 9 | Focus indicator em inputs (3.1) | Acessibilidade | Baixo | Médio |
| 10 | Demais itens de acessibilidade/performance/banco/código | — | Variável | Baixo-Médio |

Segurança e SEO: já fechadas (ver commits `3b75d7c`/`0dcbf1f` e memória `security_hardening_upa`).
