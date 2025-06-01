document.addEventListener('DOMContentLoaded', () => {
  // Seleção dos elementos necessários
  const btnProximo = document.querySelector('.btn-proximo');
  const videoWrapper = document.querySelector('.video-wrapper');
  const navegacao = document.querySelector('.navegacao');
  const exercicio1 = document.getElementById('exercicio1');
  const btnVoltar = document.getElementById('btn-voltar');
  const btnResponder = document.getElementById('btn-responder');

  // Função para trocar o estilo de destaque de um submódulo
  function marcarSubmodulo(submodulo, ativo) {
    if (!submodulo) return;
    if (ativo) {
      submodulo.classList.add('ativo', 'bold');
    } else {
      submodulo.classList.remove('ativo', 'bold');
    }
  }

  // Função para resetar todos os submódulos, deixando só o primeiro ativo
  function resetarSubmodulos() {
    const submodulos = document.querySelectorAll('.submodulo');
    submodulos.forEach((sub, index) => {
      marcarSubmodulo(sub, index === 0);
    });
  }

  // Função para atualizar o destaque do próximo submódulo
  function atualizarProximoSubmodulo() {
    const submodulos = document.querySelectorAll('.submodulo');
    const atualIndex = [...submodulos].findIndex(el => el.classList.contains('ativo'));

    if (atualIndex !== -1) {
      const atual = submodulos[atualIndex];
      marcarSubmodulo(atual, false);

      if (atualIndex < submodulos.length - 1) {
        const proximo = submodulos[atualIndex + 1];
        marcarSubmodulo(proximo, true);
      } else {
        // Se já está no último, mantém ele ativo
        marcarSubmodulo(atual, true);
      }

      // Atualiza título do módulo (ajuste conforme necessário)
      const tituloModuloAtual = document.querySelector('.titulo-modulo');
      if (tituloModuloAtual) {
        tituloModuloAtual.classList.add('titulo-branco');
        tituloModuloAtual.classList.remove('titulo-amarelo');
      }
    }
  }

  // Função para forçar o exercício (último submódulo) a ficar ativo
  function marcarExercicioAtivo() {
    const submodulos = document.querySelectorAll('.submodulo');
    submodulos.forEach(sub => marcarSubmodulo(sub, false)); // limpa todos
    const ultimoSub = submodulos[submodulos.length - 1];
    if (ultimoSub) {
      marcarSubmodulo(ultimoSub, true);
    }
  }

  // Inicializa estado ao carregar a página
  resetarSubmodulos();

  // Adiciona eventos se elementos existem
  if (btnProximo && videoWrapper && navegacao && exercicio1 && btnVoltar && btnResponder) {
    btnProximo.addEventListener('click', () => {
      videoWrapper.style.display = 'none';
      navegacao.style.display = 'none';
      exercicio1.style.display = 'block';

      // Aqui força o exercício a ficar ativo (amarelo)
      marcarExercicioAtivo();
    });

    btnVoltar.addEventListener('click', () => {
      videoWrapper.style.display = 'block';
      navegacao.style.display = 'flex';
      exercicio1.style.display = 'none';

      // Ao voltar, resetar destaque para o primeiro submódulo
      resetarSubmodulos();
    });

    btnResponder.addEventListener('click', () => {
      alert('Lógica para responder a questão vai aqui!');
      // Se quiser, pode chamar atualizarProximoSubmodulo() aqui para avançar após resposta
    });
  }
});
