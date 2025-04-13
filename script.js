// Função para pegar a data e hora automaticamente
function obterDataHora() {
  const data = new Date();
  const dataFormatada = data.toLocaleDateString("pt-BR");
  const horaFormatada = data.toLocaleTimeString("pt-BR");

  document.getElementById("data").value = dataFormatada;
  document.getElementById("hora").value = horaFormatada;
}

// Função para mostrar ou esconder os campos com base no tipo de ocorrência
function mostrarCamposEspecificos() {
  const tipo = document.getElementById("tipo").value;

  // Esconde/mostra o campo 'Valor Alterado' e 'Foto' com base no tipo de ocorrência
  if (tipo === "Alteração") {
    document.getElementById("valorAlteradoDiv").style.display = "block";
    document.getElementById("fotoDiv").style.display = "block";
  } else {
    document.getElementById("valorAlteradoDiv").style.display = "none";
    document.getElementById("fotoDiv").style.display = "none";
  }
}

// Função para salvar a ocorrência
function salvarOcorrencia() {
  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const operador = document.getElementById("operador").value;
  const motivo = document.getElementById("motivo").value;
  const valor = document.getElementById("valor").value;
  const valorAlterado = document.getElementById("valorAlterado").value;
  
  const ocorrencia = {
    tipo,
    data,
    hora,
    operador,
    motivo,
    valor,
    valorAlterado: tipo === "Alteração" ? valorAlterado : null,
  };

  // Salvar ocorrência na lista (simulação)
  const lista = JSON.parse(localStorage.getItem("ocorrencias")) || [];
  lista.push(ocorrencia);
  localStorage.setItem("ocorrencias", JSON.stringify(lista));

  // Mostrar ocorrências registradas
  mostrarOcorrencias();
}

// Função para mostrar as ocorrências registradas
function mostrarOcorrencias() {
  const lista = JSON.parse(localStorage.getItem("ocorrencias")) || [];
  const ocorrenciasLista = document.getElementById("ocorrencias-lista");

  ocorrenciasLista.innerHTML = "";
  lista.forEach((ocorrencia, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>Tipo:</strong> ${ocorrencia.tipo} <br>
      <strong>Data:</strong> ${ocorrencia.data} <br>
      <strong>Hora:</strong> ${ocorrencia.hora} <br>
      <strong>Motivo:</strong> ${ocorrencia.motivo} <br>
      <strong>Valor:</strong> ${ocorrencia.valor} <br>
      ${ocorrencia.valorAlterado ? `<strong>Valor Alterado:</strong> ${ocorrencia.valorAlterado} <br>` : ""}
      <button onclick="excluirOcorrencia(${index})">Excluir</button>
    `;
    ocorrenciasLista.appendChild(div);
  });
}

// Função para excluir uma ocorrência
function excluirOcorrencia(index) {
  const lista = JSON.parse(localStorage.getItem("ocorrencias"));
  lista.splice(index, 1);
  localStorage.setItem("ocorrencias", JSON.stringify(lista));
  mostrarOcorrencias();
}

// Função para baixar o relatório
function baixarRelatorio() {
  const lista = JSON.parse(localStorage.getItem("ocorrencias")) || [];
  let relatorio = "";
  lista.forEach((ocorrencia) => {
    relatorio += `
      Tipo: ${ocorrencia.tipo} <br>
      Data: ${ocorrencia.data} <br>
      Hora: ${ocorrencia.hora} <br>
      Operador: ${ocorrencia.operador} <br>
      Motivo: ${ocorrencia.motivo} <br>
      Valor: ${ocorrencia.valor} <br>
      ${ocorrencia.valorAlterado ? `Valor Alterado: ${ocorrencia.valorAlterado} <br>` : ""}
      <br>
    `;
  });

  const blob = new Blob([relatorio], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "relatorio_ocorrencias.html";
  a.click();
}

// Função para compartilhar o relatório
function compartilharRelatorio() {
  const lista = JSON.parse(localStorage.getItem("ocorrencias")) || [];
  let relatorio = "";
  lista.forEach((ocorrencia) => {
    relatorio += `
      Tipo: ${ocorrencia.tipo} <br>
      Data: ${ocorrencia.data} <br>
      Hora: ${ocorrencia.hora} <br>
      Operador: ${ocorrencia.operador} <br>
      Motivo: ${ocorrencia.motivo} <br>
      Valor: ${ocorrencia.valor} <br>
      ${ocorrencia.valorAlterado ? `Valor Alterado: ${ocorrencia.valorAlterado} <br>` : ""}
      <br>
    `;
  });

  if (navigator.share) {
    navigator.share({
      title: "Relatório de Ocorrências",
      text: relatorio,
    });
  } else {
    alert("Compartilhamento não disponível no seu navegador.");
  }
}

// Chama a função para inicializar os campos
obterDataHora();
mostrarCamposEspecificos();
mostrarOcorrencias();
