const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { getDocumentContent, extractGoogleDocsId } = require('./controllers/google');
const { splitTextIntoChunks, analyzeText, validateSummary, findKeywords } = require('./controllers/chatGPT');
const { validateReferences } = require('./referenceValidator'); // Importe a função

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/document', async (req, res) => {
  try {
    const url = req.body.url;
    const documentId = extractGoogleDocsId(url);
    const options = req.body.options;

    const content = await getDocumentContent(documentId);
    let summary = null;
    let keywords = null;
    let analysis = null;
    let missingReferences = null;
    
    analysis = await analyzeText(content);

    if (options.validateSummary) {
      summary = await validateSummary(content);
    }

    if (options.findKeywords) {
      keywords = await findKeywords(content);
    }

    if (options.checkReferences) {
      missingReferences = validateReferences(content); // Use a função do arquivo separado
    }
    
    const responseObj = {
      analysis: analysis,
      summary: summary,
      keywords: keywords,
      missingReferences: missingReferences,
    };

    res.send(responseObj);
  } catch (err) {
    console.log(`Ocorreu um erro: ${err}`);
    res.status(500).send(err);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});

