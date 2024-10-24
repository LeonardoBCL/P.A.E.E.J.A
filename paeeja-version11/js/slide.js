var cont = 1;

document.getElementById("radio1").checked = true;

setInterval(() => {
  proximaImg();
}, 7000);

function proximaImg() {
  cont++;

  if (cont > 5) {
    cont = 1;
  }

  document.getElementById("radio" + cont).checked = true;
}
