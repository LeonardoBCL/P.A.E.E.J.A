//NÃO ESTÁ FUNCIONANDO ESSA FUNCTION
// Função para inicializar as funcionalidades da navegação



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


