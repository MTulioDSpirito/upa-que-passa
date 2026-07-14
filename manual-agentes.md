# Guia de Operacionalização e Comandos dos Agentes

Este guia instrui como executar manualmente os agentes autônomos de conteúdo gamer no portal **Upa que Passa** utilizando tanto o **Claude Desktop/CLI** quanto o **Antigravity IDE**.

---

## 1. Visão Geral da Operação

Os agentes realizam varreduras automáticas em busca de conteúdo na internet e salvam as sugestões diretamente na tabela `SugestaoAgente` no banco de dados PostgreSQL. Nenhuma sugestão é publicada diretamente no portal público até que seja moderada e aprovada por um administrador em `/admin/sugestoes`.

### Agentes Disponíveis e Funções:
*   **`kai-reporter`:** Notícias rápidas, patches, novidades de hardware do ecossistema PlayStation.
*   **`nina-correspondente-noticias`:** Matérias amplas de negócios, movimentações e tendências do mercado gamer.
*   **`milo-batedor-lancamentos`:** Mapeamento de calendário de lançamentos recentes e "Em Breve".
*   **`theo-redator-reviews`:** Produz a análise completa (Prós, Contras, Notas por categoria) de um jogo selecionado.
*   **`vera-curadora-notas`:** Agrega notas de portais internacionais (Metacritic, IGN, Eurogamer) calculando a média global de um jogo.

---

## 2. Como Rodar no Claude (Membro do Time A)

Os agentes do Claude estão configurados nos arquivos Markdown locais em `.claude/agents/`.

### Comandos de Execução:
Para acionar um agente com uma instrução de varredura manual, utilize os comandos do Claude CLI no terminal da raiz do projeto:

```bash
# Executar a varredura diária de notícias rápidas (Kai)
npx @google/claudia run kai-reporter --prompt "Faça a varredura das últimas 24h em busca de novidades de PS5"

# Executar a cobertura de mercado e indústria (Nina)
npx @google/claudia run nina-correspondente-noticias --prompt "Procure por relatórios financeiros ou vendas relevantes da Sony/PlayStation"

# Rastrear lançamentos no calendário (Milo)
npx @google/claudia run milo-batedor-lancamentos --prompt "Varra o calendário atrás de lançamentos de destaque de PS5 para esta semana"

# Redigir a análise de um jogo específico (Theo)
npx @google/claudia run theo-redator-reviews --prompt "Escreva a review completa do jogo Ghost of Yotei"

# Agregar notas externas de avaliação de um jogo (Vera)
npx @google/claudia run vera-curadora-notas --prompt "Busque as notas externas do Metacritic e IGN para o jogo Death Stranding 2"
```

---

## 3. Como Rodar no Antigravity (Membro do Time B)

O Antigravity carrega as instruções automaticamente como **Skills** do diretório local `.agents/skills/`.

### Como Invocar no Antigravity Chat:
Dentro do chat do Antigravity IDE, mencione a skill específica correspondente para realizar a tarefa:

```markdown
# Chamar o Kai para Notícias
"Kai, execute a skill 'kai-reporter' e varra a internet atrás de notícias de PS5 das últimas 24h"

# Chamar a Nina para Negócios/Indústria
"Nina, execute a skill 'nina-correspondente-noticias' em busca de tendências e fusões de estúdios gamer recentes"

# Chamar o Milo para Calendário de Jogos
"Milo, execute a skill 'milo-batedor-lancamentos' e encontre os principais lançamentos e jogos em breve no PlayStation Blog"

# Chamar o Theo para Redigir Review
"Theo, execute a skill 'theo-redator-reviews' para gerar a análise do jogo 'Marvel's Wolverine'"

# Chamar a Vera para Agregação de Notas
"Vera, execute a skill 'vera-curadora-notas' para trazer a média de notas externas do jogo 'GTA VI'"
```

---

## 4. O Fluxo sob o Capô

Tanto as Skills do Antigravity quanto os Agentes do Claude geram um payload JSON e utilizam o script unificado do projeto para persistência:

```bash
npx tsx scripts/registrar-sugestao.ts --json '<PAYLOAD_JSON>'
```

### O que acontece a seguir:
1. O script valida e insere o payload diretamente no banco PostgreSQL com o status `PENDING`.
2. A sugestão aparece imediatamente na interface administrativa do portal em `/admin/sugestoes`.
3. O administrador revisa os textos, prós/contras ou notas na tela.
4. Ao clicar em **Aprovar**, a API altera o status do rascunho e cria a entidade final na tabela pública do portal.
