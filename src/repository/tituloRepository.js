const db = require('../config/db');

async function listar(filtros = {}) {
  const valores = [];
  const condicoes = [];

  if (filtros.tipo) {
    valores.push(filtros.tipo);
    condicoes.push(`tipo = $${valores.length}`);
  }

  if (filtros.genero) {
    valores.push(filtros.genero);
    condicoes.push(`genero = $${valores.length}`);
  }

  if (filtros.busca) {
    valores.push(`%${filtros.busca}%`);
    condicoes.push(`nome ILIKE $${valores.length}`);
  }

  const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';

  const { rows } = await db.query(`
    SELECT id_titulo, nome, genero, tipo, ano_lancamento, sinopse
    FROM public.titulo
    ${where}
    ORDER BY id_titulo;
  `, valores);

  return rows;
}

async function buscarPorId(id) {
  const { rows } = await db.query(`
    SELECT id_titulo, nome, genero, tipo, ano_lancamento, sinopse
    FROM public.titulo
    WHERE id_titulo = $1;
  `, [id]);
  return rows[0] || null;
}

async function criar({ nome, genero, tipo, ano_lancamento, sinopse }) {
  const { rows } = await db.query(`
    INSERT INTO public.titulo (nome, genero, tipo, ano_lancamento, sinopse)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_titulo, nome, genero, tipo, ano_lancamento, sinopse;
  `, [nome, genero, tipo, ano_lancamento, sinopse ?? null]);
  return rows[0];
}

async function atualizar(id, { nome, genero, tipo, ano_lancamento, sinopse }) {
  const { rows } = await db.query(`
    UPDATE public.titulo
    SET nome = $1, genero = $2, tipo = $3, ano_lancamento = $4, sinopse = $5
    WHERE id_titulo = $6
    RETURNING id_titulo, nome, genero, tipo, ano_lancamento, sinopse;
  `, [nome, genero, tipo, ano_lancamento, sinopse ?? null, id]);
  return rows[0] || null;
}

async function remover(id) {
  const { rows } = await db.query(`
    DELETE FROM public.titulo
    WHERE id_titulo = $1
    RETURNING id_titulo;
  `, [id]);
  return rows[0] || null;
}

async function listarAvaliacoes(idTitulo) {
  const { rows } = await db.query(`
    SELECT
      a.id_avaliacao,
      a.nota,
      a.comentario,
      a.data_avaliacao,
      u.id_usuario,
      u.nome AS usuario
    FROM public.avaliacao a
    INNER JOIN public.usuario u ON u.id_usuario = a.id_usuario
    WHERE a.id_titulo = $1
    ORDER BY a.id_avaliacao;
  `, [idTitulo]);
  return rows;
}

async function mediaAvaliacoes(idTitulo) {
  const { rows } = await db.query(`
    SELECT
      t.id_titulo,
      t.nome,
      COUNT(a.id_avaliacao)::int AS quantidade_avaliacoes,
      COALESCE(ROUND(AVG(a.nota)::numeric, 2), 0) AS media
    FROM public.titulo t
    LEFT JOIN public.avaliacao a ON a.id_titulo = t.id_titulo
    WHERE t.id_titulo = $1
    GROUP BY t.id_titulo, t.nome;
  `, [idTitulo]);
  return rows[0] || null;
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover,
  listarAvaliacoes,
  mediaAvaliacoes
};
