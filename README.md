# Plataforma de Revenda de Veículos – Backend API

![CI](https://github.com/Thiago5g/task4_getaway_fiap/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-80%2B-green?style=flat)
![Sonar Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=REPLACE_ME_PROJECT_KEY&metric=alert_status)
![Sonar Maintainability](https://sonarcloud.io/api/project_badges/measure?project=REPLACE_ME_PROJECT_KEY&metric=sqale_rating)
![Sonar Security](https://sonarcloud.io/api/project_badges/measure?project=REPLACE_ME_PROJECT_KEY&metric=security_rating)

> Substitua `REPLACE_ME_PROJECT_KEY` após configurar o projeto no SonarCloud.

Esta é a API para uma plataforma de revenda de veículos construída com NestJS e TypeORM, como parte do desafio Sub Tech Challenge do curso SOAT – PósTech (fase 3).

---

## 📋 Descrição do Projeto

O sistema permite:
- Cadastro, edição e listagem de veículos (disponíveis e vendidos), ordenados por preço.
- Cadastro e atualização de clientes.
- Registro de vendas (status do veículo atualizado localmente; dados consolidados em microserviço externo de vendas).
- Autenticação de usuários (via módulo `auth`), com login, validação e verificação de permissões.

A autenticação está implementada internamente com JWT, mas pode ser migrada para serviço externo conforme requisito.

---

## 🧱 Arquitetura e Módulos

- **auth**: autenticação/login de usuários via JWT.
- **usuarios**: validação da existência de usuários e associação a autenticação.
- **clientes**: cadastro e atualização de dados de clientes (quantidade de carros comprados, dados pessoais etc.).
- **veiculos**: CRUD de veículos e endpoints de listagem (disponíveis e vendidos).
- **vendas**: resolve cliente por CPF e veículo por placa, atualiza status local e envia (clienteId, veiculoId, preco) para microserviço externo de vendas (configurável via `SALES_MS_URL`). Não há mais tabela local de vendas.

Cada módulo está isolado com controladores, serviços e DTOs, utilizando TypeORM para persistência em banco de dados relacional.

---

## ⚙️ Requisitos para rodar localmente

1. Clone este repositório.
2. Instale dependências com `npm install`.
3. Rode a aplicação com `npm run start:dev`.

---

## 🔌 Endpoints de Vendas (Integração com Microserviço)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/vendas` | Realiza uma venda. Body: `{ cpf, placa, preco }` |
| GET | `/vendas` | Lista vendas retornadas pelo microserviço enriquecidas com dados locais de cliente e veículo |
| GET | `/vendas/placa/:placa` | Retorna a venda (microserviço) de um veículo identificado pela placa, enriquecida com cliente e veículo |

Observações:
- Persistência da venda ocorre somente no microserviço externo.
- Esta API apenas atualiza o status do veículo para `VENDIDO` localmente.
- Variável de ambiente: `SALES_MS_URL` define a base do microserviço (default `http://localhost:3001`).

---

## 🧪 Testes e Cobertura

Executar testes:

```
npm run test:cov
```

Cobertura mínima exigida: 80% (branches, functions, lines, statements). Ajuste em `package.json` se necessário.