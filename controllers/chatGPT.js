const axios = require('axios');
require('dotenv').config();

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

// Estado inicial do contexto
let conversationContext = [
  { role: 'system', content: 'Você é um assistente útil que analisa texto.' },
  { role: 'user', content: 'Início do texto a ser analisado:' },
];

const cleanAndFormatResponse = (response) => {
  // Remova o identificador da parte [Parte X] e os colchetes iniciais usando expressão regular
  const cleanedResponse = response.replace(/\[Parte \d+\]/g, '').replace(/^"|"$/g, '');

  return cleanedResponse;
};

const analyzeText = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const parts = splitTextIntoChunks(message, 2000);

    const getConversationContext = (partIndex) => {
      const context = [
        { role: 'system', content: 'Você é um assistente útil que analisa texto.' },
        { role: 'user', content: 'Faça uma breve análise do texto quanto ao conteúdo, ignore quaisquer partes que não possam ser analisadas. O texto precisará ser enviado em partes, portanto, tente trabalhá-lo como um documento contínuo.' },
        { role: 'user', content: `[Parte ${partIndex + 1}] ${parts[partIndex]}` },
        { role: 'user', content: partIndex === parts.length - 1 ? 'Está é a última parte do texto' : 'Continuação da análise:' },
      ];

      return context;
    };

    let conversationContext = getConversationContext(0);
    const assistantResponses = [];

    for (let i = 0; i < parts.length; i++) {
      const response = await axios.post(apiUrl, {
        messages: conversationContext,
        model: 'gpt-3.5-turbo',
        temperature: 0.5,
        max_tokens: 4000,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      const assistantMessage = response.data.choices[0].message.content;
      
      // Limpe e formate a resposta antes de armazená-la
      const formattedResponse = cleanAndFormatResponse(assistantMessage);

      assistantResponses.push(formattedResponse);

      // Atualize o contexto apenas se houver mais partes a serem processadas
      if (i < parts.length - 1) {
        conversationContext = [
          ...getConversationContext(i + 1),
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


const validateSummary = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(apiUrl, {
      messages: [
        { role: 'system', content: 'You are a helpful assistant that validates summaries.' },
        { role: 'user', content: `Verifique se a seção resumo foi preenchida e está alinhada com os tópicos discutidos no restante do artigo: ${message}` }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 400,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log('Erro ao realizar a análise de resumo:', error);
    throw error;
  }
};

const findKeywords = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(apiUrl, {
      messages: [
        { role: 'system', content: 'You are a helpful assistant that identifies keywords.' },
        { role: 'user', content: `Identifique os seis termos relevantes com maior ocorrência no seguinte texto: ${message}` }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 50,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log('Erro ao realizar a análise de palavras chave:', error);
    throw error;
  }
};

module.exports = { splitTextIntoChunks, analyzeText, validateSummary, findKeywords };
