var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
});


async function navegacaoVerCursos() {
  const path = window.location.pathname;
  const logado = localStorage.getItem("usuarioLogado") === "true";
  const resposta = await fetch("/sessao");
  const dados = await resposta.json();

  if (dados.logado && path !== "/trilhas" && logado) {
    window.location = '/trilhas';
  } else {
    window.location = '/login';
  }
}

async function navegacaoPortugues() {
  const path = window.location.pathname;
  const logado = localStorage.getItem("usuarioLogado") === "true";
  const resposta = await fetch("/sessao");
  const dados = await resposta.json();

  if (dados.logado && path !== "/trilhas" && logado) {
    window.location = '/trilhas/portugues';
  } else {
    window.location = '/login';
  }
}