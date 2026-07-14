# DI-003 - Estado do Backend e dos Admins

## Estado atual (atualizado em Julho de 2026)

**Decisão de Arquitetura implementada:** Substituição de rascunhos físicos em arquivos `.md` locais por um fluxo de banco de dados transacional utilizando Prisma e PostgreSQL.

**O que existe agora:**
- `prisma/schema.prisma` — model `AdminUser` (SQLite) e tabela `SugestaoAgente` (PostgreSQL/Prisma Client) contendo os registros estruturados criados pelos agentes autônomos.
- Enums no banco para categorizar os tipos de sugestões (`NOTICIA`, `REVIEW`, `LANCAMENTO`), os agentes criadores (`KAI_REPORTER`, `NINA_CORRESPONDENTE`, etc.) e status (`PENDING`, `APPROVED`, `REJECTED`).
- API robusta em `/api/admin/entregas` mapeando a leitura das sugestões diretamente do banco de dados baseado no `StatusSugestao`.
- Endpoints de curadoria `/aprovar` e `/rejeitar` atualizando de forma transacional o status das sugestões e associando ao `AdminUser` logado que efetuou a revisão.
- Expansão da linha editorial: O portal e os agentes autônomos agora cobrem nativamente **PC, PS5 e Nintendo Switch**, gerando payloads categorizados com metadados de plataforma.
- Execução manual documentada em `manual-agentes.md` tanto para desenvolvedores usando Claude CLI quanto Antigravity Skills (com arquivos de skill em `.agents/skills/`).

## Credenciais padrão (ambiente local)

| Nome | E-mail | Papel |
|---|---|---|
| Vic | vic@upaquepassa.com.br | EDITOR_CHEFE |
| Kai | kai@upaquepassa.com.br | REPORTER |
| Vera | vera@upaquepassa.com.br | CURADOR_NOTAS |
| Theo | theo@upaquepassa.com.br | REDATOR_REVIEWS |
| Dara | dara@upaquepassa.com.br | QA_DADOS |

Senha padrão (todos): `UpaQuePassa@2026`

---

## Automação e Operacionalização dos Agentes

Os agentes autônomos de conteúdo operam por comandos manuais executados no console local:
- O agente varre a internet em busca de conteúdos relacionados a **PC, PS5 e Switch**.
- O agente envia o payload formatado em JSON para o script do projeto `npx tsx scripts/registrar-sugestao.ts --json '<JSON>'`.
- A API do Admin gerencia a aprovação, garantindo que nada seja publicado no portal público sem a devida autorização e sem a checagem manual do time editorial.

