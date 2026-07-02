# SOP-002 — Publicar uma Notícia

- **Dono padrão:** Kai (redação), Dara (merge)
- **Acionado por:** Kai identifica um fato relevante durante a varredura diária, ou pedido direto do usuário

## Passos

1. **Kai** escreve o rascunho em `Entregas/AAAA-MM-DD-<slug>.md` seguindo a estrutura do `NewsArticle` (`src/lib/types.ts`): título, slug, excerpt, categoria, tags, e o corpo do texto.
2. **Kai** sinaliza uma URL candidata para a capa (não resolve sozinho).
3. **Dara** resolve a capa definitiva (Wikipedia/Wikimedia para fotos de produto/console, Steam CDN se for sobre um jogo específico) e testa com `curl` — só `200` passa.
4. **Dara** valida o schema completo e adiciona ao array `NEWS` em `src/lib/data.ts`.
5. **Dara** roda `npm run build`.
6. **Vic** revisa em `/noticias/<slug>` antes de considerar concluído.

## Referências

- [[../Diretrizes/DI-001-fontes-confiaveis]]
- [[SOP-003-verificar-imagem]]
