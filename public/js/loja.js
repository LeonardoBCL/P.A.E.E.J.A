let selectedItemId = null;
  let selectedTipo = null;

  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("confirm-modal");
    const btnYes = document.getElementById("confirm-yes");
    const btnNo = document.getElementById("confirm-no");

    document.querySelectorAll(".item-img").forEach(img => {
      img.addEventListener("click", () => {
        console.log("Imagem clicada:", img.dataset);
        selectedItemId = img.dataset.id;
        selectedTipo = img.dataset.tipo;
        modal.style.display = "flex";
      });
    });

    btnYes.addEventListener("click", async () => {
      try {
        const resposta = await fetch("/loja/comprar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemId: selectedItemId,
            tipo: selectedTipo
          }),
          credentials: "same-origin"
        });

        const resultado = await resposta.json();
        alert(resultado.message);
      } catch (error) {
        alert("Erro ao processar a compra:" + error);
        console.log(error)
      }

      modal.style.display = "none";
    });

    btnNo.addEventListener("click", () => {
      modal.style.display = "none";
    });
  });