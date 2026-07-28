import fs from 'fs';
import path from 'path';

// Configurações de Caminhos
const PROJECT_ROOT = path.resolve(__dirname, '..');
const VAULT_ROOT = path.resolve(PROJECT_ROOT, '..', 'upa-que-passa-vault');

console.log(`🚀 Iniciando Gerador de Wiki Definitivo (V2)...`);
console.log(`📁 Origem: ${PROJECT_ROOT}`);
console.log(`📂 Destino (Vault): ${VAULT_ROOT}`);

// -------------------------------------------------------------
// Gavetas Semânticas (Pastas do Obsidian)
// -------------------------------------------------------------
const FOLDERS = {
  DASHBOARD: '00 - Dashboard',
  DATABASE: '10 - Modelo de Dados (Database)',
  BACKEND: '20 - APIs e Servidor (Backend)',
  FRONTEND: '30 - Rotas e Navegação (Frontend)',
  UI: '40 - Componentes de Interface (UI)',
  BUSINESS: '50 - Logica e Regras de Negocio'
};

// Limpa e recria diretórios para evitar lixo residual
function initVault() {
  if (fs.existsSync(VAULT_ROOT)) {
    console.log(`🧹 Limpando conteúdo residual do Vault...`);
    fs.rmSync(VAULT_ROOT, { recursive: true, force: true });
  }
  fs.mkdirSync(VAULT_ROOT, { recursive: true });
  Object.values(FOLDERS).forEach(folder => {
    fs.mkdirSync(path.join(VAULT_ROOT, folder), { recursive: true });
  });
}

// Helper para salvar nota
function saveNote(folder: string, fileName: string, content: string) {
  const targetPath = path.join(VAULT_ROOT, folder, fileName.endsWith('.md') ? fileName : `${fileName}.md`);
  fs.writeFileSync(targetPath, content.trim() + '\n', 'utf-8');
}

// Detecta o provider de banco de dados dinamicamente dentro do bloco "datasource"
let providerName = 'postgresql';
const schemaPath = path.join(PROJECT_ROOT, 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  const datasourceBlock = schemaContent.match(/datasource\s+\w+\s+\{[\s\S]*?\}/);
  if (datasourceBlock) {
    const providerMatch = datasourceBlock[0].match(/provider\s*=\s*"([^"]+)"/);
    if (providerMatch) {
      providerName = providerMatch[1];
    }
  }
}

// ==========================================
// 1. GERAÇÃO DO DASHBOARD (00 - Dashboard)
// ==========================================
function generateDashboard() {
  const content = `---
title: Visão Geral do Sistema - Upa que passa
tags:
  - dashboard
  - documentacao
  - overview
---

# 🎮 Upa que passa - Portal & Ecossistema de Jogos

Bem-vindo ao repositório de conhecimento do projeto **Upa que passa**. Este Vault foi gerado automaticamente a partir do código-fonte para servir como memória técnica de longo prazo para desenvolvedores e IAs.

> [!tip] Grafo do Obsidian
> Abra a visualização em grafo (**Graph View**) no painel lateral do Obsidian para ver as conexões entre o Banco de Dados, Endpoints, Telas e Componentes!

## 🧭 Gavetas Semânticas

## 🧭 Gavetas Semânticas

### 🗄️ [[10 - Banco de Dados|10 - Banco de Dados e Modelagem]]
Mapeamento das entidades do banco de dados ${providerName.toUpperCase()} gerenciadas pelo Prisma ORM.
* Entidades principais: **[[SiteUser]]** (usuários finais), **[[AdminUser]]** (membros da equipe) e **[[Favorite]]** (favoritos de jogos).

### ⚙️ [[20 - Rotas de API|20 - APIs e Servidor (Backend)]]
Endpoints REST e controladores backend localizados em \`src/app/api\`.

### 🎨 [[30 - Páginas e Navegação|30 - Rotas e Navegação (Frontend)]]
Mapeamento de todas as telas públicas e administrativas disponíveis no App Router do Next.js.

### 🧱 [[40 - Componentes de UI|40 - Componentes de Interface (UI)]]
Componentes de interface comuns construídos com React e estilizados com Tailwind CSS.

### 📚 [[50 - Regras de Negócio|50 - Lógica e Regras de Negócio]]
Utilitários de autenticação, criptografia, hooks customizados e middlewares.

### 🛡️ Segurança e Performance (Auditoria Recente)
Mecanismos de robustez e proteção implantados no monólito:
* **Proteção contra Spam (Views)**: Controle de visualização de artigos dedupado por hash de IP (\`ArticleViewLog\`) com janela de 30 min.
* **Segurança de Uploads**: Validação de arquivos via *magic bytes* (assinatura real de cabeçalho) bloqueando SVGs maliciosos (XSS).
* **SSRF Hardening**: Resolução DNS ativa com bloqueio a redes locais e privadas para links externos.
* **Lockout de Login**: Proteção contra força bruta (bloqueio por 15 min após 5 tentativas falhas).
* **Performance ISR**: Rotas de alta leitura (\`/noticias\`, \`/reviews\`, \`/ranking\`) servidas via Server Components com revalidação dinâmica de 60s.

---
*Gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}.*
`;

  saveNote(FOLDERS.DASHBOARD, '00 - Visão Geral', content);
}

// ==========================================
// 2. PARSE DO SCHEMA PRISMA (10 - Database)
// ==========================================
interface PrismaModel {
  name: string;
  fields: Array<{ name: string; type: string; modifiers: string }>;
}

interface PrismaEnum {
  name: string;
  values: string[];
}

function generateDatabaseDocs() {
  const schemaPath = path.join(PROJECT_ROOT, 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.warn(`⚠️ Prisma schema não localizado.`);
    return;
  }

  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  const lines = schemaContent.split('\n');

  const models: PrismaModel[] = [];
  const enums: PrismaEnum[] = [];

  let currentModel: PrismaModel | null = null;
  let currentEnum: PrismaEnum | null = null;

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('model ')) {
      const name = line.split(' ')[1];
      currentModel = { name, fields: [] };
    } else if (line.startsWith('enum ')) {
      const name = line.split(' ')[1];
      currentEnum = { name, values: [] };
    } else if (line === '}') {
      if (currentModel) {
        models.push(currentModel);
        currentModel = null;
      }
      if (currentEnum) {
        enums.push(currentEnum);
        currentEnum = null;
      }
    } else if (currentModel && line.length > 0 && !line.startsWith('//')) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const name = parts[0];
        const type = parts[1];
        const modifiers = parts.slice(2).join(' ');
        currentModel.fields.push({ name, type, modifiers });
      }
    } else if (currentEnum && line.length > 0 && !line.startsWith('//')) {
      currentEnum.values.push(line);
    }
  }

  // Nota principal do banco
  const dbOverview = `---
title: Banco de Dados e Modelagem
tags:
  - database
  - prisma
  - ${providerName}
---

# 🗄️ Modelo de Dados (Database)

Mapeamento do banco de dados relacional baseado em **${providerName.toUpperCase()}** e gerenciado pelo Prisma ORM.

## 📊 Entidades Encontradas

### Tabelas (Models)
${models.map(m => `* **[[${m.name}]]**: Tabela para armazenamento de registros de \`${m.name}\`.`).join('\n')}

### Enumeradores (Enums)
${enums.map(e => `* **[[${e.name}]]**: Conjunto de valores permitidos para campos de tipo \`${e.name}\`.`).join('\n')}

---
[[00 - Visão Geral|⬅️ Voltar à Visão Geral]]
`;
  saveNote(FOLDERS.DATABASE, '10 - Banco de Dados', dbOverview);

  // Modelos Individuais
  models.forEach(model => {
    const fieldsTable = model.fields
      .map(f => `| **${f.name}** | \`${f.type}\` | ${f.modifiers ? `\`${f.modifiers}\`` : '-'} |`)
      .join('\n');

    const content = `---
title: Tabela ${model.name}
tags:
  - database
  - model
  - ${model.name.toLowerCase()}
---

# Entidade: \`${model.name}\`

Estrutura de dados definida no arquivo de modelo do Prisma.

## 📋 Definição de Campos

| Campo | Tipo de Dado | Atributos e Modificadores |
| :--- | :--- | :--- |
${fieldsTable}

---
[[10 - Banco de Dados|⬅️ Voltar ao Banco de Dados]]
`;
    saveNote(FOLDERS.DATABASE, model.name, content);
  });

  // Enums Individuais
  enums.forEach(en => {
    const content = `---
title: Enum ${en.name}
tags:
  - database
  - enum
---

# Enumeração: \`${en.name}\`

Conjunto estático de dados que limita as opções para determinados campos do banco:

${en.values.map(val => `* \`${val}\``).join('\n')}

---
[[10 - Banco de Dados|⬅️ Voltar ao Banco de Dados]]
`;
    saveNote(FOLDERS.DATABASE, en.name, content);
  });

  console.log(`✅ Banco de Dados documentado na gaveta semântica: ${FOLDERS.DATABASE}`);
}

// ==========================================
// 3. PARSE DAS APIs (20 - Backend)
// ==========================================
function generateBackendDocs() {
  const apiDir = path.join(PROJECT_ROOT, 'src', 'app', 'api');
  if (!fs.existsSync(apiDir)) {
    console.warn(`⚠️ Diretório de APIs não existe.`);
    return;
  }

  const routes: string[] = [];

  function scanApiRoutes(currentPath: string, routePrefix = '/api') {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanApiRoutes(fullPath, `${routePrefix}/${file}`);
      } else if (file === 'route.ts' || file === 'route.js') {
        routes.push(routePrefix);
      }
    }
  }

  scanApiRoutes(apiDir);

  const overviewContent = `---
title: Rotas de API
tags:
  - backend
  - api
  - nextjs
---

# ⚙️ APIs e Servidor (Backend)

O backend do sistema é integrado por meio de rotas HTTP servidas pelo Next.js localizadas em \`src/app/api\`.

## 📌 Lista de Endpoints Disponíveis

${routes.map(r => `* \`${r}\` ➔ **[[API ${r.replace(/\//g, ' ').trim()}]]**`).join('\n')}

---
[[00 - Visão Geral|⬅️ Voltar à Visão Geral]]
`;
  saveNote(FOLDERS.BACKEND, '20 - Rotas de API', overviewContent);

  routes.forEach(route => {
    const safeName = `API ${route.replace(/\//g, ' ').trim()}`;
    const apiFile = path.join(apiDir, route.replace('/api/', '').replace('/api', ''), 'route.ts');
    
    const verbsFound: string[] = [];
    if (fs.existsSync(apiFile)) {
      const fileContent = fs.readFileSync(apiFile, 'utf-8');
      if (fileContent.includes('export async function GET')) verbsFound.push('GET');
      if (fileContent.includes('export async function POST')) verbsFound.push('POST');
      if (fileContent.includes('export async function PUT')) verbsFound.push('PUT');
      if (fileContent.includes('export async function DELETE')) verbsFound.push('DELETE');
      if (fileContent.includes('export async function PATCH')) verbsFound.push('PATCH');
    }

    const content = `---
title: Endpoint ${route}
tags:
  - backend
  - api
---

# Endpoint: \`${route}\`

Definido sob a rota \`src/app${route}/route.ts\`.

## 🟢 Métodos Suportados
${verbsFound.length > 0 ? verbsFound.map(v => `* **${v}**`).join('\n') : '*Nenhum método exportado explicitamente.*'}

## 🛡️ Integração de Dados
Este endpoint interage com o banco de dados. Veja os modelos relacionados em: [[10 - Banco de Dados]].

---
[[20 - Rotas de API|⬅️ Voltar à lista de APIs]]
`;
    saveNote(FOLDERS.BACKEND, safeName, content);
  });

  console.log(`✅ APIs documentadas na gaveta semântica: ${FOLDERS.BACKEND}`);
}

// ==========================================
// 4. PARSE DO FRONTEND (30 - Frontend)
// ==========================================
function generateFrontendDocs() {
  const appDir = path.join(PROJECT_ROOT, 'src', 'app');
  if (!fs.existsSync(appDir)) {
    console.warn(`⚠️ Pasta src/app não encontrada.`);
    return;
  }

  const pages: string[] = [];

  function scanPages(currentPath: string, routePrefix = '') {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (file === 'api' || file.startsWith('_') || file.startsWith('(')) {
          continue;
        }
        scanPages(fullPath, `${routePrefix}/${file}`);
      } else if (file === 'page.tsx' || file === 'page.js') {
        pages.push(routePrefix === '' ? '/' : routePrefix);
      }
    }
  }

  scanPages(appDir);

  const overviewContent = `---
title: Rotas e Navegação
tags:
  - frontend
  - pages
  - nextjs
---

# 🎨 Rotas e Navegação (Frontend)

Mapeamento visual das telas desenvolvidas no Next.js (App Router).

## 🖥️ Telas do Portal

${pages.map(p => `* **\`${p}\`** ➔ [[Tela ${p === '/' ? 'Home' : p.replace(/\//g, ' ').trim()}]]`).join('\n')}

---
[[00 - Visão Geral|⬅️ Voltar à Visão Geral]]
`;
  saveNote(FOLDERS.FRONTEND, '30 - Rotas e Navegação', overviewContent);

  pages.forEach(page => {
    const isHome = page === '/';
    const safeName = `Tela ${isHome ? 'Home' : page.replace(/\//g, ' ').trim()}`;
    const pagePath = isHome ? 'page.tsx' : path.join(page.slice(1), 'page.tsx');

    const content = `---
title: Página ${page}
tags:
  - frontend
  - page
---

# Rota Visual: \`${page}\`

Arquivo de origem: \`src/app/${pagePath}\`.

> [!note] Fluxos Associados
> Para ver os dados consumidos por esta tela ou endpoints associados, verifique [[20 - Rotas de API]].
> Os componentes reutilizados estão listados em [[40 - Componentes de UI]].

---
[[30 - Rotas e Navegação|⬅️ Voltar ao índice de Telas]]
`;
    saveNote(FOLDERS.FRONTEND, safeName, content);
  });

  console.log(`✅ Páginas frontend documentadas na gaveta semântica: ${FOLDERS.FRONTEND}`);
}

// ==========================================
// 5. PARSE DE COMPONENTES E LIBS (40/50)
// ==========================================
function generateComponentsAndLibs() {
  // Componentes de UI
  const compDir = path.join(PROJECT_ROOT, 'src', 'components');
  let componentsList: string[] = [];

  function scanComponents(currentPath: string, relativePath = '') {
    let list: string[] = [];
    if (!fs.existsSync(currentPath)) return list;
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        list = list.concat(scanComponents(fullPath, relativePath ? `${relativePath}/${file}` : file));
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        list.push(relativePath ? `${relativePath}/${file}` : file);
      }
    }
    return list;
  }

  if (fs.existsSync(compDir)) {
    componentsList = scanComponents(compDir);
  }

  const compOverview = `---
title: Componentes de UI
tags:
  - components
  - react
---

# 🧱 Componentes de Interface (UI)

Lista de componentes visuais reutilizáveis em \`src/components/\`.

## 📦 Componentes Cadastrados
${componentsList.map(c => `* **\`${c}\`**: Componente visual.`).join('\n')}

---
[[00 - Visão Geral|⬅️ Voltar à Visão Geral]]
`;
  saveNote(FOLDERS.UI, '40 - Componentes de UI', compOverview);

  // Libs & Helpers
  const libDir = path.join(PROJECT_ROOT, 'src', 'lib');
  const hooksDir = path.join(PROJECT_ROOT, 'src', 'hooks');

  let libFiles: string[] = [];
  if (fs.existsSync(libDir)) {
    libFiles = fs.readdirSync(libDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  }

  let hookFiles: string[] = [];
  if (fs.existsSync(hooksDir)) {
    hookFiles = fs.readdirSync(hooksDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  }

  const libOverview = `---
title: Regras de Negócio e Helpers
tags:
  - logic
  - helper
---

# 📚 Lógica e Regras de Negócio

Mapeamento de funções auxiliares, utilitários de autenticação e hooks customizados.

## ⚙️ Arquivos Utilitários (lib)
${libFiles.map(l => `* [[${l.replace(/\.(ts|js)$/, '')}]]`).join('\n')}

## ⚓ Hooks Customizados (hooks)
${hookFiles.map(h => `* **\`${h}\`**: React hook para manipulação de estado do cliente.`).join('\n')}

---
[[00 - Visão Geral|⬅️ Voltar à Visão Geral]]
`;
  saveNote(FOLDERS.BUSINESS, '50 - Regras de Negócio', libOverview);

  // Notas Individuais das Libs
  libFiles.forEach(lib => {
    const libName = lib.replace(/\.(ts|js)$/, '');
    const libPath = path.join(libDir, lib);
    const exportsList: string[] = [];

    if (fs.existsSync(libPath)) {
      const fileContent = fs.readFileSync(libPath, 'utf-8');
      const matches = fileContent.matchAll(/export\s+(const|function|async\s+function|class|type|interface)\s+([a-zA-Z0-9_]+)/g);
      for (const match of matches) {
        exportsList.push(match[2]);
      }
    }

    const content = `---
title: Módulo ${libName}
tags:
  - lib
  - helper
---

# Utilitário: \`${libName}\`

Arquivo de origem: \`src/lib/${lib}\`.

## 📦 Elementos Exportados
${exportsList.length > 0 ? exportsList.map(exp => `* \`${exp}\``).join('\n') : '*Módulo exporta funções ou dados padrão.*'}

---
[[50 - Regras de Negócio|⬅️ Voltar à lista de Helpers]]
`;
    saveNote(FOLDERS.BUSINESS, libName, content);
  });

  console.log(`✅ Componentes e Lógica documentados nas gavetas correspondentes.`);
}

// -------------------------------------------------------------
// EXECUÇÃO DO FLUXO
// -------------------------------------------------------------
initVault();
generateDashboard();
generateDatabaseDocs();
generateBackendDocs();
generateFrontendDocs();
generateComponentsAndLibs();

console.log(`\n✨ SUCESSO! A Wiki foi gerada e distribuída semanticamente.`);
console.log(`📂 Caminho do Vault: ${VAULT_ROOT}`);
