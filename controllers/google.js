const { google } = require('googleapis');
require('dotenv').config();

const authClient = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  scopes: ['https://www.googleapis.com/auth/documents'],
});

const extractGoogleDocsId = (url) => {
  const regex = /\/document\/d\/([a-zA-Z0-9-_]+)\/edit/i;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}

const getDocumentContent = async (documentId) => {
  const docs = google.docs({ version: 'v1', auth: authClient });

  try {
    const response = await docs.documents.get({
      documentId: documentId,
    });

    const document = response.data;

    let content = '';

    if (document.body.content) {
      for (const c of document.body.content) {
        if (c.paragraph) {
          for (const e of c.paragraph.elements) {
            if (e.textRun) {
              content += e.textRun.content;
            }
          }
        } else if (c.table) {
          for (const row of c.table.tableRows) {
            for (const cell of row.tableCells) {
              for (const e of cell.content) {
                if (e.paragraph) {
                  for (const el of e.paragraph.elements) {
                    if (el.textRun) {
                      content += el.textRun.content;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return content;
  } catch (err) {
    console.log('Erro ao obter o conteúdo do documento:', err);
    throw err;
  }
};

module.exports = { extractGoogleDocsId, getDocumentContent };
