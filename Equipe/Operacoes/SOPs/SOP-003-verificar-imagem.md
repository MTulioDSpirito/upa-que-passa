# SOP-003 — Verificar uma URL de Imagem/Vídeo

- **Dono padrão:** Dara
- **Reutilizável por qualquer agente** antes de sugerir uma URL para Dara aceitar.
- **Acionado por:** qualquer URL nova candidata a entrar em `data.ts` (capa, galeria, foto, avatar).

## Por que isso existe

Em 2026-07-01, o catálogo inteiro do Upa que Passa tinha URLs de imagem inventadas — hashes que pareciam URLs reais da CDN da PlayStation, geradas por um modelo anterior sem verificação, e que devolviam 404. 5 de 6 capas de jogos e as 3 capas de notícias estavam quebradas. O bug só foi pego porque alguém testou manualmente no navegador.

## Passos

1. Rode, **um comando por vez** (loops de shell com `for` tendem a acionar bloqueio de permissão neste ambiente — prefira chamadas individuais, em paralelo se precisar checar várias URLs de uma vez):

```bash
curl -s -o /dev/null -w "%{http_code}\n" --max-time 10 "<url>"
```

2. Só `200` é aceito. Qualquer outro código (404, 403, 000/timeout) é rejeitado.
3. Se a URL for de Steam CDN, confirme primeiro que o appid é do jogo certo:

```bash
curl -s --max-time 10 "https://store.steampowered.com/api/appdetails?appids=<appid>&filters=basic"
```

Confira o campo `"name"` da resposta bate com o jogo esperado antes de aceitar a imagem.

4. Se a URL for Wikipedia/Wikimedia, prefira o padrão `upload.wikimedia.org/wikipedia/en/.../<Arquivo>` (fair-use da infobox) ou `upload.wikimedia.org/wikipedia/commons/...` (domínio público/CC) — nunca a URL de thumbnail (`/thumb/.../250px-...`), sempre a versão de resolução completa.
5. Se nada verificar como `200`, volte ao especialista que sugeriu a URL e peça uma fonte alternativa. Nunca aceite "provavelmente funciona".

## Erros comuns

- Confiar em uma URL só porque o domínio parece oficial (`image.api.playstation.com` já causou o bug — o domínio é real, o hash específico era inventado).
- Rodar `curl` dentro de um loop `for` no Bash — nesta configuração de permissões isso é frequentemente bloqueado; prefira uma chamada por URL.
- Usar a URL de thumbnail do Wikimedia em vez da resolução completa.
