const path = require('path');

const controller = require('../controllers/controllers');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'home.html'));
  });

  app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'home.html'));
  });
  
  app.get('/cursos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'cursos.html'));
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'login.html'));
  });

  app.get('/PaginaPerfil', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'PaginaPerfil.html'));
  });
  
  app.get('/loja', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'loja.html'));
  });

  app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'register.html'));
  });

   app.get('/materiaModulo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'materiaModulo.html'));
  });

   app.get('/conteudocurso', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'conteudo-curso.html'));
  });


     app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'views', 'faq.html'));
  });

  app.get("/sessao", controller.verificarSessao);

  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  app.post('/cadastro', controller.criarUsuario);
  app.post('/login', controller.login);

  app.get('/itens', controller.getItensLoja);
  app.post('/loja/verificar-compra', controller.verificarComprado);
  app.post('/loja/comprar', controller.comprarItem);
  app.post('/equipar-avatar', controller.equiparAvatar);
  app.get("/avatar-equipado", controller.getAvatarEquipado);

  app.post('/registrar-progresso', controller.registrarProgresso);
  app.post('/verificar-progresso', controller.verificarProgresso);
  app.post('/obter-progresso-curso', controller.obterProgressoCurso);
  app.post('/responder-questionario', controller.responderQuestionario);
};