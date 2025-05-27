const db = require('../database');

function criarUsuario(nome, email, senha, callback) {
  const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  db.query(query, [nome, email, senha], callback);
}

function buscarPorEmailSenha(email, senha, callback) {
  const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  db.query(sql, [email, senha], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]); 
  });
}

function buscarNomeUsuario(email, callback) {
  const sql = 'SELECT nome FROM usuarios WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0].nome); // Retorna só o nome
  });
}

module.exports = {
    criarUsuario,
    buscarPorEmailSenha,
    buscarNomeUsuario
};