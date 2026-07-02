# Prompt para o NotebookLM — Levantamento de Fontes

Cole no NotebookLM para validar/expandir [[DI-001-fontes-confiaveis]]. Depois de rodar, atualize DI-001-fontes-confiaveis.md com o resultado.

```
Você é um pesquisador especializado em curadoria de fontes para um portal de
notícias e reviews de jogos de PS5 (público brasileiro). Preciso de uma lista
definitiva de fontes para automatizar diariamente:

1. Notícias de lançamentos, atualizações, patches e eventos de jogos de PS5
2. Notas/reviews agregadas de crítica (tipo Metacritic/OpenCritic) e nota de usuários
3. Capas/artes oficiais de jogos que eu possa usar sem violar direitos autorais
   ou cair em hotlink protection (preciso de URLs estáveis, testáveis via HTTP)

Para cada fonte, me diga:
- Nome e URL
- Tipo (RSS, API oficial, scraping permitido pelos Termos de Uso, agregador)
- Se tem API pública/gratuita e limites de uso (rate limit, autenticação)
- Idioma (preciso de fontes BRASILEIRAS e internacionais)
- Confiabilidade editorial (fonte oficial vs imprensa vs agregador de usuários)
- Restrições legais relevantes (ToS de scraping, direitos de imagem, atribuição obrigatória)

Categorias a cobrir:
1. Notícias gerais de PS5/games (ex: PlayStation Blog oficial, IGN Brasil, Voxel,
   TecMundo Games, Adrenaline, GameVicio, Meio Bit, Eurogamer, GamesRadar, Push Square)
2. Datas de lançamento e calendário de jogos (ex: RAWG API, IGDB API, Steam API,
   PlayStation Store)
3. Notas agregadas de crítica (Metacritic, OpenCritic) — via API oficial ou só
   leitura manual/scraping permitido?
4. Capas/artes de jogos com URLs estáveis, sem hotlink protection (ex: Steam CDN,
   Wikipedia/Wikimedia Commons, press kits oficiais dos publishers)
5. Hardware/acessórios PS5 (anúncios oficiais da Sony)

Devolva em tabela markdown, ordenada por confiabilidade, com uma recomendação
final de quais 5 a 8 fontes eu devo integrar primeiro num pipeline automatizado
que roda todo dia.
```
