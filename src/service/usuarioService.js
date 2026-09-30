const repository = require('../repository/usuarioRepository');

function validarId(id) {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) throw Object.assign(new Error('ID inválido.'), { status: 400 });
  return numero;
}

function validarDados(dados) {
  const { nome, email, senha } = dados;
  if (!nome || !email || !senha) throw Object.assign(new Error('nome, email e senha são obrigatórios.'), { status: 400 });
  if (String(nome).length > 90) throw Object.assign(new Error('O nome deve ter no máximo 90 caracteres.'), { status: 400 });
  if (String(email).length > 150 || !String(email).includes('@')) throw Object.assign(new Error('E-mail inválido.'), { status: 400 });
  return { nome: String(nome).trim(), email: String(email).trim().toLowerCase(), senha: String(senha) };
}

async function listar() { return repository.listar(); }
async function buscarPorId(id) { return repository.buscarPorId(validarId(id)); }
async function criar(dados) { return repository.criar(validarDados(dados)); }
async function atualizar(id, dados) { return repository.atualizar(validarId(id), validarDados(dados)); }
async function remover(id) { return repository.remover(validarId(id)); }
async function login(dados) {
  const { email, senha } = dados;
  if (!email || !senha) throw Object.assign(new Error('E-mail e senha são obrigatórios.'), { status: 400 });
  return repository.login(String(email).trim().toLowerCase(), String(senha));
}

module.exports = { listar, buscarPorId, criar, atualizar, remover, login };
