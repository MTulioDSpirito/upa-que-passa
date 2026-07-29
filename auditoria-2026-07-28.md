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

**1.2 — [RESOLVIDO 2026-07-28] `useFetchData` invalida cache HTTP em toda requisição**
Removido o `?_t=${Date.now()}` do `fetch()` interno. Confirmado que os 4 consumidores (`useAllGames`/`useAllNews`/`useAllReviews`/`useAllYoutubeVideos`) só buscam uma vez por mount (sem polling), então a remoção não muda o comportamento de atualização — só deixa de invalidar à toa o `Cache-Control: s-maxage=60` já configurado em `/api/admin/games` (que só faz efeito real com CDN em produção; o projeto ainda não tem deploy, então risco de "dado desatualizado" local é nulo agora). Build/lint sem regressão.

**1.3 — `AdminPanelLayout` busca a tabela de jogos inteira independente da aba ativa**
`src/app/admin/AdminPanelLayout.tsx:61` chama `useAllGames()` incondicionalmente, mesmo em abas que nunca usam `allGames` (Youtube, Comments, Admin Users, Password Resets).
*Fix:* buscar só quando `activeSection` precisar, ou passar flag `skip` pro hook.

**1.4 — `PerfilClient` busca o catálogo inteiro de jogos só pra achar os favoritos**
`src/app/perfil/PerfilClient.tsx:31,34` — `useAllGames()` traz tudo pra filtrar poucos `favoriteGameIds`, mesmo a página já sendo majoritariamente server-rendered.
*Fix:* resolver os jogos favoritos no servidor (`prisma.game.findMany({ where: { id: { in: favoriteGameIds } } })`) e passar como prop.

**1.5 — `/buscar` também busca jogos+notícias inteiros no client**
`src/app/buscar/SearchPageContent.tsx:35-38` — `cache: "no-store"` + filtro `.includes()` no client. Funciona na escala atual, mas não escala.
*Fix (não urgente):* mover a filtragem pro servidor via `/api/search?q=` com `contains`/`take`, quando o catálogo crescer.

**1.6 — [RESOLVIDO 2026-07-28] Imagens estáticas locais usando `<img>` em vez de `next/image`**
`BrandHeader.tsx` (banner + logo, ambos `priority` — prováveis LCP, aparecem em toda página pública), `LoadingScreen.tsx` (logo), `AboutUs.tsx` (7 fotos locais da equipe) — todas trocadas por `next/image` com `fill` dentro dos containers já dimensionados/posicionados existentes + `sizes` apropriado. Testado ao vivo: banner/logo na home e as 7 fotos da seção "Quem Somos" renderizam idênticas, zero erro de console.

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

**2.3 — [RESOLVIDO 2026-07-28] `ArticleViewLog` sem retenção/limpeza — a tabela que mais cresce no sistema**
Adicionado `@@index([viewedAt])` (migration `20260728201609_add_article_view_log_index`). Como o projeto não tem infra de cron, a limpeza roda oportunisticamente dentro do próprio `POST /api/noticias/view` — ~1% das requisições disparam um `deleteMany` de linhas com mais de 90 dias, em vez de rodar em toda requisição.

**2.4 — [RESOLVIDO 2026-07-28, parcial] `CommentReaction.commentId` sem índice independente**
Adicionado `@@index([commentId])` em `CommentReaction` (mesma migration do item 2.1). `Favorite.gameId` continua sem índice independente — baixo volume, não priorizado agora.

**2.5 — [RESOLVIDO 2026-07-28] `PasswordResetToken` sem limpeza de tokens expirados-mas-nunca-usados**
Adicionada limpeza oportunística global (mesmo padrão do item 2.3) em `POST /api/auth/forgot-password` — ~1% das requisições apagam tokens com `expiresAt` no passado, de qualquer e-mail. O `deleteMany` por e-mail específico que já existia continua intacto.

**2.6 — `readAdminReviews`/`getMergedAdminNews` sem cache no dashboard admin**
`src/app/api/admin/dashboard/stats/route.ts:30,36` — usa só `.length`/soma de `.views`, mas paga o custo do `findMany` completo (ver 1.7) a cada visita ao dashboard.

**Confirmado correto, sem ação necessária:** singleton do Prisma (`src/lib/prisma.ts`) bem implementado; zero SQL raw no projeto (sem risco de injection); `onDelete: Cascade` consistente em todas as FKs; 10 migrations revisadas sem drift ou edição manual arriscada.

---

## 3. Acessibilidade (WCAG 2.2) — primeira auditoria desse tipo no projeto

### Bloqueantes

**3.1 — [RESOLVIDO 2026-07-28] Inputs de texto perdem todo indicador de foco (2.4.7 Focus Visible)**
`AuthModal.tsx` é código morto (ver 3.2/3.3), não corrigido. `SearchModal.tsx` — adicionado `focus-within:ring-2 focus-within:border-purple-500/50` no formulário (o input é `bg-transparent` dentro de uma caixa, então o ring fica no container em vez do próprio input). `ReviewClient.tsx` (textarea de comentário) — adicionado `focus-visible:ring-2 focus-visible:ring-purple-500/30` complementando o `focus:border-purple-500/50` já existente. Build/lint sem regressão.

**3.2/3.3 — [RESOLVIDO 2026-07-28, com correção de escopo] `AuthModal` não é usado em lugar nenhum do app**
Descoberto ao investigar: `AuthModal.tsx` não tem nenhum import/renderização em `src/` (confirmado via grep) — o colaborador removeu seu uso em 20/07/2026 (commit `728bae4`) quando migrou login/cadastro pras páginas dedicadas `/login` e `/cadastrar`. É código morto; corrigir o modal seria esforço desperdiçado. O equivalente real (as duas páginas ao vivo) tinha um problema *mais grave* que o relatório original não pegou: `<label>` sem associação `htmlFor`/`id` com os `<input>` em ambos os formulários (nickname/e-mail/senha/console) — leitor de tela não anunciava o nome do campo (WCAG 1.3.1/4.1.2). Corrigido em `src/app/login/page.tsx` e `src/app/cadastrar/page.tsx`: `htmlFor`/`id` em todos os campos, `aria-label`/`aria-pressed` nos botões de mostrar/ocultar senha, e reforço do indicador de foco (`focus:ring-2`) no `/cadastrar` pra ficar consistente com o `/login`. Testado ao vivo: autofill do Chrome passou a reconhecer os campos corretamente (efeito colateral da associação correta), `find` confirmou nome acessível "Mostrar senha" nos dois toggles, zero erros de console. Build/lint sem regressão (250 problemas, mesmo baseline). *(Foco-trap/Escape/backdrop do relatório original não se aplicam — não são modais, são páginas inteiras.)*

### Maiores

- **3.4** — [RESOLVIDO 2026-07-28] Alt text genérico (`"Screenshot 1"`) trocado por `"${game.title} — captura de tela ${i+1}"` em `ReviewClient.tsx`.
- **3.5** — [RESOLVIDO 2026-07-28] Os 3 gauges (Metacritic/Média Geral/Comunidade) ganharam `role="img" aria-label="..."` com o valor por extenso, e o SVG/número visual viraram `aria-hidden`.
- **3.6** — [RESOLVIDO 2026-07-28] `h2` (título da review) pulava direto pra `h4` (PRÓS/CONTRAS/Conclusão) — corrigido pra `h3`.
- **3.7** — [RESOLVIDO 2026-07-28] Link "Pular para o conteúdo" adicionado em `SiteShell.tsx` (`sr-only focus:not-sr-only`, primeiro elemento focável) apontando pra `id="main-content"` no `<main>`. Testado ao vivo: aparece corretamente no primeiro Tab.
- **3.8** Botões de mostrar/ocultar senha sem nome acessível — já resolvido em `/login` e `/cadastrar` (ver 3.2/3.3); `AuthModal.tsx` é código morto, não corrigido.
- **3.9** — [RESOLVIDO 2026-07-28] Seletor de nota 1-10 ganhou `role="radiogroup"` no container e `role="radio"`/`aria-checked`/`aria-label` em cada botão.

### Menores

- **3.10** — [RESOLVIDO 2026-07-28] Botão de compartilhar ganhou `aria-label="Compartilhar"` além do `title` já existente.
- **3.11** — [RESOLVIDO 2026-07-28] Todas as 8 ocorrências de texto pequeno de baixo contraste em `ReviewClient.tsx` (`text-gray-500`→`text-gray-400`, `text-gray-600`→`text-gray-500`, mantendo 10px).
- **3.12** — [RESOLVIDO 2026-07-28] Dropdown de notificações ganhou `aria-haspopup="true"`/`aria-expanded` em `Navbar.tsx`.
- **3.13** — [RESOLVIDO 2026-07-28] Hambúrguer mobile ganhou `aria-expanded` em `Navbar.tsx`.
- **3.14** Asteriscos de campo obrigatório — só existem em `AuthModal.tsx` (código morto), não em `/login`/`/cadastrar` (que usam `*` no texto do label, não em span separado) — não corrigido, baixo risco real.
- **3.15** — [RESOLVIDO 2026-07-28] SVGs decorativos dos 3 gauges marcados `aria-hidden="true"` (junto com 3.5).

**Pontos positivos confirmados:** `ScoreBadge.tsx` já expõe notas como texto real (não só cor); `SearchModal.tsx` já usa Radix Dialog com foco correto; `Footer.tsx` já tem `aria-label`s; `<html lang="pt-BR">` correto na raiz.

---

## 4. Qualidade de código React/Next

**4.1 — [RESOLVIDO 2026-07-28] `MarketplaceFeatured` recebia `activeListings` mas nunca usava**
Investigando antes de corrigir: a seção é um teaser proposital — sempre mostra `EXAMPLE_LISTINGS` borrado com cadeado, rotulado "Exemplos ilustrativos", independente de login/dado real (não é uma prévia que deveria refletir anúncios de verdade). Então o prop `activeListings?: any[]` e o cálculo `LISTINGS.filter(...).slice(0,3)` em `page.tsx` eram só plumbing morto, não um bug de dado fake sendo mostrado por engano. Removido: a prop/interface do componente e o import/cálculo/passagem em `page.tsx`. Zero mudança visual (confirmado ao vivo). Build limpo; lint melhorou (250→248, removeu o `any[]`).

**4.2 — [RESOLVIDO 2026-07-28] Falha de rede desloga o usuário silenciosamente**
`src/hooks/useUserSession.ts` — o `.catch()` de erro de rede não seta mais `null` (que corresponde ao mesmo estado de "não logado"); agora deixa o estado como `undefined` (carregando), sem afirmar falsamente que o usuário está deslogado. Confirmado que nenhum dos 6 consumidores (`ReviewClient`, `NewsInteractions`, `Navbar`, `GameCard`, `MarketplaceFeatured`, `PerfilClient`) distingue `undefined` de `null` — só fazem `!currentUser`, então o comportamento de gating fica idêntico, só corrige o caso de falso-deslogado. Build/lint sem regressão.

**4.3 — [RESOLVIDO 2026-07-28] `BrandHeader` duplicava checagem que o único chamador já fazia**
Removida a checagem interna `usePathname`/`isAdmin` (nunca disparava, já que `SiteShell.tsx` só renderiza `<BrandHeader />` quando não é admin) e o `"use client"` — virou server component puro. Combinado com a conversão pra `next/image` do item 1.6 no mesmo arquivo.

**4.4 — [RESOLVIDO 2026-07-28, parcial] `any` no boundary Prisma↔app pode corromper dado silenciosamente**
Adicionado helper `asArray<T>()` (`Array.isArray` guard) usado no caminho de leitura (`mapGame`) pros campos `links`/`siteScores` — se uma linha tiver JSON mal formado, agora vira lista vazia de forma explícita em vez de propagar um formato errado silenciosamente. Os casts `as any` no caminho de escrita (`writeAdminGames`) não foram tocados — lá a entrada já é o tipo `Game` bem tipado do app, o cast é só formalidade pra satisfizer o tipo `Json` do Prisma, não um risco real de dado corrompido.

**4.5 — `useFetchData` (hook novo do colaborador) só foi adotado pela metade**
`useAllGames`/`useAllNews`/`useAllReviews` já usam, mas `useAdminUsers.ts:12-33`, `ReviewClient.tsx` (3 blocos ~91-130) e `NewsInteractions.tsx` (2 blocos, 11-27 e 44-54) continuam reimplementando o mesmo `fetch().then(ok?json:null).then(setState).catch(()=>{})` manualmente.

**4.6 — [RESOLVIDO 2026-07-28] Busca de usuários admin sem debounce**
`useAdminUsers.ts` — `search` agora passa por um debounce de 300ms antes de virar dependência do `useEffect` de fetch, e a busca ganhou um guard `cancelled` (mesmo padrão já usado em `useUserSession`/`useFetchData`) pra respostas fora de ordem não sobrescreverem o resultado mais recente.

**4.7 — `catch` vazio no POST de contagem de views, não só nos GETs**
`NewsInteractions.tsx:14-26` — se o POST de `/api/noticias/view` falhar, o `sessionStorage` nunca é setado (está dentro do `.then`), então a mesma notícia tenta de novo a cada reload, sem backoff nem sinal pro usuário. Severidade baixa, mas vale documentar se é "fire-and-forget" proposital.

**4.8 — [RESOLVIDO 2026-07-28] Botões do `ContactBox` sem handler nenhum**
Investigado antes de corrigir: `Listing` (tipo em `src/lib/types.ts`) não tem campo de telefone/WhatsApp do vendedor, e não existe chat interno nem API de favoritar anúncio no backend — implementar de verdade seria escopo bem maior que "baixo esforço". Marcado como indisponível: os 3 botões (WhatsApp/Chat Interno/Salvar Anúncio) ganharam `disabled`, `title="Em breve"` e estilo esmaecido + "(Em breve)" no texto, em vez de parecerem funcionais sem fazer nada.

**4.9 — [RESOLVIDO 2026-07-28] Efeito do carrossel da home reiniciava em vez de só pausar**
`TrendingStrip.tsx` — o `setInterval` agora é criado uma única vez por `slideCount` (não mais recriado a cada toggle de `isPaused`); o estado de pausa é lido via `ref` dentro do callback do timer, então passar o mouse repetidamente só pula o avanço enquanto pausado, sem resetar a fase da contagem de 6s.

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
