const express = require('express');
const controller = require('../controller/tituloController');
const router = express.Router();

router.get('/titulos', controller.listar);
router.get('/titulos/:id/avaliacoes', controller.listarAvaliacoes);
router.get('/titulos/:id/media', controller.media);
router.get('/titulos/:id', controller.buscarPorId);
router.post('/titulos', controller.criar);
router.put('/titulos/:id', controller.atualizar);
router.delete('/titulos/:id', controller.remover);

module.exports = router;
