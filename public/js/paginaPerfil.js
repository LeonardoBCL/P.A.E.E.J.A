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

    try {
        for (let i = 1; i < 5; i++) {
            const resposta = await fetch("/PaginaPerfil/verificar-avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatar: i }),
                credentials: "same-origin"
            });

            const resultado = await resposta.json();
            if (resultado.sucesso) {
                const box = document.getElementById('box-itens-comprados');

                let avatarSelecionado = "";
                switch (i) {
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
                const img = document.createElement('img');
                img.src = `/imgs/images-avatares/${avatarSelecionado}.png`; 
                box.appendChild(img);
            }
        }
    } catch (error) {

    }
});