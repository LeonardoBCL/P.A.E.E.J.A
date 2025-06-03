// Função para carregar a barra de navegação
async function loadNavbar() {
  try {
    const response = await fetch('/views/nav.html');
    const data = await response.text();
    document.getElementById('navbar').innerHTML = data;
    await verificarLogin(); // Aguarda navbar renderizada antes de prosseguir
  } catch (err) {
    console.error("Erro ao carregar navbar:", err);
  }
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
async function navegacaoCursosNav() {
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
    window.location = '#faq';
  } else {
    window.location = '/#faq';
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

      // Verifica se já há avatar no localStorage para carregar instantaneamente
      const avatarIdLocal = localStorage.getItem("avatarEquipadoId");
      const iconUsuario = document.getElementById("iconUsuario");

      if (iconUsuario && avatarIdLocal) {
        const avatarSelecionado = getAvatarFileName(parseInt(avatarIdLocal));
        if (avatarSelecionado) {
          iconUsuario.onload = () => iconUsuario.hidden = false;
          iconUsuario.src = `/imgs/images-avatares/${avatarSelecionado}.png`;
        }
      }

      // Requisição ao backend para garantir consistência do avatar
      try {
        const resposta = await fetch("/avatar-equipado");
        const resultado = await resposta.json();

        if (resultado.sucesso && resultado.avatarId) {
          const avatarSelecionado = getAvatarFileName(parseInt(resultado.avatarId));
          if (iconUsuario && avatarSelecionado) {
            iconUsuario.onload = () => iconUsuario.hidden = false;
            iconUsuario.src = `/imgs/images-avatares/${avatarSelecionado}.png`;

            // Atualiza o cache local
            localStorage.setItem("avatarEquipadoId", resultado.avatarId);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar avatar da navbar:", err);
      }

    } else {
      document.getElementById("botaoSair").style.display = "none";
      document.getElementById("nomeUsuario").hidden = true;
      document.getElementById("iconUsuario").hidden = true;
    }
  } catch (erro) {
    console.error("Erro ao verificar login:", erro);
  }
}

// Mapeia o ID para o nome do arquivo do avatar
function getAvatarFileName(avatarId) {
  switch (avatarId) {
    case 1: return "avatar-1-desblock";
    case 2: return "avatar-2-desblock";
    case 3: return "avatar-fem-desblock";
    case 4: return "avatar-fem2-desblock";
    default: return null;
  }
}

// Função para o botão de Sair (Logout)
function sairLogin(event) {
  event.preventDefault();
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("avatarEquipadoId"); // limpa o avatar cacheado
  window.location.href = '/logout';
}

// Executa a carga da navbar quando o DOM está completamente carregado
document.addEventListener("DOMContentLoaded", loadNavbar);
