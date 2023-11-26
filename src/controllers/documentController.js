import { connectToMongoDB, disconnectFromMongoDB } from '../config/database.js';
import { extractGoogleDocsId, getDocumentContent } from '../services/google.mjs';
import { analyzeText } from '../services/chatGPT.mjs';
import AnalysisModel from '../models/analysisModel.js';

export async function processDocument(req, res) {
  try {
    console.log('Recebendo requisição para processar documento...');

    // Conecte-se ao MongoDB
    connectToMongoDB();

    const url = req.body.url;
    const documentId = extractGoogleDocsId(url);
    const options = req.body.options;

    if (!documentId) {
      // Se não for possível extrair um ID válido do URL, retorne uma resposta adequada
      return res.status(400).send({ error: 'URL inválida' });
    }

    const content = await getDocumentContent(documentId);

    let analysis = null;

    const analysisAlreadyExists = await AnalysisModel.findOne({
      documentId: documentId,
      contentLength: content.length,
      options: options,
    });

    if (analysisAlreadyExists) {
      console.log('Análise retornada do banco de dados');

      res.status(200).json(JSON.parse(analysisAlreadyExists.analysis));
    } else {
      analysis = await analyzeText(content, options);

      const objToInsert = {
        analysis: typeof analysis !== 'string' ? JSON.stringify(analysis) : analysis,
        documentId: documentId,
        contentLength: content.length,
        options: {
          validateSummary: options.validateSummary,
          findKeywords: options.findKeywords,
          improvementSuggestions: options.improvementSuggestions,
        },
      };

      const analysisObject = new AnalysisModel(objToInsert);
      await analysisObject.save();

      console.log('Objeto salvo com sucesso no MongoDB');
      res.status(200).json(analysis);
    }
  } catch (err) {
    console.error(`Ocorreu um erro: ${err}`);

    // Modificado: Adicione detalhes do erro à resposta para fins de depuração
    res.status(500).send({ error: `Ocorreu um erro ao processar a solicitação. Detalhes: ${err.message}` });
  } finally {
    console.log('Finalizando processamento do documento...');
    // Certifique-se de desconectar do MongoDB após salvar
    disconnectFromMongoDB();
  }
}
