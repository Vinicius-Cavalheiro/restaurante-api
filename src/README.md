# 🍽️ API Raízes do Nordeste

API REST desenvolvida para o gerenciamento de uma rede de restaurantes, contemplando autenticação de usuários, controle de acesso por perfil, unidades, produtos, estoque, pedidos multicanal, pagamentos simulados, programa de fidelidade e auditoria.

O projeto foi desenvolvido como trabalho acadêmico utilizando **Node.js, TypeScript, Express, Prisma ORM e MySQL**.

---

## 📌 Objetivo

O objetivo da API é centralizar operações importantes de uma rede de restaurantes em um único sistema Back-End.

Entre as funcionalidades implementadas estão:

- cadastro e autenticação de usuários;
- autorização baseada em perfis;
- gerenciamento de unidades;
- gerenciamento de produtos;
- controle de estoque por unidade;
- registro de entradas e saídas de estoque;
- criação e acompanhamento de pedidos;
- pedidos originados de diferentes canais;
- processamento simulado de pagamentos;
- programa de fidelidade;
- consentimento para participação no programa de fidelidade;
- crédito controlado de pontos;
- resgate de pontos;
- regras conceituais de promoções/campanhas;
- auditoria de operações;
- documentação da API utilizando Swagger/OpenAPI.

---

## 🛠️ Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- Prisma ORM
- MySQL
- JWT (JSON Web Token)
- bcrypt
- Swagger / OpenAPI
- Insomnia
- Git / GitHub

---

# 🏗️ Arquitetura

O projeto utiliza separação em camadas para facilitar manutenção, organização e evolução da aplicação.

Estrutura simplificada:

```text
restaurante-api/
│
├── docs/
│   ├── diagramas/
│   ├── evidencias/
│   ├── insomnia/
│   ├── arquitetura.md
│   ├── promocoes.md
│   └── testes.md
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
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
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

## Routes

Responsáveis pela definição dos endpoints HTTP e pela aplicação dos middlewares necessários.

## Controllers

Recebem as requisições HTTP, realizam validações relacionadas à camada HTTP e retornam as respostas adequadas.

## Services

Concentram as regras de negócio da aplicação e as operações relacionadas à persistência dos dados.

## Middlewares

Responsáveis por funcionalidades transversais, como autenticação JWT e controle de acesso baseado em perfis.

## Persistência

O Prisma ORM é utilizado como camada de acesso ao banco de dados MySQL.

O Prisma é responsável por:

- modelagem das entidades;
- relacionamentos;
- consultas;
- inserções;
- atualizações;
- exclusões;
- migrations;
- integração tipada com TypeScript.

---

# 🔐 Autenticação e autorização

A API utiliza autenticação baseada em **JWT (JSON Web Token)**.

Após realizar login, o usuário recebe um token que deve ser enviado nas rotas protegidas:

```http
Authorization: Bearer TOKEN
```

Os perfis utilizados pela aplicação são:

```text
ADMIN
GERENTE
ATENDENTE
CLIENTE
```

A autenticação verifica a identidade do usuário, enquanto a autorização determina quais recursos aquele perfil pode acessar.

Por exemplo, um usuário pode estar autenticado corretamente e ainda receber:

```text
403 Forbidden
```

caso não possua permissão para executar determinada operação.

---

# 👤 Usuários e autenticação

Principais endpoints:

```text
POST /auth/register
POST /auth/login
GET  /auth/me
GET  /auth/admin
```

O endpoint de login retorna um token JWT utilizado nas requisições protegidas.

As senhas não são armazenadas em texto puro. Antes da persistência, é utilizado hash com `bcrypt`.

---

# 🏢 Unidades

O sistema permite o gerenciamento das unidades da rede.

```text
GET    /unidades
GET    /unidades/:id
POST   /unidades
PUT    /unidades/:id
DELETE /unidades/:id
```

As operações são protegidas conforme as regras de autenticação e autorização definidas pela aplicação.

Cada unidade possui informações como:

- nome;
- endereço;
- cidade;
- situação ativo/inativo.

---

# 🍔 Produtos / Cardápio

O módulo de produtos representa os itens disponíveis no cardápio da rede.

```text
GET    /produtos
GET    /produtos/:id
POST   /produtos
PUT    /produtos/:id
DELETE /produtos/:id
```

Cada produto possui informações como:

- nome;
- descrição;
- categoria;
- SKU;
- preço;
- custo;
- situação ativo/inativo.

O `SKU` é único no sistema.

A disponibilidade efetiva de um produto em determinada unidade depende também do estoque associado àquela unidade.

---

# 📦 Estoque

O estoque é controlado individualmente por unidade e produto.

Principais endpoints:

```text
GET  /estoques/movimentacoes
GET  /estoques/unidade/:unidadeId
GET  /estoques/unidade/:unidadeId/produto/:produtoId

POST /estoques/entrada
POST /estoques/saida
```

O sistema registra movimentações dos tipos:

```text
ENTRADA
SAIDA
```

Cada movimentação registra:

- unidade;
- produto;
- quantidade;
- tipo da movimentação;
- usuário responsável;
- data e hora.

O usuário responsável é obtido a partir do JWT autenticado, evitando que o cliente informe manualmente quem realizou a operação.

A API impede operações que resultariam em estoque negativo.

Exemplo:

```json
{
  "error": "ESTOQUE_INSUFICIENTE",
  "message": "Não há estoque suficiente para realizar esta saída."
}
```

---

# 🛒 Pedidos

Usuários autenticados podem criar pedidos contendo um ou mais produtos.

```text
GET   /pedidos
POST  /pedidos
POST  /pedidos/:id/pagamento
PATCH /pedidos/:id/status
```

Exemplo de criação:

```json
{
  "unidadeId": 1,
  "canalPedido": "APP",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2
    }
  ]
}
```

Durante a criação, o Back-End:

1. valida a unidade;
2. valida os produtos;
3. verifica se os produtos estão ativos;
4. valida as quantidades;
5. consulta o estoque da unidade;
6. impede venda sem estoque suficiente;
7. obtém o preço cadastrado no servidor;
8. calcula os subtotais;
9. calcula o valor total;
10. registra os itens;
11. cria o pedido;
12. registra a operação necessária para rastreabilidade.

O preço enviado pelo cliente não é utilizado para determinar o valor do pedido.

---

## 🌐 Multicanalidade

Os pedidos podem ser originados através dos canais:

```text
BALCAO
APP
DELIVERY
```

Também é possível filtrar os pedidos por canal:

```http
GET /pedidos?canalPedido=APP
```

Exemplo:

```http
GET /pedidos?canalPedido=DELIVERY
```

Valores inválidos de canal são rejeitados pela API.

---

# 🔄 Fluxo do pedido

Os pedidos possuem os estados:

```text
PENDENTE
CONFIRMADO
EM_PREPARO
PRONTO
FINALIZADO
CANCELADO
```

Um pedido recém-criado inicia como:

```text
PENDENTE
```

Após a confirmação do pagamento, o fluxo operacional esperado é:

```text
PENDENTE
    ↓
pagamento aprovado
    ↓
CONFIRMADO
    ↓
EM_PREPARO
    ↓
PRONTO
    ↓
FINALIZADO
```

Quando aplicável, o pedido também pode chegar ao estado:

```text
CANCELADO
```

As transições são controladas pela regra de negócio.

Por exemplo, não é permitido avançar diretamente de:

```text
CONFIRMADO → FINALIZADO
```

ignorando as etapas intermediárias.

Uma tentativa de transição inválida pode retornar:

```json
{
  "error": "TRANSICAO_STATUS_INVALIDA",
  "message": "A transição de status solicitada não é permitida."
}
```

---

# 💳 Pagamento mock

O projeto **não implementa pagamento financeiro real**.

Foi desenvolvido um mock para representar conceitualmente a comunicação com um serviço externo de pagamentos.

Endpoint:

```text
POST /pedidos/:id/pagamento
```

Exemplo:

```json
{
  "metodo": "PIX",
  "resultado": "APROVADO"
}
```

Métodos suportados:

```text
PIX
CARTAO
```

Resultados simulados:

```text
APROVADO
RECUSADO
```

## Pagamento aprovado

Quando o mock retorna aprovação:

- o pagamento é registrado;
- uma identificação de transação simulada é gerada;
- o pedido passa para `CONFIRMADO`;
- o fluxo operacional pode continuar.

## Pagamento recusado

Quando o mock retorna recusa:

- o pagamento recusado é registrado;
- o resultado da transação é armazenado;
- o pedido é tratado conforme a regra definida pela aplicação.

A API também impede que um pedido com pagamento já processado seja processado novamente.

Exemplo:

```json
{
  "error": "PAGAMENTO_JA_PROCESSADO",
  "message": "Este pedido já possui um pagamento processado."
}
```

---

# ⭐ Programa de fidelidade

A aplicação possui um programa de fidelidade vinculado ao usuário.

O programa contempla:

- consulta de saldo;
- consentimento do usuário;
- crédito controlado de pontos;
- prevenção de crédito duplicado;
- resgate simples de pontos.

A participação no programa depende da regra de consentimento implementada pela aplicação.

Os pontos relacionados a um pedido somente são concedidos quando as condições definidas pela regra de negócio são satisfeitas.

O modelo `Pedido` possui controle através do campo:

```text
pontosCreditados
```

Esse campo ajuda a impedir que um mesmo pedido gere pontos repetidamente.

O crédito ocorre no momento apropriado do fluxo, quando o pedido chega ao estado:

```text
FINALIZADO
```

## Consulta de saldo

O usuário autenticado pode consultar seus próprios dados de fidelidade.

```text
GET /fidelidade/saldo
```

Exemplo de resposta:

```json
{
  "fidelidade": {
    "usuarioId": 1,
    "nome": "João Silva",
    "pontos": 32
  }
}
```

As demais operações relacionadas ao consentimento e resgate estão documentadas no Swagger da aplicação de acordo com as rotas implementadas.

---

# 🎁 Promoções e campanhas

O requisito de promoções/campanhas foi tratado de forma **conceitual/documental**, conforme permitido no escopo acadêmico do projeto.

As regras propostas estão documentadas em:

```text
docs/promocoes.md
```

A documentação apresenta como campanhas poderiam ser aplicadas ao sistema, incluindo aspectos como:

- período de validade;
- produtos elegíveis;
- unidades participantes;
- canais participantes;
- critérios de aplicação;
- prioridade de regras;
- descontos;
- integração futura com pedidos.

Essa abordagem permite a evolução futura do sistema para um módulo completo de promoções sem acoplar prematuramente essa funcionalidade ao fluxo principal.

---

# 📋 Auditoria

A aplicação mantém registros de auditoria para operações relevantes do sistema.

Endpoint:

```text
GET /auditorias
```

O acesso à consulta de auditoria é restrito ao perfil:

```text
ADMIN
```

Um registro pode conter informações como:

```text
usuarioId
acao
entidade
entidadeId
detalhes
createdAt
```

A auditoria permite rastrear ações sensíveis e identificar o usuário responsável pela operação.

Entre as operações que podem gerar rastreabilidade estão ações relacionadas a:

- pedidos;
- alterações de status;
- estoque;
- fidelidade;
- demais operações sensíveis previstas pelos services.

---

# 📚 Swagger / OpenAPI

A API possui documentação interativa utilizando Swagger/OpenAPI.

Com a aplicação em execução, acesse:

```text
http://localhost:3000/docs/
```

A documentação apresenta os módulos da API, incluindo:

- Autenticação;
- Unidades;
- Produtos;
- Pedidos;
- Estoque;
- Fidelidade;
- Auditoria.

Endpoints protegidos exibem o esquema de autenticação correspondente.

Para testar uma rota protegida:

1. realize login;
2. copie o `accessToken`;
3. abra o botão **Authorize** no Swagger;
4. informe o token conforme o esquema apresentado;
5. execute o endpoint desejado.

---

# ⚠️ Tratamento de erros

A API utiliza códigos HTTP de acordo com a situação encontrada.

| Código | Significado |
|---|---|
| `200` | Operação realizada com sucesso |
| `201` | Recurso criado com sucesso |
| `400` | Requisição inválida |
| `401` | Usuário não autenticado / token inválido |
| `403` | Usuário autenticado sem permissão |
| `404` | Recurso não encontrado |
| `409` | Conflito com uma regra de negócio |
| `422` | Dados semanticamente inválidos |
| `500` | Erro interno do servidor |

As respostas seguem um padrão semelhante a:

```json
{
  "error": "CODIGO_DO_ERRO",
  "message": "Descrição do problema."
}
```

Exemplos de erros tratados durante os testes:

```text
TOKEN_INVALIDO
ACESSO_NEGADO
CAMPOS_OBRIGATORIOS
PRODUTO_INVALIDO
QUANTIDADE_INVALIDA
ESTOQUE_INSUFICIENTE
SKU_JA_CADASTRADO
CANAL_PEDIDO_INVALIDO
PAGAMENTO_JA_PROCESSADO
TRANSICAO_STATUS_INVALIDA
```

---

# 🧪 Testes

Os endpoints foram testados utilizando **Insomnia** e **Swagger**.

Foram executados cenários positivos e negativos para verificar tanto o funcionamento normal quanto as principais regras de negócio.

## Cenários positivos

Entre os cenários verificados estão:

- cadastro e login;
- autenticação via JWT;
- consulta de usuário autenticado;
- listagem de unidades;
- listagem de produtos;
- criação de pedidos;
- filtro por canal;
- entrada de estoque;
- saída de estoque;
- pagamento aprovado;
- pagamento recusado;
- fluxo válido de status;
- consulta de estoque;
- consulta de fidelidade;
- operações do programa de fidelidade;
- consulta de auditoria com perfil autorizado.

## Cenários negativos

Também foram verificados:

- token inválido ou expirado (`401`);
- usuário sem permissão (`403`);
- campo obrigatório ausente (`400`);
- canal de pedido inválido (`400`);
- produto inexistente (`404`);
- estoque insuficiente (`409`);
- SKU duplicado (`409`);
- pagamento já processado (`409`);
- transição de status inválida (`409`);
- quantidade negativa (`422`).

A documentação detalhada dos testes encontra-se em:

```text
docs/testes.md
```

As capturas utilizadas como evidências estão em:

```text
docs/evidencias/
```

---

# 🧪 Coleção do Insomnia

A coleção utilizada durante os testes da API foi exportada e incluída na documentação do projeto.

Ela está disponível em:

```text
docs/insomnia/
```

O arquivo permite importar as requisições no Insomnia e reproduzir os principais testes da aplicação.

> Tokens, senhas e outros segredos reais não devem ser armazenados na coleção publicada.

---

# 🗄️ Banco de dados

A aplicação utiliza **MySQL** com **Prisma ORM**.

Entre as entidades principais estão:

```text
Usuario
Unidade
Produto
Estoque
MovimentacaoEstoque
Pedido
ItemPedido
Pagamento
Auditoria
```

Os relacionamentos entre essas entidades estão definidos em:

```text
prisma/schema.prisma
```

O banco contempla relacionamentos entre usuários, unidades, produtos, estoque, movimentações, pedidos, itens, pagamentos e auditorias.

---

# 🔄 Migrations

As alterações estruturais do banco são versionadas utilizando Prisma Migrate.

As migrations estão armazenadas em:

```text
prisma/migrations/
```

Isso permite reconstruir a estrutura do banco de maneira controlada.

Para aplicar migrations existentes em um ambiente de desenvolvimento:

```bash
npx prisma migrate dev
```

---

# 🌱 Seed

O projeto possui um script de seed para facilitar a criação de dados iniciais necessários para demonstração e testes.

Arquivo:

```text
prisma/seed.ts
```

Antes da execução, configure corretamente o banco de dados através das variáveis de ambiente.

Execute o seed utilizando o comando definido no `package.json`.

Exemplo:

```bash
npm run db:seed
```

> Caso o nome do script seja alterado no `package.json`, utilize o comando correspondente configurado no projeto.

---

# ⚙️ Configuração do projeto

## 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd restaurante-api
```

---

## 2. Instalar as dependências

```bash
npm install
```

---

## 3. Configurar as variáveis de ambiente

Utilize o arquivo:

```text
.env.example
```

como referência para criar:

```text
.env
```

A configuração utiliza variáveis relacionadas a:

```text
PORT
DATABASE_URL
DB_PASSWORD
JWT_SECRET
JWT_EXPIRES_IN
```

Utilize valores próprios para o seu ambiente.

> Nunca envie o `.env` real para um repositório público.

---

## 4. Preparar o banco

Com o MySQL configurado e o `.env` preenchido:

```bash
npx prisma migrate dev
```

Depois gere o Prisma Client:

```bash
npx prisma generate
```

---

## 5. Popular o banco

Caso seja necessário carregar os dados iniciais:

```bash
npm run db:seed
```

---

## 6. Verificar o TypeScript

```bash
npx tsc --noEmit
```

---

## 7. Compilar

```bash
npm run build
```

---

## 8. Executar em desenvolvimento

```bash
npm run dev
```

Por padrão, a aplicação utiliza:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/docs/
```

---

# 🔒 Segurança

Entre as práticas aplicadas no projeto estão:

- autenticação por JWT;
- hash de senhas com bcrypt;
- autorização baseada em perfis;
- validação de dados;
- proteção de endpoints;
- controle de operações administrativas;
- tratamento padronizado de erros;
- validação das transições de pedido;
- prevenção de estoque negativo;
- prevenção de crédito duplicado de fidelidade;
- auditoria de operações relevantes;
- uso de variáveis de ambiente;
- exclusão do `.env` do versionamento.

---

# 🛡️ LGPD e privacidade

O projeto considera princípios básicos relacionados à proteção de dados pessoais.

Entre as medidas adotadas estão:

- utilização apenas dos dados necessários ao funcionamento da aplicação;
- proteção das senhas através de hash;
- autenticação para acesso aos recursos protegidos;
- autorização baseada em perfis;
- rastreabilidade através de auditoria;
- separação de informações sensíveis por variáveis de ambiente;
- consentimento associado à participação no programa de fidelidade.

Por se tratar de um projeto acadêmico, a aplicação **não representa uma implementação completa de conformidade jurídica com a LGPD**, mas aplica conceitos técnicos relacionados à segurança, privacidade e controle de acesso.

---

# 📐 Diagramas

O projeto possui documentação visual da solução.

Os diagramas estão disponíveis em:

```text
docs/diagramas/
```

Entre eles estão:

- Diagrama Entidade-Relacionamento (DER);
- Diagrama de Classes;
- Diagrama de Casos de Uso.

Os diagramas representam a estrutura do banco, os principais elementos do domínio e as interações dos diferentes perfis com a API.

---

# 📖 Documentação complementar

A documentação do projeto está concentrada no diretório:

```text
docs/
```

Estrutura:

```text
docs/
├── diagramas/
├── evidencias/
├── insomnia/
├── arquitetura.md
├── promocoes.md
└── testes.md
```

## `arquitetura.md`

Apresenta as decisões arquiteturais, organização em camadas, tecnologias e principais fluxos da aplicação.

## `testes.md`

Documenta os cenários utilizados para validar a API.

## `promocoes.md`

Documenta conceitualmente as regras de promoções e campanhas.

## `diagramas/`

Contém os diagramas utilizados para representar a solução.

## `evidencias/`

Contém capturas dos testes executados.

## `insomnia/`

Contém a coleção exportada utilizada para reprodução das requisições.

---

# 🔍 Principais regras de negócio

A implementação contempla regras como:

1. somente usuários autenticados acessam recursos protegidos;
2. determinadas operações dependem do perfil do usuário;
3. produtos possuem SKU único;
4. produtos inativos não podem ser utilizados normalmente em novos pedidos;
5. pedidos precisam possuir itens válidos;
6. a quantidade de um item deve ser maior que zero;
7. pedidos não podem utilizar quantidade superior ao estoque disponível;
8. o preço do pedido é calculado pelo Back-End;
9. o canal deve pertencer aos valores permitidos;
10. pagamentos são simulados através de mock;
11. um pagamento já processado não pode ser processado novamente;
12. mudanças de status seguem transições permitidas;
13. movimentações de estoque mantêm rastreabilidade do usuário;
14. pontos de fidelidade são controlados para evitar duplicidade;
15. operações relevantes podem gerar registros de auditoria.

---

# 🔁 Fluxo principal da aplicação

O fluxo principal integra os principais módulos do sistema:

```text
Usuário autenticado
        ↓
Seleciona unidade
        ↓
Seleciona produtos
        ↓
Cria pedido
        ↓
API valida produtos e estoque
        ↓
API calcula valor total
        ↓
Pedido PENDENTE
        ↓
Pagamento mock
        ↓
Pagamento aprovado
        ↓
Pedido CONFIRMADO
        ↓
EM_PREPARO
        ↓
PRONTO
        ↓
FINALIZADO
        ↓
Regra de fidelidade
        ↓
Auditoria
```

Esse fluxo demonstra a integração entre autenticação, unidades, produtos, estoque, pedidos, pagamento, fidelidade e auditoria.

---

# 🚀 Reprodução da avaliação

Para reproduzir o projeto:

```bash
git clone URL_DO_REPOSITORIO
cd restaurante-api
npm install
```

Configure o `.env` utilizando `.env.example`.

Em seguida:

```bash
npx prisma migrate dev
npx prisma generate
npm run db:seed
npm run dev
```

Acesse:

```text
Swagger:
http://localhost:3000/docs/
```

Também é possível importar a coleção presente em:

```text
docs/insomnia/
```

As evidências dos cenários executados estão disponíveis em:

```text
docs/evidencias/
```

---

# 👨‍💻 Projeto acadêmico

**Curso:** Análise e Desenvolvimento de Sistemas  
 



### Aluno

- [Vinicius Gabriel Cavalheiro da Silva]
  [RU: 4699592]
---

