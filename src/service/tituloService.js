const repository = require('../repository/tituloRepository');

function idValido(id) {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) throw Object.assign(new Error('ID inválido.'), { status: 400 });
  return numero;
}

function validar(dados) {
  const { nome, genero, tipo, ano_lancamento } = dados;
  if (!nome || !genero || !tipo || ano_lancamento === undefined) {
    throw Object.assign(new Error('nome, genero, tipo e ano_lancamento são obrigatórios.'), { status: 400 });
  }
  if (!['Filme', 'Serie'].includes(tipo)) throw Object.assign(new Error('tipo deve ser Filme ou Serie.'), { status: 400 });
  const ano = Number(ano_lancamento);
  if (!Number.isInteger(ano) || ano < 1888) throw Object.assign(new Error('ano_lancamento inválido.'), { status: 400 });
  return { nome: String(nome).trim(), genero: String(genero).trim(), tipo, ano_lancamento: ano, sinopse: dados.sinopse ?? null };
}

async function listar(filtros) { return repository.listar(filtros); }
async function buscarPorId(id) { return repository.buscarPorId(idValido(id)); }
async function criar(dados) { return repository.criar(validar(dados)); }
async function atualizar(id, dados) { return repository.atualizar(idValido(id), validar(dados)); }
async function remover(id) { return repository.remover(idValido(id)); }
async function listarAvaliacoes(id) { return repository.listarAvaliacoes(idValido(id)); }
async function mediaAvaliacoes(id) { return repository.mediaAvaliacoes(idValido(id)); }

module.exports = { listar, buscarPorId, criar, atualizar, remover, listarAvaliacoes, mediaAvaliacoes };
