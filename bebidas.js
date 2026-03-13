// const precos = {
//   "Classico": { ml300: 14.50, ml500: 19.50 },
//   "Ovomaltine": { ml300: 18.00, ml500: 23.00 },
//   "KitKat": { ml300: 22.00, ml500: 27.00 },
//   "Kids": { ml300: 15.00, ml500: 20.00 },
//   "Tropical": { ml300: 20.00, ml500: 24.00 },
//   "Nutella": { ml300: 21.00, ml500: 26.00 }
// };

// let selecionado = {
//   produto: "Escolhas da Casa",
//   sabor: null,
//   volume: null,
//   preco: null,
//   subtotal: null
// };

// function selectContainer(el) {
//   // Limpa seleção anterior
//   document.querySelectorAll(".container").forEach(c => {
//     c.classList.remove("selected");
//     c.querySelector("input[type='radio']").checked = false;
//   });

//   // Seleciona o atual
//   el.classList.add("selected");
//   el.querySelector("input[type='radio']").checked = true;

//   const sabor = el.querySelector("input[type='radio']").value;
//   selecionado.sabor = sabor;
//   selecionado.volume = null;
//   selecionado.preco = null;
//   selecionado.subtotal = null;

//   if (precos[sabor]) {
//     document.getElementById("saborSelecionado").textContent = sabor;

//     const p300 = document.getElementById("preco300");
//     const p500 = document.getElementById("preco500");

//     // Exibe valores formatados (com vírgula)
//     p300.textContent = `300ml - \nR$ ${precos[sabor].ml300.toFixed(2).replace(".", ",")}`;
//     p500.textContent = `500ml - \nR$ ${precos[sabor].ml500.toFixed(2).replace(".", ",")}`;

//     // Remove destaque anterior
//     p300.classList.remove("selecionado");
//     p500.classList.remove("selecionado");

//     // Clique 300ml
//     p300.onclick = () => {
//       selecionado.volume = "300ml";
//       selecionado.preco = precos[sabor].ml300; // float
//       selecionado.subtotal = selecionado.preco; // salva subtotal
//       p300.classList.add("selecionado");
//       p500.classList.remove("selecionado");
//     };

//     // Clique 500ml
//     p500.onclick = () => {
//       selecionado.volume = "500ml";
//       selecionado.preco = precos[sabor].ml500; // float
//       selecionado.subtotal = selecionado.preco; // salva subtotal
//       p500.classList.add("selecionado");
//       p300.classList.remove("selecionado");
//     };
//   }

//   // Mostra a seção de preços e oculta escolhas
//   document.getElementById("sectionEscolhas").style.display = "none";
//   document.getElementById("sectionPrecos").style.display = "flex";
//   document.getElementById("linkHome").style.display = "none";
// }

// function voltar() {
//   document.getElementById("sectionEscolhas").style.display = "block";
//   document.getElementById("sectionPrecos").style.display = "none";
//   document.getElementById("linkHome").style.display = "inline-block";
// }

// function finalizar() {
//   if (!selecionado.sabor || !selecionado.volume) {
//     alert("Por favor, selecione um sabor e o volume!");
//     return;
//   }

//   if (isNaN(selecionado.preco)) {
//     alert("Erro ao adicionar ao carrinho. Preço inválido.");
//     return;
//   }

//   let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
//   const editIndex = localStorage.getItem("editarIndex");

//   if (editIndex !== null) {
//     // Atualiza o item existente
//     carrinho[editIndex] = { ...selecionado };
//     localStorage.removeItem("editarIndex");
//   } else {
//     // Adiciona novo item
//     carrinho.push({ ...selecionado });
//   }

//   localStorage.setItem("carrinho", JSON.stringify(carrinho));
//   window.location.href = "carrinho.html";
// }


// function preencherEdicaoSeNecessario() {
//   const editIndex = localStorage.getItem("editarIndex");
//   if (editIndex === null) return;

//   const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
//   const item = carrinho[editIndex];
//   if (!item || item.produto !== "Escolhas da Casa") return;

//   selecionado = item;

//   // Marca o sabor automaticamente
//   const saborRadio = document.querySelector(`input[value="${item.sabor}"]`);
//   if (saborRadio) {
//     saborRadio.checked = true;
//     saborRadio.closest(".container").classList.add("selected");
//     selectContainer(saborRadio.closest(".container"));
//   }

//   // Marca o volume (300ml ou 500ml)
//   if (item.volume === "300ml") {
//     document.getElementById("preco300").click();
//   } else if (item.volume === "500ml") {
//     document.getElementById("preco500").click();
//   }

//   // Atualiza o texto do botão
//   const btn = document.getElementById("btnFinalizar");
//   if (btn) btn.textContent = "Salvar Alterações";
// }

// document.addEventListener("DOMContentLoaded", preencherEdicaoSeNecessario);
