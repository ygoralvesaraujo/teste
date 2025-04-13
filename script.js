let usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
let usuarioLogado = null;

function login() {
  const username = document.getElementById('username').value;
  const senha = document.getElementById('password').value;
  if (usuarios[username] && usuarios[username] === senha) {
    usuarioLogado = username;
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
    document.getElementById('dataHora').value = new Date().toISOString().slice(0,16);
  } else {
    document.getElementById('login-msg').innerText = 'Usuário ou senha incorretos';
  }
}

function mostrarCadastro() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('cadastro-container').style.display = 'flex';
}

function voltarLogin() {
  document.getElementById('cadastro-container').style.display = 'none';
  document.getElementById('login-container').style.display = 'flex';
}

function cadastrarUsuario() {
  const newUser = document.getElementById('new-username').value;
  const newPass = document.getElementById('new-password').value;
  if (newUser && newPass) {
    usuarios[newUser] = newPass;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    document.getElementById('cadastro-msg').innerText = 'Usuário cadastrado!';
  }
}

function atualizarFormulario() {
  const tipo = document.getElementById('tipo').value;
  document.getElementById('campoValorAlterado').style.display = tipo === 'Alteração' ? 'block' : 'none';
  document.getElementById('campoFoto').style.display = tipo === 'Alteração' ? 'block' : 'none';
}

function limparAssinatura() {
  const canvas = document.getElementById('assinaturaCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function salvarOcorrencia() {
  const tipo = document.getElementById('tipo').value;
  const dataHora = document.getElementById('dataHora').value;
  const operador = document.getElementById('operador').value;
  const valor = document.getElementById('valor').value;
  const valorAlterado = document.getElementById('valorAlterado').value;
  const motivo = document.getElementById('motivo').value;

  const canvas = document.getElementById('assinaturaCanvas');
  const assinatura = canvas.toDataURL();

  const fotoInput = document.getElementById('foto');
  let fotoURL = '';
  if (fotoInput.files && fotoInput.files[0]) {
    fotoURL = URL.createObjectURL(fotoInput.files[0]);
  }

  const ocorrencia = {
    tipo, dataHora, operador, valor, valorAlterado, motivo, assinatura, usuarioFiscal: usuarioLogado, fotoURL
  };

  const lista = JSON.parse(localStorage.getItem('ocorrencias')) || [];
  lista.push(ocorrencia);
  localStorage.setItem('ocorrencias', JSON.stringify(lista));
  mostrarOcorrencias();
}

function mostrarOcorrencias() {
  const container = document.getElementById('ocorrencias');
  container.innerHTML = '';
  const lista = JSON.parse(localStorage.getItem('ocorrencias')) || [];

  lista.forEach((oc, index) => {
    const div = document.createElement('div');
    div.style.border = '1px solid black';
    div.style.padding = '10px';
    div.style.marginBottom = '10px';

    div.innerHTML = `
      <strong>Tipo:</strong> ${oc.tipo}<br>
      <strong>Data/Hora:</strong> ${oc.dataHora}<br>
      <strong>Operador:</strong> ${oc.operador}<br>
      <strong>Valor:</strong> ${oc.valor}<br>
      ${oc.tipo === 'Alteração' ? `<strong>Valor Alterado:</strong> ${oc.valorAlterado}<br>` : ''}
      <strong>Motivo:</strong> ${oc.motivo}<br>
      <strong>Assinatura:</strong><br><img src="${oc.assinatura}" width="100"><br>
      ${oc.fotoURL ? `<strong>Foto:</strong><br><img src="${oc.fotoURL}" width="100"><br>` : ''}
      <strong>Fiscal:</strong> ${oc.usuarioFiscal}<br>
      <button onclick="excluirOcorrencia(${index})">Excluir</button>
    `;
    container.appendChild(div);
  });
}

function excluirOcorrencia(index) {
  const lista = JSON.parse(localStorage.getItem('ocorrencias')) || [];
  lista.splice(index, 1);
  localStorage.setItem('ocorrencias', JSON.stringify(lista));
  mostrarOcorrencias();
}

function baixarRelatorio() {
  const lista = JSON.parse(localStorage.getItem('ocorrencias')) || [];
  const relatorio = lista.map((oc, i) => `
    Ocorrência ${i + 1}:
    Tipo: ${oc.tipo}
    Data/Hora: ${oc.dataHora}
    Operador: ${oc.operador}
    Valor: ${oc.valor}
    ${oc.tipo === 'Alteração' ? `Valor Alterado: ${oc.valorAlterado}` : ''}
    Motivo: ${oc.motivo}
    Fiscal: ${oc.usuarioFiscal}
  `).join('\n\n');

  const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "relatorio_ocorrencias.txt";
  link.click();
}

function compartilharRelatorio() {
  const lista = JSON.parse(localStorage.getItem('ocorrencias')) || [];
  const relatorio = lista.map((oc, i) => `
    Ocorrência ${i + 1}:
    Tipo: ${oc.tipo}
    Data/Hora: ${oc.dataHora}
    Operador: ${oc.operador}
    Valor: ${oc.valor}
    ${oc.tipo === 'Alteração' ? `Valor Alterado: ${oc.valorAlterado}` : ''}
    Motivo: ${oc.motivo}
    Fiscal: ${oc.usuarioFiscal}
  `).join('\n\n');

  const blob = new Blob([relatorio], { type: 'text/plain' });
  const file = new File([blob], 'relatorio.txt', { type: 'text/plain' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      title: 'Relatório de Ocorrências',
      text: 'Segue o relatório das ocorrências.',
      files: [file]
    });
  } else {
    alert("Compartilhamento não suportado neste dispositivo.");
  }
}

window.onload = mostrarOcorrencias;

// Captura assinatura com mouse ou toque
const canvas = document.getElementById("assinaturaCanvas");
const ctx = canvas.getContext("2d");
let desenhando = false;

canvas.addEventListener("mousedown", e => {
  desenhando = true;
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", e => {
  if (desenhando) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", () => desenhando = false);
canvas.addEventListener("mouseout", () => desenhando = false);

// Suporte a toque
canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  desenhando = true;
  const rect = canvas.getBoundingClientRect();
  ctx.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
});

canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  if (desenhando) {
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    ctx.stroke();
  }
});

canvas.addEventListener("touchend", () => desenhando = false);
