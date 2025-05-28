const usuarioModel = require('../models/models');

async function criarUsuario(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'É obrigatório o preenchimento de todos os campos !' });
  }

  try {
    const id = await usuarioModel.criarUsuario(nome, email, senha);
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', id });
  } catch (err) {
    console.error('Erro ao inserir usuário:', err);
    return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const usuario = await usuarioModel.buscarPorEmailSenha(email, senha);
    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });

    req.session.usuario = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      moedas: usuario.moedas
    };

    return res.json({ sucesso: true, redirecionar: '/' });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro no servidor' });
  }
}

async function verificarSessao(req, res) {
  if (!req.session.usuario || !req.session.usuario.email) {
    return res.json({ logado: false });
  }

  try {
    const nome = await usuarioModel.buscarNomeUsuario(req.session.usuario.email);
    res.json({ logado: true, usuario: req.session.usuario });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao procurar nome de usuário' });
  }
}

async function getItensLoja(req, res) {
  try {
    const capas = await usuarioModel.buscarCapas();
    const temas = await usuarioModel.buscarTemas();
    res.json({ capas, temas });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Erro ao buscar itens da loja." });
  }
}

async function comprarItem(req, res) {
  const { tipo, itemId } = req.body;

  if (!req.session.usuario || !req.session.usuario.id) {
    return res.json({ sucesso: false, message: "Usuário não autenticado." });
  }

  const usuarioId = req.session.usuario.id;

  try {
    const item = await usuarioModel.buscarPrecoItem(tipo, itemId);
    if (!item) {
      return res.json({ sucesso: false, message: "Item não encontrado." });
    }

    const usuario = await usuarioModel.buscarMoedas(usuarioId);
    if (!usuario || usuario.moedas < item.preco) {
      return res.json({ sucesso: false, message: "Moedas insuficientes." });
    }

    const comprado = await usuarioModel.jaComprou(usuarioId, tipo, itemId);
    if (comprado) {
      return res.json({ sucesso: false, message: "Item já comprado." });
    }

    await usuarioModel.descontarMoedas(usuarioId, item.preco);
    await usuarioModel.registrarCompra(usuarioId, tipo, itemId);

    return res.json({ sucesso: true, message: "Compra realizada com sucesso!" });
  } catch (err) {
    console.error("Erro ao realizar compra:", err);
    return res.json({ sucesso: false, message: "Erro ao realizar compra." });
  }
}

async function verificarComprado(req, res) {
  const { tipo, itemId } = req.body;

  if (!req.session.usuario || !req.session.usuario.id) {
    return res.json({ sucesso: false, comprado: false, message: "Usuário não autenticado." });
  }

  const usuarioId = req.session.usuario.id;

  try {
    const comprado = await usuarioModel.jaComprou(usuarioId, tipo, itemId);
    res.json({ sucesso: true, comprado });
  } catch (err) {
    console.error("Erro ao verificar compra:", err);
    res.json({ sucesso: false, comprado: false, message: "Erro ao verificar compra." });
  }
}


module.exports = {
  criarUsuario,
  login,
  verificarSessao,
  getItensLoja,
  comprarItem,
  verificarComprado
};