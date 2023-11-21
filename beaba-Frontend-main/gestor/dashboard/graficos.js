async function graficos() {
  const grafico1Div = document.getElementById("grafico1");
  const grafico2Div = document.getElementById("grafico2");

  const squadId = await getSquadId();

  const iframe1 = document.createElement("iframe");

  const iframe2 = document.createElement("iframe");

  const srcGrafico1 = `http://127.0.0.1:5000/graficos/grafico1/${squadId}`;

  const srcGrafico2 = `http://127.0.0.1:5000/graficos/grafico2/${squadId}`;

  iframe1.src = srcGrafico1;

  iframe2.src = srcGrafico2;

  grafico1Div.appendChild(iframe1);

  grafico2Div.appendChild(iframe2);
}

graficos();

async function getSquadId() {
  const token = localStorage.getItem("token");

  const headers = {
    "x-access-token": token,
  };

  const response = await fetch("http://localhost:3300/validaToken", {
    method: "POST",
    headers: headers,
  });

  const resposta = await response.json();

  return resposta.squadId;
}
