import dotenv from 'dotenv';
import { callOpenAI } from './callOpenAI.mjs';

dotenv.config();

/**
 * Divide o texto em pedaços com base no número máximo de tokens.
 * @param {string} text - O texto a ser dividido.
 * @param {number} maxTokens - O número máximo de tokens por pedaço.
 * @returns {string[]} - Array de pedaços de texto.
 */
const splitTextIntoChunks = (text, maxTokens) => {
  const words = text.split(/\s+/).filter(Boolean);  // Quebra palavras corretamente
  const chunks = [];

  for (let i = 0; i < words.length; i += maxTokens) {
    const chunk = words.slice(i, i + maxTokens).join(' ');
    chunks.push(chunk);
  }

  return chunks;
};

/**
 * Limpa e formata a resposta removendo identificadores de parte [Parte X] e colchetes iniciais.
 *
 * @param {string} response - A resposta a ser limpa e formatada.
 * @returns {string} A resposta limpa e formatada.
 */
const cleanAndFormatResponse = (response) => {
  // Remova o identificador da parte [Parte X] e os colchetes iniciais usando expressão regular
  const cleanedResponse = response.replace(/^\[.*?\] /, '').replace(/^\[|\]$/g, '').replace(/^"|"$/g, '');

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

export { splitTextIntoChunks, analyzeText, cleanAndFormatResponse, createContentInstruction };
