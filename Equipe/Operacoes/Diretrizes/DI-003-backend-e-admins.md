# DI-003 - Estado do Backend e dos Admins

## Estado atual (atualizado 2026-07-01)

**Decisão tomada:** Next.js API Routes + Prisma + SQLite, sessão própria via JWT em cookie httpOnly (sem NextAuth — evitamos trazer uma dependência beta numa versão tão nova do Next).

**O que existe agora:**
- `prisma/schema.prisma` — model `AdminUser` (id, name, email, passwordHash, role, active, timestamps). Banco: `prisma/dev.db` (SQLite, gitignored).
- 5 contas seedadas (`npm run db:seed`, idempotente): Vic (EDITOR_CHEFE), Kai (REPORTER), Vera (CURADOR_NOTAS), Theo (REDATOR_REVIEWS), Dara (QA_DADOS). Senha padrão compartilhada — ver aviso abaixo.
- Login real em `/admin/login` (não em `/login` — aquele continua sendo a UI pública não conectada, para usuários comuns do site, escopo separado).
- `src/middleware.ts` protege `/admin/:path*`.
- `src/app/admin/page.tsx` é Server Component: sem sessão válida, redireciona para `/admin/login`.

**O que ainda NÃO existe:**
- Autenticação de usuários públicos (o `/login` do site continua mockado — fora do escopo desta rodada).
- Persistência de jogos/notícias/reviews/marketplace em banco — continuam em `data.ts` (mock). Migrar isso é a próxima fronteira se o volume de conteúdo justificar.
- Tela de troca de senha — os 5 admins usam a senha padrão até isso ser construído.
- Controle de permissão por seção do painel (todo admin logado vê o dashboard inteiro; diferenciação por `role` hoje é só cosmética, mostrando o cargo na sidebar).

## Credenciais padrão (ambiente local)

| Nome | E-mail | Papel |
|---|---|---|
| Vic | vic@upaquepassa.com.br | EDITOR_CHEFE |
| Kai | kai@upaquepassa.com.br | REPORTER |
| Vera | vera@upaquepassa.com.br | CURADOR_NOTAS |
| Theo | theo@upaquepassa.com.br | REDATOR_REVIEWS |
| Dara | dara@upaquepassa.com.br | QA_DADOS |

Senha padrão (todos): `UpaQuePassa@2026`

**Isso é senha de desenvolvimento local, não vai para produção assim.** Antes de qualquer deploy público: trocar a senha de cada conta (ainda não existe UI para isso — via `npx prisma studio` ou um script dá pra fazer manualmente por enquanto), e não commitar `.env`.

## Próximo passo

Quando o volume de conteúdo justificar, considerar migrar `GAMES`/`NEWS`/`REVIEWS`/`LISTINGS` de `data.ts` para o mesmo banco Prisma, com endpoints de escrita que a Equipe de Conteúdo (Kai/Vera/Theo/Dara) usa para publicar direto, em vez de editar `data.ts` manualmente via Edit.
