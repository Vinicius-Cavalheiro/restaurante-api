# Testes da API — Raízes do Nordeste

## 1. Objetivo

Os testes tiveram como objetivo validar o funcionamento dos principais endpoints da API, incluindo cenários positivos e negativos.

Foram avaliados:

- autenticação;
- autorização por perfil;
- unidades;
- produtos;
- estoque;
- pedidos;
- multicanalidade;
- pagamentos;
- fluxo de status;
- fidelidade;
- auditoria;
- tratamento de erros.

Os testes manuais foram realizados principalmente utilizando Insomnia e Swagger/OpenAPI.

---

# 2. Estratégia de Testes

Foram utilizados testes funcionais de API através de requisições HTTP.

Para cada funcionalidade foram avaliados:

- método HTTP;
- endpoint;
- autenticação;
- autorização;
- dados enviados;
- código HTTP retornado;
- corpo da resposta;
- aplicação das regras de negócio.

Foram utilizados tanto cenários de sucesso quanto cenários de erro.

---

# 3. Códigos HTTP validados

Durante os testes foram observados os seguintes códigos HTTP:

| Código | Utilização |
|---|---|
| 200 | Operação realizada com sucesso |
| 201 | Recurso criado com sucesso |
| 400 | Requisição ou parâmetro inválido |
| 401 | Falha de autenticação |
| 403 | Usuário autenticado sem autorização |
| 404 | Recurso não encontrado |
| 409 | Conflito com regra de negócio |
| 422 | Dados semanticamente inválidos |
| 500 | Erro interno tratado pela API |

---

# 4. Autenticação

## T01 — Login válido

**Endpoint**

```http
POST /auth/login
```

**Objetivo**

Validar a autenticação de um usuário cadastrado.

**Resultado esperado**

```text
200 OK
```

A API deve retornar um token JWT.

**Resultado obtido**

```text
APROVADO
```

---

## T02 — Token inválido

**Objetivo**

Tentar acessar um endpoint protegido utilizando token JWT inválido.

**Resultado esperado**

```text
401 Unauthorized
```

**Resultado obtido**

```text
APROVADO
```

O endpoint protegido rejeitou a requisição.

---

# 5. Autorização por perfil

## T03 — CLIENTE tentando acessar recurso administrativo

**Endpoint utilizado**

```http
GET /auditorias
```

**Perfil**

```text
CLIENTE
```

**Resultado esperado**

```text
403 Forbidden
```

**Resultado obtido**

```text
APROVADO
```

Esse teste demonstra que autenticação e autorização são tratadas separadamente.

O usuário possui um JWT válido, porém seu perfil não possui autorização para acessar a auditoria.

---

## T04 — ADMIN acessando auditoria

**Endpoint**

```http
GET /auditorias
```

**Perfil**

```text
ADMIN
```

**Resultado esperado**

```text
200 OK
```

**Resultado obtido**

```text
APROVADO
```

---

# 6. Produtos

## T05 — Listagem de produtos

```http
GET /produtos
```

**Resultado esperado**

```text
200 OK
```

**Resultado obtido**

```text
APROVADO
```

---

## T06 — Cadastro de produto

```http
POST /produtos
```

**Perfil**

```text
ADMIN
```

**Resultado esperado**

```text
201 Created
```

**Resultado obtido**

```text
APROVADO
```

---

## T07 — SKU duplicado

**Objetivo**

Tentar cadastrar um produto utilizando um SKU já existente.

**Resultado esperado**

```text
409 Conflict
```

Erro esperado:

```text
SKU_JA_CADASTRADO
```

**Resultado obtido**

```text
APROVADO
```

O sistema impediu a duplicidade do SKU.

---

# 7. Estoque

## T08 — Consulta de estoque por unidade

```http
GET /estoques/unidade/:unidadeId
```

**Resultado esperado**

```text
200 OK
```

**Resultado obtido**

```text
APROVADO
```

---

## T09 — Entrada de estoque

```http
POST /estoques/entrada
```

**Perfil**

```text
ADMIN
```

**Resultado esperado**

```text
200 OK
```

**Resultado obtido**

```text
APROVADO
```

O saldo do estoque foi aumentado.

A operação também gerou uma movimentação do tipo:

```text
ENTRADA
```

---

## T10 — Saída de estoque

```http
POST /estoques/saida
```

**Perfil**

```text
ADMIN
```

**Resultado esperado**

```text
200 OK
```

**Resultado obtido**

```text
APROVADO
```

A quantidade foi removida do estoque e uma movimentação do tipo `SAIDA` foi registrada.

---

## T11 — Estoque insuficiente

**Objetivo**

Tentar retirar uma quantidade superior ao saldo disponível.

**Resultado esperado**

```text
409 Conflict
```

Resposta esperada:

```json
{
  "error": "ESTOQUE_INSUFICIENTE",
  "message": "Não há estoque suficiente para realizar esta saída."
}
```

**Resultado obtido**

```text
APROVADO
```

O estoque negativo foi impedido.

---

## T12 — Quantidade inválida

**Objetivo**

Enviar quantidade igual ou inferior a zero.

**Resultado esperado**

```text
422 Unprocessable Entity
```

Erro:

```text
QUANTIDADE_INVALIDA
```

**Resultado obtido**

```text
APROVADO
```

---

# 8. Pedidos

## T13 — Criação de pedido

```http
POST /pedidos
```

Exemplo:

```json
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
```

**Resultado esperado**

```text
201 Created
```

O pedido deve ser criado inicialmente como:

```text
PENDENTE
```

**Resultado obtido**

```text
APROVADO
```

---

## T14 — Pedido sem itens

**Resultado esperado**

```text
422 Unprocessable Entity
```

Erro:

```text
PEDIDO_SEM_ITENS
```

**Resultado obtido**

```text
APROVADO
```

---

## T15 — Produto inexistente

**Objetivo**

Criar pedido utilizando produto inexistente ou inválido.

**Resultado esperado**

```text
404 Not Found
```

Erro:

```text
PRODUTO_INVALIDO
```

**Resultado obtido**

```text
APROVADO
```

---

## T16 — Canal de pedido inválido

Exemplo inválido:

```json
{
  "canalPedido": "WHATSAPP"
}
```

Os canais permitidos são:

```text
BALCAO
APP
DELIVERY
```

**Resultado esperado**

```text
422 Unprocessable Entity
```

na criação do pedido.

Na validação do filtro `GET /pedidos?canalPedido=...`, parâmetros inválidos podem retornar:

```text
400 Bad Request
```

**Resultado obtido**

```text
APROVADO
```

---

# 9. Multicanalidade

## T17 — Pedido pelo canal APP

```json
{
  "canalPedido": "APP"
}
```

**Resultado**

```text
APROVADO
```

---

## T18 — Pedido pelo canal BALCAO

```json
{
  "canalPedido": "BALCAO"
}
```

**Resultado**

```text
APROVADO
```

---

## T19 — Pedido pelo canal DELIVERY

```json
{
  "canalPedido": "DELIVERY"
}
```

**Resultado**

```text
APROVADO
```

---

## T20 — Filtro por canal

```http
GET /pedidos?canalPedido=APP
```

**Resultado esperado**

A API deve retornar os pedidos correspondentes ao canal solicitado.

**Resultado obtido**

```text
APROVADO
```

Esse teste comprova que o canal é persistido e pode ser utilizado como critério de consulta.

## T20a — Pedido pelo canal TOTEM

**Entrada**

{
  "canalPedido": "TOTEM"
}

**Resultado esperado**

201 Created

O pedido deve ser persistido com o canal TOTEM.

**Resultado obtido**

APROVADO

---

## T20b — Filtro pelo canal TOTEM

**Endpoint**

GET /pedidos?canalPedido=TOTEM

**Resultado esperado**

200 OK

A API deve retornar somente os pedidos associados ao canal TOTEM.

**Resultado obtido**

APROVADO

---

# 10. Pagamento

## T21 — Pagamento aprovado

```http
POST /pedidos/:id/pagamento
```

**Resultado esperado**

```text
200 OK
```

Fluxo:

```text
PENDENTE
   ↓
Pagamento APROVADO
   ↓
CONFIRMADO
```

**Resultado obtido**

```text
APROVADO
```

---

## T22 — Pagamento recusado

```http
POST /pedidos/:id/pagamento
```

**Resultado esperado**

O pagamento deve ser registrado como:

```text
RECUSADO
```

e o pedido deve seguir a regra de cancelamento implementada.

**Resultado obtido**

```text
APROVADO
```

Fluxo validado:

```text
PENDENTE
   ↓
Pagamento RECUSADO
   ↓
CANCELADO
```

---

## T23 — Pagamento duplicado

**Objetivo**

Tentar processar novamente o pagamento de um pedido que já possui pagamento registrado.

**Resultado esperado**

```text
409 Conflict
```

Erro:

```text
PAGAMENTO_JA_PROCESSADO
```

**Resultado obtido**

```text
APROVADO
```

---

# 11. Status do pedido

## T24 — Alterar para EM_PREPARO

```http
PATCH /pedidos/:id/status
```

```json
{
  "status": "EM_PREPARO"
}
```

**Resultado esperado**

```text
200 OK
```

**Resultado obtido**

```text
APROVADO
```

---

## T25 — Alterar para PRONTO

```json
{
  "status": "PRONTO"
}
```

**Resultado esperado**

```text
200 OK
```

**Resultado obtido**

```text
APROVADO
```

---

## T26 — Finalizar pedido

```json
{
  "status": "FINALIZADO"
}
```

**Resultado esperado**

```text
200 OK
```

**Resultado obtido**

```text
APROVADO
```

Fluxo completo validado:

```text
CONFIRMADO
     ↓
EM_PREPARO
     ↓
PRONTO
     ↓
FINALIZADO
```

---

## T27 — Transição inválida

**Objetivo**

Tentar pular uma etapa obrigatória do fluxo.

Exemplo:

```text
CONFIRMADO → FINALIZADO
```

**Resultado esperado**

```text
409 Conflict
```

Erro:

```text
TRANSICAO_STATUS_INVALIDA
```

**Resultado obtido**

```text
APROVADO
```

---

# 12. Fidelidade

## T28 — Consulta de saldo

```http
GET /fidelidade/saldo
```

**Resultado esperado**

```text
200 OK
```

Exemplo:

```json
{
  "fidelidade": {
    "usuarioId": 1,
    "nome": "Usuário",
    "pontos": 32
  }
}
```

**Resultado obtido**

```text
APROVADO
```

---

## T29 — Crédito de pontos após finalização

**Objetivo**

Validar que a finalização do pedido gera pontos de fidelidade.

Regra utilizada:

```text
R$ 1,00 gasto = 1 ponto
```

A parte decimal do valor é desconsiderada.

Exemplo:

```text
R$ 32,90 → 32 pontos
```

**Resultado obtido**

```text
APROVADO
```

O campo:

```text
pontosCreditados
```

também impede o crédito repetido dos pontos do mesmo pedido.

---

# 13. Auditoria

## T30 — Registro de criação de pedido

Evento:

```text
PEDIDO_CRIADO
```

**Resultado**

```text
APROVADO
```

---

## T31 — Registro de pagamento

Eventos possíveis:

```text
PAGAMENTO_APROVADO
PAGAMENTO_RECUSADO
```

**Resultado**

```text
APROVADO
```

---

## T32 — Registro de alteração de status

Evento:

```text
STATUS_PEDIDO_ALTERADO
```

**Resultado**

```text
APROVADO
```

---

## T33 — Auditoria de fidelidade

Evento:

```text
PONTOS_FIDELIDADE_CREDITADOS
```

**Resultado**

```text
APROVADO
```

---

# 14. Fluxo crítico validado

O fluxo crítico da aplicação foi testado de ponta a ponta:

```text
Usuário autenticado
        ↓
Criação do pedido
        ↓
Validação da unidade
        ↓
Validação dos produtos
        ↓
Validação do estoque
        ↓
Cálculo do pedido
        ↓
Pedido PENDENTE
        ↓
Pagamento
       / \
      /   \
APROVADO  RECUSADO
   ↓          ↓
CONFIRMADO  CANCELADO
   ↓
Baixa do estoque
   ↓
EM_PREPARO
   ↓
PRONTO
   ↓
FINALIZADO
   ↓
Crédito de fidelidade
   ↓
Auditoria
```

---

# 15. Evidências

As evidências dos testes foram registradas através de capturas de tela das requisições realizadas no Insomnia e Swagger.



```text
docs/
└── evidencias/
    ├── autenticacao/
    ├── autorizacao/
    ├── produtos/
    ├── estoque/
    ├── pedidos/
    ├── pagamentos/
    ├── fidelidade/
    └── auditoria/
```

Os arquivos podem utilizar uma nomenclatura padronizada, por exemplo:

```text
01-login-sucesso.png
02-token-invalido-401.png
03-acesso-negado-403.png
04-produto-sku-duplicado-409.png
05-estoque-insuficiente-409.png
06-pedido-criado-201.png
07-pagamento-aprovado.png
08-pagamento-recusado.png
09-transicao-invalida-409.png
10-fidelidade.png
11-auditoria.png
```

---

# 16. Conclusão

Os testes demonstram o funcionamento das principais regras de negócio da API Raízes do Nordeste.

Além dos cenários de sucesso, foram validados cenários de erro relacionados a autenticação, autorização, validação de dados, recursos inexistentes, conflitos de negócio, estoque insuficiente, pagamento e transições inválidas.

O fluxo crítico de pedido foi validado desde sua criação até pagamento, movimentação de estoque, atualização de status, fidelização e auditoria.