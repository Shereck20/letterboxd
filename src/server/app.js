const express = require('express');
const path = require('path');
const cors = require('cors');
const usuarioRoutes = require('../routes/usuarioRoutes');
const tituloRoutes = require('../routes/tituloRoutes');
const avaliacaoRoutes = require('../routes/avaliacaoRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.get('/api', (req, res) => {
  res.json({
    projeto: 'Letterboxd Backend',
    mensagem: 'API funcionando.',
    recursos: ['/api/usuarios', '/api/titulos', '/api/avaliacoes']
  });
});

app.use('/api', usuarioRoutes);
app.use('/api', tituloRoutes);
app.use('/api', avaliacaoRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === '23505') {
    return res.status(409).json({ erro: 'Registro duplicado. Verifique o e-mail ou se o usuário já avaliou este título.' });
  }
  if (error.code === '23503') {
    return res.status(400).json({ erro: 'Usuário ou título informado não existe.' });
  }
  if (error.code === '23514') {
    return res.status(400).json({ erro: 'Um dos valores não atende às regras do banco de dados.' });
  }

  return res.status(error.status || 500).json({
    erro: error.message || 'Erro interno do servidor.'
  });
});

module.exports = app;
