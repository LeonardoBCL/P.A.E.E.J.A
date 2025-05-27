//NÃO ESTÁ FUNCIONANDO ESSA FUNCTION
// Função para inicializar as funcionalidades da navegação
function initNavFunctionality() {
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  navLinks.forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault();
          const targetSection = document.querySelector(this.getAttribute('href'));
          if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth' });
          }
      });
  });
}

// Função para carregar a barra de navegação
function loadNavbar() {
  fetch('/views/nav.html') // Carrega o conteúdo de navbar.html
      .then(response => response.text())
      .then(data => {
          document.getElementById('navbar').innerHTML = data;
          initNavFunctionality(); // Inicializa as funcionalidades após carregar a nav
          verificarLogin(); // Verifica o estado de login após a navbar ser carregada
      });
}

// Redireciona para o topo da página inicial
function navegacaoLogo() {
  const path = window.location.pathname;

  if (path === "/") {
    window.location = '#section-home';
  } else if (path === "/cursos") {
    window.location = '/#section-home';
  }
}

// Redireciona para cursos com base no login
function navegacaoCursos() {
  const path = window.location.pathname;
  const logado = localStorage.getItem("usuarioLogado") === "true";

  if (path === "/" && logado) {
    window.location = '/cursos';
  } else if (path === "/cursos") {
    window.location = '#inicioCursos';
  } else if (path === "/" && !logado) {
    window.location = '#sectionCursos';
  }
}

// Redireciona para a Loja
function navegacaoLoja() {
  const path = window.location.pathname;
  const logado = localStorage.getItem("usuarioLogado") === "true";
  if (logado) {
    window.location = '/loja';
  } else{
    window.location = '/login';
  }
}

// Redireciona para a seção "Fale Conosco"
function navegacaoFale() {
  const path = window.location.pathname;

  if (path === "/") {
    window.location = '#faleConosco';
  } else if (path === "/cursos") {
    window.location = '/#faleConosco'; // Corrigido
  }
}


// Função para verificar o estado de login
async function verificarLogin() {
  try {
    const resposta = await fetch("/sessao");
    const dados = await resposta.json();
    const logado = localStorage.getItem("usuarioLogado") === "true";

    if (dados.logado || logado) {
      document.getElementById("nomeUsuario").textContent = dados.usuario.nome;
      document.getElementById("botaoEntrarNav").style.display = "none";
      document.getElementById("botaoCadastrarNav").style.display = "none";

      document.getElementById("botaoSair").style.display = "inline";
      nomeUsuario.hidden = false;
      iconUsuario.hidden = false;
    } else {
      document.getElementById("botaoSair").style.display = "none";
      nomeUsuario.hidden = true;
      iconUsuario.hidden = true;
    }
  } catch (erro) {
    console.error("Erro ao verificar login:", erro);
  }
}


// Função relacionada à tela de Cadastro
function cadastrarUsuario(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (senha === confirmarSenha) {
    fetch('/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha})
    });
    window.location.href = "/login";
  } else {
      document.getElementById('errormsg2').hidden = false;
      const limpa = document.getElementById("confirmarSenha");
      limpa.value = '';
      limpa.focus();
      
  }
}

async function loginUsuario(event) {
  event.preventDefault()

  const email = document.getElementById("email-login").value;
  const senha = document.getElementById("senha-login").value;

  const errormsg = document.getElementById("errormsg");

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const result = await response.json();

    if (response.ok && result.sucesso) {
      localStorage.setItem("usuarioLogado", "true");
      window.location.href = result.redirecionar;
    } else {
      // Mostra mensagem de erro se login falhar (ex: 401)
      errormsg.hidden = false;
      const limpa = document.getElementById('senha-login');
      limpa.value = '';
      limpa.focus();
    }
  } catch (error) {
    console.log(`ERRO: ${error}`);
  }
}


// Função para o botão de Sair (Logout)
function sairLogin(event) {
  event.preventDefault();
  localStorage.removeItem("usuarioLogado");
  window.location.href = '/logout'
}

// Função responsável pelo funcionamento do botão de revelar a senha do Login
function esconderOuRevelar() {
  let senha = document.getElementById('senha-login');
  const btnSenha = document.getElementById('btnRevelarSenha');

  if (senha.type === 'password') {
      senha.setAttribute('type', 'text');
      btnSenha.classList.replace('bi-eye', 'bi-eye-slash');
  } else {
      senha.setAttribute('type', 'password');
      btnSenha.classList.replace('bi-eye-slash', 'bi-eye');
  }
}

// Funções para revelar senhas do Registro
function esconderOuRevelar2() {
  let senhaRegister = document.getElementById('senha');
  const btnSenhaRegister = document.getElementById('btnRevelarSenhaRegister');

  if (senhaRegister.type === 'password') {
      senhaRegister.setAttribute('type', 'text');
      btnSenhaRegister.classList.replace('bi-eye', 'bi-eye-slash');
  } else {
      senhaRegister.setAttribute('type', 'password');
      btnSenhaRegister.classList.replace('bi-eye-slash', 'bi-eye');
  }
}

function esconderOuRevelar3() {
  let senhaRegister2 = document.getElementById('confirmarSenha');
  const btnSenhaRegister2 = document.getElementById('btnRevelarSenhaRegister2');

  if (senhaRegister2.type === 'password') {
      senhaRegister2.setAttribute('type', 'text');
      btnSenhaRegister2.classList.replace('bi-eye', 'bi-eye-slash');
  } else {
      senhaRegister2.setAttribute('type', 'password');
      btnSenhaRegister2.classList.replace('bi-eye-slash', 'bi-eye');
  }
}

// Executa a carga da navbar quando o DOM está completamente carregado
document.addEventListener("DOMContentLoaded", loadNavbar);
