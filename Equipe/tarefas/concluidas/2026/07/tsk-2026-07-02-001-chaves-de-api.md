---
id: tsk-2026-07-02-001
titulo: "Gerar chaves de API gratuitas (RAWG, IGDB, News API, OpenCritic)"
atribuido_a: usuario
tipo: engenharia
status: concluida
criado: 2026-07-02T18:30:00Z
atualizado: 2026-07-02T20:15:00Z
fontes:
  - https://rawg.io/apidocs
  - https://dev.twitch.tv/console
  - https://newsapi.org/register
  - https://rapidapi.com/opencritic-opencritic-default/api/opencritic-api
tags: [api, chaves, infraestrutura]
---

# Gerar chaves de API gratuitas (RAWG, IGDB, News API, OpenCritic)

## O que é isto

A DI-001 v2 promoveu a **RAWG API** a fonte primária de fichas técnicas e nota Metacritic, mas ela retornava 401 sem chave. A chave RAWG (a única obrigatória) foi gerada pelo usuário e validada.

## Resultado

- ✅ **RAWG** — `RAWG_API_KEY` no `.env`, testada em 2026-07-02: busca 200 (Astro Bot correto), `media.rawg.io` servindo imagem 200. Ressalva: endpoint `/screenshots` vem com `results` vazio no tier gratuito — usar `short_screenshots` do payload de busca.
- ⏸️ **IGDB/Twitch, News API, OpenCritic/RapidAPI** — opcionais, não geradas. Se algum agente precisar delas no futuro, abrir tarefa nova.
- ⚠️ A chave é **local** (`.env` gitignorado). A rotina diária na nuvem não a possui — lá o pipeline segue com Steam + feeds RSS.

## Critérios de sucesso

- [x] `RAWG_API_KEY` no `.env` e o curl de teste retornando 200.
- [x] Dara consegue puxar imagens via RAWG e validá-las com curl (capa do Astro Bot: 200).
- [x] DI-001 atualizada: RAWG agora "200 testada com chave".

## Atualizações

- 2026-07-02 18:30 (Claude/Vic) — criado a partir da pesquisa do NotebookLM e dos testes HTTP da sessão.
- 2026-07-02 20:15 (Claude/Vic) — usuário gerou a chave RAWG; validada via curl (200); DI-001 v2 atualizada; chaves opcionais adiadas. Concluída.
