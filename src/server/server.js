const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const db = require('../config/db');

const PORT = Number(process.env.PORT) || 3000;

async function iniciar() {
  try {
    await db.query('SELECT 1');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao PostgreSQL. Confira o arquivo .env.');
    console.error(error.message);
    process.exit(1);
  }
}

iniciar();
