import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Função para obter a URL do MongoDB a partir das variáveis de ambiente
 * @returns Verifique se a variável de ambiente MONGODB_URL está definida
 */
function getMongoDBURL() {
  const url = process.env.MONGODB_URL;
  
  if (!url) {
    throw new Error('A variável de ambiente MONGODB_URL não está definida no arquivo .env');
  }
  
  return url;
}

// URL de conexão com o MongoDB
const url = getMongoDBURL();

// Nome do banco de dados
const dbName = 'tcc_review';

/**
 * Função para conectar ao MongoDB usando Mongoose
 * @returns Retorna o cliente (conexão Mongoose)
 */
async function connectToMongoDB() {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado ao MongoDB');

    return { client: mongoose.connection };
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

/**
 * Função para desconectar do MongoDB
 */
function disconnectFromMongoDB() {
  mongoose.disconnect();
  console.log('Desconectado do MongoDB');
}

export { connectToMongoDB, disconnectFromMongoDB };
