# gpt4free-proxy

> **Note:** The English version of this README is [further below](#english).

Proxy leve de LLM inspirado no [n8n-g4f-proxy](https://github.com/korotovsky/n8n-g4f-proxy) (korotovsky). Expõe backends no estilo Gpt4Free como um endpoint **compatível com a API OpenAI**, para integrar inferência gratuita em fluxos n8n, agentes locais ou qualquer cliente que fale o formato da API OpenAI.

## Índice

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Uso rápido](#uso-rápido)
- [Referência da API](#referência-da-api)
- [Integração com n8n](#integração-com-n8n)
- [Limitações e avisos legais](#limitações-e-avisos-legais)
- [Licença](#licença)
- [English (below)](#english)

## Requisitos

- **Node.js** 18 ou superior (recomendado: versão LTS atual)
- Um **upstream** compatível (por exemplo instância do n8n-g4f-proxy ou API Gpt4Free equivalente) acessível na URL definida em `LLM_UPSTREAM`

## Instalação

```bash
git clone <url-do-repositório>
cd gpt4free-proxy
npm install
```

## Configuração

Crie um ficheiro `.env` na raiz do projeto (pode copiar de `.env.example`):

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `LLM_UPSTREAM` | Sim | URL base do backend (sem barra final desnecessária), ex.: `http://127.0.0.1:8080` |
| `LLM_PROXY_PROVIDER` | Não | Nome do provider enviado no corpo das pedidas ao upstream (`provider`). Se vazio, o upstream decide o comportamento padrão. |

Exemplo:

```env
LLM_UPSTREAM=http://127.0.0.1:8080
LLM_PROXY_PROVIDER=
```

## Execução

```bash
# desenvolvimento (reinicia ao guardar)
npm run dev

# produção local
npm start
```

O servidor escuta em **`0.0.0.0:12343`** por defeito ([`src/index.ts`](src/index.ts)).

- **Timeout de pedido:** até **15 minutos** (adequado a respostas longas ou streaming).

## Uso rápido

Base URL local: `http://localhost:12343`

O proxy **reencaminha o header `Authorization`** para o upstream quando o envia — use-o se o seu backend exigir token ou chave.

**Chat completions (não streaming, exemplo mínimo):**

```bash
curl -s http://localhost:12343/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_SE_NECESSARIO" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Olá"}]
  }'
```

**Listar modelos expostos para o provider configurado:**

```bash
curl -s http://localhost:12343/v1/models \
  -H "Authorization: Bearer SEU_TOKEN_SE_NECESSARIO"
```

**Listar providers do upstream:**

```bash
curl -s http://localhost:12343/v1/providers
```

## Referência da API

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `GET` | `/v1/models` | Obtém modelos do upstream (`{LLM_UPSTREAM}/backend-api/v2/models`) e devolve entradas no formato lista OpenAI para o provider definido em `LLM_PROXY_PROVIDER`. Em caso de erro, responde **200** com lista vazia. |
| `GET` | `/v1/providers` | Proxy para `{LLM_UPSTREAM}/v1/providers`. |
| `POST` | `/v1/chat/completions` | Proxy para `{LLM_UPSTREAM}/v1/chat/completions`; injeta `provider` no JSON; preserva `Content-Type` e corpo (incluindo **streaming**). |
| `POST` | `/v1/responses` | Converte o fluxo estilo **Responses API** para chat completions no upstream e devolve um objeto no formato de resposta compatível (ver [`utils/Utils.ts`](utils/Utils.ts)). |

O formato exacto dos modelos depende do que o **seu** upstream devolve; este repositório não fixa nomes de modelos ou provedores.

## Integração com n8n

No nó **OpenAI** (ou equivalente que use a API OpenAI), defina a **URL base** como `http://<host>:12343` (ou o host/porta onde corre o proxy) e use as mesmas credenciais que o upstream espera, se aplicável. Assim os workflows tratam o proxy como um endpoint OpenAI standard.

## Limitações e avisos legais

- Provedores “gratuitos” estão sujeitos a **termos de uso**, quotas, bloqueios e alterações sem aviso.
- Não há garantia de **paridade total** com a API oficial da OpenAI.
- A disponibilidade depende do **upstream**; este proxy apenas reencaminha e adapta pedidos.
- Use por sua conta e risco; não substitui um serviço comercial com SLA.

## Licença

[ISC](package.json) (conforme `package.json` do projeto).

---

## English

A lightweight LLM proxy inspired by [n8n-g4f-proxy](https://github.com/korotovsky/n8n-g4f-proxy) by korotovsky, built to expose Gpt4Free providers as an **OpenAI-compatible API** endpoint — making it easy to integrate free LLM inference into n8n workflows, local agents, or any tool that speaks the OpenAI API format.

### Table of contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running](#running)
- [Quick start](#quick-start)
- [API reference](#api-reference)
- [n8n integration](#n8n-integration)
- [Limitations and legal notice](#limitations-and-legal-notice)
- [License](#license)

### Requirements

- **Node.js** 18 or higher (recommended: current LTS)
- A compatible **upstream** (for example an n8n-g4f-proxy instance or equivalent Gpt4Free API) reachable at the URL set in `LLM_UPSTREAM`

### Installation

```bash
git clone <repository-url>
cd gpt4free-proxy
npm install
```

### Configuration

Create a `.env` file in the project root (you can copy from `.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `LLM_UPSTREAM` | Yes | Base URL of the backend (no trailing slash required), e.g. `http://127.0.0.1:8080` |
| `LLM_PROXY_PROVIDER` | No | Provider name sent in the JSON body to the upstream (`provider`). If empty, upstream default behavior applies. |

Example:

```env
LLM_UPSTREAM=http://127.0.0.1:8080
LLM_PROXY_PROVIDER=
```

### Running

```bash
# development (restarts on save)
npm run dev

# local production
npm start
```

The server listens on **`0.0.0.0:12343`** by default ([`src/index.ts`](src/index.ts)).

- **Request timeout:** up to **15 minutes** (suited to long replies or streaming).

### Quick start

Local base URL: `http://localhost:12343`

The proxy **forwards the `Authorization` header** to the upstream when you send it — use it if your backend expects a token or API key.

**Chat completions (non-streaming, minimal example):**

```bash
curl -s http://localhost:12343/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_IF_NEEDED" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

**List models for the configured provider:**

```bash
curl -s http://localhost:12343/v1/models \
  -H "Authorization: Bearer YOUR_TOKEN_IF_NEEDED"
```

**List upstream providers:**

```bash
curl -s http://localhost:12343/v1/providers
```

### API reference

| Method | Path | Description |
|--------|------|---------------|
| `GET` | `/v1/models` | Fetches models from the upstream (`{LLM_UPSTREAM}/backend-api/v2/models`) and returns OpenAI-style list entries for the provider set in `LLM_PROXY_PROVIDER`. On error, responds with **200** and an empty list. |
| `GET` | `/v1/providers` | Proxy to `{LLM_UPSTREAM}/v1/providers`. |
| `POST` | `/v1/chat/completions` | Proxy to `{LLM_UPSTREAM}/v1/chat/completions`; injects `provider` into the JSON; preserves `Content-Type` and body (including **streaming**). |
| `POST` | `/v1/responses` | Maps **Responses API**-style requests to chat completions on the upstream and returns a compatible response object (see [`utils/Utils.ts`](utils/Utils.ts)). |

Exact model names depend on what **your** upstream returns; this repo does not pin specific models or providers.

### n8n integration

In the **OpenAI** node (or any node that uses the OpenAI API), set the **base URL** to `http://<host>:12343` (or wherever the proxy runs) and use the same credentials the upstream expects, if any. Workflows then treat the proxy as a standard OpenAI endpoint.

### Limitations and legal notice

- “Free” providers are subject to **terms of use**, quotas, blocks, and unannounced changes.
- There is no guarantee of **full parity** with the official OpenAI API.
- Availability depends on the **upstream**; this proxy only forwards and adapts requests.
- Use at your own risk; it is not a substitute for a commercial SLA-backed service.

### License

[ISC](package.json) as defined in the project `package.json`.
