const service = require('../service/avaliacaoService');

async function listar(req, res, next) { try { res.json(await service.listar()); } catch (e) { next(e); } }
async function buscarPorId(req, res, next) { try { const item = await service.buscarPorId(req.params.id); if (!item) return res.status(404).json({ erro: 'Avaliação não encontrada.' }); res.json(item); } catch (e) { next(e); } }
async function criar(req, res, next) { try { res.status(201).json(await service.criar(req.body)); } catch (e) { next(e); } }
async function atualizar(req, res, next) { try { const item = await service.atualizar(req.params.id, req.body); if (!item) return res.status(404).json({ erro: 'Avaliação não encontrada.' }); res.json(item); } catch (e) { next(e); } }
async function remover(req, res, next) { try { const item = await service.remover(req.params.id); if (!item) return res.status(404).json({ erro: 'Avaliação não encontrada.' }); res.json({ mensagem: 'Avaliação removida com sucesso.' }); } catch (e) { next(e); } }

module.exports = { listar, buscarPorId, criar, atualizar, remover };
