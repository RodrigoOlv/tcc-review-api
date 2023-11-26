# Plano de Testes - documentController.js
## Objetivo
Verificar o correto funcionamento do controlador de documentos (documentController.js) por meio da realização de testes de integração utilizando o framework Supertest.

## Testes

### 1. Processamento de Documento Válido
- **Descrição:** Verificar se o controlador processa corretamente um documento válido do Google Docs.
- **Procedimento:**
  - Enviar uma solicitação POST para /api/document com uma URL válida de um documento do Google Docs.
  - Verificar se a resposta tem status 200.

### 2. Processamento de Documento Inválido (URL Inválida)
- **Descrição:** Verificar se o controlador lida corretamente com uma solicitação contendo uma URL inválida.
- **Procedimento:**
  - Enviar uma solicitação POST para /api/document com uma URL inválida.
  - Verificar se a resposta tem status 400.
  - Verificar se o corpo da resposta contém uma propriedade error que inclui a mensagem 'URL inválida'.

### 3. Processamento de Documento - Validação de Resumo
- **Descrição:** Verificar se o controlador processa corretamente um documento quando a opção de validação de resumo está ativada.
- **Procedimento:**
  - Enviar uma solicitação POST para /api/document com uma URL válida de um documento do Google Docs e a opção validateSummary ativada.
  - Verificar se a resposta tem status 200.

### 4. Processamento de Documento - Sugestões de Melhoria
- **Descrição:** Verificar se o controlador processa corretamente um documento quando a opção de sugestões de melhoria está ativada.
- **Procedimento:**
  - Enviar uma solicitação POST para /api/document com uma URL válida de um documento do Google Docs e a opção improvementSuggestions   - ativada.
  - Verificar se a resposta tem status 200.

### 5. Conexão ao MongoDB
- **Descrição:** Verificar se a conexão ao MongoDB é estabelecida corretamente antes de executar os testes.
- **Procedimento:**
  - Executar todos os testes do conjunto.
  - Verificar se a conexão ao MongoDB foi estabelecida com sucesso antes dos testes.

### 6. Desconexão do MongoDB
- **Descrição:** Verificar se a desconexão do MongoDB é realizada corretamente após a conclusão de todos os testes.
- **Procedimento:**
  - Executar todos os testes do conjunto.
  - Verificar se a desconexão do MongoDB foi realizada com sucesso após os testes.