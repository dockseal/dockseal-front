# Dockseal

![Dockseal](https://github.com/user-attachments/assets/b6fb0396-b56f-45f9-81f1-6e1b833613bc)

## Sobre

Front-end do Dockseal, painel de conferência documental de embarques portuários. O operador registra embarques, associa contêineres, envia documentos e pede a validação com IA. O gestor trata os alertas gerados pelas divergências, acompanha os indicadores e consulta a auditoria do processo.

Stack: React, Vite, TypeScript, TanStack Router e Query, React Hook Form com Zod, Zustand, Axios, Tailwind CSS v4 e shadcn/ui. Testes com Vitest, Playwright, Testing Library e MSW.

A API é o projeto FastAPI `dockseal-api`, no repositório irmão. O contrato HTTP é o OpenAPI publicado por ela.

## Pré-requisitos

- Node 20 ou mais recente.
- pnpm 11 (a versão exata está em `packageManager` no `package.json`).
- Docker com Docker Compose.
- O repositório `dockseal-api` clonado ao lado deste (`../dockseal-api`).

## Subindo a API

```bash
cd ../dockseal-api
docker compose up -d
```

A API sobe em `http://localhost:8000`. Confira com `curl http://localhost:8000/health` (deve responder `{"status":"ok"}`). A documentação interativa fica em `http://localhost:8000/docs` e o contrato em `http://localhost:8000/openapi.json`.

Para entrar no painel é preciso ter usuários no banco local. Os comandos abaixo usam o exemplo do README da API e servem só para o ambiente local. Não use essas senhas em outro lugar:

```bash
cd ../dockseal-api
docker compose exec dockseal-api uv run python -m app.cli create-user "Operador Teste" operador@dockseal.com 'Password@123' OPERADOR
docker compose exec dockseal-api uv run python -m app.cli create-user "Gestor Teste" gestor@dockseal.com 'Password@123' GESTOR
docker compose exec dockseal-api uv run python -m app.cli create-user "Admin Teste" admin@dockseal.com 'Password@123' ADMIN
```

Se o usuário já existir, o comando falha com erro de chave duplicada e pode ser ignorado.

## Configurando o front-end

```bash
pnpm install
cp .env.example .env.local
```

| Variável | Padrão | Uso |
| --- | --- | --- |
| `MODE` | `development` | Modo do Vite. Os mocks só ligam em `test`. |
| `VITE_API_URL` | `http://localhost:8000` | Origem da API. Obrigatória. |
| `VITE_ENABLE_API_DELAY` | `false` | Atrasa as respostas para visualizar os estados de carregamento. |
| `VITE_ENABLE_DEVTOOLS` | `false` | Mostra as devtools do TanStack no `pnpm dev`. |

## Rodando

```bash
pnpm dev
```

O painel abre em `http://localhost:5173` e conversa com a API real em `http://localhost:8000`. A porta 3000 aparece no CORS da API só como origem liberada; o front-end não roda nela.

Rota inicial depois do login: operador vai para `/embarques`; gestor e administrador vão para `/dashboard`.

## Testes

```bash
pnpm exec vitest run   # testes unitários (test/unit)
pnpm test:e2e          # testes ponta a ponta (test/e2e), com MSW
pnpm lint              # Biome
pnpm build             # tsc -b e build de produção
```

- `pnpm test` não roda o Vitest, porque o script no `package.json` chama `vistest`. Use `pnpm exec vitest run`.
- O Playwright sobe sozinho o `pnpm dev:test` em `http://localhost:50789` com `MODE=test`, ou reaproveita um servidor que já esteja nessa porta.
- Na primeira vez, instale o navegador com `pnpm exec playwright install chromium`.
- Os testes não usam a API real nem credenciais reais.

## Mocks

- Os mocks são handlers do MSW em `src/api/mocks`, um por rota da API, com as mesmas URLs e formatos do OpenAPI.
- Eles só ligam quando `MODE=test` (`pnpm dev:test`, `pnpm build:test`, `pnpm preview:test` e a suíte E2E). O `pnpm dev` comum nunca usa mocks.
- O banco simulado vive na memória da aba e volta ao estado inicial a cada recarga.
- Cenários de erro são ligados pela chave `@dockseal:mock-scenario` do `localStorage`, com uma lista JSON, por exemplo `["upload-413"]`. A lista completa está em `src/api/mocks/scenario.ts`.

## Configurações, mocks e credenciais para teste manual

**Com mocks (sem API, sem IA).** Rode `pnpm dev:test` e abra `http://localhost:50789`. As credenciais são fictícias e só existem no MSW:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Operador | `operador@dockseal.test` | `Senha@123` |
| Gestor | `gestor@dockseal.test` | `Senha@123` |
| Administrador | `admin@dockseal.test` | `Senha@123` |

Todas as rotas da API são simuladas, incluindo a análise com IA, o OCR das fotos e a validação do embarque. Para forçar um erro, rode no console do navegador `localStorage.setItem('@dockseal:mock-scenario', '["validate-502"]')` e recarregue. Para voltar ao normal, `localStorage.removeItem('@dockseal:mock-scenario')`.

**Com a API real.** Suba a API, crie os usuários locais da seção "Subindo a API" e rode `pnpm dev`. Variáveis envolvidas:

- Front-end: `VITE_API_URL` (`.env.local`).
- API: `OPENAI_API_KEY` e `JWT_SECRET` no `.env` do `dockseal-api`. Sem chave ou sem crédito na OpenAI, a validação do embarque, a análise rápida e o OCR de fotos respondem com erro (502 ou 422); o restante funciona.
- Serviços: containers `dockseal-api` (porta 8000) e `dockseal-db` (PostgreSQL, porta 5432).

Roteiro manual sugerido: login dos três perfis; login com senha errada; criar embarque com contêiner; adicionar um segundo contêiner; enviar um `.txt`; enviar uma foto como "Foto do contêiner"; validar o embarque; usar a análise rápida com dois `.txt`; resolver um alerta como gestor; abrir a auditoria e a aba "Histórico" do embarque; adulterar o token no `localStorage` (`@dockseal:auth`) e recarregar para ver a renovação silenciosa; parar a API (`docker compose stop dockseal-api`) e recarregar para ver a mensagem de erro, depois `docker compose start dockseal-api`.

## Problemas comuns

- **Erro de CORS no console.** A API só libera `http://localhost:5173` e `http://localhost:3000`. Rode o `pnpm dev` na porta padrão.
- **Tela branca com `Invalid environment variables`.** Falta `VITE_API_URL` no `.env.local`. Copie o `.env.example`.
- **Porta 50789 ocupada nos testes E2E.** Encerre o processo que está nela ou deixe o Playwright reaproveitar um `pnpm dev:test` já aberto.
- **`Executable doesn't exist` no Playwright.** Rode `pnpm exec playwright install chromium`.
- **"Não foi possível analisar agora" ao validar ou analisar.** A API recebeu erro da OpenAI (chave ausente ou sem crédito). Confira `OPENAI_API_KEY` e os logs com `docker compose logs dockseal-api`.
- **Volta ao login depois de um tempo parado.** O token de acesso dura 60 minutos e o painel tenta renová-lo uma vez; se a renovação falhar (o refresh dura 7 dias), é preciso entrar de novo.
- **"Não foi possível conectar à API".** A API está parada ou em outra porta. Confira `docker compose ps` e `VITE_API_URL`.
