import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const authClient = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  scopes: ['https://www.googleapis.com/auth/documents'],
});

const extractGoogleDocsId = (url) => {
  // Utilizando o operador de encadeamento opcional
  const match = url?.match(/\/document\/d\/([a-zA-Z0-9-_]+)\/edit/i);
  
  // Retorna o resultado da expressão, que será a correspondência ou null se não houver correspondência
  return match?.[1] || null;
};

const getDocumentContent = async (documentId) => {
  const docs = google.docs({ version: 'v1', auth: authClient });

  try {
    const response = await docs.documents.get({
      documentId: documentId,
    });

    const document = response.data;

    const content = extractContentFromDocument(document);

    return content;
  } catch (err) {
    console.log('Erro ao obter o conteúdo do documento:', err);
    throw err;
  }
};


const extractContentFromDocument = (document) => {
  let content = '';

  for (const c of document?.body?.content || []) {
    if (!c.paragraph) {
      continue;
    }

    for (const e of c.paragraph.elements) {
      if (!e.textRun) {
        continue;
      }

      content += e.textRun.content;
    }
  }

  return content;
};



export { extractGoogleDocsId, getDocumentContent, extractContentFromDocument };
