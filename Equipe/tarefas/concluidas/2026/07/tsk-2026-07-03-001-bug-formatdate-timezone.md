---
id: tsk-2026-07-03-001
titulo: "Bug: formatDate() exibe data um dia a menos (off-by-one de timezone)"
atribuido_a: nao-atribuido
tipo: engenharia
status: concluida
criado: 2026-07-03T09:30:00Z
atualizado: 2026-07-05T00:00:00Z
fontes: []
tags: [bug, data, timezone, formatDate]
---

# Bug: formatDate() exibe data um dia a menos (off-by-one de timezone)

## O que é isto

`formatDate()` em `src/lib/data.ts:833-835` fazia `new Date(dateStr).toLocaleDateString("pt-BR")`. Quando `dateStr` é uma string ISO sem horário (`"2026-07-02"`), o `Date` do JS interpreta como UTC-meia-noite; `toLocaleDateString` depois formata no fuso do runtime. Em `America/Sao_Paulo` (UTC-3), isso sempre exibia **um dia a menos** do que o valor real salvo.

## Correção aplicada

```ts
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}
```

Verificado isoladamente: `formatDate("2026-07-02")` → `"02/07/2026"`. Aplicado como parte da leva de autenticação de usuários + acabamentos do site (2026-07-05).

## Atualizações

- 2026-07-03 09:30 (Claude/Vic) — encontrado durante verificação em runtime (/verify) do pipeline diário de conteúdo; aberto como tarefa de engenharia.
- 2026-07-05 (Claude/Vic) — corrigido, verificado isoladamente e via build. Concluída.
