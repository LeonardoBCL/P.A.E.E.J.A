// Exemplo: backend insere isso no template
const showTutorial = true;  // ou false
const tutorialSteps = [
  {
    text: "Introdução ao Sistema de Gamificação: Bem-vindo(a)! Aqui você ganha pontos e desbloqueia conquistas.",
    image: "imgs/tutorial-popup/image-popup.png"
  },
  {
    text: "Conquistas e Pontos: Você ganha moedas ao completar vídeo-aulas e exercícios e pode desbloquear itens especiais e conquistas ao longo do percurso.",
    image: "imgs/tutorial-popup/image-popup2.png"
  },
  {
    text: "Barra de Progresso: Acompanhe seu progresso! Ela atualiza automaticamente à medida que você avança nos cursos.",
    image: "imgs/tutorial-popup/image-popup3.png"
  },
  {
    text: "Cada conquista é um marco! Ao desbloquear conquistas, elas serão exibidas no seu perfil.",
    image: "imgs/tutorial-popup/image-popup4.png"
  },
  {
    text: "É a sua vez! Comece seu primeiro curso e veja a gameficação em ação!!",
    image: "imgs/tutorial-popup/image-popup5.png"
  } 
];

const helpButton = document.getElementById('icone-ajuda');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popupText');
const popupImage = document.getElementById('popupImage');
const skipButton = document.getElementById('skipButton');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');
const closeButton = document.getElementById('closeButton');

let currentStep = 0;

function updatePopup() {
  const step = tutorialSteps[currentStep];
  popupText.textContent = step.text;
  popupImage.src = step.image;

  prevButton.style.display = currentStep === 0 ? 'none' : 'inline';
  nextButton.style.display = currentStep === tutorialSteps.length - 1 ? 'none' : 'inline';
  skipButton.style.display = currentStep === tutorialSteps.length - 1 ? 'none' : 'inline';
  closeButton.classList.toggle('hidden', currentStep !== tutorialSteps.length - 1);
}

if (helpButton) {
  helpButton.addEventListener('click', () => {
    popup.classList.remove('hidden');   // Mostra o popup
    currentStep = 0;                    // Começa do primeiro passo
    updatePopup();                      // Atualiza conteúdo
  });
}

nextButton.addEventListener('click', () => {
  if (currentStep < tutorialSteps.length - 1) {
    currentStep++;
    updatePopup();
  }
});

prevButton.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    updatePopup();
  }
});

skipButton.addEventListener('click', () => {
  currentStep = tutorialSteps.length - 1;
  updatePopup();
});

  closeButton.addEventListener('click', () => {
    popup.classList.add('hidden');
    console.log("Tutorial encerrado");
  });

  // startButton.addEventListener('click', () => {
  // popup.classList.add('hidden');
  // console.log('Tutorial concluído e iniciado!');
  // Aqui pode chamar função para iniciar curso
// });

// // Chamada ao backend informando que usuário viu o tutorial
//   fetch('/tutorial/visto', { method: 'POST' })
//     .then(() => console.log('Tutorial marcado como visto.'))
//     .catch(err => console.error('Erro ao marcar tutorial visto', err));

// // Exibir automaticamente se backend mandar showTutorial = true

if (showTutorial) {
  popup.classList.remove('hidden');
  updatePopup();
}