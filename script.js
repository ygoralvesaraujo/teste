let usuarioLogado = "";

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user && pass) {
    usuarioLogado = user;
    document.getElementById("login-container").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    const agora = new Date().toISOString().slice(0,16);
    document.getElementById("dataHora").value = agora;
  } else {
    alert("Preencha usuário e senha.");
  }
}

function atualizarFormulario() {
  const tipo = document.getElementById("tipo").value;
  document.getElementById("campoValorAlterado").style.display = tipo === "Alteração" ? "block" : "none";
  document.getElementById("campoFoto").style.display = tipo === "Alteração" ? "block" : "none";
}

function limparAssinatura() {
  const canvas = document.getElementById("assinaturaCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getAssinaturaImagem() {
  return document.getElementById("assinaturaCanvas").toDataURL();
}

let isDesenhando = false;
let canvas = document.getElementById("assinaturaCanvas");
let ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", () => isDesenhando = true);
canvas.addEventListener("mouseup", () => isDesenhando = false);
canvas.addEventListener("mousemove", desenhar);

canvas.addEventListener("touchstart", (e) => {
  isDesenhando = true;
  desenhar(e.touches[0]);
  e.preventDefault();
});
canvas.addEventListener("touchend", () => isDesenhando = false);
canvas.addEventListener("touchmove", (e) => {
  desenhar(e.touches[0]);
  e.preventDefault();
});

function desenhar(e) {
  if (!isDesenhando) return;
  const rect = canvas.getBoundingClientRect();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function salvarOcorrencia() {
  const tipo = document.getElementById("tipo").value;
  const dataHora = document.getElementById("dataHora").value;
  const operador = document.getElementById("operador").value;
  const valor = document.getElementById("valor").value;
  const valorAlterado = document.getElementById("valorAlterado").value;
  const motivo = document.getElementById("motivo").value;
  const assinatura = getAssinaturaImagem();
  const foto = document.getElementById("foto").files[0];

  if (!operador || !valor || !motivo) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const div = document.createElement("div");
  div.style.border = "1px solid #ccc";
  div.style.margin = "10px 0";
  div.style.padding = "10px";

  let html = `
    <strong>Tipo:</strong> ${tipo}<br>
    <strong>Data e Hora:</strong> ${dataHora}<br>
    <strong>Operador:</strong> ${operador}<br>
    <strong>Valor:</strong> R$ ${valor}<br>
  `;

  if (tipo === "Alteração") {
    html += `<strong>Valor Alterado:</strong> R$ ${valorAlterado}<br>`;
    if (foto) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100%";
        div.appendChild(img);
      };
      reader.readAsDataURL(foto);
    }
  }

  html += `
    <strong>Motivo:</strong> ${motivo}<br>
    <strong>Fiscal:</strong> ${usuarioLogado}<br>
    <strong>Assinatura:</strong><br><img src="${assinatura}" width="300"><br>
  `;

  div.innerHTML = html;

  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "Excluir";
  btnExcluir.onclick = () => div.remove();
  div.appendChild(btnExcluir);

  document.getElementById("ocorrencias").appendChild(div);
}

function baixarRelatorio() {
  const container = document.getElementById("ocorrencias").innerHTML;
  const blob = new Blob([container], {type: "text/html"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "relatorio.html";
  link.click();
}

function compartilharRelatorio() {
  const html = document.getElementById("ocorrencias").innerHTML;
  const blob = new Blob([html], {type: "text/html"});
  const file = new File([blob], "relatorio.html", { type: "text/html" });

  if (navigator.share) {
    const data = {
      files: [file],
      title: "Relatório de Ocorrências",
      text: "Segue o relatório de ocorrências."
    };
    navigator.share(data).catch(console.error);
  } else {
    alert("Compartilhamento não suportado neste dispositivo.");
  }
}
