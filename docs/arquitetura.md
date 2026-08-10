# Arquitetura do Back-End

## 1. Visão Geral

A aplicação foi estruturada como uma API REST desenvolvida com Node.js, TypeScript, Express, Prisma ORM e MySQL.

O projeto segue uma organização em camadas com separação de responsabilidades entre entrada HTTP, regras de negócio, persistência e controle de acesso.

A arquitetura adotada busca manter o código organizado, facilitar a manutenção, reduzir o acoplamento entre módulos e permitir evolução gradual da aplicação.

---

## 2. Tecnologias Utilizadas

### Node.js
Utilizado como ambiente de execução do Back-End.

### TypeScript
Utilizado para tipagem estática, organização do código e redução de erros durante o desenvolvimento.

### Express
Utilizado para criação da API REST, definição de rotas e gerenciamento das requisições HTTP.

### Prisma ORM
Utilizado como camada de acesso ao banco de dados, definição dos modelos e versionamento da estrutura através de migrations.

### MySQL
Utilizado como banco de dados relacional da aplicação.

### JSON Web Token
Utilizado para autenticação dos usuários.

### bcrypt
Utilizado para geração e verificação do hash das senhas.

### Git e GitHub
Utilizados para versionamento e armazenamento remoto do código-fonte.

---

## 3. Organização em Camadas

O projeto está dividido nas seguintes camadas:

### 3.1 Routes

Responsáveis pela definição dos endpoints da API.

Exemplos:

- `auth.routes.ts`
- `unidade.routes.ts`
- `produto.routes.ts`

As rotas também são responsáveis por definir quais middlewares devem ser executados antes da chamada do controller.

Exemplo:

`POST /unidades`

Fluxo:

Router  
→ Middleware de autenticação  
→ Middleware de autorização  
→ Controller

---

### 3.2 Controllers

Os controllers são responsáveis por receber as requisições HTTP, validar os dados básicos recebidos e retornar as respostas HTTP.

Exemplos:

- `auth.controller.ts`
- `unidade.controller.ts`

Os controllers não devem concentrar regras complexas de negócio.

Eles atuam como intermediários entre a camada HTTP e a camada de serviços.

---

### 3.3 Services

A camada de services concentra as regras de negócio da aplicação.

Exemplos:

- validação de usuário existente;
- criação de usuário;
- consulta de unidade;
- criação de produtos;
- validação de estoque;
- criação de pedidos;
- processamento do pagamento mock.

Exemplos de arquivos:

- `usuario.service.ts`
- `unidade.service.ts`
- `produto.service.ts`
- `estoque.service.ts`
- `pedido.service.ts`

---

### 3.4 Persistência

A persistência é realizada através do Prisma ORM.

O Prisma é responsável por:

- comunicação com o MySQL;
- definição dos modelos;
- consultas;
- inserções;
- atualizações;
- exclusões;
- relacionamentos;
- migrations.

O arquivo principal de modelagem é:

`prisma/schema.prisma`

---

### 3.5 Middlewares

Os middlewares são responsáveis por funções transversais da aplicação.

Exemplos:

- autenticação JWT;
- autorização por perfil;
- tratamento futuro de logs;
- validações reutilizáveis.

Middlewares atuais:

- `auth.middleware.ts`
- `role.middleware.ts`

---

## 4. Estrutura do Projeto

A organização principal do projeto é:

```text
restaurante-api/
│
├── docs/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── @types/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   └── server.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
5. Fluxo de uma Requisição

Exemplo de criação de unidade:

Cliente HTTP
→ POST /unidades
→ authMiddleware
→ permitirPerfis("ADMIN")
→ unidade.controller.ts
→ unidade.service.ts
→ Prisma ORM
→ MySQL
→ resposta HTTP

Esse fluxo demonstra a separação entre autenticação, autorização, tratamento HTTP, regra de negócio e persistência.

6. Fluxo Crítico Planejado

O fluxo principal da aplicação será baseado na criação de pedidos.

Fluxo:

Usuário autenticado
→ criação do pedido
→ validação da unidade
→ validação dos produtos
→ validação do estoque
→ cálculo do total
→ registro do canal do pedido
→ criação do pedido
→ pagamento mock
→ atualização de status
→ atualização de estoque
→ registro de auditoria

Esse fluxo foi escolhido por integrar as principais regras de negócio do sistema.

7. Segurança

A aplicação utiliza autenticação baseada em JWT.

Após o login, o usuário recebe um token que deve ser enviado nos endpoints protegidos.

Também existe controle de acesso baseado em perfis.

Perfis:

ADMIN
GERENTE
ATENDENTE
CLIENTE

Exemplo:

Um usuário do perfil CLIENTE pode estar autenticado, mas não possui autorização para cadastrar uma nova unidade.

Nesse caso, a API retorna:

403 Forbidden

As senhas dos usuários são armazenadas utilizando hash e nunca devem ser retornadas nas respostas da API.

8. Banco de Dados

O banco de dados é relacional e utiliza MySQL.

O Prisma ORM é utilizado para garantir coerência entre:

modelos;
relacionamentos;
migrations;
regras da aplicação.

As alterações do banco são versionadas através de migrations e enviadas ao repositório Git.

9. Tratamento de Erros

A API utiliza códigos HTTP coerentes com cada situação.

Exemplos:

200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error

O projeto adota um formato de erro baseado em:

{
  "error": "CODIGO_DO_ERRO",
  "message": "Descrição legível do erro"
}

O formato poderá ser expandido posteriormente com:

detalhes;
timestamp;
path;
requestId.
10. Decisões Arquiteturais
Separação entre Controller e Service

A lógica de negócio é mantida nos services para evitar controllers excessivamente grandes e difíceis de manter.

Prisma como camada de persistência

O Prisma foi escolhido por oferecer tipagem, migrations e integração direta com TypeScript.

JWT

O JWT foi escolhido por permitir autenticação stateless e integração simples com APIs REST.

Controle por Roles

A autorização por perfis foi adotada porque diferentes tipos de usuários possuem responsabilidades diferentes na aplicação.

Variáveis de ambiente

Credenciais, segredos JWT e dados de conexão com o banco são armazenados em variáveis de ambiente e não são enviados para o repositório público.

11. Evolução Planejada

A arquitetura permite adicionar novos módulos sem alterar drasticamente os módulos existentes.

Próximos módulos previstos:

Produtos;
Estoque;
Pedidos;
Pagamentos;
Fidelização;
Auditoria;
Swagger;
Testes.

### Auditoria de Estoque

As entradas e saídas de estoque geram automaticamente registros de movimentação contendo usuário responsável, unidade, produto, tipo de operação, quantidade e data/hora.

O usuário responsável é obtido a partir do JWT autenticado, evitando que o cliente da API informe manualmente o identificador do responsável pela ação.