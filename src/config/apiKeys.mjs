// Importe a biblioteca dotenv para carregar variáveis de ambiente
import dotenv from 'dotenv';

// Carregue as variáveis de ambiente a partir do arquivo .env
dotenv.config();

/**
 * 
 * @returns chave de api do Open AI
 */
const getGPTApiKey = () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('A chave de API da OpenAI não está definida. Verifique o arquivo .env.');
  }

  return apiKey;
};

export { getGPTApiKey };
