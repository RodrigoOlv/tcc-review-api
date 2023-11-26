# Plano de Testes - callOpenAI.test.js
## Objetivo
Verificar se o serviço `callOpenAI` funciona corretamente.

## Testes

### 1. Manuseio de Erros e Registro
- **Descrição:** O serviço deve lidar corretamente com erros da API e registrar os erros.
- **Procedimento:**
  - Configurar um stub para simular uma chamada que gera um erro.
  - Chamar `callOpenAI` com parâmetros válidos.
  - Verificar se a função lida corretamente com o erro e registra a mensagem de erro.

### 2. Envio de Parâmetros Corretos para a API OpenAI
- **Descrição:** O serviço deve enviar os parâmetros corretos para a API OpenAI.
- **Procedimento:**
  - Configurar um stub para simular uma chamada bem-sucedida da API.
  - Chamar `callOpenAI` com parâmetros válidos.
  - Verificar se a função utiliza os parâmetros corretos ao fazer a chamada à API.

### 3. Manuseio Correto da Resposta da API OpenAI
- **Descrição:** O serviço deve manipular corretamente a resposta da API OpenAI.
- **Procedimento:**
  - Configurar um stub para simular uma chamada bem-sucedida da API.
  - Chamar `callOpenAI` com parâmetros válidos.
  - Verificar se a função retorna corretamente a resposta da API.

### 4. Uso Correto da Chave de API da OpenAI
- **Descrição:** O serviço deve usar a chave de API correta ao chamar a API OpenAI.
- **Procedimento:**
  - Configurar um stub para simular uma chamada bem-sucedida da API.
  - Configurar uma chave de API fictícia para o teste.
  - Chamar `callOpenAI` com parâmetros válidos.
  - Verificar se a função inclui a chave de API correta no cabeçalho de autorização.


# Plano de Testes - chatGPT.test.js
## Objetivo
Verificar o correto funcionamento das funções do serviço ChatGPT, incluindo a divisão de texto em partes, formatação da resposta e criação de instruções de conteúdo.

## Testes
### 1. Função splitTextIntoChunks
- **Descrição:** Verificar se a função divide corretamente o texto em partes com base no número máximo de tokens.
- **Procedimento:**
  - Chamar a função splitTextIntoChunks com um texto de exemplo.
  - Verificar se o resultado é uma matriz de partes.
  - Garantir que cada parte não exceda o número máximo de tokens.
  - Garantir que a concatenação das partes seja igual ao texto original.

### 2. Função splitTextIntoChunks (Texto Vazio)
- **Descrição:** Verificar se a função lida corretamente com um texto vazio.
- **Procedimento:**
  - Chamar a função splitTextIntoChunks com um texto vazio.
  - Verificar se o resultado é uma matriz vazia.

### 3. Função splitTextIntoChunks (Espaços em Branco Extras)
- **Descrição:** Verificar se a função lida corretamente com espaços em branco extras no texto.
- **Procedimento:**
  - Chamar a função splitTextIntoChunks com um texto contendo espaços em branco extras.
  - Verificar se o resultado não contém espaços em branco consecutivos.

### 4. Função splitTextIntoChunks (Pontuações e Caracteres Especiais)
- **Descrição:** Verificar se a função lida corretamente com pontuações e caracteres especiais no texto.
- **Procedimento:**
  - Chamar a função splitTextIntoChunks com um texto contendo pontuações e caracteres especiais.
  - Verificar se o resultado não excede o número máximo de tokens.
  - Garantir que a concatenação das partes seja igual ao texto original.
### 5. Função cleanAndFormatResponse
- **Descrição:** Verificar se a função remove corretamente o identificador de parte e colchetes iniciais da resposta.
- **Procedimento:**
  - Chamar a função cleanAndFormatResponse com uma resposta contendo identificador de parte e colchetes iniciais.
  - Verificar se o resultado é a resposta formatada corretamente.

### 6. Função cleanAndFormatResponse (Sem Identificador ou Colchetes)
- **Descrição:** Verificar se a função mantém a resposta inalterada se não houver identificador de parte ou colchetes.
- **Procedimento:**
  - Chamar a função cleanAndFormatResponse com uma resposta sem identificador de parte ou colchetes.
  - Verificar se o resultado é a resposta original.

### 7. Função createContentInstruction (Validação de Resumo)
- **Descrição:** Verificar se a função cria uma instrução com validação de resumo.
- **Procedimento:**
  - Chamar a função createContentInstruction com a opção de validação de resumo ativada.
  - Verificar se a instrução contém a mensagem apropriada.

### 8. Função createContentInstruction (Busca de Palavras-Chave)
- **Descrição:** Verificar se a função cria uma instrução com busca de palavras-chave.
- **Procedimento:**
  - Chamar a função createContentInstruction com a opção de busca de palavras-chave ativada.
  - Verificar se a instrução contém a mensagem apropriada.

### 9. Função createContentInstruction (Sugestões de Melhoria)
- **Descrição:** Verificar se a função cria uma instrução com sugestões de melhoria.
- **Procedimento:**
  - Chamar a função createContentInstruction com a opção de sugestões de melhoria ativada.
  - Verificar se a instrução contém a mensagem apropriada.

### 10. Função createContentInstruction (Todas as Opções)
- **Descrição:** Verificar se a função cria uma instrução com todas as opções ativadas.
- **Procedimento:**
  - Chamar a função createContentInstruction com todas as opções ativadas.
  - Verificar se a instrução contém as mensagens apropriadas para cada opção.


# Plano de Testes - database.test.js

## Objetivo
Verificar se as operações de banco de dados relacionadas ao MongoDB funcionam corretamente.

## Testes
### 1. Conexão com o MongoDB
- **Descrição:** Verificar se a conexão com o MongoDB é estabelecida corretamente.
- **Procedimento:**
  - Chamar a função `connectToMongoDB`.
  - Verificar se a conexão é bem-sucedida sem erros.

### 2. Desconexão do MongoDB
 - **Descrição:** Verificar se a desconexão do MongoDB é realizada corretamente.
 - **Procedimento:**
  - Chamar a função `disconnectFromMongoDB` após a conexão.
  - Verificar se a desconexão é bem-sucedida sem erros.

### 3. Inserção de Dados no MongoDB
 - **Descrição:** Verificar se a inserção de dados no MongoDB é realizada corretamente.
 - **Procedimento:**
  - Inserir dados de teste no MongoDB usando uma função apropriada.
  - Verificar se os dados são inseridos corretamente e podem ser recuperados.

### 4. Recuperação de Dados do MongoDB
 - **Descrição:** Verificar se a recuperação de dados do MongoDB é realizada corretamente.
 - **Procedimento:**
  - Inserir dados de teste no MongoDB.
  - Recuperar os dados usando uma função apropriada.
  - Verificar se os dados recuperados correspondem aos dados inseridos.

### 5. Atualização de Dados no MongoDB
 - **Descrição:** Verificar se a atualização de dados no MongoDB é realizada corretamente.
 - **Procedimento:**
  - Inserir dados de teste no MongoDB.
  - Atualizar os dados usando uma função apropriada.
  - Verificar se os dados são atualizados corretamente.

### 6. Exclusão de Dados no MongoDB
 - **Descrição:** Verificar se a exclusão de dados no MongoDB é realizada corretamente.
 - **Procedimento:**
  - Inserir dados de teste no MongoDB.
  - Excluir os dados usando uma função apropriada.
  - Verificar se os dados são removidos corretamente.

### 7. Manipulação de Erros ao Conectar
 - **Descrição:** Verificar se o sistema lida corretamente com erros ao conectar ao MongoDB.
 - **Procedimento:**
  - Modificar temporariamente as credenciais ou informações de conexão para forçar um erro.
  - Chamar a função connectToMongoDB.
  - Verificar se o sistema trata o erro adequadamente.

### 8. Manipulação de Erros ao Desconectar
 - **Descrição:** Verificar se o sistema lida corretamente com erros ao desconectar do MongoDB.
 - **Procedimento:**
  - Desconectar do MongoDB.
  - Tentar desconectar novamente.
  - Verificar se o sistema trata o erro adequadamente.

### 9. Manipulação de Erros nas Operações de Banco de Dados
 - **Descrição:** Verificar se o sistema lida corretamente com erros durante operações no MongoDB.
 - **Procedimento:**
  - Executar uma operação no banco de dados que resulte em erro (por exemplo, atualização de um documento inexistente).
  - Verificar se o sistema trata o erro adequadamente.


# Plano de Testes - google.test.mjs
## Objetivo
Verificar o correto funcionamento das funções do serviço Google, incluindo a extração do ID do Google Docs a partir da URL e a extração de conteúdo de documentos.

## Testes

### 1. Função extractGoogleDocsId
- **Descrição:** Verificar se a função extrai corretamente o ID do Google Docs a partir da URL.
- **Procedimento:**
  - Chamar a função extractGoogleDocsId com uma URL válida de um documento do Google Docs.
  - Verificar se o ID extraído é o esperado.

### 2. Função extractGoogleDocsId (URL Inválida)
- **Descrição:** Verificar se a função retorna null para uma URL inválida do Google Docs.
- **Procedimento:**
  - Chamar a função extractGoogleDocsId com uma URL inválida do Google Docs.
  - Verificar se a função retorna null.

### 3. Função extractGoogleDocsId (Entrada Nula)
- **Descrição:** Verificar se a função retorna null para entrada nula.
- **Procedimento:**
  - Chamar a função extractGoogleDocsId com uma entrada nula.
  - Verificar se a função retorna null.

### 4. Função extractContentFromDocument
- **Descrição:** Verificar se a função extrai corretamente o conteúdo de um documento com conteúdo.
- **Procedimento:**
  - Criar um documento de exemplo com conteúdo (por exemplo, um parágrafo com texto).
  - Chamar a função extractContentFromDocument com o documento.
  - Verificar se o conteúdo extraído é o esperado.

### 5. Função extractContentFromDocument (Documento Sem Conteúdo)
- **Descrição:** Verificar se a função retorna uma string vazia para um documento sem conteúdo.
- **Procedimento:**
  - Criar um documento de exemplo sem conteúdo.
  - Chamar a função extractContentFromDocument com o documento.
  - Verificar se a função retorna uma string vazia.

### 6. Função extractContentFromDocument (Documento Nulo)
- **Descrição:** Verificar se a função retorna uma string vazia para um documento nulo.
- **Procedimento:**
  - Chamar a função extractContentFromDocument com um documento nulo.
  - Verificar se a função retorna uma string vazia.