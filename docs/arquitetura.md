# Arquitetura do Back-End

## 1. Visão Geral

A aplicação foi estruturada como uma API REST para gerenciamento da rede de restaurantes **Raízes do Nordeste**, desenvolvida com Node.js, TypeScript, Express, Prisma ORM e MySQL.

A solução utiliza uma organização em camadas, separando as responsabilidades relacionadas a:

- entrada e saída HTTP;
- autenticação e autorização;
- regras de negócio;
- persistência de dados;
- controle de estoque;
- pedidos;
- pagamento mock;
- fidelização;
- auditoria;
- documentação da API.

Essa separação busca reduzir o acoplamento entre os módulos, melhorar a manutenção do código e facilitar a evolução do sistema.

---

## 2. Tecnologias Utilizadas

### 2.1 Node.js

Utilizado como ambiente de execução da aplicação Back-End.

### 2.2 TypeScript

Utilizado para tipagem estática, organização do código e redução de erros durante o desenvolvimento.

### 2.3 Express

Utilizado para criação da API REST, gerenciamento das requisições HTTP e definição das rotas.

### 2.4 Prisma ORM

Utilizado como camada de acesso aos dados, definição dos modelos, relacionamentos e migrations.

### 2.5 MySQL

Utilizado como sistema de gerenciamento de banco de dados relacional.

### 2.6 JSON Web Token - JWT

Utilizado para autenticação de usuários em endpoints protegidos.

### 2.7 bcrypt

Utilizado para geração e validação de hashes de senha.

### 2.8 Swagger / OpenAPI

Utilizado para documentação interativa dos contratos da API.

### 2.9 Insomnia

Utilizado para testes manuais dos endpoints e validação dos cenários positivos e negativos.

### 2.10 Git e GitHub

Utilizados para versionamento do código-fonte e armazenamento remoto do projeto.

---

# 3. Organização em Camadas

A aplicação adota uma estrutura semelhante a uma arquitetura em camadas.

## 3.1 Routes

As rotas representam a camada de entrada HTTP da aplicação.

São responsáveis por:

- definir método HTTP e URL;
- associar a rota ao controller correspondente;
- aplicar middleware de autenticação;
- aplicar middleware de autorização;
- disponibilizar documentação Swagger/OpenAPI.

Exemplos:

```text
auth.routes.ts
unidade.routes.ts
produto.routes.ts
estoque.routes.ts
pedido.routes.ts
fidelidade.routes.ts
auditoria.routes.ts

3.2 Controllers

Os controllers são responsáveis por receber as requisições HTTP e realizar validações relacionadas ao contrato da API.

Entre suas responsabilidades estão:

leitura de parâmetros;
leitura do body;
validações básicas;
chamada dos services;
definição dos status HTTP;
montagem das respostas JSON;
tratamento dos erros esperados.

Exemplos:

auth.controller.ts
unidade.controller.ts
produto.controller.ts
estoque.controller.ts
pedido.controller.ts
pagamento.controller.ts
fidelidade.controller.ts
auditoria.controller.ts

Os controllers evitam concentrar regras complexas de negócio.

3.3 Services

A camada de services concentra as principais regras de negócio da aplicação.

Entre as operações executadas nessa camada estão:

criação e autenticação de usuários;
consulta e criação de unidades;
gerenciamento de produtos;
controle de estoque;
registro de movimentações;
criação de pedidos;
validação do estoque;
cálculo dos valores do pedido;
processamento de pagamento mock;
controle do fluxo de status;
concessão de pontos de fidelidade;
geração de registros de auditoria.

Exemplos:

usuario.service.ts
unidade.service.ts
produto.service.ts
estoque.service.ts
pedido.service.ts
pagamento.service.ts
fidelidade.service.ts
auditoria.service.ts
3.4 Persistência

A persistência é realizada através do Prisma ORM.

O Prisma é responsável por:

comunicação com o MySQL;
consultas;
inserções;
atualizações;
exclusões;
relacionamentos;
integridade estrutural;
gerenciamento de migrations.

A modelagem principal está localizada em:

prisma/schema.prisma

As alterações do banco de dados são versionadas através de:

prisma/migrations/
3.5 Middlewares

Os middlewares são utilizados para funcionalidades transversais da aplicação.

Atualmente são utilizados principalmente para:

autenticação JWT;
autorização baseada em roles.

Arquivos:

auth.middleware.ts
role.middleware.ts

Exemplo:

CLIENTE autenticado
        ↓
GET /auditorias
        ↓
authMiddleware
        ↓
permitirPerfis("ADMIN")
        ↓
403 Forbidden

Nesse caso, o usuário está autenticado, mas não possui autorização para acessar o recurso.

4. Estrutura do Projeto

A estrutura principal do projeto é:

restaurante-api/
│
├── docs/
│   ├── arquitetura.md
│   ├── testes.md
│   └── demais documentos
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── @types/
│   ├── config/
│   │   ├── prisma.ts
│   │   └── swagger.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── unidade.controller.ts
│   │   ├── produto.controller.ts
│   │   ├── estoque.controller.ts
│   │   ├── pedido.controller.ts
│   │   ├── pagamento.controller.ts
│   │   ├── fidelidade.controller.ts
│   │   └── auditoria.controller.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── role.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── unidade.routes.ts
│   │   ├── produto.routes.ts
│   │   ├── estoque.routes.ts
│   │   ├── pedido.routes.ts
│   │   ├── fidelidade.routes.ts
│   │   └── auditoria.routes.ts
│   │
│   ├── services/
│   │   ├── usuario.service.ts
│   │   ├── unidade.service.ts
│   │   ├── produto.service.ts
│   │   ├── estoque.service.ts
│   │   ├── pedido.service.ts
│   │   ├── pagamento.service.ts
│   │   ├── fidelidade.service.ts
│   │   └── auditoria.service.ts
│   │
│   └── server.ts
│
├── .env
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── prisma.config.ts
└── tsconfig.json
5. Fluxo de uma Requisição

Exemplo de entrada de estoque:

Cliente HTTP
        ↓
POST /estoques/entrada
        ↓
authMiddleware
        ↓
permitirPerfis("ADMIN")
        ↓
estoque.controller.ts
        ↓
estoque.service.ts
        ↓
Prisma ORM
        ↓
MySQL
        ↓
movimentação de estoque
        ↓
resposta HTTP

Esse fluxo demonstra a separação entre autenticação, autorização, contrato HTTP, regra de negócio e persistência.

6. Fluxo Crítico Implementado

O principal fluxo de negócio implementado na aplicação é o fluxo de pedidos.

Usuário autenticado
        ↓
Criação do pedido
        ↓
Validação da unidade
        ↓
Validação dos produtos
        ↓
Validação das quantidades
        ↓
Validação do estoque
        ↓
Consulta dos preços no banco
        ↓
Cálculo dos subtotais
        ↓
Cálculo do valor total
        ↓
Registro do canalPedido
        ↓
Pedido PENDENTE
        ↓
Auditoria: PEDIDO_CRIADO
        ↓
Pagamento Mock
       / \
      /   \
APROVADO  RECUSADO
   ↓          ↓
CONFIRMADO  CANCELADO
   ↓
Baixa do estoque
   ↓
Movimentação SAIDA
   ↓
Auditoria de pagamento
   ↓
EM_PREPARO
   ↓
PRONTO
   ↓
FINALIZADO
   ↓
Pontos de fidelidade
   ↓
Auditoria

Esse fluxo integra as principais funcionalidades da API e representa o MVP crítico escolhido para a entrega.

7. Multicanalidade

O canal de origem do pedido faz parte do domínio da aplicação.

O campo:

canalPedido

é obrigatório durante a criação do pedido.

Os canais atualmente implementados são:

APP
BALCAO
DELIVERY

Exemplo:

{
  "unidadeId": 1,
  "canalPedido": "APP",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 1
    }
  ]
}

Também é possível realizar consultas utilizando o canal como filtro:

GET /pedidos?canalPedido=APP

Isso permite rastrear a origem dos pedidos e consolidar informações por canal.

8. Controle de Estoque

O estoque é mantido separadamente por unidade e produto.

A combinação:

unidadeId + produtoId

identifica o saldo de determinado produto em uma unidade.

O sistema implementa:

consulta de estoque;
entrada;
saída;
histórico de movimentações;
validação de estoque insuficiente;
registro do usuário responsável.

Uma saída não pode resultar em saldo negativo.

Quando a quantidade disponível é insuficiente, a API retorna:

409 Conflict

com erro:

{
  "error": "ESTOQUE_INSUFICIENTE",
  "message": "Não há estoque suficiente para realizar esta saída."
}
9. Pagamento Mock

A integração de pagamento é simulada.

O endpoint:

POST /pedidos/:id/pagamento

permite enviar:

PIX
CARTAO

e simular os resultados:

APROVADO
RECUSADO

O objetivo é representar o comportamento de uma integração externa sem utilizar um provedor financeiro real.

Em caso de pagamento aprovado:

PENDENTE
   ↓
CONFIRMADO

Em caso de pagamento recusado:

PENDENTE
   ↓
CANCELADO

O sistema também impede o processamento de pagamento duplicado para o mesmo pedido.

10. Fluxo de Status do Pedido

Após pagamento aprovado, o pedido segue o fluxo:

CONFIRMADO
     ↓
EM_PREPARO
     ↓
PRONTO
     ↓
FINALIZADO

A API bloqueia transições que não estejam previstas.

Exemplo inválido:

CONFIRMADO → FINALIZADO

Resultado:

409 Conflict

Essa regra evita inconsistências no processo operacional.

11. Fidelização

A aplicação possui um sistema simples de fidelização.

Cada usuário possui um saldo de pontos.

Os pontos são concedidos após a finalização do pedido.

Regra utilizada:

R$ 1,00 gasto = 1 ponto

A parte decimal é desconsiderada no cálculo dos pontos.

Exemplo:

Pedido: R$ 32,90
Pontos concedidos: 32

O usuário autenticado pode consultar seu saldo através de:

GET /fidelidade/saldo

O sistema também mantém controle para evitar o crédito duplicado dos pontos do mesmo pedido.

12. Auditoria

A aplicação registra eventos relacionados a ações sensíveis.

Entre as ações registradas estão:

PEDIDO_CRIADO
PAGAMENTO_APROVADO
PAGAMENTO_RECUSADO
STATUS_PEDIDO_ALTERADO
PONTOS_FIDELIDADE_CREDITADOS

Cada registro pode conter:

usuário responsável;
ação realizada;
entidade afetada;
identificador da entidade;
detalhes adicionais;
data e hora.

A consulta dos registros é realizada por:

GET /auditorias

e é restrita ao perfil:

ADMIN

A auditoria melhora a rastreabilidade das operações realizadas no sistema.

13. Segurança

A aplicação utiliza autenticação baseada em JWT.

Após o login, o usuário recebe um token que deve ser enviado nos endpoints protegidos.

Exemplo:

Authorization: Bearer TOKEN

Os perfis definidos são:

ADMIN
GERENTE
ATENDENTE
CLIENTE

As permissões são aplicadas nas rotas conforme a responsabilidade de cada perfil.

As senhas são armazenadas utilizando hash através do bcrypt.

A senha original não é persistida diretamente no banco.

As credenciais de banco e o segredo JWT são mantidos em variáveis de ambiente.

O arquivo:

.env

não é versionado no repositório.

Um arquivo:

.env.example

é disponibilizado apenas com valores fictícios para facilitar a configuração do ambiente.

14. LGPD e Privacidade

A aplicação aplica cuidados técnicos relacionados à proteção de dados pessoais.

Entre eles:

minimização dos dados utilizados pela aplicação;
armazenamento de senha apenas em formato de hash;
autenticação antes de acessar informações protegidas;
autorização por perfil;
controle de acesso a registros administrativos;
auditoria de ações relevantes;
não exposição de segredos nas respostas;
armazenamento de credenciais em variáveis de ambiente.

Por se tratar de um projeto acadêmico, a solução representa uma aplicação técnica dos princípios básicos de proteção de dados, e não uma certificação formal de conformidade jurídica.

15. Tratamento de Erros

A API utiliza códigos HTTP de acordo com o tipo de resultado.

Principais códigos:

200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error

O padrão de resposta de erro utilizado é:

{
  "error": "CODIGO_DO_ERRO",
  "message": "Descrição legível do erro."
}

Exemplos:

CAMPOS_OBRIGATORIOS
NAO_AUTENTICADO
ACESSO_NEGADO
PRODUTO_INVALIDO
ESTOQUE_INSUFICIENTE
PAGAMENTO_JA_PROCESSADO
TRANSICAO_STATUS_INVALIDA
QUANTIDADE_INVALIDA
16. Documentação da API

A API utiliza Swagger/OpenAPI.

Com o servidor em execução, a documentação pode ser acessada em:

http://localhost:3000/docs/

A documentação contempla os módulos:

Autenticação
Unidades
Produtos
Estoque
Pedidos
Fidelidade
Auditoria

O Swagger também permite inserir o JWT através da opção:

Authorize

permitindo testar endpoints protegidos diretamente pela interface.

17. Testes

Os endpoints foram testados utilizando Insomnia e Swagger.

Foram executados cenários positivos e negativos.

Entre os status HTTP validados estão:

200
201
400
401
403
404
409
422

Entre os cenários testados estão:

login válido;
token inválido;
acesso sem permissão;
criação de pedido;
filtro de pedido por canal;
produto inexistente;
quantidade negativa;
estoque insuficiente;
pagamento aprovado;
pagamento recusado;
pagamento duplicado;
transição inválida de status;
SKU duplicado;
consulta de auditoria;
fidelização.
18. Decisões Arquiteturais
18.1 Separação entre Controller e Service

Os controllers foram mantidos responsáveis principalmente pelo contrato HTTP.

As regras de negócio são concentradas nos services.

Essa separação reduz o acoplamento e facilita futuras alterações.

18.2 Prisma ORM

O Prisma foi escolhido devido à integração com TypeScript, suporte a migrations e facilidade de manipulação de relacionamentos.

18.3 JWT

JWT foi utilizado para permitir autenticação stateless na API.

18.4 Controle de acesso por Roles

A autorização baseada em perfis foi utilizada porque diferentes usuários possuem responsabilidades diferentes.

Exemplo:

CLIENTE

pode realizar pedidos, mas não deve acessar recursos administrativos como auditoria.

18.5 Variáveis de ambiente

Informações sensíveis são armazenadas fora do código-fonte.

Exemplos:

DATABASE_URL
DB_PASSWORD
JWT_SECRET
JWT_EXPIRES_IN
PORT
18.6 Auditoria

As ações sensíveis são registradas para aumentar a rastreabilidade do sistema.

O usuário responsável é obtido através do JWT autenticado, evitando que o cliente informe manualmente o responsável pela operação.

19. Estado Atual da Solução

Os principais módulos previstos para o MVP foram implementados:

autenticação;
autorização;
unidades;
produtos;
estoque;
movimentações;
pedidos;
multicanalidade;
pagamento mock;
controle de status;
fidelização;
auditoria;
documentação Swagger;
testes positivos e negativos.

A solução possui persistência real em MySQL através do Prisma ORM e implementa o fluxo crítico de pedidos de ponta a ponta.