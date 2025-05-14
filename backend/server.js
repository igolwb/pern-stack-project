import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import quartosRoutes from './routes/quartosRoutes.js';
import clientesRoutes from './routes/clientesRoutes.js';
import reservasRoutes from './routes/reservasRoutes.js';

import { sql } from './config/db.js';

dotenv.config();                                            // Carrega as variáveis de ambiente do arquivo .env para process.env
                                                            // dotenv é um módulo que carrega variáveis de ambiente de um arquivo .env para process.env, permitindo o uso de variáveis de configuração em seu aplicativo.

const app = express();
const PORT = process.env.PORT;

app.use(express.json());                                    // middleware para analisar o body das requisições JSON
app.use(cors());                                            // middleware para habilitar CORS (Cross-Origin Resource Sharing), permitindo que o frontend acesse o backend em diferentes domínios.
app.use(helmet());                                          // helmet é um middleware de segurança que ajuda a proteger o seu app definindo vários cabeçalhos HTTP relacionados à segurança.
app.use(morgan('dev'));                                     // morgan é um middleware de logging que registra as requisições HTTP no console.

app.use('/api/quartos', quartosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/reservas', reservasRoutes);

async function startdb() {
  try {
    // Criação da tabela 'clientes'
    await sql`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        telefone VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL
      );
    `;

    // Criação da tabela 'quartos'
    await sql`
      CREATE TABLE IF NOT EXISTS quartos (
        id SERIAL PRIMARY KEY,
        imagem_url VARCHAR(255),
        nome VARCHAR(255) NOT NULL,
        descricao VARCHAR(255),
        preco DECIMAL(10,2) NOT NULL,
        quantidade INTEGER NOT NULL
      );
    `;

    // Criação da tabela 'reservas'
    await sql`
        CREATE TABLE reservas (
        id SERIAL PRIMARY KEY,
        quarto_id INTEGER REFERENCES quartos(id),
        cliente_id INTEGER REFERENCES clientes(id),
        hospedes INTEGER NOT NULL,
        inicio DATE NOT NULL,
        fim DATE NOT NULL
    );
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