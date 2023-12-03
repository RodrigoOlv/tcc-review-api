import dotenv from 'dotenv';
import { callOpenAI } from './callOpenAI.mjs';

dotenv.config();

// Função para dividir o texto em partes menores
const splitTextIntoChunks = (text, maxTokens) => {
  const chunks = [];
  const words = text.split(' ');
  let currentChunk = '';

  for (const word of words) {
    const wordTokens = word.split(' ').length;
    if ((currentChunk.length + wordTokens) <= maxTokens) {
      currentChunk += ` ${word}`;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = `${word}`;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

const cleanAndFormatResponse = (response) => {
  // Remova o identificador da parte [Parte X] e os colchetes iniciais usando expressão regular
  const cleanedResponse = response.replace(/\[Parte \d+\]/g, '').replace(/^"|"$/g, '');

  return cleanedResponse;
};

const defaultInstruction = 'O texto precisará ser enviado em partes, portanto, tente trabalhá-lo como um documento contínuo e seja breve. Identifique inconsistências e erros no texto, analise seu conteúdo, linguagem, clareza e fluidez.';

const analyzeText = async (content, options) => {
  try {
    const parts = splitTextIntoChunks(content, 1000);
    const assistantResponses = [];

    let conversationContext = [
      { role: 'system', content: 'Você é um assistente útil que analisa texto.' },
      { role: 'user', content: createContentInstruction(defaultInstruction, options) },
      { role: 'user', content: `[Parte 1] ${parts[0]}` },
      { role: 'user', content: 'Continuação da análise:' },
    ];

    for (let i = 0; i < parts.length; i++) {
      const assistantMessage = await callOpenAI(conversationContext, 2000);
      
      // Limpe e formate a resposta antes de armazená-la
      const formattedResponse = cleanAndFormatResponse(assistantMessage);

      assistantResponses.push(formattedResponse);

      // Atualize o contexto apenas se houver mais partes a serem processadas
      if (i < parts.length - 1) {
        conversationContext = [
          ...conversationContext.slice(0, 3), // Mantenha as três primeiras mensagens
          { role: 'assistant', content: assistantMessage },
        ];
      }
    }

    return assistantResponses;
  } catch (error) {
    console.log('Erro ao realizar a análise de texto:', error);
    throw error;
  }
};

function createContentInstruction(defaultInstruction, options) {
  let contentInstruction = defaultInstruction;

  if (options.validateSummary) {
    contentInstruction += ' Inclua um resumo do texto.';
  }

  if (options.findKeywords) {
    contentInstruction += ' Encontre as palavras-chave no texto.';
  }

  if (options.improvementSuggestions) {
    contentInstruction += ' Sugira melhorias no texto.';
  }

  console.log('Instrução: ', contentInstruction);

  return contentInstruction;
}

export { splitTextIntoChunks, analyzeText };
