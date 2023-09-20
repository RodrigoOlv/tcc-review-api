import { AnalysisModel } from '../models/analysisModel.js';
import { connectToMongoDB, disconnectFromMongoDB } from '../config/database.mjs';
import { getDocumentContent, extractGoogleDocsId } from '../services/google.mjs';
import { analyzeText } from '../services/chatGPT.mjs';

export async function processDocument(req, res) {
  try {
    // Conecte-se ao MongoDB
    connectToMongoDB();

    const url = req.body.url;
    const documentId = extractGoogleDocsId(url);
    const options = req.body.options;

    const content = await getDocumentContent(documentId);

    let analysis = null;

    const analysisAlreadyExists = await AnalysisModel.findOne({
      documentId: documentId,
      contentLength: content.length,
      options: options,
    });

    if (analysisAlreadyExists) {
      console.log('Análise retornada do banco de dados');
      res.status(200).json(analysisAlreadyExists.analysis);
    } else {
      analysis = await analyzeText(content, options);

      const objToInsert = {
        analysis: typeof analysis !== 'string' ? JSON.stringify(analysis) : analysis,
        documentId: documentId,
        contentLength: content.length,
        options: {
          validateSummary: options.validateSummary,
          findKeywords: options.findKeywords,
          checkReferences: options.checkReferences
        },
      };

      const analysisObject = new AnalysisModel(objToInsert);
      await analysisObject.save();

      console.log('Objeto salvo com sucesso no MongoDB');
      res.status(200).json(analysis);
    }
  } catch (err) {
    console.log(`Ocorreu um erro: ${err}`);
    res.status(500).send({ error: 'Ocorreu um erro ao processar a solicitação.' });
  } finally {
    // Certifique-se de desconectar do MongoDB após salvar
    disconnectFromMongoDB();
  }
}
