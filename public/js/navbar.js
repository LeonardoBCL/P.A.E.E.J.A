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
  } else{
    window.location = '/#section-home';
  }
}

// Redireciona para cursos com base no login
function navegacaoCursos() {
  const path = window.location.pathname;
  const logado = localStorage.getItem("usuarioLogado") === "true";

  if (path !== "/cursos" && logado) {
    window.location = '/cursos';
  } else if (path === "/" && !logado) {
    window.location = '#sectionCursos';
  } else{
    window.location = '#inicioCursos';
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
  } else{
    window.location = '/#faleConosco'; // Corrigido
  }
}


async function verificarLogin() {
  try {
    const resposta = await fetch("/sessao");
    const dados = await resposta.json();
    const logado = localStorage.getItem("usuarioLogado") === "true";

    if (dados.logado && logado) {
      document.getElementById("nomeUsuario").textContent = dados.usuario.nome;
      document.getElementById("paeeja-moeda-valor").textContent = dados.usuario.moedas; // ✅ Aqui foi corrigido

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

// Função para o botão de Sair (Logout)
function sairLogin(event) {
  event.preventDefault();
  localStorage.removeItem("usuarioLogado");
  window.location.href = '/logout'
}

// Executa a carga da navbar quando o DOM está completamente carregado
document.addEventListener("DOMContentLoaded", loadNavbar);