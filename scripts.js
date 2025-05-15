import showResults from "./data-semana.js";

const resultados = showResults(); // resultados importados do Database
const mostrarNaTela = document.querySelector("#output"); // Cria Section com os dados na tela
const seletorData = document.querySelector("#seletor-data"); // Selecionar Data
const seletorJogador = document.querySelector("#seletor-jogador"); // Selecionar Jogador

const datasUnicas = [...new Set(resultados.map((resultado) => resultado.data))];
// Preencher o select com as datas únicas
datasUnicas.forEach((data) => {
  const opcao = document.createElement("Option");
  opcao.value = data;
  opcao.textContent = data;
  seletorData.appendChild(opcao);
});

const jogadorUnico = [
  ...new Set(resultados.map((resultado) => resultado.nome)),
];
// Preencher o select com jogadores únicos
jogadorUnico.forEach((nome) => {
  const opcao = document.createElement("Option");
  opcao.value = nome;
  opcao.textContent = nome;
  seletorJogador.appendChild(opcao);
});

// FUNÇAO: Atualiza a tela com base nos filtros
function atualizarResultados() {
  const dataSelecionada = seletorData.value;
  const jogadorSelecionado = seletorJogador.value;

  mostrarNaTela.innerHTML = "";

  if (dataSelecionada === "" && jogadorSelecionado === "") {
    mostrarNaTela.innerHTML = `<p class="text-center text-indigo-500 text-lg font-semibold mt-6 mb-4">Selecione uma data ou um jogador para ver o ranking.</p>`;
    // mudar para mostrar placar do dia >>>>>>>>>>>>>>>>>
    return;
  }

  let resultadosFiltrados = resultados.filter((r) => {
    const filtroData = dataSelecionada ? r.data === dataSelecionada : true;
    const filtroJogador = jogadorSelecionado
      ? r.nome === jogadorSelecionado
      : true;
    return filtroData && filtroJogador;
  });

  if (resultadosFiltrados.length === 0) {
    mostrarNaTela.innerHTML = `<h3>Nenhum resultado encontrado.</h3>`;
    return;
  }

  // Agrupado por data
  const agrupadoPorData = {};

  resultadosFiltrados.forEach((r) => {
    const tempoCorrigido = r.flawless ? r.segundos : r.segundos + 45;
    const penalidade = r.flawless ? 0 : 45;

    if (!agrupadoPorData[r.data]) agrupadoPorData[r.data] = {};
    if (!agrupadoPorData[r.data][r.jogo]) agrupadoPorData[r.data][r.jogo] = [];

    agrupadoPorData[r.data][r.jogo].push({
      nome: r.nome,
      tempo: tempoCorrigido,
      original: r.segundos,
      penalidade: penalidade,
    });
  });

  const datasOrdenadas = Object.keys(agrupadoPorData).sort();

  datasOrdenadas.forEach((data) => {
    //mostrarNaTela.innerHTML += `<h3>📅 ${data}</h3>`;
    // Formatar apenas para exibição
    const dataFormatada = new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Mostrar com estilo
    /*     mostrarNaTela.innerHTML += `
  <h3 class="text-lg font-semibold text-indigo-600 mb-2 flex items-center gap-2">
    📅 <span>${dataFormatada}</span>
  </h3>
`; */
    mostrarNaTela.innerHTML += `
  <h3 class="text-2xl font-semibold text-indigo-600 mb-2 mt-6 flex items-center gap-2 justify-center text-center">
    📅 <span>${dataFormatada}</span>
  </h3>
`;

    const jogos = agrupadoPorData[data];

    for (const jogo in jogos) {
      const blocoJogo = document.createElement("div");
      blocoJogo.className =
        "border border-gray-300 rounded-2x1 shadow-sm p-4 my-2 bg-gray-50";

      //for (const jogo in jogos) {
      const titulo = document.createElement("h4");
      titulo.className = "text-center text-2xl font-bold text-indigo-600 mb-2"; //mb-4
      titulo.textContent = `${jogo}:`;
      //mostrarNaTela.appendChild(titulo);
      blocoJogo.appendChild(titulo);
      //mostrarNaTela.appendChild(document.createElement("br"));

      // Ordenar os jogadores pelo tempo
      jogos[jogo].sort((a, b) => a.tempo - b.tempo);

      jogos[jogo].forEach((entrada, index, array) => {
        const apenasDataSelecionada =
          seletorData.value && !seletorJogador.value;

        let medalha = "";
        if (apenasDataSelecionada) {
          if (index === 0) {
            medalha = "🥇";
          } else if (index === 1) {
            medalha = "🥈";
          } else if (index === 2) {
            medalha = "🥉";
          } else if (index === array.length - 1) {
            medalha = "🍍";
          }
        }

        const linha = document.createElement("p");
        linha.className = "text-gray-600 mb-1";
        if (entrada.penalidade) {
          //linha.innerHTML = `${medalha} ${entrada.nome} - ${entrada.original} + <strong style="color:red;">${entrada.penalidade}</strong> = <strong>${entrada.tempo}</strong> segundos`;
          linha.innerHTML = `${medalha} <span class="font-semibold">${entrada.nome}</span> - ${entrada.original} + <span class="text-red-600 font-bold">${entrada.penalidade}</span> = <span class="font-semibold">${entrada.tempo}</span> segundos`;
        } else {
          //linha.innerHTML = `${medalha} ${entrada.nome} - <strong>${entrada.tempo}</strong> segundos`;
          linha.innerHTML = `${medalha} <span class="font-semibold">${entrada.nome}</span> - <span class="font-semibold">${entrada.tempo}</span> segundos`;
        }

        //mostrarNaTela.appendChild(linha);
        blocoJogo.appendChild(linha);
      });

      mostrarNaTela.appendChild(document.createElement("br"));
      mostrarNaTela.appendChild(blocoJogo);
    }
  });

  // === MELHORES TEMPOS DO JOGADOR ===
  if (jogadorSelecionado) {
    const melhores = {};
    resultadosFiltrados.forEach((r) => {
      const tempoCorrigido = r.flawless ? r.segundos : r.segundos + 45;
      if (!melhores[r.jogo] || tempoCorrigido < melhores[r.jogo].tempo) {
        melhores[r.jogo] = {
          tempo: tempoCorrigido,
          original: r.segundos,
          penalidade: r.flawless ? 0 : 45,
          data: r.data,
        };
      }
    });

    mostrarNaTela.innerHTML += `<h3>Melhores tempos de ${jogadorSelecionado}</h3>`;
    for (const jogo in melhores) {
      const entrada = melhores[jogo];
      const linha = document.createElement("p");
      linha.className = "text-gray-600 mb-1";
      if (entrada.penalidade > 0) {
        linha.innerHTML = `${jogo}: ${entrada.original} + <strong style="color:red;">${entrada.penalidade}</strong> = <strong>${entrada.tempo}</strong> segundos (em ${entrada.data})`;
      } else {
        linha.innerHTML = `${jogo}: <strong>${entrada.tempo}</strong> segundos (em ${entrada.data})`;
      }
      mostrarNaTela.appendChild(linha);
    }
  }
}

// Listeners para os dois seletores
window.onload = () => {
  atualizarResultados();
};
seletorData.addEventListener("change", atualizarResultados);
seletorJogador.addEventListener("change", atualizarResultados);
