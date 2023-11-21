// test/google.test.mjs

// Importa as funções e métodos necessários do Mocha e Chai
import { describe, it } from 'mocha';
import { expect } from 'chai';

// Importa as funções do módulo de serviços do Google
import { extractGoogleDocsId, extractContentFromDocument } from '../src/services/google.mjs';

// Descreve o conjunto de testes para o serviço do Google
describe('Google Service', () => {
  // Descreve o conjunto de testes para a função extractGoogleDocsId
  describe('extractGoogleDocsId', () => {
    // Teste para verificar se a função extrai corretamente o ID do Google Docs a partir da URL
    it('should extract Google Docs ID from URL', () => {
      // URL de exemplo de um documento do Google Docs
      const url = 'https://docs.google.com/document/d/1OQWq6RyHofyymomkRaAHP_xA3LIToukeiTSSzQY-sHY/edit';
      // Chama a função e verifica se o ID extraído é o esperado
      const extractedId = extractGoogleDocsId(url);
      expect(extractedId).to.equal('1OQWq6RyHofyymomkRaAHP_xA3LIToukeiTSSzQY-sHY');
    });

    // Teste para verificar se a função retorna null para uma URL inválida
    it('should return null for invalid Google Docs URL', () => {
      // Simula uma URL inválida
      const url = 'https://example.com/not-a-google-docs-url';
      // Chama a função e verifica se ela retorna null para URLs inválidas
      const extractedId = extractGoogleDocsId(url);
      expect(extractedId).to.be.null;
    });

    // Teste para verificar se a função retorna null para entrada nula
    it('should return null for null input', () => {
      // Simula uma entrada nula
      const extractedId = extractGoogleDocsId(null);
      // Chama a função e verifica se ela retorna null para entradas nulas
      expect(extractedId).to.be.null;
    });
  });

  // Descreve o conjunto de testes para a função extractContentFromDocument
  describe('extractContentFromDocument', () => {
    // Teste para verificar se a função extrai corretamente o conteúdo de um documento com conteúdo
    it('should extract content from a document with content', () => {
      // Documento de exemplo com um parágrafo contendo 'Hello, World!'
      const document = {
        body: {
          content: [
            {
              paragraph: {
                elements: [
                  {
                    textRun: {
                      content: 'Hello, World!'
                    }
                  }
                ]
              }
            }
          ]
        }
      };
      // Chama a função e verifica se o conteúdo extraído é o esperado
      const content = extractContentFromDocument(document);
      expect(content).to.equal('Hello, World!');
    });

    // Teste para verificar se a função retorna uma string vazia para um documento sem conteúdo
    it('should return an empty string for a document without content', () => {
      // Documento de exemplo sem conteúdo
      const document = {
        body: {
          content: []
        }
      };
      // Chama a função e verifica se ela retorna uma string vazia para documentos sem conteúdo
      const content = extractContentFromDocument(document);
      expect(content).to.equal('');
    });

    // Teste para verificar se a função retorna uma string vazia para um documento nulo
    it('should return an empty string for a null document', () => {
      // Chama a função com um documento nulo e verifica se ela retorna uma string vazia
      const content = extractContentFromDocument(null);
      expect(content).to.equal('');
    });
  });
});
