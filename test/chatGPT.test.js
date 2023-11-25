// test/textAnalysis.test.js
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { splitTextIntoChunks, cleanAndFormatResponse, createContentInstruction } from '../src/services/chatGPT.mjs';

// Instrução padrão para criação de conteúdo
const defaultInstruction = 'O texto precisará ser enviado em partes, portanto, tente trabalhá-lo como um documento contínuo e seja breve. Identifique inconsistências e erros no texto, analise seu conteúdo, linguagem, clareza e fluidez.';

describe('ChatGPT Service', () => {
  describe('splitTextIntoChunks', () => {
    // Teste para verificar se o texto é dividido em partes com base no número máximo de tokens
    it('should split text into chunks based on maxTokens', () => {
      const text = 'This is a sample text for testing splitTextIntoChunks function.';
      const maxTokens = 10;

      const result = splitTextIntoChunks(text, maxTokens);

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf.at.least(1);

      result.forEach(chunk => {
        const tokens = chunk.split(' ').filter(Boolean).length;
        expect(tokens).to.be.at.most(maxTokens);
      });

      const joinedResult = result.join(' ');
      expect(joinedResult).to.equal(text);
    });

    // Teste para verificar se a função lida corretamente com um texto vazio
    it('should handle an empty text', () => {
      const text = '';
      const maxTokens = 10;

      const result = splitTextIntoChunks(text, maxTokens);

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(0);
    });

        // Teste para verificar se a função lida corretamente com espaços em branco extras

    it('should handle text with extra whitespaces', () => {
      const text = 'This   is    a sample text   with extra whitespaces.';
      const maxTokens = 5;

      const result = splitTextIntoChunks(text, maxTokens);

      expect(result).to.not.match(/\s{2,}/);
    });

    // Teste para verificar se a função lida corretamente com pontuações e caracteres especiais
    it('should handle text with punctuations and special characters', () => {
      const text = 'This, is a sample text with punctuations! How are you doing?';
      const maxTokens = 5;
    
      const result = splitTextIntoChunks(text, maxTokens);
    
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf.at.least(1);
    
      result.forEach(chunk => {
        const tokens = chunk.split(' ').filter(Boolean).length;
        expect(tokens).to.be.at.most(maxTokens);
      });
    
      const joinedResult = result.join(' ');
      expect(joinedResult).to.equal(text);
    });    
  });

  describe('cleanAndFormatResponse', () => {
    // Teste para verificar se a função remove corretamente o identificador de parte
    it('should remove the part identifier', () => {
      const input = '[Parte 1] Esta é a resposta';
      const output = cleanAndFormatResponse(input);
      expect(output.trim()).to.equal('Esta é a resposta');
    });
  
    // Teste para verificar se a função remove corretamente colchetes iniciais
    it('should remove leading brackets', () => {
      const input = '["Esta é a resposta"';
      const output = cleanAndFormatResponse(input);
      expect(output.trim()).to.equal('Esta é a resposta');
    });
  
    // Teste para verificar se a função remove tanto o identificador de parte quanto colchetes iniciais
    it('should remove both part identifier and leading brackets', () => {
      const input = '[Parte 1] ["Esta é a resposta"';
      const output = cleanAndFormatResponse(input);
      expect(output.trim()).to.equal('Esta é a resposta');
    });
  
    // Teste para verificar se a função mantém a resposta inalterada se não houver identificador ou colchetes
    it('should keep the response unchanged if no identifier or brackets', () => {
      const input = 'Esta é a resposta';
      const output = cleanAndFormatResponse(input);
      expect(output.trim()).to.equal('Esta é a resposta');
    });
  });

  describe('createContentInstruction', () => {
    // Teste para verificar se a função cria uma instrução com validação de resumo
    it('should create instruction with summary validation', () => {
      const options = {
        validateSummary: true,
        findKeywords: false,
        improvementSuggestions: false,
      };

      const result = createContentInstruction(defaultInstruction, options);

      expect(result).to.include('Inclua um resumo do texto.');
      expect(result).to.not.include('Encontre as palavras-chave no texto.');
      expect(result).to.not.include('Sugira melhorias no texto.');
    });

    // Teste para verificar se a função cria uma instrução com busca de palavras-chave
    it('should create instruction with keyword finding', () => {
      const options = {
        validateSummary: false,
        findKeywords: true,
        improvementSuggestions: false,
      };

      const result = createContentInstruction(defaultInstruction, options);

      expect(result).to.not.include('Inclua um resumo do texto.');
      expect(result).to.include('Encontre as palavras-chave no texto.');
      expect(result).to.not.include('Sugira melhorias no texto.');
    });

    // Teste para verificar se a função cria uma instrução com sugestões de melhoria
    it('should create instruction with improvement suggestions', () => {
      const options = {
        validateSummary: false,
        findKeywords: false,
        improvementSuggestions: true,
      };

      const result = createContentInstruction(defaultInstruction, options);

      expect(result).to.not.include('Inclua um resumo do texto.');
      expect(result).to.not.include('Encontre as palavras-chave no texto.');
      expect(result).to.include('Sugira melhorias no texto.');
    });

    // Teste para verificar se a função cria uma instrução com todas as opções
    it('should create instruction with all options', () => {
      const options = {
        validateSummary: true,
        findKeywords: true,
        improvementSuggestions: true,
      };

      const result = createContentInstruction(defaultInstruction, options);

      expect(result).to.include('Inclua um resumo do texto.');
      expect(result).to.include('Encontre as palavras-chave no texto.');
      expect(result).to.include('Sugira melhorias no texto.');
    });
  });
});

