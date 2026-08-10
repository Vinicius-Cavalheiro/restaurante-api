# Plano e Evidências de Testes da API

## 1. Objetivo

Este documento registra os testes funcionais realizados na API do sistema de restaurante.

Os testes são executados utilizando o Insomnia e contemplam cenários positivos e negativos, incluindo autenticação, autorização, validações e regras de negócio.

---

## 2. Ambiente de Testes

- API: Node.js + Express + TypeScript
- Banco de dados: MySQL
- ORM: Prisma
- Cliente HTTP: Insomnia
- Autenticação: JWT
- URL base local: `http://localhost:3000`

---

## 3. Resumo dos Testes

| ID | Cenário | Tipo | Resultado esperado |
|---|---|---|---|
| T01 | Cadastro de usuário válido | Positivo | 201 Created |
| T02 | Login válido | Positivo | 200 OK |
| T03 | Acesso sem token | Negativo | 401 Unauthorized |
| T04 | Acesso com perfil sem permissão | Negativo | 403 Forbidden |
| T05 | Cadastro de unidade por ADMIN | Positivo | 201 Created |
| T06 | Atualização de unidade | Positivo | 200 OK |
| T07 | Cadastro de produto por ADMIN | Positivo | 201 Created |
| T08 | Cadastro de produto com SKU duplicado | Negativo | 409 Conflict |
| T09 | Consulta da lista de produtos | Positivo | 200 OK |
| T10 | Consulta de produto por ID | Positivo | 200 OK |
| T11 | Atualização de produto | Positivo | 200 OK |
| T12 | Consulta de produto inexistente | Negativo | 404 Not Found |

---

# 4. Autenticação e Usuários

## T01 - Cadastro de usuário válido

**Método:** `POST`

**Rota:** `/auth/register`

**Tipo:** Positivo

**Resultado esperado:** `201 Created`

**Descrição:**  
Verificar se um novo usuário pode ser cadastrado corretamente quando os dados obrigatórios são informados.

**Resultado obtido:** `201 Created`

**Status:** APROVADO

---

## T02 - Login válido

**Método:** `POST`

**Rota:** `/auth/login`

**Tipo:** Positivo

**Resultado esperado:** `200 OK`

**Descrição:**  
Verificar se um usuário com credenciais válidas consegue realizar login e receber um token JWT.

**Resultado obtido:** `200 OK`

**Status:** APROVADO

---

## T03 - Acesso a recurso protegido sem token

**Tipo:** Negativo

**Resultado esperado:** `401 Unauthorized`

**Descrição:**  
Verificar se a API impede o acesso a recursos protegidos quando o token JWT não é informado.

**Resposta esperada:**

```json
{
  "error": "TOKEN_NAO_INFORMADO",
  "message": "Token de autorização não informado."
}
Resultado obtido: 401 Unauthorized

Status: APROVADO

T04 - Usuário sem permissão acessando recurso administrativo

Tipo: Negativo

Resultado esperado: 403 Forbidden

Descrição:
Verificar se um usuário autenticado com perfil sem permissão é impedido de acessar um recurso exclusivo de perfis administrativos.

Resposta esperada:

{
  "error": "ACESSO_NEGADO",
  "message": "Você não possui permissão para acessar este recurso."
}

Resultado obtido: 403 Forbidden

Status: APROVADO

5. Unidades
T05 - Cadastro de unidade por ADMIN

Método: POST

Rota: /unidades

Tipo: Positivo

Resultado esperado: 201 Created

Descrição:
Verificar se um usuário ADMIN consegue cadastrar uma nova unidade.

Exemplo de entrada:

{
  "nome": "Restaurante Centro",
  "endereco": "Rua Principal, 100",
  "cidade": "Curitiba"
}

Resultado obtido: 201 Created

Status: APROVADO

T06 - Atualização de unidade

Método: PUT

Rota: /unidades/:id

Tipo: Positivo

Resultado esperado: 200 OK

Descrição:
Verificar se os dados de uma unidade existente podem ser atualizados corretamente.

Resultado obtido: 200 OK

Status: APROVADO

6. Produtos
T07 - Cadastro de produto por ADMIN

Método: POST

Rota: /produtos

Tipo: Positivo

Resultado esperado: 201 Created

Entrada utilizada:

{
  "nome": "X-Burger",
  "descricao": "Hambúrguer, queijo e molho da casa",
  "categoria": "Lanches",
  "sku": "LAN-XBURGER-001",
  "preco": 29.90,
  "custo": 12.50
}

Resultado obtido: 201 Created

Status: APROVADO

T08 - Cadastro de produto com SKU duplicado

Método: POST

Rota: /produtos

Tipo: Negativo

Resultado esperado: 409 Conflict

Descrição:
Verificar se o sistema impede o cadastro de dois produtos utilizando o mesmo SKU.

Status: APROVADO

T09 - Listar produtos

Método: GET

Rota: /produtos

Tipo: Positivo

Resultado esperado: 200 OK

Status: APROVADO

T10 - Buscar produto por ID

Método: GET

Rota: /produtos/1

Tipo: Positivo

Resultado esperado: 200 OK

Status: Aprovado

T11 - Atualizar produto

Método: PUT

Rota: /produtos/1

Tipo: Positivo

Resultado esperado: 200 OK

Status: APROVADO

T12 - Consultar produto inexistente

Método: GET

Rota: /produtos/99999

Tipo: Negativo

Resultado esperado: 404 Not Found

Status: aprovado