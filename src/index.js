import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerrar o aplicativo em caso de falha na conexão
  });

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
