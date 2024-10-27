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
  fetch('nav.html') // Carrega o conteúdo de navbar.html
      .then(response => response.text())
      .then(data => {
          document.getElementById('navbar').innerHTML = data;
          initNavFunctionality(); // Inicializa as funcionalidades após carregar a nav
          verificarLogin(); // Verifica o estado de login após a navbar ser carregada
      });
}

// Função para verificar o estado de login
function verificarLogin() {
  if(localStorage.getItem("nomeCadastrado") != null){
      document.getElementById("nomeUsuario").textContent = localStorage.getItem("nomeCadastrado");
  }

  if (localStorage.getItem("verificarLogin") === "true") {
      document.getElementById("botaoEntrarNav").style.display = "none";
      document.getElementById("botaoCadastrarNav").style.display = "none";
      
      document.getElementById("botaoSair").style.display = "inline"; // Deixa o botão de Logout visível
      nomeUsuario.hidden = false; // Deixa nome do usuário visível
      iconUsuario.hidden = false; // Deixa ícone do usuário visível
  } else {
      document.getElementById("botaoSair").style.display = "none"; 
      nomeUsuario.hidden = true; 
      iconUsuario.hidden = true;
  }
}

// Função relacionada à tela de Cadastro
function cadastrarUsuario(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  localStorage.setItem("nomeCadastrado", nome);
  localStorage.setItem("emailCadastrado", email);
  if (senha === confirmarSenha) {
      localStorage.setItem("senhaCadastrado", senha);
      window.location = "../pages/login.html";
  } else {
      document.getElementById('errormsg2').hidden = false;
  }
}

// Função relacionada à tela de Login
function loginUsuario(event) {
  event.preventDefault();
  const email = document.getElementById("email-login").value;
  const senha = document.getElementById("senha-login").value;

  const storedEmail = localStorage.getItem("emailCadastrado");
  const storedSenha = localStorage.getItem("senhaCadastrado");

  const errormsg = document.getElementById("errormsg");

  if (email === storedEmail && senha === storedSenha) {
      localStorage.setItem("verificarLogin", "true");
      window.location = "../pages/home.html";
  } else {
      errormsg.hidden = false;
  }
}

// Função para o botão de Sair (Logout)
function sairLogin(event) {
  event.preventDefault();
  localStorage.removeItem("verificarLogin");
  window.location.reload(); // Recarrega a página
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
