// database.test.js
import mongoose from 'mongoose';
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { connectToMongoDB, disconnectFromMongoDB } from '../src/config/database.mjs';
import { AnalysisModel } from '../src/models/analysisModel.js';

/**
 * Testes para a conexão e desconexão com o MongoDB.
 */
describe('MongoDB Connection', () => {
  let client;

  /**
   * Configuração: Conecta ao MongoDB antes de executar os testes.
   */
  before(async function () {
    // Aumentei o timeout para 5000ms para dar mais tempo à conexão
    this.timeout(5000);

    try {
      client = await connectToMongoDB();
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  });

  /**
   * Limpeza: Desconecta do MongoDB após a execução dos testes.
   */
  after(async () => {
    await disconnectFromMongoDB();
  });

  /**
   * Teste: Deve conectar ao MongoDB com sucesso.
   */
  it('should connect to MongoDB', () => {
    // Testa se a conexão foi estabelecida com sucesso
    expect(client).to.have.property('client');
  });

  /**
   * Teste: Deve desconectar do MongoDB com sucesso.
   */
  it('should disconnect from MongoDB', async () => {
    // Obtém o número inicial de conexões ativas
    const initialConnectionCount = Object.keys(mongoose.connections).length;

    // Realiza uma operação que resultaria em uma nova conexão
    await AnalysisModel.find({});

    // Desconecta do MongoDB de forma assíncrona
    await disconnectFromMongoDB();

    // Adiciona um atraso para garantir que a desconexão seja tratada assincronamente
    await new Promise(resolve => setTimeout(resolve, 100));

    // Obtém o número final de conexões ativas após a desconexão
    const finalConnectionCount = Object.keys(mongoose.connections).length;

    // Verifica se o número de conexões é o mesmo que o inicial, indicando que a desconexão foi bem-sucedida
    expect(finalConnectionCount).to.equal(initialConnectionCount);
  });
});
