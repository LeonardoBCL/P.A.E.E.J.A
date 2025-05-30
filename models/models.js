const db = require('../database');

async function criarUsuario(nome, email, senha) {
  const [result] = await db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha]);
  return result.insertId;
}

async function buscarPorEmailSenha(email, senha) {
  const [results] = await db.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
  if (results.length === 0) return null;
  return results[0];
}

async function buscarNomeUsuario(email) {
  const [results] = await db.query('SELECT nome FROM usuarios WHERE email = ?', [email]);
  if (results.length === 0) return null;
  return results[0].nome;
}

async function buscarCapas() {
  const [avatar] = await db.query("SELECT id, nome, preco FROM avatar");
  return avatar;
}

async function buscarPrecoItem(tipo, itemId) {
  const [rows] = await db.query("SELECT preco FROM avatar WHERE id = ?", [itemId]);
  return rows[0];
}

async function buscarMoedas(usuarioId) {
  const [[usuario]] = await db.query("SELECT moedas FROM usuarios WHERE id = ?", [usuarioId]);
  return usuario;
}

async function jaComprou(usuarioId, tipo, itemId) {
  const [rows] = await db.query(
    "SELECT * FROM personalizacoes_compradas WHERE usuario_id = ? AND tipo = ? AND item_id = ?",
    [usuarioId, tipo, itemId]
  );
  return rows.length > 0;
}

async function descontarMoedas(usuarioId, valor) {
  await db.query("UPDATE usuarios SET moedas = moedas - ? WHERE id = ?", [valor, usuarioId]);
}

async function registrarCompra(usuarioId, tipo, itemId) {
  await db.query(
    "INSERT INTO personalizacoes_compradas (usuario_id, tipo, item_id) VALUES (?, ?, ?)",
    [usuarioId, tipo, itemId]
  );
}

async function atualizarAvatar(usuarioId, avatarId) {
  const sql = 'UPDATE usuarios SET avatar_id = ? WHERE id = ?';
  await db.query(sql, [avatarId, usuarioId]);
}

async function buscarAvatarEquipado(usuarioId) {
  const [rows] = await db.query("SELECT avatar_id FROM usuarios WHERE id = ?", [usuarioId]);
  return rows[0];
}

module.exports = {
  criarUsuario,
  buscarPorEmailSenha,
  buscarNomeUsuario,
  buscarCapas,
  buscarPrecoItem,
  buscarMoedas,
  jaComprou,
  descontarMoedas,
  registrarCompra,
  atualizarAvatar,
  buscarAvatarEquipado
};