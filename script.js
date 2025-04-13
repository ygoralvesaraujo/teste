// Variáveis de usuário
let usuarios = [
  { username: "admin", password: "admin" }
];

let usuarioLogado = null;

// Função de login
function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  
  let usuario = usuarios.find(user => user.username === username && user.password === password);
  if (usuario) {
    usuarioLogado = usuario;
    mostrarTelaApp();
  } else {
    document.getElementById("login-msg").innerText = "Usuário ou senha inválidos!";
  }
}

// Mostrar tela de cadastro
function mostrarCadastro() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("cadastro-container").style.display = "block";
}

// Voltar para a tela de login
function voltarLogin() {
  document.getElementById("cadastro-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
}

// Função de cadastro de novo usuário
function cadastrarUsuario() {
  let username = document.getElementById("new-username").value;
  let password = document.getElementById("new-password").value;
  
  usuarios.push({ username, password });
  document.getElementById("cadastro-msg").innerText = "Usuário cadastrado com sucesso!";
  voltarLogin();
}

// Mostrar tela principal do app
function mostrarTelaApp() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("app-container").style.display = "block";

  // Preencher automaticamente com a data e hora atual
  let currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset()); // Ajusta para horário local
  let currentDateTime = currentDate.toISOString().slice(0, 16); // Formato: YYYY-MM-DDTHH:MM
  document.getElementById("dataHora").value = currentDateTime;
}

// Atualizar formulário com base no tipo de ocorrência selecionado
function atualizarFormulario() {
  let tipo = document.getElementById("tipo").value;
  
  document.getElementById("campoValorAlterado").style.display = tipo === "Alteração" ? "block" : "none";
  document.getElementById("campoFoto").style.display = tipo === "Alteração" ? "block" : "none";
}

// Função para salvar a ocorrência
function salvarOcorrencia() {
  let tipo = document.getElementById("tipo").value;
  let dataHora = document.getElementById("dataHora").value;
  let operador = document.getElementById("operador").value;
  let valor = document.getElementById("valor").value;
  let motivo = document.getElementById("motivo").value;
  let valorAlterado = tipo === "Alteração" ? document.getElementById("valorAlterado").value : null;
  let assinatura = obterAssinaturaBase64(); // Captura a assinatura
  
  // Aqui você pode salvar essas informações ou apenas exibir como exemplo
  let ocorrencia = {
    tipo,
    dataHora,
    operador,
    valor,
    motivo,
    valorAlterado,
    assinatura
  };

  // Exibir as ocorrências salvas
  let ocorrenciasContainer = document.getElementById("ocorrencias");
  let ocorrenciaDiv = document.createElement("div");
  ocorrenciaDiv.innerHTML = `
    <p><strong>Tipo:</strong> ${ocorrencia.tipo}</p>
    <p><strong>Data e Hora:</strong> ${ocorrencia.dataHora}</p>
    <p><strong>Operador:</strong> ${ocorrencia.operador}</p>
    <p><strong>Valor:</strong> ${ocorrencia.valor}</p>
    <p><strong>Motivo:</strong> ${ocorrencia.motivo}</p>
    ${ocorrencia.valorAlterado ? `<p><strong>Valor Alterado:</strong> ${ocorrencia.valorAlterado}</p>` : ""}
    <img src="${ocorrencia.assinatura}" alt="Assinatura" />
  `;
  ocorrenciasContainer.appendChild(ocorrenciaDiv);
}

// Limpar a assinatura
function limparAssinatura() {
  const canvas = document.getElementById("assinaturaCanvas");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Captura a assinatura como base64
function obterAssinaturaBase64() {
  const canvas = document.getElementById('assinaturaCanvas');
  return canvas.toDataURL();
}

// Função para baixar relatório
function baixarRelatorio() {
  let relatorio = gerarRelatorio();
  let blob = new Blob([relatorio], { type: "text/plain;charset=utf-8" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "relatorio.txt";
  link.click();
}

// Função para gerar o relatório
function gerarRelatorio() {
  let ocorrenciasContainer = document.getElementById("ocorrencias");
  return ocorrenciasContainer.innerText;
}

// Função para compartilhar relatório e fotos
function compartilharRelatorio() {
  let relatorio = gerarRelatorio();  // Função que gera o relatório textual

  // Captura as fotos tiradas
  let fotos = [];
  let fotoInput = document.getElementById('foto');
  if (fotoInput.files.length > 0) {
    fotos = Array.from(fotoInput.files);
  }

  // Enviar o relatório + fotos
  const dadosParaCompartilhar = {
    relatorio: relatorio,
    fotos: fotos
  };

  // Aqui você pode usar uma API de compartilhamento ou apenas mostrar um link para compartilhar
  console.log("Relatório:", dadosParaCompartilhar.relatorio);
  console.log("Fotos:", dadosParaCompartilhar.fotos);
  // Exemplo de como as fotos podem ser compartilhadas:
  fotos.forEach(foto => {
    // Aqui você pode enviar as fotos via links ou mesmo compartilhar via aplicativos do celular
    console.log("Foto a ser compartilhada:", URL.createObjectURL(foto));
  });

  alert('Relatório e fotos prontos para compartilhar!');
}
