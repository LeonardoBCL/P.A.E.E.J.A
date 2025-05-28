document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("confirm-modal");
  const btnYes = document.getElementById("confirm-yes");
  const btnNo = document.getElementById("confirm-no");
  const modalText = document.getElementById("confirm-text");
  const modalMessage = document.getElementById("modal-message");
  const btnClose = document.getElementById("close-modal");

  document.querySelectorAll(".item-img").forEach(img => {
    img.addEventListener("click", () => {
      selectedItemId = img.dataset.id;
      selectedTipo = img.dataset.tipo;

      // Resetando o modal para o estado inicial
      modalText.style.display = "flex";
      modalText.textContent = "Deseja finalizar a compra?";
      modalMessage.textContent = "";
      btnYes.style.display = "inline-block";
      btnNo.style.display = "inline-block";
      btnClose.style.display = "none";

      modal.style.display = "flex";
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

  btnClose.addEventListener("click", () => {
    modal.style.display = "none";
  });
});
