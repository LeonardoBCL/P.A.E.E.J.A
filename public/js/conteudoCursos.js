document.addEventListener('DOMContentLoaded', () => {
  const btnProximo = document.querySelector('.btn-proximo');
  const videoWrapper = document.querySelector('.video-wrapper');
  const navegacao = document.querySelector('.navegacao');
  const exercicio1 = document.getElementById('exercicio1');
  const btnVoltar = document.getElementById('btn-voltar');
  const btnResponder = document.getElementById('btn-responder');
  const aulaId = 1;

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

  atualizarBarraDeProgressoCurso();

  async function carregarRespostasSalvas() {
    const resposta = await fetch('/obter-respostas-salvas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionarioId: 1 })
    });

    const dados = await resposta.json();

    dados.respostas.forEach(resp => {
      const form = document.querySelector(`form[data-questao-id="${resp.questao_id}"]`);
      if (!form) return;

      const alternativas = form.querySelectorAll('label.alternativa');
      alternativas.forEach(label => {
        const input = label.querySelector('input');
        label.classList.remove('correta', 'incorreta');

        if (input.value === resp.resposta && resp.correta) {
          label.classList.add('correta');
        }
        if (input.value === resp.resposta && !resp.correta) {
          label.classList.add('incorreta');
        }
        if (input.value === resp.correta_questao && !resp.correta) {
          label.classList.add('correta');
        }
        input.checked = input.value === resp.resposta;
        input.disabled = true;
      });
    });

    const totalCorretas = dados.respostas.filter(r => r.correta).length;
    if (dados.respostas.length >= 3 && totalCorretas >= 2) {
      btnResponder.disabled = true;
    } else {
      btnResponder.disabled = false;
    }
  }

  carregarRespostasSalvas();

  function marcarSubmodulo(submodulo, ativo) {
    if (!submodulo) return;
    if (ativo) {
      submodulo.classList.add('ativo', 'bold');
    } else {
      submodulo.classList.remove('ativo', 'bold');
    }
  }

  function resetarSubmodulos() {
    const submodulos = document.querySelectorAll('.submodulo');
    submodulos.forEach((sub, index) => {
      marcarSubmodulo(sub, index === 0);
    });
  }

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
        marcarSubmodulo(atual, true);
      }

      const tituloModuloAtual = document.querySelector('.titulo-modulo');
      if (tituloModuloAtual) {
        tituloModuloAtual.classList.add('titulo-branco');
        tituloModuloAtual.classList.remove('titulo-amarelo');
      }
    }
  }

  function marcarExercicioAtivo() {
    const submodulos = document.querySelectorAll('.submodulo');
    submodulos.forEach(sub => marcarSubmodulo(sub, false));
    const ultimoSub = submodulos[submodulos.length - 1];
    if (ultimoSub) {
      marcarSubmodulo(ultimoSub, true);
    }
  }

  resetarSubmodulos();

  if (btnProximo && videoWrapper && navegacao && exercicio1 && btnVoltar && btnResponder) {
    btnProximo.addEventListener('click', async () => {
      videoWrapper.style.display = 'none';
      navegacao.style.display = 'none';
      direitosAutorais.style.display='none';
      exercicio1.style.display = 'block';
      marcarExercicioAtivo();

      try {
        const resposta = await fetch('/registrar-progresso', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aulaId })
        });

        const resultado = await resposta.json();
        console.log(resultado.mensagem);

        const spanMoedas = document.getElementById("paeeja-moeda-valor");
        if (resultado.novoSaldo !== undefined && spanMoedas) {
          const saldoAtual = parseInt(spanMoedas.textContent) || 0;
          const novoSaldo = resultado.novoSaldo;
          animarContadorMoedas(spanMoedas, saldoAtual, novoSaldo, 1000); // 1 segundo de animação
        }

        atualizarTextoBotaoProximo();
        atualizarBarraDeProgressoCurso();
      } catch (error) {
        console.error('Erro ao registrar progresso:', error);
      }
    });

    // Função de animação do contador
    function animarContadorMoedas(elemento, inicio, fim, duracao) {
      const range = fim - inicio;
      const startTime = performance.now();

      function atualizarContador(currentTime) {
        const elapsed = currentTime - startTime;
        const progresso = Math.min(elapsed / duracao, 1); // Progresso de 0 a 1
        const valorAtual = Math.floor(inicio + range * progresso);
        elemento.textContent = valorAtual;

        if (progresso < 1) {
          requestAnimationFrame(atualizarContador);
        } 
      }

      requestAnimationFrame(atualizarContador);
    }

    btnVoltar.addEventListener('click', () => {
      videoWrapper.style.display = 'block';
      direitosAutorais.style.display='flex';
      navegacao.style.display = 'flex';
      exercicio1.style.display = 'none';
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
      questionarioId: 1,
      respostas
    })
  });

  const resultado = await resposta.json();

  const totalCorretas = resultado.respostas.filter(r => r.correta).length;

  resultado.respostas.forEach(resp => {
    const form = document.querySelector(`form[data-questao-id="${resp.questao_id}"]`);
    const alternativas = form.querySelectorAll('label.alternativa');

    alternativas.forEach(label => {
      const input = label.querySelector('input');
      const letra = input.value;
      label.classList.remove('correta', 'incorreta');

      if (letra === resp.alternativa_correta) {
        label.classList.add('correta');
      }

      if (letra === resp.resposta && !resp.correta) {
        label.classList.add('incorreta');
      }

      if (letra === resp.resposta && resp.correta) {
        label.classList.add('correta');
      }

      // Se acertou 2 ou mais, desabilita. Se não, deixa habilitado para tentar de novo
      input.disabled = totalCorretas >= 2;
    });
  });

  btnResponder.disabled = totalCorretas >= 2;

  if (resultado.novoSaldo !== undefined) {
    const spanMoedas = document.getElementById("paeeja-moeda-valor");
    if (spanMoedas) {
      const saldoAtual = parseInt(spanMoedas.textContent) || 0;
      const novoSaldo = resultado.novoSaldo;
      animarContadorMoedas(spanMoedas, saldoAtual, novoSaldo, 1000);
    }
  }

  atualizarBarraDeProgressoCurso();
});

// Função de animação do contador
function animarContadorMoedas(elemento, inicio, fim, duracao) {
  const range = fim - inicio;
  const startTime = performance.now();

  function atualizarContador(currentTime) {
    const elapsed = currentTime - startTime;
    const progresso = Math.min(elapsed / duracao, 1); // Progresso de 0 a 1
    const valorAtual = Math.floor(inicio + range * progresso);
    elemento.textContent = valorAtual;

    if (progresso < 1) {
      requestAnimationFrame(atualizarContador);
    }
  }

  requestAnimationFrame(atualizarContador);
}

  }
});
