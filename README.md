# Proj09-CardapioDigitalVue2 - Ramen Monolith Commerce Suite

Este projeto e uma aplicacao de cardapio digital 2.0 desenvolvida com Vue 3 + Vite, com foco em experiencia visual cinematografica, fluxo completo de compra e operacao administrativa (menu, estoque e vendas).

A proposta central e unir frente de loja + painel de controle em uma unica SPA:

- jornada publica com paginas de marketing e cardapio interativo;
- checkout com confirmacao de pagamento;
- baixa automatica de estoque apos venda;
- dashboard de vendas com metricas e tendencia;
- persistencia local com localStorage para simular operacao real.

Ao longo do desenvolvimento, o projeto evoluiu com melhorias de arquitetura e UX, incluindo:

- menu, footer e alertas globais no `App.vue`;
- area admin protegida por autenticacao;
- controle de estoque com status (In Stock / Low Stock / Out of Stock);
- dashboard com filtros temporais (7D, 30D, 90D);
- hero com video sincronizado por scroll;
- secao de oferta limitada com contador e regras de limite.

## Tecnologias Utilizadas

- Vue 3 + Composition API: `ref`, `computed`, `watch`, `onMounted`, `onBeforeUnmount`, `provide/inject`.
- Vue Router 4: navegacao por rotas publicas e administrativas.
- Vuex 4: estado global de carrinho e autenticacao admin.
- TypeScript: tipagem de estado, modelos de pedido, inventario e componentes.
- Vite 8: dev server e build de producao.
- CSS utilitario + tema custom: identidade visual dark/cinematic e responsividade.
- localStorage: persistencia de carrinho, menu customizado, estoque, login admin e pedidos.
- FFmpeg (pipeline de midia): preparacao/otimizacao do video `.mp4` usado na Home.

## Funcionalidades

### 1. Experiencia Publica

- Home com narrativa visual e video sincronizado ao scroll (`src/views/HomeView.vue`).
- Catalogo interativo com busca por texto, filtro por categoria e modal de item (`src/views/CardapioView.vue`).
- Pagina Menu com CTA de adicao rapida ao carrinho (`src/views/MenuView.vue`).
- Oferta limitada dinamica com contador regressivo e desconto aplicado em tempo real (`src/views/HomeView.vue`).

### 2. Carrinho e Checkout

- Carrinho global acessivel pelo menu fixo (`src/components/UniversalMenu.vue`).
- Validacao de limite por estoque antes de adicionar/atualizar quantidade.
- Checkout com resumo, taxa estimada e total final (`src/views/CheckoutView.vue`).
- Confirmacao de pagamento com modal de confirmacao (`src/components/ConfirmDialog.vue`).
- Ao pagar:
  - registra pedido em `ramen_sales_orders`;
  - consome estoque em `ramen_inventory_records`;
  - limpa carrinho e exibe feedback visual.

### 3. Backoffice Admin

- Login admin com rota protegida (`/admin`, `/admin/stock`, `/admin/sales`).
- CRUD de itens do menu com logs de acao (`src/views/AdminView.vue`).
- Controle de estoque com ajuste rapido (+/-), estoque minimo e status por item (`src/views/InventoryView.vue`).
- Dashboard com:
  - receita total;
  - numero de pedidos;
  - ticket medio;
  - unidades vendidas;
  - tendencia de receita diaria;
  - top itens e pedidos recentes (`src/views/SalesDashboardView.vue`).

### 4. Layout e Design

- Layout global com `UniversalMenu`, `RouterView`, `AppFooter` e `AppToastAlerts` no `App.vue`.
- Sistema visual dark com accent laranja e tipografia forte para branding.
- Transicoes e microinteracoes para reforcar leitura de estado (cards, alerts, modal, dashboard).
- Responsividade para desktop/tablet/mobile em telas publicas e administrativas.

## Uso de FFmpeg no Projeto

O repositorio possui o asset `src/assets/videos/cinematic-bowl-of-ramen.mp4`, usado na Home para a secao de scroll-driven video.

Nao ha script automatizado de FFmpeg no `package.json`, mas o fluxo recomendado para preparar videos e:

```bash
# 1) Re-encode para H.264 + AAC com compatibilidade web
ffmpeg -i input.mov -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k output.mp4

# 2) Gerar versao otimizada para web (mais leve)
ffmpeg -i output.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart -c:a aac -b:a 96k cinematic-bowl-of-ramen.mp4
```

Objetivo no contexto da aplicacao:

- reduzir tamanho de bundle e tempo de carregamento;
- manter qualidade visual coerente com o hero cinematografico;
- garantir playback estavel no navegador.

## Estrutura do Projeto

```text
.
├── public/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── assets/
│   │   ├── images/
│   │   ├── videos/
│   │   └── styles/theme.css
│   ├── components/
│   │   ├── UniversalMenu.vue
│   │   ├── AppFooter.vue
│   │   ├── AppToastAlerts.vue
│   │   └── ConfirmDialog.vue
│   ├── data/
│   │   ├── userMenuItems.ts
│   │   └── menu.ts
│   ├── router/
│   │   └── index.ts
│   ├── store/
│   │   ├── index.ts
│   │   └── modules/
│   │       ├── cart.ts
│   │       └── adminAuth.ts
│   ├── utils/
│   │   ├── inventory.ts
│   │   ├── sales.ts
│   │   └── format.ts
│   └── views/
│       ├── HomeView.vue
│       ├── MenuView.vue
│       ├── CardapioView.vue
│       ├── CheckoutView.vue
│       ├── LoginView.vue
│       ├── AdminView.vue
│       ├── InventoryView.vue
│       └── SalesDashboardView.vue
├── package.json
├── vite.config.ts
└── tsconfig*.json
```

## Rotas da Aplicacao

- `/` -> Home
- `/menu` -> Menu visual
- `/cardapio` -> Catalogo com busca/filtro/modal
- `/checkout` -> Checkout
- `/login` -> Login admin
- `/admin` -> Gestao de itens
- `/admin/stock` -> Gestao de estoque
- `/admin/sales` -> Dashboard de vendas

Guardas de rota:

- rotas `/admin*` exigem autenticacao;
- usuario autenticado nao permanece em `/login`.

## Persistencia (localStorage)

- `ramen_cart_items`: estado do carrinho.
- `ramen_admin_auth`: sessao admin.
- `ramen_user_menu_items`: itens customizados no admin.
- `ramen_inventory_records`: estoque e estoque minimo por item.
- `ramen_sales_orders`: pedidos de venda.
- `ramen_admin_action_logs`: historico de operacoes admin.

## Como Executar Localmente

Pre-requisitos:

- Node.js 20+
- npm

Instalar dependencias:

```bash
npm install
```

Rodar ambiente de desenvolvimento:

```bash
npm run dev
```

Acessar no navegador:

```text
http://localhost:5173
```

Build de producao (com type-check):

```bash
npm run build
```

Preview de build:

```bash
npm run preview
```

## Docker

Nesta versao (`Proj09`) nao ha `Dockerfile` e `docker-compose.yml` no repositorio.

Se quiser, posso te entregar na proxima iteracao:

- `Dockerfile` multi-stage para build Vite + Nginx;
- `docker-compose.yml` com exposicao em `:8080`;
- guia de deploy local e em VPS.

## Conceitos do Modulo Aplicados (componente + linha aproximada)

### Reatividade com `ref`

- `src/views/HomeView.vue` (linhas ~13-28): estado de parallax, video, oferta limitada e timers.
- `src/views/InventoryView.vue` (linhas ~28-39): estado de filtros, paginacao e modal de estoque.
- `src/views/AdminView.vue` (linhas ~33-92): estado de busca, CRUD, modais e logs.

### Propriedades computadas com `computed`

- `src/views/SalesDashboardView.vue` (linhas ~117-170): `filteredOrders`, `totalRevenue`, `averageTicket`, `revenueByDay`, `topItems`.
- `src/views/CheckoutView.vue` (linhas ~20-23): subtotal, taxa estimada e total.
- `src/views/HomeView.vue` (linhas ~84-124): estagios de narrativa, precos promocionais e contador.

### Persistencia e reacao a mudancas com `watch`

- `src/views/AdminView.vue` (linha ~462): reseta pagina ao alterar busca/filtro.
- `src/views/InventoryView.vue` (linhas ~219-225): controle de pagina e reset por filtro/busca.
- `src/views/CardapioView.vue` (linhas ~205-210): reacao a `query.item` para abrir modal automaticamente.

### Ciclo de vida (`onMounted`, `onBeforeUnmount`)

- `src/views/HomeView.vue` (linhas ~304-322): listeners de scroll/resize + limpeza de frame/timer.
- `src/views/SalesDashboardView.vue` (linhas ~172-181): sincronizacao por `focus` e evento `storage`.
- `src/components/ConfirmDialog.vue` (linhas ~24-30): handler global de tecla ESC.

### Comunicacao entre componentes (`props` / `emits` / `provide-inject`)

- `src/App.vue` (linhas ~11-23): `provide('notify', notify)` para alertas globais.
- `src/components/AppToastAlerts.vue` (linhas ~11-14): recebe `alerts` por props.
- `src/components/ConfirmDialog.vue` (linhas ~12-22): emite `confirm` e `cancel`.

### Diretivas e bindings dinamicos (`v-for`, `v-if`, `v-model`, `:class`, `:style`)

- `src/views/CardapioView.vue` (linhas ~259+): grid dinamico, filtros e modal de item.
- `src/views/SalesDashboardView.vue` (linhas ~247+): filtros de periodo e blocos de metricas.
- `src/views/InventoryView.vue` (linhas ~357+): status visual por estoque e acoes por linha.

### Estado global com Vuex

- `src/store/modules/cart.ts` (linhas ~153-198): regras de add/update/sync por estoque + persistencia.
- `src/store/modules/adminAuth.ts` (linhas ~50-59): login/logout e persistencia da sessao.
- `src/router/index.ts` (linhas ~30-43): guarda de navegacao baseada no estado de autenticacao.

## Objetivos do Projeto

Este projeto consolida os principais conceitos de Vue em um caso real de produto digital 2.0:

- composicao de interface por dominio (publico, checkout, admin);
- fluxo completo de venda com impacto em estoque;
- observabilidade basica via dashboard e logs de operacao;
- persistencia local como camada de simulacao de backend;
- design orientado a identidade visual e experiencia de uso.

A evolucao para esta versao 2.0 transformou o cardapio em uma plataforma operacional completa, indo alem da listagem de itens e aproximando o projeto de um cenario de ecommerce/restaurante real.
