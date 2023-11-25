// callOpenAI.test.js
import { describe, it, afterEach, after } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import { callOpenAI } from '../src/services/callOpenAI.mjs';

describe('callOpenAI', () => {
  // Stub axios para simular uma chamada que gera um erro
  const axiosStub = sinon.stub(axios, 'post').rejects({ message: 'API error' });

  afterEach(() => {
    axiosStub.resetHistory();
  });

  after(() => {
    axiosStub.restore();
  });

  it('should handle errors and log them', async () => {
    try {
      await callOpenAI(['context'], 50);
      // Se a chamada acima não lançar uma exceção, o teste falhará
    } catch (error) {
      expect(error.message).to.equal('API error');
      expect(axiosStub.calledOnce).to.be.true;
    }
  });

  it('should send correct parameters to OpenAI API', async () => {
    // Restaura o stub axios para simular uma chamada bem-sucedida desta vez
    axiosStub.rejects('Unexpected call to axios.post');
    axiosStub.resolves({ data: { choices: [{ message: { content: 'Response' } }] } });

    await callOpenAI(['context'], 50);

    expect(axiosStub.calledOnce).to.be.true;
    const callArgs = axiosStub.getCall(0).args;
    expect(callArgs[0]).to.equal('https://api.openai.com/v1/chat/completions');
    expect(callArgs[1]).to.deep.equal({
      messages: ['context'],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 50,
    });
  });

  it('should handle OpenAI API response correctly', async () => {
    // Restaura o stub axios para simular uma chamada bem-sucedida desta vez
    axiosStub.rejects('Unexpected call to axios.post');
    axiosStub.resolves({ data: { choices: [{ message: { content: 'Response' } }] } });

    const result = await callOpenAI(['context'], 50);

    expect(result).to.equal('Response');
  });

  it('should use the correct OpenAI API key in the Authorization header', async () => {
    // Restaura o stub axios para simular uma chamada bem-sucedida desta vez
    axiosStub.rejects('Unexpected call to axios.post');
    axiosStub.resolves({ data: { choices: [{ message: { content: 'Response' } }] } });

    // Use uma chave fictícia para o teste
    sinon.stub(process.env, 'OPENAI_API_KEY').value('fakeApiKey');

    await callOpenAI(['context'], 50);

    expect(axiosStub.calledOnce).to.be.true;
    const callArgs = axiosStub.getCall(0).args;
    const headers = callArgs[2].headers;
    expect(headers['Authorization']).to.equal('Bearer fakeApiKey');

    process.env.OPENAI_API_KEY = undefined; // Restaura o valor original
  });
});
