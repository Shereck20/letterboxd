const express = require('express');
const controller = require('../controller/usuarioController');
const router = express.Router();

router.post('/login', controller.login);
router.get('/usuarios', controller.listar);
router.get('/usuarios/:id', controller.buscarPorId);
router.post('/usuarios', controller.criar);
router.put('/usuarios/:id', controller.atualizar);
router.delete('/usuarios/:id', controller.remover);

module.exports = router;
