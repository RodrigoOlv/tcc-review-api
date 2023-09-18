import { AnalysisModel } from '../models/analysisModel.js';
import { connectToMongoDB, disconnectFromMongoDB } from '../config/database.mjs';
import { getDocumentContent, extractGoogleDocsId } from '../services/google.mjs';
import { analyzeText, validateSummary, findKeywords } from '../services/chatGPT.mjs';
import { validateReferences } from '../referenceValidator.mjs';

export async function processDocument(req, res) {
  try {
    // Conecte-se ao MongoDB
    await connectToMongoDB();

    const url = req.body.url;
    const documentId = extractGoogleDocsId(url);
    const options = req.body.options;

    const content = await getDocumentContent(documentId);
    let summary = null;
    let keywords = null;
    let analysis = null;
    let missingReferences = null;

    const analysisAlreadyExists = await AnalysisModel.findOne({
      documentId: documentId,
      contentLength: content.length,
      options: options,
    });

    console.log('Buscando no banco de dados:', analysisAlreadyExists);

    if (analysisAlreadyExists) {
      console.log('Análise retornada do banco de dados');
      res.status(200).json(analysisAlreadyExists);
    } else {
      analysis = await analyzeText(content);

      if (options.validateSummary) {
        summary = await validateSummary(content);
      }

      if (options.findKeywords) {
        keywords = await findKeywords(content);
      }

      if (options.checkReferences) {
        missingReferences = validateReferences(content);
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
        options: options,
      };

      const analysisObject = new AnalysisModel(objToInsert);
      await analysisObject.save();

      console.log('Objeto salvo com sucesso no MongoDB');
      res.status(200).json(responseObj);
    }
  } catch (err) {
    console.log(`Ocorreu um erro: ${err}`);
    res.status(500).send({ error: 'Ocorreu um erro ao processar a solicitação.' });
  } finally {
    // Certifique-se de desconectar do MongoDB após salvar
    disconnectFromMongoDB();
  }
}
