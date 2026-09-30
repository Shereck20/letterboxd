const db = require('../config/db');

async function listar() {
  const { rows } = await db.query(`
    SELECT id_usuario, nome, email, data_cadastro
    FROM public.usuario
    ORDER BY id_usuario;
  `);
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await db.query(`
    SELECT id_usuario, nome, email, data_cadastro
    FROM public.usuario
    WHERE id_usuario = $1;
  `, [id]);
  return rows[0] || null;
}

async function criar({ nome, email, senha }) {
  const { rows } = await db.query(`
    INSERT INTO public.usuario (nome, email, senha)
    VALUES ($1, $2, $3)
    RETURNING id_usuario, nome, email, data_cadastro;
  `, [nome, email, senha]);
  return rows[0];
}

async function atualizar(id, { nome, email, senha }) {
  const { rows } = await db.query(`
    UPDATE public.usuario
    SET nome = $1, email = $2, senha = $3
    WHERE id_usuario = $4
    RETURNING id_usuario, nome, email, data_cadastro;
  `, [nome, email, senha, id]);
  return rows[0] || null;
}

async function remover(id) {
  const { rows } = await db.query(`
    DELETE FROM public.usuario
    WHERE id_usuario = $1
    RETURNING id_usuario;
  `, [id]);
  return rows[0] || null;
}


async function login(email, senha) {
  const { rows } = await db.query(`
    SELECT id_usuario, nome, email, data_cadastro
    FROM public.usuario
    WHERE LOWER(email) = LOWER($1) AND senha = $2;
  `, [email, senha]);
  return rows[0] || null;
}

module.exports = { listar, buscarPorId, criar, atualizar, remover, login };
