document.addEventListener('DOMContentLoaded', () => {
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
});