# Requisitos do Sistema

## 1. Contexto do Projeto

O projeto consiste no desenvolvimento de uma API Back-End para o gerenciamento de uma rede de restaurantes composta por matriz e unidades.

A aplicação deverá centralizar o gerenciamento de usuários, unidades, produtos, estoque, pedidos, pagamentos, canais de pedido, fidelização e rastreabilidade das operações.

O sistema será desenvolvido com foco em segurança, organização arquitetural, persistência de dados, aplicação de regras de negócio e documentação dos endpoints.

---

## 2. Objetivo Geral

Desenvolver uma API REST capaz de atender às principais necessidades operacionais de uma rede de restaurantes, permitindo o controle de usuários, unidades, produtos, estoque e pedidos, além da integração simulada com pagamento externo.

O sistema deverá possuir autenticação, autorização por perfis, rastreabilidade das operações e aplicação de princípios mínimos relacionados à LGPD.

---

## 3. Requisitos Funcionais

### RF01 - Cadastro de usuários
O sistema deve permitir o cadastro de usuários com nome, e-mail, senha e perfil de acesso.

### RF02 - Autenticação
O sistema deve permitir a autenticação de usuários por e-mail e senha.

### RF03 - Geração de token
Após autenticação válida, o sistema deve gerar um token JWT para acesso aos recursos protegidos.

### RF04 - Controle de acesso por perfil
O sistema deve limitar determinadas operações de acordo com o perfil do usuário.

Perfis previstos:

- ADMIN
- GERENTE
- ATENDENTE
- CLIENTE

### RF05 - Gerenciamento de unidades
O sistema deve permitir cadastrar, consultar, atualizar e excluir unidades da rede.

### RF06 - Gerenciamento de produtos
O sistema deve permitir cadastrar, consultar, atualizar e excluir produtos.

### RF07 - Controle de estoque por unidade
O sistema deve controlar a quantidade disponível de cada produto separadamente em cada unidade.

### RF08 - Movimentação de estoque
O sistema deve permitir registrar entradas e saídas de estoque, mantendo o saldo atualizado.

### RF09 - Criação de pedidos
O sistema deve permitir a criação de pedidos vinculados a uma unidade e a um cliente.

### RF10 - Itens do pedido
Um pedido deve possuir um ou mais itens, contendo produto, quantidade e preço unitário.

### RF11 - Validação de estoque
Antes da confirmação de um pedido, o sistema deve validar se existe estoque suficiente para todos os itens solicitados.

### RF12 - Multicanalidade
O sistema deve registrar o canal de origem do pedido por meio do campo `canalPedido`.

Exemplos de canais:

- BALCAO
- SITE
- APLICATIVO
- DELIVERY

### RF13 - Pagamento externo simulado
O sistema deve possuir uma integração simulada de pagamento.

### RF14 - Pagamento aprovado
Quando o pagamento for aprovado, o sistema deve atualizar o pedido para um status correspondente ao sucesso da operação.

### RF15 - Pagamento rejeitado
Quando o pagamento for rejeitado, o sistema deve registrar a falha e atualizar corretamente o status do pedido.

### RF16 - Status do pedido
O sistema deve controlar a evolução do status do pedido durante seu fluxo.

Exemplos:

- CRIADO
- AGUARDANDO_PAGAMENTO
- PAGO
- EM_PREPARO
- PRONTO
- FINALIZADO
- CANCELADO

### RF17 - Fidelização
O sistema deve possuir suporte a informações de fidelização de clientes.

A implementação poderá considerar acúmulo de pontos ou registro de benefícios vinculados ao cliente.

### RF18 - Auditoria
O sistema deve registrar ações sensíveis realizadas na aplicação.

Exemplos:

- criação de pedido;
- cancelamento de pedido;
- alteração de status;
- movimentação de estoque.

### RF19 - Consulta de pedidos
O sistema deve permitir consultar pedidos e seus respectivos dados.

### RF20 - Rastreabilidade por canal
O sistema deve permitir identificar a origem dos pedidos utilizando o campo `canalPedido`.

---

## 4. Requisitos Não Funcionais

### RNF01 - Segurança de senha
As senhas dos usuários devem ser armazenadas utilizando algoritmo de hash.

### RNF02 - JWT
A autenticação da API deve utilizar JSON Web Token.

### RNF03 - Autorização
Endpoints sensíveis devem validar o perfil do usuário autenticado.

### RNF04 - Proteção de dados
A API não deve retornar senhas ou outros dados sensíveis nas respostas.

### RNF05 - LGPD
A solução deve considerar princípios mínimos da LGPD, incluindo:

- finalidade;
- minimização dos dados;
- proteção de dados pessoais;
- restrição de exposição de informações desnecessárias.

### RNF06 - API REST
A aplicação deve seguir o padrão REST para organização dos endpoints.

### RNF07 - Status HTTP
A API deve utilizar códigos HTTP coerentes com os resultados das operações.

Exemplos:

- 200 - operação realizada com sucesso;
- 201 - recurso criado;
- 400 - dados inválidos;
- 401 - usuário não autenticado;
- 403 - acesso não autorizado;
- 404 - recurso não encontrado;
- 409 - conflito de regra de negócio;
- 422 - dados semanticamente inválidos;
- 500 - erro interno.

### RNF08 - Persistência
Os dados devem ser armazenados em banco de dados relacional MySQL.

### RNF09 - ORM
A comunicação com o banco será realizada utilizando Prisma ORM.

### RNF10 - Migrations
Alterações na estrutura do banco devem ser versionadas utilizando migrations.

### RNF11 - Arquitetura em camadas
O projeto deve possuir separação clara de responsabilidades entre rotas, controllers, services, persistência e middlewares.

### RNF12 - Documentação da API
Os endpoints implementados devem ser documentados utilizando Swagger/OpenAPI.

### RNF13 - Testes
A API deverá possuir cenários de teste positivos e negativos executáveis por meio de Postman ou Insomnia.

### RNF14 - Logs
Operações sensíveis devem possuir registros que permitam rastreabilidade.

### RNF15 - Versionamento
O código-fonte deve ser versionado utilizando Git e disponibilizado em repositório remoto.

### RNF16 - Configuração segura
Credenciais e informações sensíveis devem ser armazenadas em variáveis de ambiente e não devem ser versionadas no Git.

### RNF17 - Reprodutibilidade
O projeto deverá possuir um README contendo instruções suficientes para configurar, executar, migrar e testar a aplicação.

---

## 5. Priorização do MVP

O desenvolvimento foi dividido em funcionalidades essenciais para o MVP e funcionalidades complementares.

### Funcionalidades prioritárias do MVP

- autenticação com JWT;
- autorização por perfil;
- gerenciamento de unidades;
- gerenciamento de produtos;
- controle de estoque por unidade;
- criação de pedidos;
- registro do `canalPedido`;
- validação de estoque;
- pagamento externo simulado;
- atualização do status do pedido;
- logs básicos de auditoria.

Essas funcionalidades foram priorizadas porque formam o fluxo crítico necessário para demonstrar o funcionamento ponta a ponta da aplicação.

### Funcionalidades complementares

- fidelização avançada;
- paginação;
- filtros de consultas;
- métricas;
- relatórios;
- integrações reais com provedores externos.

Essas funcionalidades são consideradas extensões da solução e podem ser implementadas após a conclusão do fluxo crítico.

---

## 6. Fluxo Crítico Priorizado

O fluxo crítico escolhido para a aplicação é:

Cliente cria pedido  
→ sistema valida unidade e produtos  
→ sistema valida estoque  
→ sistema calcula o valor total  
→ sistema registra o canal do pedido  
→ sistema cria o pedido  
→ sistema executa pagamento mock  
→ pagamento é aprovado ou rejeitado  
→ sistema atualiza o status do pedido  
→ sistema registra a operação para auditoria.

A escolha deste fluxo foi realizada por envolver diversas regras de negócio e integrar autenticação, estoque, pedidos, pagamento, multicanalidade e rastreabilidade.