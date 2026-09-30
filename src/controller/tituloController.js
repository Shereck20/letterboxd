const service = require('../service/tituloService');

async function listar(req, res, next) { try { res.json(await service.listar(req.query)); } catch (e) { next(e); } }
async function buscarPorId(req, res, next) { try { const item = await service.buscarPorId(req.params.id); if (!item) return res.status(404).json({ erro: 'Título não encontrado.' }); res.json(item); } catch (e) { next(e); } }
async function criar(req, res, next) { try { res.status(201).json(await service.criar(req.body)); } catch (e) { next(e); } }
async function atualizar(req, res, next) { try { const item = await service.atualizar(req.params.id, req.body); if (!item) return res.status(404).json({ erro: 'Título não encontrado.' }); res.json(item); } catch (e) { next(e); } }
async function remover(req, res, next) { try { const item = await service.remover(req.params.id); if (!item) return res.status(404).json({ erro: 'Título não encontrado.' }); res.json({ mensagem: 'Título removido com sucesso.' }); } catch (e) { next(e); } }
async function listarAvaliacoes(req, res, next) { try { const titulo = await service.buscarPorId(req.params.id); if (!titulo) return res.status(404).json({ erro: 'Título não encontrado.' }); res.json(await service.listarAvaliacoes(req.params.id)); } catch (e) { next(e); } }
async function media(req, res, next) { try { const item = await service.mediaAvaliacoes(req.params.id); if (!item) return res.status(404).json({ erro: 'Título não encontrado.' }); res.json(item); } catch (e) { next(e); } }

module.exports = { listar, buscarPorId, criar, atualizar, remover, listarAvaliacoes, media };
