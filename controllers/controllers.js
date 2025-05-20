const usuarioModel = require('../models/models');

function criarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'É obrigatório o preenchimento de todos os campos !' });
  }

  usuarioModel.criarUsuario(nome, email, senha, (err, resultado) => {
    if (err) {
      console.error('Erro ao inserir usuário:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', id: resultado.insertId});
  });
}

function login(req, res) {

  const { email, senha } = req.body;

  usuarioModel.buscarPorEmailSenha(email, senha, (err, usuario) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

    // Salva os dados do usuário na sessão
    req.session.usuario = {
      id: usuario.id_usuario,
      email: usuario.email
    };

    return res.json({ sucesso: true, redirecionar: '/' });
  });
}

function verificarSessao(req, res) {
  if (!req.session.usuario || !req.session.usuario.email) {
    return res.json({ logado: false });
  }

  usuarioModel.buscarNomeUsuario(req.session.usuario.email, (err, nome) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao procurar nome de usuário' });
    }

    // Atualiza a sessão com o nome (se ainda não estiver salvo)
    req.session.usuario.nome = nome;

    res.json({ logado: true, usuario: req.session.usuario });
  });
}

module.exports = {
  criarUsuario,
  login,
  verificarSessao
}