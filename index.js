import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose'; // Importe o mongoose aqui
import { getDocumentContent, extractGoogleDocsId } from './services/google.mjs';
import { analyzeText, validateSummary, findKeywords } from './services/chatGPT.mjs';
import { validateReferences } from  './referenceValidator.mjs';
import { connectToMongoDB, disconnectFromMongoDB } from './config/database.mjs';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Defina o esquema Mongoose fora da rota
const objectSchema = new mongoose.Schema({
  analysis: String,
  documentId: String,
  contentLength: Number,
  options: { validateSummary: Boolean, findKeywords: Boolean },
});

const ObjectModel = mongoose.model('Analysis', objectSchema); // Crie o modelo fora da rota

app.post('/document', async (req, res) => {
  try {
    // Conecte-se ao MongoDB
    const { client: connectedClient } = await connectToMongoDB();

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

    const objToInsert = {
      analysis: typeof analysis !== 'string' ? JSON.stringify(analysis) : analysis,
      documentId: documentId,
      contentLength: content.length,
      options: options
    };

    // Crie uma instância do modelo
    const analysisObject = new ObjectModel(objToInsert);

    // Salve o objeto no banco de dados
    await analysisObject.save();

    console.log('Objeto salvo com sucesso no MongoDB');
    res.status(200).json(responseObj);
  } catch (err) {
    console.log(`Ocorreu um erro: ${err}`);
    res.status(500).send(err);
  } finally {
    // Certifique-se de desconectar do MongoDB após salvar
    disconnectFromMongoDB();
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
