document.addEventListener('DOMContentLoaded', () => {
  // Seleção dos elementos necessários
  const btnProximo = document.querySelector('.btn-proximo');
  const videoWrapper = document.querySelector('.video-wrapper');
  const navegacao = document.querySelector('.navegacao');
  const exercicio1 = document.getElementById('exercicio1');
  const btnVoltar = document.getElementById('btn-voltar');
  const btnResponder = document.getElementById('btn-responder');

  // IDs de exemplo – substitua pelos valores reais vindos da sessão ou contexto
  const aulaId = 1

  async function atualizarTextoBotaoProximo() {
    try {
      const resposta = await fetch('/verificar-progresso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aulaId })
      });

      const resultado = await resposta.json();
      if (btnProximo) {
        btnProximo.textContent = resultado.jaConcluiu ? 'Próximo' : 'Finalizar Aula';
      }
    } catch (error) {
      console.error('Erro ao verificar progresso da aula:', error);
    }
  }

  // Chama ao carregar a página
  atualizarTextoBotaoProximo();

  async function atualizarBarraDeProgressoCurso() {
    try {
      const resposta = await fetch('/obter-progresso-curso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const { progresso } = await resposta.json();
      const barra = document.querySelector('.barra span');
      if (barra) {
        barra.style.width = `${progresso}%`;
        barra.textContent = `${progresso}%`;
      }
    } catch (error) {
      console.error('Erro ao atualizar barra de progresso do curso:', error);
    }
  }

  // Chamada ao carregar a página
  atualizarBarraDeProgressoCurso();

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
    btnProximo.addEventListener('click', async () => {
      videoWrapper.style.display = 'none';
      navegacao.style.display = 'none';
      exercicio1.style.display = 'block';
      marcarExercicioAtivo();

      try {
        const resposta = await fetch('/registrar-progresso', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ aulaId })
        });

        const resultado = await resposta.json();
        console.log(resultado.mensagem);

        const spanMoedas = document.getElementById("paeeja-moeda-valor");
        if (resultado.novoSaldo !== undefined && spanMoedas) {
          spanMoedas.textContent = resultado.novoSaldo;
        }
        atualizarTextoBotaoProximo();
        atualizarBarraDeProgressoCurso();
      } catch (error) {
        console.error('Erro ao registrar progresso:', error);
      }
    });

    btnVoltar.addEventListener('click', () => {
      videoWrapper.style.display = 'block';
      navegacao.style.display = 'flex';
      exercicio1.style.display = 'none';

      // Ao voltar, resetar destaque para o primeiro submódulo
      resetarSubmodulos();
    });

    btnResponder.addEventListener('click', async () => {
      const formularios = document.querySelectorAll('form.alternativas');
      const respostas = [];

      formularios.forEach(form => {
        const questaoId = parseInt(form.dataset.questaoId);
        const selecionado = form.querySelector('input[type="radio"]:checked');
        if (selecionado) {
          respostas.push({ questao_id: questaoId, resposta: selecionado.value });
        }
      });

      const resposta = await fetch('/responder-questionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionarioId: 1, // Substituir dinamicamente depois
          respostas
        })
      });

      const resultado = await resposta.json();

      const spanMoedas = document.getElementById("paeeja-moeda-valor");
        if (resultado.novoSaldo !== undefined && spanMoedas) {
          spanMoedas.textContent = resultado.novoSaldo;
        }
      if (resposta.status !== 200) {
        alert(resultado.mensagem);
        return;
      }

      // Mostrar resultado visual
      resultado.respostasComCorrecao.forEach(res => {
        const questaoForm = document.querySelector(`form[data-questao-id="${res.questao_id}"]`);
        const alternativas = questaoForm.querySelectorAll('label.alternativa');

        alternativas.forEach(label => {
          label.classList.remove('correta', 'incorreta');
          const input = label.querySelector('input');
          if (input.value === res.resposta && !res.correta) {
            label.classList.add('incorreta');
          }
          if (input.value === res.resposta && res.correta) {
            label.classList.add('correta');
          }
          if (input.value === res.correta && !res.correta) {
            const corretaLabel = questaoForm.querySelector(`input[value="${res.correta}"]`).parentElement;
            corretaLabel.classList.add('correta');
          }
          input.disabled = true;
        });
      });

      if (resultado.ganhouMoeda) {
        alert('Parabéns! Você ganhou 50 moedas.');
      }

      btnResponder.disabled = true;
    });
  }
});
