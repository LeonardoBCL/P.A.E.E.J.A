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
    const avatar = await usuarioModel.buscarCapas();
    const temas = await usuarioModel.buscarTemas();
    res.json({ avatar, temas });
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

    const novoSaldo = await usuarioModel.buscarMoedas(usuarioId);
    req.session.usuario.moedas = novoSaldo.moedas;

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

async function equiparAvatar(req, res) {
  const { avatarId } = req.body;
  const usuarioId = req.session.usuario.id;

  if (!usuarioId) {
    return res.status(401).json({ sucesso: false, message: "Usuário não autenticado." });
  }

  try {
    const comprado = await usuarioModel.jaComprou(usuarioId, 'avatar', avatarId);

    if (!comprado) {
      return res.status(403).json({ sucesso: false, message: "Avatar não comprado." });
    }

    await usuarioModel.atualizarAvatar(usuarioId, avatarId);
    req.session.usuario.avatar_id = avatarId;

    res.json({ sucesso: true, avatarId });
  } catch (err) {
    console.error("Erro ao equipar avatar:", err);
    res.status(500).json({ sucesso: false, message: "Erro interno ao equipar avatar." });
  }
}

async function getAvatarEquipado(req, res) {
  if (!req.session.usuario || !req.session.usuario.id) {
    return res.status(401).json({ sucesso: false, message: "Usuário não autenticado" });
  }

  try {
    const usuario = await usuarioModel.buscarAvatarEquipado(req.session.usuario.id);
    return res.json({ sucesso: true, avatarId: usuario.avatar_id }); // Certifique-se que `avatar_id` vem do banco
  } catch (err) {
    console.error("Erro ao buscar avatar equipado:", err);
    return res.status(500).json({ sucesso: false, message: "Erro ao buscar avatar." });
  }
}

async function registrarProgresso(req, res){
  const { aulaId } = req.body;
  const usuarioId = req.session.usuario.id;

  try {
    const jaConcluiu = await usuarioModel.verificarProgresso(usuarioId, aulaId);

    if (!jaConcluiu) {
      await usuarioModel.registrarProgresso(usuarioId, aulaId);
      await usuarioModel.adicionarMoedas(usuarioId, 50);

      const novoSaldo = await usuarioModel.buscarMoedas(usuarioId);
      req.session.usuario.moedas = novoSaldo.moedas;
      return res.status(200).json({ 
        mensagem: 'Progresso salvo e moedas adicionadas.', 
        novoSaldo: novoSaldo.moedas 
      });
    }

    res.status(200).json({ mensagem: 'Progresso já registrado anteriormente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao registrar progresso.' });
  }
};

async function verificarProgresso(req, res) {
  const { aulaId } = req.body;
  const usuarioId = req.session.usuario.id;

  try {
    const jaConcluiu = await usuarioModel.verificarProgresso(usuarioId, aulaId);
    res.status(200).json({ jaConcluiu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao verificar progresso.' });
  }
};

module.exports = {
  criarUsuario,
  login,
  verificarSessao,
  getItensLoja,
  comprarItem,
  verificarComprado,
  equiparAvatar,
  getAvatarEquipado,
  registrarProgresso,
  verificarProgresso
};