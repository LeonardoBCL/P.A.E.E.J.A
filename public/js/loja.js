document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("confirm-modal");
  const btnYes = document.getElementById("confirm-yes");
  const btnNo = document.getElementById("confirm-no");
  const modalText = document.getElementById("confirm-text");
  const modalMessage = document.getElementById("modal-message");
  const btnClose = document.getElementById("close-modal");
  let btnEquipar;
  async function verificarItensComprados() {
    const imagens = document.querySelectorAll(".item-img");

    for (const img of imagens) {
      const itemId = img.dataset.id;
      const tipo = img.dataset.tipo;

      // Se não tiver ID e tipo, pula (ex: imagem faltando dataset)
      if (!itemId || !tipo) continue;

      try {
        const resposta = await fetch("/loja/verificar-compra", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, tipo }),
          credentials: "same-origin"
        });

        const resultado = await resposta.json();

        if (resultado.sucesso && resultado.comprado) {
          img.src = img.src.replace(".png", "-desblock.png");
          const parent = img.closest(".item");
          if (parent) {
            const price = parent.querySelector("p");
            if (price) price.remove();
          }
        }
      } catch (error) {
        console.error("Erro ao verificar item comprado:", error);
      }
    }
  }

  verificarItensComprados();

  document.querySelectorAll(".item-img").forEach(img => {
    img.addEventListener("click", async () => {
      selectedItemId = img.dataset.id;
      selectedTipo = img.dataset.tipo;

      try {
        const resposta = await fetch("/loja/verificar-compra", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: selectedItemId, tipo: selectedTipo }),
          credentials: "same-origin"
        });

        const resultado = await resposta.json();

        if (!resultado.sucesso) {
          alert("Erro ao verificar item.");
          return;
        }

        if (resultado.comprado) {
          // Mostra modal informando que o item já foi comprado
          btnYes.style.display = "none";
          btnNo.style.display = "none";
          modalText.style.display = "none";
          modalMessage.textContent = "Você já comprou esse item. Deseja usá-lo?";
          modalMessage.style.color = "green";
          btnClose.style.display = "none";

          btnEquipar = document.createElement("button");
          btnEquipar.id = "confirm-yes";
          btnEquipar.textContent = "Equipar";
          modalMessage.after(btnEquipar);
          modal.style.display = "flex";
          btnClose.style.display = "inline-block";

          btnEquipar.addEventListener("click", async () => {
            try {
              const resposta = await fetch("/equipar-avatar", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ avatarId: selectedItemId })
              });

              const resultado = await resposta.json();

              if (resultado.sucesso) {
                // Atualiza a imagem na navbar, se aplicável
                const iconUsuario = document.getElementById("iconUsuario");
                if (iconUsuario && resultado.avatarId) {
                  const avatarId = parseInt(resultado.avatarId);
                  let avatarSelecionado = "";
                  switch (avatarId) {
                    case 1:
                      avatarSelecionado = "avatar-1-desblock"
                      break;
                    case 2:
                      avatarSelecionado = "avatar-2-desblock"
                      break;
                    case 3:
                      avatarSelecionado = "avatar-fem-desblock"
                      break;
                    case 4:
                      avatarSelecionado = "avatar-fem2-desblock"
                      break;
                  
                    default:
                      break;
                  }
                  iconUsuario.src = `/imgs/images-avatares/${avatarSelecionado}.png`;
                }

                btnEquipar.remove();
                modal.style.display = "none";
              } else {
                alert(resultado.message);
              }
            } catch (err) {
              console.error("Erro ao equipar avatar:", err);
            }
          });

          return;
        }


        // Resetando o modal para o estado inicial
        modalText.style.display = "flex";
        modalText.textContent = "Deseja finalizar a compra?";
        modalMessage.textContent = "";
        btnYes.style.display = "inline-block";
        btnNo.style.display = "inline-block";
        btnClose.style.display = "none";

        modal.style.display = "flex";

      } catch (error) {
        console.error("Erro ao verificar compra:", error);
        alert("Erro ao verificar compra.");
      }
    });
  });

  btnYes.addEventListener("click", async () => {
    try {
      const resposta = await fetch("/loja/comprar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: selectedItemId, tipo: selectedTipo }),
        credentials: "same-origin"
      });

      const resultado = await resposta.json();

      // Oculta botões "Sim" e "Não", mostra mensagem e botão "Fechar"
      btnYes.style.display = "none";
      btnNo.style.display = "none";
      modalText.style.display = "none";
      modalMessage.textContent = resultado.message;
      modalMessage.style.color = resultado.sucesso ? "green" : "red";
      btnClose.style.display = "inline-block";
      if (resultado.sucesso) {
        const img = document.querySelector(`.item-img[data-id="${selectedItemId}"][data-tipo="${selectedTipo}"]`);
        if (img) {
          img.src = img.src.replace(".png", "-desblock.png");
          const parent = img.closest(".item");
          if (parent) {
            const price = parent.querySelector("p");
            if (price) price.remove();
          }
        }
      }

    } catch (error) {
      btnYes.style.display = "none";
      btnNo.style.display = "none";
      modalText.style.display = "none";
      modalMessage.textContent = "Erro ao processar a compra.";
      modalMessage.style.color = "red";
      btnClose.style.display = "inline-block";
      console.error(error);
    }
  });

  btnNo.addEventListener("click", () => {
    modal.style.display = "none";
  });

  btnClose.addEventListener("click", async () => {
    modal.style.display = "none";
    btnEquipar.remove();
    const respostaDadosUsuario = await fetch("/sessao");
    const dadosUsuario = await respostaDadosUsuario.json();
    document.getElementById("paeeja-moeda-valor").textContent = dadosUsuario.usuario.moedas;
  });
});
