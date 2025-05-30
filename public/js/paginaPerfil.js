document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resposta = await fetch("/avatar-equipado");
        const resultado = await resposta.json();

        if (resultado.sucesso && resultado.avatarId) {
            const iconUsuario = document.getElementById("foto-usuario");

            let avatarSelecionado = "";
            switch (parseInt(resultado.avatarId)) {
                case 1:
                    avatarSelecionado = "avatar-1-desblock";
                    break;
                case 2:
                    avatarSelecionado = "avatar-2-desblock";
                    break;
                case 3:
                    avatarSelecionado = "avatar-fem-desblock";
                    break;
                case 4:
                    avatarSelecionado = "avatar-fem2-desblock";
                    break;
                default:
                    // Nenhum avatar equipado, não muda nada
                    return;
            }

            if (iconUsuario) {
                iconUsuario.src = `/imgs/images-avatares/${avatarSelecionado}.png`;
            }
        }
    } catch (err) {
        console.error("Erro ao carregar avatar da navbar:", err);
    }
});