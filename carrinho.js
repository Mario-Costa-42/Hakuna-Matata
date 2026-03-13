// Navegação entre páginas do carrinho
let paginaAtual = 0;
const paginas = document.querySelectorAll(".pagina");

function mostrarPagina(index) {
  paginas.forEach(p => p.classList.remove("ativa"));
  paginas[index].classList.add("ativa");
  paginaAtual = index;
}

function proximaPagina() {
  const carrinho = getCarrinho();
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }
  if (paginaAtual < paginas.length - 1) mostrarPagina(paginaAtual + 1);
}

function paginaAnterior() {
  if (paginaAtual > 0) mostrarPagina(paginaAtual - 1);
}

// Helpers carrinho
function getCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}
function setCarrinho(c) {
  localStorage.setItem("carrinho", JSON.stringify(c));
}
function brl(n) {
  return Number(n || 0).toFixed(2).replace(".", ",");
}

function descricaoItem(item) {
  // PIZZA
  if (item.produto === "Pizza") {
    return `${item.nome} x${item.quantidade} = R$ ${brl(item.subtotal)}`;
  }

  // HAMBÚRGUER
  if (item.produto === "Hambúrguer") {
    return `${item.nome} x${item.quantidade} = R$ ${brl(item.subtotal)}`;
  }

  // ACOMPANHAMENTO
  if (item.produto === "Acompanhamento") {
    return `${item.nome} x${item.quantidade} = R$ ${brl(item.subtotal)}`;
  }

  // BEBIDAS
  if (item.produto === "Bebidas") {
    return `${item.nome} x${item.quantidade} = R$ ${brl(item.subtotal)}`;
  }

  return "Item"; 
}

// Renderização unificada
function carregarCarrinho() {
  const carrinho = getCarrinho();
  const container = document.getElementById("carrinho");
  const container2 = document.getElementById("carrinho2");
  container.innerHTML = "";
  container2.innerHTML = "";

  if (carrinho.length === 0) {
    container.textContent = "Carrinho vazio.";
    container.style.color = "#E9CEA2";
    localStorage.setItem("resumoPedido", "");
    return;
  }

  let totalGeral = 0;
  let listaPedidos = "";

  carrinho.forEach((item, index) => {
    const divItem = document.createElement("div");
    divItem.style.border = "1px solid #ccc";
    divItem.style.padding = "10px";
    divItem.style.margin = "10px 0";
    divItem.style.borderRadius = "8px";
    divItem.style.background = "#f9f9f9";

    const desc = descricaoItem(item);

    const span = document.createElement("span");
    span.textContent = desc;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "✏️ Editar";
    btnEditar.style.marginLeft = "10px";
    btnEditar.style.background = "#1976d2";
    btnEditar.style.color = "#fff";
    btnEditar.style.border = "none";
    btnEditar.style.padding = "5px 10px";
    btnEditar.style.cursor = "pointer";
    btnEditar.style.borderRadius = "6px";
    btnEditar.onclick = () => editarItem(index);

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "❌ Cancelar";
    btnRemover.style.marginLeft = "10px";
    btnRemover.style.background = "#ff4d4d";
    btnRemover.style.color = "#fff";
    btnRemover.style.border = "none";
    btnRemover.style.padding = "5px 10px";
    btnRemover.style.cursor = "pointer";
    btnRemover.style.borderRadius = "6px";
    btnRemover.onclick = () => removerItem(index);

    divItem.appendChild(span);
    divItem.appendChild(btnEditar);
    divItem.appendChild(btnRemover);
    container.appendChild(divItem);

    // Resumo na página 2
    const resumoLinha = document.createElement("div");
    resumoLinha.textContent = `• ${desc}`;
    container2.appendChild(resumoLinha);

    totalGeral += Number(item.subtotal || 0);
    listaPedidos += `- ${desc}\n`;
  });

  const totalP = document.createElement("h2");
  totalP.textContent = "Total: R$ " + brl(totalGeral);
  totalP.style.color = "#E9CEA2";
  container.appendChild(totalP);
  container2.appendChild(totalP.cloneNode(true));

  localStorage.setItem("resumoPedido", listaPedidos + "\nTotal: R$ " + brl(totalGeral));
}

function editarItem(index) {
  localStorage.setItem("editarIndex", String(index));
  const item = getCarrinho()[index];
  if (!item) return;

  if (item.produto === "Pizza") {
    window.location.href = "pizzas.html";
  } else if (item.produto === "Hambúrguer") {
    window.location.href = "hamburguer.html";
  } else if (item.produto === "Acompanhamento") {
    window.location.href = "acompanhamentos.html";
  } else if (item.produto === "Bebidas") {
    window.location.href = "bebidas.html";
  } else {
    alert("Não é possível editar este item.");
  }
}

function removerItem(index) {
  const carrinho = getCarrinho();
  carrinho.splice(index, 1);
  setCarrinho(carrinho);
  carregarCarrinho();
}

// Pagamento
function mostrarOpcaoPagamento() {
  const opcao = document.getElementById("pagamento").value;
  document.getElementById("pixInfo").style.display = (opcao === "pix") ? "block" : "none";
  document.getElementById("dinheiroInfo").style.display = (opcao === "dinheiro") ? "block" : "none";
}

function copiarPix() {
  const chavePix = "teste_exemplo";
  navigator.clipboard.writeText(chavePix);
  alert("Chave Pix copiada!");
}

function enviarWhatsapp() {
  const resumo = localStorage.getItem("resumoPedido") || "";
  const pagamento = document.getElementById("pagamento").value;
  let textoPagamento = "";

  if (pagamento === "pix") {
    textoPagamento = "\nForma de pagamento: Pix ✅";
  } else if (pagamento === "dinheiro") {
    const troco = document.getElementById("troco").value;
    textoPagamento = `\nForma de pagamento: Dinheiro ✅ ${troco ? "(Troco para R$" + troco + ")" : ""}`;
  } else {
    textoPagamento = "\nForma de pagamento: Não informado ⚠️";
  }

  const textoFinal = "📋 Pedido:\n" + resumo + textoPagamento;
  const numero = "5532984923417"; 
  const url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(textoFinal);
  window.location.href = url;
  localStorage.clear();
}

// Inicialização
document.addEventListener("DOMContentLoaded", carregarCarrinho);
