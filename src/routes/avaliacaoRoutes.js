const express = require('express');
const controller = require('../controller/avaliacaoController');
const router = express.Router();

router.get('/avaliacoes', controller.listar);
router.get('/avaliacoes/:id', controller.buscarPorId);
router.post('/avaliacoes', controller.criar);
router.put('/avaliacoes/:id', controller.atualizar);
router.delete('/avaliacoes/:id', controller.remover);

module.exports = router;
