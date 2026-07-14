# Integração de Agentes Automatizados e Portal Administrativo

Este documento apresenta uma análise dos agentes autônomos configurados na pasta `.claude/agents` e propõe melhorias de implementação para integrar de forma robusta e transparente a lógica desses agentes ao portal administrativo do **Upa que Passa**.

---

## 1. Mapeamento dos Agentes e Fluxo de Conteúdo

Os agentes automatizados atuam como uma equipe editorial virtual organizada em um pipeline completo:

**Fluxo de Trabalho Visual:**
1. **Entrada de Dados (Fontes Externas & Calendários)**
   * ➔ **Kai** (Repórter de Notícias)
   * ➔ **Nina** (Correspondente Geral)
   * ➔ **Milo** (Batedor de Lançamentos)
2. **Processamento & Curadoria**
   * **Milo** identifica jogos que necessitam de:
     * ➔ **Vera** (Calcula média externa das notas - Metacritic/IGN/etc)
     * ➔ **Theo** (Redige análise completa, prós/contras e notas internas)
3. **Fila de Entrega**
   * Todos os rascunhos são salvos em formato `.md` na pasta `Equipe/Entregas/pendentes/`
4. **Revisão e Validação**
   * O Administrador revisa tudo no **Painel de Sugestões** do portal administrativo.
   * Ao aprovar: **Dara** entra em ação (valida URLs de imagens via curl e mescla em `data.ts` ou DB).
   * O conteúdo fica **Publicado no Portal**.


### Papéis Detalhados:
*   **`kai-reporter`:** Rastreia e redige rascunhos de notícias rápidas e oficiais sobre PS5 (PlayStation Blog, hardware, patches).
*   **`nina-correspondente-noticias`:** Aborda matérias mais amplas da indústria de games, vendas, movimentos corporativos e análises cross-platform.
*   **`milo-batedor-lancamentos`:** Mapeia lançamentos recentes de impacto e jogos com datas confirmadas para a seção "Em Breve".
*   **`vera-curadora-notas`:** Agrega avaliações de sites internacionais (Metacritic, OpenCritic, IGN) para alimentar as notas externas.
*   **`theo-redator-reviews`:** Produz a análise completa dos jogos (gráficos, jogabilidade, trilha sonora, prós e contras).
*   **`vic-editor-chefe`:** Responsável por supervisionar o fluxo de aprovação e rejeição de sugestões.
*   **`dara-arquiteta-dados`:** Realiza a validação de infraestrutura e qualidade de dados (ex: testar URLs de imagens usando `curl` com HTTP 200) antes de mesclar o conteúdo no banco ou arquivo de dados.

---

## 2. Status da Integração no Sistema Atual

A estrutura de dados e rotas para suportar essa lógica já existe no projeto:
*   **Pastas Locais:** Armazenamento em `/Equipe/Entregas/` dividido em `pendentes`, `aprovados` e `rejeitados`.
*   **API Integrada:** Endpoints em `/api/admin/entregas` mapeando a leitura física e movimentação dos arquivos `.md` através de [entregas.ts](file:///c:/Users/thhia/Documents/Desenvolvimento%20Web/Upa%20que%20passa/upa-que-passa/src/lib/entregas.ts).
*   **Interface Administrativa:** O componente [SugestoesClient.tsx](file:///c:/Users/thhia/Documents/Desenvolvimento%20Web/Upa%20que%20passa/upa-que-passa/src/app/admin/sugestoes/SugestoesClient.tsx) apresenta as sugestões com base no tipo de arquivo e permite aprovar ou rejeitar (enviando um motivo de rejeição).

---

## 3. Sugestões de Implementação da Ideia

Para tornar esse fluxo mais eficiente e prático para a equipe de administração humana, propõem-se as seguintes implementações:

### A. Editor de Conteúdo Online (Ajustar antes de aprovar)
*   **Oportunidade:** Hoje, o fluxo exige que o administrador aprove o texto do agente de forma integral ("as is") ou edite manualmente o arquivo `.md` no disco antes de clicar em aprovar.
*   **Proposta:** Adicionar um botão **"Editar Rascunho"** na listagem de pendentes. Ao clicar, abrir um modal com um editor Markdown ou formulário dinâmico contendo o título, descrição, tags e corpo do texto. O salvamento deve persistir as alterações diretamente no arquivo `.md` (ou base de dados) antes de movê-lo para aprovado.

### B. Automação da Dara no Backend de Aprovação
*   **Oportunidade:** Integrar as regras rígidas do agente `dara-arquiteta-dados` diretamente no backend da rota de aprovação do portal.
*   **Proposta:** Quando o administrador clicar em **Aprovar**, a rota `/api/admin/entregas/aprovar` deve:
    1.  Efetuar uma requisição de validação em background para testar a validade da URL da imagem/capa (retornando HTTP 200).
    2.  Fazer o parse do rascunho aprovado e inseri-lo diretamente na base de dados activa do site.

### C. Execução do Pipeline via Painel do Portal
*   **Oportunidade:** Os agentes são executados localmente e de forma agendada por terminal.
*   **Proposta:** Adicionar um botão **"Solicitar Nova Varredura"** ou **"Atualizar Notícias da Web"** no topo da página de sugestões administrativas. Esse botão dispara uma chamada de API que executa o script do pipeline (invocando Kai, Nina e Milo) em background no servidor.

### D. Renderização Customizada por Tipo de Entrega
*   **Oportunidade:** Melhorar a legibilidade dos rascunhos de acordo com a proposta de cada agente.
*   **Proposta:** Customizar os cards da listagem:
    *   **Review (Theo):** Renderizar uma planilha visual de notas por categoria (Gameplay, Gráficos, Diversão) e as colunas separadas de Prós e Contras.
    *   **Lançamentos (Milo):** Renderizar a lista de novos jogos identificados permitindo ao administrador marcar quais realmente deseja importar.
    *   **Notas (Vera):** Mostrar um comparativo das notas de cada portal internacional e a média global calculada.
