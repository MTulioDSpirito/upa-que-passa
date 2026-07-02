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

## Automação diária (adicionado 2026-07-02)

Para os agentes rodarem sozinhos todo dia, sem depender de uma sessão local aberta, foi criado:

- **Repositório GitHub privado:** `https://github.com/MTulioDSpirito/upa-que-passa` — necessário porque agentes na nuvem (`RemoteTrigger`) rodam isolados, com o próprio checkout git, e não enxergam o disco local. O repo é privado porque este arquivo (DI-003) tem a senha padrão em texto puro.
- **Rotina agendada:** `trig_018q9aogsE5hLed31mjrpvgK`, cron `7 11 * * *` (UTC) = 08:07 America/Sao_Paulo, todo dia. Gerenciável em https://claude.ai/code/routines. Assume os papéis de Kai (notícias) e Vera (notas), escreve rascunhos em `Equipe/Entregas/pendentes/`, faz commit e push. Nunca toca em `src/`, `prisma/` ou qualquer arquivo de código — só em `Equipe/Entregas/pendentes/`.
- **Consequência prática:** o repositório local (`C:\Users\mtden\upa`) fica desatualizado em relação ao GitHub depois que o job roda. É preciso `git pull` para ver os rascunhos novos localmente antes de abrir `/admin/sugestoes` (a página lê o disco local, não o GitHub diretamente).
- **Fila de revisão:** `/admin/sugestoes` (rota protegida, os 5 admins têm acesso) lista `Equipe/Entregas/pendentes/`, com botões Aprovar (→ `aprovados/`) e Rejeitar (→ `rejeitados/`, com motivo). Implementado em `src/lib/entregas.ts` + `src/app/api/admin/entregas/**`.
- **Subagentes locais:** `.claude/agents/{vic-editor-chefe,kai-reporter,vera-curadora-notas,theo-redator-reviews,dara-arquiteta-dados}.md` — para rodar qualquer papel manualmente numa sessão local do Claude Code, sem esperar o agendamento.

## Próximo passo

Quando o volume de conteúdo justificar, considerar migrar `GAMES`/`NEWS`/`REVIEWS`/`LISTINGS` de `data.ts` para o mesmo banco Prisma, com endpoints de escrita que a Equipe de Conteúdo (Kai/Vera/Theo/Dara) usa para publicar direto, em vez de editar `data.ts` manualmente via Edit. Isso também resolveria a divergência local/GitHub: se o "aprovar" na UI já escrevesse direto no banco (em vez de mover um arquivo), o admin não precisaria dar `git pull` antes.
