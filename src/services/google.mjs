import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const authClient = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  scopes: ['https://www.googleapis.com/auth/documents'],
});

const extractGoogleDocsId = (url) => {
  const regex = /\/document\/d\/([a-zA-Z0-9-_]+)\/edit/i;
  const match = url.match(regex);
  if (match[1]) {
    return match[1];
  } else {
    return null;
  }
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

  for (const c of document.body?.content || []) {
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



export { extractGoogleDocsId, getDocumentContent };
