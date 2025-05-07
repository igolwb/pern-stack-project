import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import produtoRoutes from './routes/produtoRoutes.js';      // Importa as rotas de produtos do arquivo produtoRoutes.js
import { sql } from '../config/db.js';                      // Importa a configuração do banco de dados do arquivo db.js
import { aj } from './lib/arcjet.js';

dotenv.config();                                            // Carrega as variáveis de ambiente do arquivo .env para process.env
                                                            // dotenv é um módulo que carrega variáveis de ambiente de um arquivo .env para process.env, permitindo o uso de variáveis de configuração em seu aplicativo.

const app = express();
const PORT = process.env.PORT;

app.use(express.json());                                    // middleware para analisar o body das requisições JSON
app.use(cors());                                            // middleware para habilitar CORS (Cross-Origin Resource Sharing), permitindo que o frontend acesse o backend em diferentes domínios.
app.use(helmet());                                          // helmet é um middleware de segurança que ajuda a proteger o seu app definindo vários cabeçalhos HTTP relacionados à segurança.
app.use(morgan('dev'));                                     // morgan é um middleware de logging que registra as requisições HTTP no console.

//aplicando o arcjet nas rotas
app.use(async (req,res, next) => {
  try {
    const decisao = await aj.protect(req, {
      requested: 1,
    });

    if (decisao.isDenied()) {
      if (decisao.reason.isRateLimit()) {
        res.status(429).json({ message: 'Limite de requisições excedido. Tente novamente mais tarde.' });
      } else if (decisao.reason.isBot()) {
        res.status(403).json({ message: 'Acesso de bot negado.' });
      } else {
        res.status(403).json({ message: 'Acesso negado.' });
      }
    }
    return next();
  } catch (error) {
    
  }
});

app.use('/api/produtos', produtoRoutes);                                                         // Rota de teste que responde com "Hello World!" quando acessada.

async function startdb() {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS produtos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      imagem VARCHAR(255) NOT NULL,
      preco DECIMAL(10, 2) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

    console.log('db conectada');
  }catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error); // Loga o erro caso a conexão falhe
  }
}

startdb().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`); // Loga a porta em que o servidor está rodando
  });
})