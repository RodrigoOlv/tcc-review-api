import express from 'express';
const router = express.Router();

import { processDocument } from '../controllers/documentController.js';

// Rota para processar documentos
router.post('/document', processDocument);

export default router;
