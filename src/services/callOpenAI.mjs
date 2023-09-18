// callOpenAI.mjs

import axios from 'axios';
import { getGPTApiKey } from '../config/apiKeys.mjs';

export const callOpenAI = async (context, maxTokens) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = getGPTApiKey();

    const response = await axios.post(apiUrl, {
      messages: context,
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: maxTokens,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log('Error calling OpenAI:', error);
    throw error;
  }
};
