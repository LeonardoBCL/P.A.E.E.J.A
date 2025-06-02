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

async function verificarProgresso(usuarioId, aulaId) {
  const [rows] = await db.execute(
    'SELECT * FROM progresso_usuario WHERE usuario_id = ? AND aula_id = ?',
    [usuarioId, aulaId]
  );
  return rows.length > 0;
};

async function registrarProgresso(usuarioId, aulaId) {
  await db.execute(
    'INSERT INTO progresso_usuario (usuario_id, aula_id, concluido) VALUES (?, ?, ?)',
    [usuarioId, aulaId, true]
  );
};

async function adicionarMoedas(usuarioId, quantidade) {
  await db.execute(
    'UPDATE usuarios SET moedas = moedas + ? WHERE id = ?',
    [quantidade, usuarioId]
  );
};

// Total de aulas no curso
async function contarTotalAulas() {
  const [rows] = await db.execute('SELECT COUNT(*) AS total FROM aulas');
  return rows[0].total;
}

// Total de exercícios (questionários) no curso
async function contarTotalExercicios() {
  const [rows] = await db.execute('SELECT COUNT(*) AS total FROM questionarios');
  return rows[0].total;
}

// Aulas concluídas pelo usuário
async function contarAulasConcluidas(usuarioId) {
  const [rows] = await db.execute(
    'SELECT COUNT(*) AS total FROM progresso_usuario WHERE usuario_id = ? AND concluido = 1',
    [usuarioId]
  );
  return rows[0].total;
}

// Exercícios feitos pelo usuário (ao menos 1 resposta em qualquer questão daquele questionário)
async function contarExerciciosFeitos(usuarioId) {
  const [rows] = await db.execute(`
    SELECT COUNT(DISTINCT q.questionario_id) AS total
    FROM respostas_usuario r
    JOIN questoes q ON r.questao_id = q.id
    WHERE r.usuario_id = ?
  `, [usuarioId]);
  return rows[0].total;
}

async function obterQuestoesDoQuestionario(questionarioId) {
  const [rows] = await db.execute(
    'SELECT * FROM questoes WHERE questionario_id = ? ORDER BY id',
    [questionarioId]
  );
  return rows;
}

async function salvarRespostas(usuarioId, respostas) {
  for (const { questao_id, resposta, correta } of respostas) {
    await db.execute(
      'REPLACE INTO respostas_usuario (usuario_id, questao_id, resposta, correta) VALUES (?, ?, ?, ?)',
      [usuarioId, questao_id, resposta, correta]
    );
  }
}

async function contarAcertos(usuarioId, questionarioId) {
  const [rows] = await db.execute(
    `SELECT COUNT(*) AS acertos FROM respostas_usuario r
       JOIN questoes q ON r.questao_id = q.id
       WHERE r.usuario_id = ? AND r.correta = 1 AND q.questionario_id = ?`,
    [usuarioId, questionarioId]
  );
  return rows[0].acertos;
}

async function verificarSeJaRespondeu(usuarioId, questionarioId) {
  const [rows] = await db.execute(
    `SELECT 1 FROM respostas_usuario r
       JOIN questoes q ON r.questao_id = q.id
       WHERE r.usuario_id = ? AND q.questionario_id = ? LIMIT 1`,
    [usuarioId, questionarioId]
  );
  return rows.length > 0;
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
  buscarAvatarEquipado,
  verificarProgresso,
  registrarProgresso,
  adicionarMoedas,
  contarTotalAulas,
  contarTotalExercicios,
  contarAulasConcluidas,
  contarExerciciosFeitos,
  obterQuestoesDoQuestionario,
  salvarRespostas,
  contarAcertos,
  verificarSeJaRespondeu
};