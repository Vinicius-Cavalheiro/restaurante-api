# Casos de Uso do Sistema

## 1. Atores

### Administrador
Responsável pela administração geral do sistema.

Principais permissões:
- gerenciar unidades;
- gerenciar produtos;
- consultar estoque;
- movimentar estoque;
- consultar pedidos;
- consultar informações administrativas.

### Gerente
Responsável pelas operações de uma unidade.

Principais permissões:
- consultar produtos;
- consultar estoque;
- movimentar estoque;
- consultar pedidos;
- atualizar determinados status de pedidos.

### Atendente
Responsável pelo atendimento e registro de pedidos.

Principais permissões:
- consultar produtos;
- consultar estoque;
- criar pedidos;
- consultar pedidos;
- atualizar determinados status de pedidos.

### Cliente
Usuário responsável pela realização de pedidos.

Principais permissões:
- autenticar-se;
- consultar produtos disponíveis;
- criar pedidos;
- consultar seus pedidos;
- participar do programa de fidelização.

---

## 2. Casos de Uso

### UC01 - Cadastrar usuário

**Ator:** Cliente / Administrador

**Objetivo:** Permitir o cadastro de um novo usuário no sistema.

**Fluxo principal:**
1. O usuário informa nome, e-mail e senha.
2. O sistema valida os dados.
3. O sistema verifica se o e-mail já está cadastrado.
4. A senha é transformada em hash.
5. O usuário é armazenado no banco.
6. O sistema retorna confirmação do cadastro.

**Fluxo alternativo:**
- Caso o e-mail já exista, o sistema rejeita o cadastro.

---

### UC02 - Realizar login

**Ator:** Todos os usuários

**Objetivo:** Autenticar o usuário.

**Fluxo principal:**
1. O usuário informa e-mail e senha.
2. O sistema localiza o usuário.
3. O sistema compara a senha com o hash armazenado.
4. O sistema gera um JWT.
5. O token é retornado ao usuário.

**Fluxo alternativo:**
- Usuário inexistente.
- Senha incorreta.

---

### UC03 - Gerenciar unidades

**Ator:** Administrador

**Objetivo:** Manter as unidades da rede.

**Operações:**
- cadastrar unidade;
- consultar unidade;
- atualizar unidade;
- excluir unidade.

**Pré-condição:**
O usuário deve estar autenticado e possuir perfil ADMIN.

---

### UC04 - Gerenciar produtos

**Ator:** Administrador

**Objetivo:** Manter o catálogo de produtos.

**Operações:**
- cadastrar produto;
- consultar produto;
- atualizar produto;
- excluir produto.

---

### UC05 - Consultar estoque

**Atores:** Administrador, Gerente e Atendente

**Objetivo:** Consultar a quantidade disponível de produtos em uma unidade.

---

### UC06 - Movimentar estoque

**Atores:** Administrador e Gerente

**Objetivo:** Registrar entradas e saídas de produtos.

**Fluxo principal:**
1. O usuário seleciona a unidade.
2. Seleciona o produto.
3. Informa o tipo de movimentação.
4. Informa a quantidade.
5. O sistema valida a operação.
6. O saldo é atualizado.
7. A movimentação é registrada.

**Fluxo alternativo:**
- Caso uma saída gere estoque negativo, a operação é rejeitada.

---

### UC07 - Criar pedido

**Atores:** Cliente ou Atendente

**Objetivo:** Registrar um novo pedido.

**Fluxo principal:**
1. O usuário seleciona uma unidade.
2. Informa os produtos e quantidades.
3. Informa o canal do pedido.
4. O sistema valida os produtos.
5. O sistema verifica o estoque.
6. O sistema calcula o valor total.
7. O pedido e seus itens são registrados.
8. O pedido segue para pagamento.

**Fluxo alternativo:**
- Produto inexistente.
- Unidade inexistente.
- Estoque insuficiente.
- Dados inválidos.

---

### UC08 - Processar pagamento

**Ator:** Sistema / Serviço de pagamento mock

**Objetivo:** Simular uma integração externa de pagamento.

**Fluxo principal:**
1. O sistema envia os dados necessários ao serviço mock.
2. O mock processa a solicitação.
3. O pagamento é aprovado.
4. O sistema registra o resultado.
5. O status do pedido é atualizado.

**Fluxo alternativo:**
1. O pagamento é rejeitado.
2. O sistema registra a falha.
3. O pedido recebe o status correspondente.

---

### UC09 - Atualizar status do pedido

**Atores:** Administrador, Gerente ou Atendente

**Objetivo:** Atualizar o estágio atual do pedido.

Possíveis estados:

- CRIADO
- AGUARDANDO_PAGAMENTO
- PAGO
- EM_PREPARO
- PRONTO
- FINALIZADO
- CANCELADO

As transições deverão respeitar as regras de negócio definidas pela aplicação.

---

### UC10 - Consultar pedidos

**Atores:** Administrador, Gerente, Atendente e Cliente

**Objetivo:** Permitir a consulta dos pedidos.

O Cliente deverá visualizar apenas os pedidos aos quais possui acesso, enquanto perfis administrativos poderão possuir consultas mais amplas.

---

### UC11 - Registrar fidelização

**Ator:** Sistema

**Objetivo:** Registrar informações relacionadas à fidelização após operações elegíveis.

Exemplo:
Após a conclusão de um pedido, o cliente poderá receber pontos de fidelidade.

---

### UC12 - Registrar auditoria

**Ator:** Sistema

**Objetivo:** Registrar automaticamente operações sensíveis.

Exemplos:
- movimentação de estoque;
- criação de pedido;
- cancelamento;
- alteração de status;
- pagamento.

O registro deverá permitir identificar, quando aplicável:
- usuário;
- ação;
- recurso afetado;
- data e hora.