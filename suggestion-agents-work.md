# Proposta de Arquitetura: Persistência em Banco de Dados para Agentes e Portal Admin

Este documento apresenta a especificação técnica para substituir a leitura física de rascunhos em arquivos `.md` locais por um fluxo transacional e seguro utilizando o banco de dados (via Prisma) e controle de permissões por `AdminRole`.

---

## 1. Visão Geral da Arquitetura

Para garantir a segurança, integridade dos dados e evitar conflitos de código no Git durante execuções locais de múltiplos desenvolvedores, o fluxo de dados dos agentes é dividido em duas camadas isoladas:

1. **Camada de Preparação (Draft):** Onde os agentes inserem os rascunhos de forma autônoma e os administradores realizam curadoria. O front-end público não tem acesso a essa camada.
2. **Camada de Produção (Publicada):** Onde os dados finais aprovados pelo administrador residem. O portal lê exclusivamente desta camada.

```
[Execução Manual do Agente]
            │
            ▼ (Gravação Direta)
┌─────────────────────────────────┐
│     Tabela SugestaoAgente       │ (Apenas visível para Admin/Desenvolvedores)
└─────────────────────────────────┘
            │
            ├──────► [Rejeitar] ──► Status: REJECTED (Com Motivo)
            │
            ▼ [Aprovar] (Por AdminUser autenticado)
┌─────────────────────────────────┐
│  Tabelas de Produção (Portal)   │ (Lida pelo Front-end público)
│  (ex: Noticia, Review, Jogo)    │
└─────────────────────────────────┘
```

---

## 2. Modelagem do Banco de Dados (Prisma Schema)

Propõe-se a adição das tabelas abaixo no seu `prisma/schema.prisma` para separar rascunhos e sugestões do conteúdo de produção:

```prisma
// Enum para identificar qual agente gerou a sugestão
enum AgenteCriador {
  KAI_REPORTER
  NINA_CORRESPONDENTE
  MILO_LANCAMENTOS
  THEO_REVIEWS
  VERA_NOTAS
}

// Tipo de conteúdo proposto
enum TipoSugestao {
  NOTICIA
  REVIEW
  LANCAMENTO
}

// Status de curadoria
enum StatusSugestao {
  PENDING
  APPROVED
  REJECTED
}

// Tabela Isolada de Rascunhos dos Agentes
model SugestaoAgente {
  id             String          @id @default(cuid())
  tipo           TipoSugestao
  criador        AgenteCriador
  titulo         String
  slug           String
  payload        Json            // JSON contendo todo o corpo, imagens, notas, prós/contras, etc.
  fontes         String[]        // URLs de referência cruzadas pelos agentes
  status         StatusSugestao  @default(PENDING)
  motivoRejeicao String?         // Mensagem de feedback caso seja rejeitado
  revisadoPorId  String?         // ID do AdminUser que aprovou ou rejeitou
  revisadoPor    AdminUser?      @relation("RevisorSugestao", fields: [revisadoPorId], references: [id])
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}
```

*Nota: No modelo final de produção, crie o relacionamento da tabela `AdminUser` com a `SugestaoAgente` adicionando `@relation("RevisorSugestao")`.*

---

## 3. Segurança e Controle de Acesso

### Isolamento das Queries Públicas
O portal público executará consultas apenas nas tabelas de produção correspondentes (ex: `Noticia.findMany` ou `Review.findMany`). Dessa forma, mesmo que ocorra algum erro lógico ou de segurança no front-end, rascunhos rejeitados ou não moderados jamais serão expostos na index pública.

### Validação por AdminRole no Painel Administrativo
No backend de aprovação, a sessão do administrador é checada contra a enumeração de roles permitidos (`DEVELOPER` ou `COLABORADOR`):

```typescript
// Localizado em: /api/admin/entregas/aprovar/route.ts
const session = await getSession();

if (!session || (session.role !== "DEVELOPER" && session.role !== "COLABORADOR")) {
  return NextResponse.json(
    { error: "Acesso negado. Apenas administradores autorizados podem aprovar conteúdos." },
    { status: 403 }
  );
}
```

---

## 4. Fluxo de Trabalho dos Agentes Locais

Mesmo que a execução do agente seja iniciada manualmente via terminal na sua máquina local de desenvolvimento, ela seguirá uma boa prática profissional:

1. **Execução Local:** Você dispara o comando do agente no terminal (ex: `npm run agent:kai`).
2. **Coleta e Parse:** O agente varre as fontes configuradas, processa as informações e monta o objeto JSON adequado.
3. **Escrita no Banco:** O agente usa o `PrismaClient` configurado no seu script local para efetuar um insert diretamente na tabela `SugestaoAgente`.
    * *Dica:* A `DATABASE_URL` no seu arquivo local `.env` define se ele está injetando no banco local de desenvolvimento ou no banco de staging/produção.
4. **Moderação no Painel:** O rascunho aparece imediatamente na interface do portal administrativo em `/admin/sugestoes` para curadoria.
5. **Conversão e Publicação:** Ao clicar em **Aprovar**:
    * A API move o registro na tabela de sugestão para o status `APPROVED`.
    * A API desconstrói o `payload` JSON e cria o registro de produção na tabela final (ex: `prisma.noticia.create`).
