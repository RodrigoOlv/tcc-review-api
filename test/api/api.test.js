import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { processDocument } from '../../src/controllers/documentController.js';
import { connectToMongoDB, disconnectFromMongoDB } from '../../src/config/database.js';

const app = express();
app.use(express.json());

app.post('/api/document', processDocument);

describe('API Endpoint /document', () => {
  // Conectar ao MongoDB antes de todos os testes
  before(async () => {
    await connectToMongoDB();
  });

  it('should process a document', async () => {
    const response = await request(app)
      .post('/api/document')
      .send({
        url: 'https://docs.google.com/document/d/1Yn4u7l4bX061871yyVkNgkq6Y3qgvyX9GCkCrd3t3aY/edit',
        options: {
          validateSummary: true,
          findKeywords: false,
          improvementSuggestions: true,
        },
      });

    expect(response.status).to.equal(200);
  });

  it('should handle invalid URL', async () => {
    const response = await request(app)
      .post('/api/document')
      .send({
        url: 'invalid-url',
        options: {
          validateSummary: true,
          findKeywords: false,
          improvementSuggestions: true,
        },
      });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error').that.includes('URL inválida');
  });

  // Desconectar do MongoDB após todos os testes
  after(async () => {
    try {
      await disconnectFromMongoDB();
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    } finally {
      // Indique ao Mocha que o término foi concluído
      process.exit();
    }
  });
});
