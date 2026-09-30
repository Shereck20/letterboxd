const db = require('../config/db');

async function listar() {
  const { rows } = await db.query(`
    SELECT
      a.id_avaliacao,
      a.nota,
      a.comentario,
      a.data_avaliacao,
      a.id_titulo,
      t.nome AS titulo,
      a.id_usuario,
      u.nome AS usuario
    FROM public.avaliacao a
    INNER JOIN public.titulo t ON t.id_titulo = a.id_titulo
    INNER JOIN public.usuario u ON u.id_usuario = a.id_usuario
    ORDER BY a.id_avaliacao;
  `);
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await db.query(`
    SELECT
      a.id_avaliacao,
      a.nota,
      a.comentario,
      a.data_avaliacao,
      a.id_titulo,
      t.nome AS titulo,
      a.id_usuario,
      u.nome AS usuario
    FROM public.avaliacao a
    INNER JOIN public.titulo t ON t.id_titulo = a.id_titulo
    INNER JOIN public.usuario u ON u.id_usuario = a.id_usuario
    WHERE a.id_avaliacao = $1;
  `, [id]);
  return rows[0] || null;
}

async function criar({ nota, comentario, id_titulo, id_usuario }) {
  const { rows } = await db.query(`
    INSERT INTO public.avaliacao (nota, comentario, id_titulo, id_usuario)
    VALUES ($1, $2, $3, $4)
    RETURNING id_avaliacao, nota, comentario, data_avaliacao, id_titulo, id_usuario;
  `, [nota, comentario ?? null, id_titulo, id_usuario]);
  return rows[0];
}

async function atualizar(id, { nota, comentario, id_titulo, id_usuario }) {
  const { rows } = await db.query(`
    UPDATE public.avaliacao
    SET nota = $1, comentario = $2, id_titulo = $3, id_usuario = $4
    WHERE id_avaliacao = $5
    RETURNING id_avaliacao, nota, comentario, data_avaliacao, id_titulo, id_usuario;
  `, [nota, comentario ?? null, id_titulo, id_usuario, id]);
  return rows[0] || null;
}

async function remover(id) {
  const { rows } = await db.query(`
    DELETE FROM public.avaliacao
    WHERE id_avaliacao = $1
    RETURNING id_avaliacao;
  `, [id]);
  return rows[0] || null;
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
