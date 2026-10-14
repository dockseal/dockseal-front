# Especificação Técnica e Backlog - Projeto Dockseal

Este documento define a arquitetura técnica, padrões de desenvolvimento e o backlog de tarefas para a implementação da plataforma **Dockseal - Plataforma Inteligente de Conformidade Portuária**.

---

## 1. Arquitetura e Tecnologias
*   **Frontend**: React.js (Componentização, responsividade, integração via APIs REST).
*   **Backend**: Python com Django (REST Framework para APIs).
*   **Processamento Assíncrono**: Redis (Mensageria/Filas) + Celery/Workers.
*   **Banco de Dados**: PostgreSQL (Relacional).
*   **IA e OCR**: Integração com API da Mistral (Visão Computacional e LLM).
*   **Infraestrutura**: Docker (Conteinerização), AWS S3 ou MinIO (Armazenamento de arquivos/evidências).

---

## 2. Padrões Globais da API

### 2.1. HTTP Status Codes Utilizados
*   `200 OK`: Sucesso em requisições `GET`, `PUT`, `PATCH`.
*   `201 Created`: Sucesso na criação de recursos (`POST`).
*   `204 No Content`: Sucesso sem retorno de corpo (ex: `DELETE`).
*   `400 Bad Request`: Erro de validação de dados enviados pelo cliente.
*   `401 Unauthorized`: Falha de autenticação (Token ausente ou inválido).
*   `403 Forbidden`: Usuário autenticado, mas sem permissão (RBAC) para a ação.
*   `404 Not Found`: Recurso ou endpoint não encontrado.
*   `422 Unprocessable Entity`: Erro de regra de negócio.
*   `500 Internal Server Error`: Erro inesperado no servidor.

### 2.2. Formatação e Validação de Dados Globais
*   **Datas**: Padrão ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`). Frontend deve formatar para o timezone local (BRT/BRST) apenas na exibição.
*   **Senha**: Mínimo de 8 caracteres, contendo letras maiúsculas, minúsculas, números e caracteres especiais. Armazenamento no banco via hash (`bcrypt` padrão do Django).
*   **E-mail**: Regex padrão de validação de e-mail corporativo. Único por usuário no banco de dados.
*   **CPF/CNPJ** (Se aplicável para empresas e motoristas): Trafega sem máscara (`12345678909`), Frontend aplica máscara na view (`123.456.789-09`). Backend valida o dígito verificador.
*   **Identificador de Contêiner**: Padrão ISO 6346 (4 letras + 7 números). Ex: `MSCU7742123`.

---

## 3. Backlog de Desenvolvimento (Epics, Stories e Tasks)

### EPIC 1: Autenticação e Controle de Acesso (IAM)
**Objetivo**: Garantir que apenas operadores e gestores autorizados acessem a plataforma.

#### Story 1.1: Como usuário, quero fazer login com e-mail e senha para acessar meu painel.
*   **Fluxo de Navegação (Front)**: `/login` -> (Sucesso) -> Redireciona para `/dashboard` (Gestor) ou `/embarques` (Operador). -> (Falha) -> Exibe Toast de erro.
*   **Tarefas (Tasks)**:
    *   **[FRONT]** Criar tela de Login baseada no Wireframe (Imagem 7).
    *   **[FRONT]** Implementar validação de formulário (e-mail válido, senha não vazia).
    *   **[FRONT]** Implementar armazenamento do JWT Token no `localStorage` ou `httpOnly cookie`.
    *   **[BACK]** Criar endpoint `POST /api/v1/auth/login`.
    *   **[BACK]** Configurar JWT (geração de Access Token e Refresh Token).
    *   **[INFRA]** Configurar variáveis de ambiente para `JWT_SECRET` e tempo de expiração (ex: 1h para access, 7d para refresh).

**Especificação do Endpoint: `POST /api/v1/auth/login`**
*   **Request**:
    ```json
    { "email": "operador@dockseal.com", "password": "Password@123" }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "access_token": "eyJhbG...",
      "refresh_token": "def456...",
      "user": { "id": 1, "name": "João", "role": "OPERADOR" }
    }
    ```
*   **Response Erro (401 Unauthorized)**:
    ```json
    { "error": "CREDENTIALS_INVALID", "message": "E-mail ou senha incorretos." }
    ```

---

### EPIC 2: Gestão de Embarques e Contêineres
**Objetivo**: Permitir o registro e acompanhamento de lotes de transporte (Shipments).

#### Story 2.1: Como Operador, quero registrar um novo embarque para iniciar a operação logística.
*   **Fluxo de Navegação (Front)**: `/embarques` -> Clicar em "Novo Embarque" -> Preencher Formulário -> Salvar -> Redirecionar para `/embarques/{id}`.
*   **Tarefas (Tasks)**:
    *   **[FRONT]** Criar view de registro de embarque (Imagem 9).
    *   **[FRONT]** Implementar inputs para ID Embarque (automático ou manual), Origem, Transportadora, ETA (Data esperada de chegada).
    *   **[BACK]** Criar endpoint `POST /api/v1/shipments/`.
    *   **[BACK]** Validar se a data `ETA` é igual ou maior que a data atual (não permitir registro no passado).
    *   **[BACK]** Criar trigger/função para registrar ação na tabela `PROCESS_EVENT` (Trilha de auditoria).

**Especificação do Endpoint: `POST /api/v1/shipments/`**
*   **Request**:
    ```json
    {
      "shipment_id_custom": "SHP-2023-9921",
      "origin": "Porto de Santos",
      "destination": "Long Beach Terminal A",
      "transport_company": "MSC",
      "expected_arrival": "2026-10-12T14:00:00Z"
    }
    ```
*   **Response (201 Created)**: Retorna o objeto criado com UUID gerado no banco.

#### Story 2.2: Como Operador, quero adicionar contêineres ao meu embarque.
*   **Tarefas (Tasks)**:
    *   **[FRONT]** Adicionar aba/modal "Unidades Logísticas" no detalhe do embarque.
    *   **[FRONT]** Máscara/Validação de ISO 6346 no input.
    *   **[BACK]** Criar endpoint `POST /api/v1/shipments/{id}/containers/`.
    *   **[BACK]** Regra: Não permitir vincular um contêiner que já esteja "Em Trânsito" em outro embarque aberto. Erro HTTP 422.

---

### EPIC 3: Gestão de Documentos e Evidências
**Objetivo**: Envio e armazenamento seguro de Bill of Lading, Notas Fiscais e imagens de contêineres.

#### Story 3.1: Como Operador, quero fazer o upload de documentos e fotos associados ao embarque.
*   **Fluxo de Navegação (Front)**: Detalhe do Embarque `/embarques/{id}` -> Aba "Documentação/Evidências" -> Drag & Drop -> Barra de Progresso -> Atualizar lista.
*   **Tarefas (Tasks)**:
    *   **[FRONT]** Componente de Drag & Drop para upload de arquivos.
    *   **[FRONT]** Validação no client-side: Apenas `PDF`, `JPEG`, `PNG`. Max 10MB por arquivo.
    *   **[BACK]** Criar endpoint `POST /api/v1/shipments/{id}/documents/`.
    *   **[BACK]** Integrar com storage S3/MinIO para salvar o arquivo físico e pegar a URL.
    *   **[BACK]** Salvar metadados na tabela `DOCUMENT` ou `EVIDENCE`.
    *   **[BACK]** Após salvar, disparar evento na fila (Redis) para iniciar o OCR (`JobQueueService.enqueue`).
    *   **[INFRA]** Provisionar bucket S3 (ou MinIO local). Configurar permissões IAM para o backend acessar.

**Especificação do Endpoint: `POST /api/v1/shipments/{id}/documents/`**
*   **Headers**: `Content-Type: multipart/form-data`
*   **Payload**: Arquivo binário + campo `type` (ex: "BILL_OF_LADING", "INVOICE", "CONTAINER_PHOTO").
*   **Response (202 Accepted)** (Pois o processamento OCR ocorrerá em background):
    ```json
    {
      "message": "Upload concluído. Processamento em andamento.",
      "document_id": "uuid-1234",
      "job_id": "job-5678"
    }
    ```

---

### EPIC 4: Processamento OCR e Inteligência Artificial
**Objetivo**: Extrair dados de imagens/PDFs assincronamente e cruzar informações (validar conformidade).

#### Story 4.1: Como Sistema, quero ler o texto das evidências (OCR) em background.
*   **Tarefas (Tasks)**:
    *   **[BACK/WORKER]** Criar Worker Celery (`ocr_worker`) para escutar a fila `ocr_tasks`.
    *   **[BACK/WORKER]** Integrar com a API de OCR da Mistral (ou biblioteca escolhida). Enviar arquivo e receber JSON estruturado.
    *   **[BACK]** Gravar texto e `confidence_score` na tabela `EXTRACTION`.
    *   **[BACK]** Enfileirar próximo Job para a fila `ai_validation_tasks`.
    *   **[INFRA]** Subir container do Redis. Subir container do Celery Worker.

#### Story 4.2: Como Sistema, quero validar os dados extraídos contra as regras de negócio para detectar anomalias.
*   **Tarefas (Tasks)**:
    *   **[BACK/WORKER]** Criar Worker Celery (`ai_worker`).
    *   **[BACK/WORKER]** Lógica de Cruzamento:
        1. Buscar dados do Embarque (Destino, ETA).
        2. Buscar dados da Nota Fiscal Extraída (Itens, Volumes, Peso).
        3. Buscar dados do Manifesto / Bill of Lading.
        4. Comparar (ex: `Volume Manifesto == Volume Nota Fiscal`).
    *   **[BACK]** Se houver divergência (ex: volume divergente, lacre violado lido na foto), criar registro na tabela `ALERT` (Criticidade: ALTA/MEDIA/BAIXA).
    *   **[BACK]** Atualizar status do Documento/Embarque para "INCONSISTENTE" ou "CONFORME".

---

### EPIC 5: Dashboards, Alertas e Histórico (Visão Gestor)
**Objetivo**: Fornecer visualização gerencial e auditoria da operação.

#### Story 5.1: Como Gestor, quero visualizar o Dashboard com a volumetria e métricas do terminal.
*   **Fluxo de Navegação (Front)**: `/dashboard` (Tela principal ao logar como Gestor - Imagem 8).
*   **Tarefas (Tasks)**:
    *   **[FRONT]** Implementar cards de KPIs (Embarques no pátio, Tempo médio em trânsito, Eficiência %).
    *   **[FRONT]** Implementar gráfico de "Tendências de Volume" (usar lib como Recharts ou Chart.js).
    *   **[BACK]** Criar endpoint `GET /api/v1/dashboard/metrics`.
    *   **[BACK]** O endpoint deve realizar agregações no banco (`COUNT`, `AVG`) e cachear no Redis por 5 minutos para evitar sobrecarga no banco de dados.

#### Story 5.2: Como Gestor, quero visualizar e tratar os Alertas de divergência.
*   **Fluxo de Navegação (Front)**: `/alertas` -> Tabela de Alertas -> Clicar no Alerta -> Exibir Detalhes (Imagem 11).
*   **Tarefas (Tasks)**:
    *   **[FRONT]** Criar view de Central de Alertas com filtros (Status, Prioridade).
    *   **[FRONT]** Criar painel lateral (Drawer) com o "Resumo do Sistema" (explicando a divergência identificada pela IA) e opções "Iniciar Análise Manual" ou "Marcar como Falso Positivo".
    *   **[BACK]** Criar endpoints `GET /api/v1/alerts/` (Lista) e `PATCH /api/v1/alerts/{id}/` (Atualizar status: OPEN -> RESOLVED ou DISMISSED).

**Especificação do Endpoint: `PATCH /api/v1/alerts/{id}/`**
*   **Request**:
    ```json
    { "status": "RESOLVED", "resolution_note": "Ajuste validado com a transportadora." }
    ```
*   **Response (200 OK)**:
    ```json
    { "id": "uuid", "status": "RESOLVED", "updated_at": "..." }
    ```

#### Story 5.3: Como Auditor/Gestor, quero ver o histórico da operação de um embarque (Trilha de Auditoria).
*   **Tarefas (Tasks)**:
    *   **[FRONT]** Na view de detalhe do embarque, criar aba "Histórico Operacional" com uma Timeline.
    *   **[BACK]** Criar endpoint `GET /api/v1/shipments/{id}/events/` que retorna os dados da tabela `PROCESS_EVENT` ordenados por data decrescente.

---

## 4. Plano de Execução (Sprints Sugeridas)

*   **Sprint 1**: Setup Inicial (Docker, CI/CD, DB), Autenticação (Login), Estrutura base de UI, Modelagem do Banco.
*   **Sprint 2**: CRUD de Embarques e Contêineres. Integração com S3/MinIO para Upload de Arquivos.
*   **Sprint 3**: Configuração Redis + Celery. Integração API Mistral para OCR. Setup dos Workers.
*   **Sprint 4**: Motor de validação cruzada (IA). Geração de Alertas no Banco de Dados.
*   **Sprint 5**: Dashboards do Gestor, Painel de Alertas, Trilha de Auditoria e Testes Finais.

---

## 5. Revisão de Segurança (Checklist)
- [x] Senhas armazenadas com hash seguro (Bcrypt/Argon2).
- [x] APIs protegidas por JWT (Authorization: Bearer). Validação do campo `role` para áreas de Gestor.
- [x] CORS configurado corretamente (aceitando apenas origem do domínio do Frontend).
- [x] Validação rigorosa de tipos de arquivos no upload para evitar *malicious payloads*.
- [x] Logs de auditoria (tabela `PROCESS_EVENT`) para qualquer alteração de estado nos embarques.