# SOP-001 — Adicionar um Jogo ao Catálogo

- **Dono padrão:** Dara (merge), com insumo de Kai (achado) e Vera (notas)
- **Acionado por:** "adiciona [jogo] ao catálogo" ou detecção de lançamento relevante por Kai

## Passos

1. **Kai** confirma que o jogo é PS5 (ou compatível) e coleta: título, desenvolvedora, publisher, data de lançamento, gêneros, sinopse, plataformas — de pelo menos 2 fontes.
2. **Vera** coleta as notas (ver [[../../Vera - Curadora de Notas/AGENTS]]) e normaliza escalas.
3. **Dara** resolve a capa: primeiro tenta Steam CDN (confirma appid via API), senão Wikipedia/Wikimedia. Roda `curl` e confirma `200` antes de aceitar a URL. Nunca aceita `image.api.playstation.com` sem teste direto.
4. **Dara** monta o objeto `Game` completo (ver `src/lib/types.ts` para todos os campos obrigatórios) e adiciona ao array `GAMES` em `src/lib/data.ts` via Edit.
5. **Dara** roda `npm run build` — precisa passar sem erro.
6. **Vic** revisa o resultado final no navegador (`/jogos/<slug>`) antes de considerar concluído.

## Erros comuns

- Aceitar uma URL sem testar porque "o padrão da URL parece certo" — foi exatamente isso que causou o bug de 2026-07-01.
- Usar Steam appid sem confirmar que é o jogo certo (aconteceu nesta sessão: appid errado devolveu a capa de "Split Fiction" no lugar de "Alan Wake 2").
- Misturar escala Metacritic (0-100) com escala interna (0-10) sem normalizar.
