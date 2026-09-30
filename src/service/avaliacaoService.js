const repository = require('../repository/avaliacaoRepository');

function idValido(id) {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) throw Object.assign(new Error('ID inválido.'), { status: 400 });
  return numero;
}

function validar(dados) {
  const nota = Number(dados.nota);
  const id_titulo = Number(dados.id_titulo);
  const id_usuario = Number(dados.id_usuario);

  if (!Number.isInteger(nota) || nota < 1 || nota > 5) throw Object.assign(new Error('A nota deve ser um número inteiro entre 1 e 5.'), { status: 400 });
  if (!Number.isInteger(id_titulo) || id_titulo <= 0 || !Number.isInteger(id_usuario) || id_usuario <= 0) throw Object.assign(new Error('id_titulo e id_usuario devem ser números inteiros positivos.'), { status: 400 });

  return { nota, comentario: dados.comentario ?? null, id_titulo, id_usuario };
}

async function listar() { return repository.listar(); }
async function buscarPorId(id) { return repository.buscarPorId(idValido(id)); }
async function criar(dados) { return repository.criar(validar(dados)); }
async function atualizar(id, dados) { return repository.atualizar(idValido(id), validar(dados)); }
async function remover(id) { return repository.remover(idValido(id)); }

module.exports = { listar, buscarPorId, criar, atualizar, remover };
