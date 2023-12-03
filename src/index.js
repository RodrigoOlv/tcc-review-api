import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rotas da API
app.use('/api', apiRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('API está funcionando.');
});

// Inicializar o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
