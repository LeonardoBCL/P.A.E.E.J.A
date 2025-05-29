// Função para carregar a barra de navegação
function loadNavbar() {
  fetch('/views/nav.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar').innerHTML = data;
      verificarLogin(); // Verifica o estado de login após carregar a navbar
    })
    .catch(err => {
      console.error("Erro ao carregar navbar:", err);
    });
}

// Redireciona para o topo da página inicial
function navegacaoLogo() {
  const path = window.location.pathname;
  if (path === "/") {
    window.location = '#section-home';
  } else {
    window.location = '/#section-home';
  }
}

// Redireciona para cursos com base no login
async function navegacaoCursos() {
  const path = window.location.pathname;
  const logado = localStorage.getItem("usuarioLogado") === "true";
  const resposta = await fetch("/sessao");
  const dados = await resposta.json();

  if (dados.logado && path !== "/cursos" && logado) {
    window.location = '/cursos';
  } else if (path === "/" && !logado) {
    window.location = '#sectionCursos';
  } else {
    window.location = '/#sectionCursos';
  }
}

// Redireciona para a Loja
async function navegacaoLoja() {
  const resposta = await fetch("/sessao");
  const dados = await resposta.json();
  const logado = localStorage.getItem("usuarioLogado") === "true";

  if (dados.logado && logado) {
    window.location = '/loja';
  } else {
    window.location = '/login';
  }
}

// Redireciona para a seção "Fale Conosco"
function navegacaoFale() {
  const path = window.location.pathname;
  if (path === "/") {
    window.location = '#faleConosco';
  } else {
    window.location = '/#faleConosco';
  }
}

// Redireciona para a página de perfil
function navegacaoPerfil() {
  window.location = '/PaginaPerfil';
}

// Verifica se o usuário está logado e ajusta a navbar
async function verificarLogin() {
  try {
    const resposta = await fetch("/sessao");
    const dados = await resposta.json();
    const logado = localStorage.getItem("usuarioLogado") === "true";

    if (dados.logado && logado) {
      document.getElementById("nomeUsuario").textContent = dados.usuario.nome;
      const nomeFormatado = `${dados.usuario.nome} <span id="usuario-handle">(@${dados.usuario.nome.toLowerCase()})</span>`;
      const nomeUsuarioDiv = document.getElementById("nome-usuario");
      if (nomeUsuarioDiv) nomeUsuarioDiv.innerHTML = nomeFormatado;

      document.getElementById("paeeja-moeda-valor").textContent = dados.usuario.moedas;

      document.getElementById("botaoEntrarNav").style.display = "none";
      document.getElementById("botaoCadastrarNav").style.display = "none";

      document.getElementById("botaoSair").style.display = "inline";
      document.getElementById("nomeUsuario").hidden = false;
      document.getElementById("iconUsuario").hidden = false;
    } else {
      document.getElementById("botaoSair").style.display = "none";
      document.getElementById("nomeUsuario").hidden = true;
      document.getElementById("iconUsuario").hidden = true;
    }
  } catch (erro) {
    console.error("Erro ao verificar login:", erro);
  }
}

// Função para o botão de Sair (Logout)
function sairLogin(event) {
  event.preventDefault();
  localStorage.removeItem("usuarioLogado");
  window.location.href = '/logout';
}

// Executa a carga da navbar quando o DOM está completamente carregado
document.addEventListener("DOMContentLoaded", loadNavbar);
