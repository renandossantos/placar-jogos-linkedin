import showResults from "./resultados-maio.js";

const resultados = showResults(); // resultados importados do Database
const mostrarNaTela = document.querySelector("#output"); // Cria Section com os dados na tela
const seletorData = document.querySelector("#seletor-data"); // Selecionar Data
const seletorJogador = document.querySelector("#seletor-jogador"); // Selecionar Jogador

const datasUnicas = [...new Set(resultados.map((resultado) => resultado.data))];

const jogadorUnico = [
  ...new Set(resultados.map((resultado) => resultado.nome)),
];

// Preencher o select com as datas únicas
datasUnicas.forEach((data) => {
  const opcao = document.createElement("Option");
  opcao.value = data;
  opcao.textContent = data;
  seletorData.appendChild(opcao);
});

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

  if (!dataSelecionada && !jogadorSelecionado) {
    mostrarNaTela.textContent =
      "Selecione uma data ou um jogador para ver o ranking.";
    // mudar para mostrar placar do dia >>>>>>>>>>>>>>>>>
    return;
  }

  // Filtrar os resultados com base nos filtros selecionados
  const resultadosFiltrados = resultados.filter((r) => {
    const filtroData = dataSelecionada ? r.data === dataSelecionada : true;
    const filtroJogador = jogadorSelecionado
      ? r.nome === jogadorSelecionado
      : true;
    return filtroData && filtroJogador;
  });

  if (resultadosFiltrados.length === 0) {
    mostrarNaTela.textContent =
      "Nenhum resultado encontrado para os filtros selecionados.";
    return;
  }

  mostrarNaTela.innerHTML = "";

  // Agrupar por jogo
  //const jogos = {};

  // Agrupado por data
  const agrupadoPorData = {};

  resultadosFiltrados.forEach((r) => {
    const tempoCorrigido = r.flawless ? r.segundos : r.segundos + 45;

    if (!agrupadoPorData[r.data]) {
      agrupadoPorData[r.data] = {};
    }

    if (!agrupadoPorData[r.data][r.jogo]) {
      agrupadoPorData[r.data][r.jogo] = [];
    }

    //verifica se o jogo existe no objeto 'jogos'
    /* if (!jogos[r.jogo]) {
      jogos[r.jogo] = [];
    } */

    //jogos[r.jogo].push({
    agrupadoPorData[r.data][r.jogo].push({
      nome: r.nome,
      tempo: tempoCorrigido,
      original: r.segundos,
      penalidade: r.flawless ? 0 : 45,
    });
  });

  // Ordenar cada jogo por tempo
  /*  for (const jogo in jogos) {
    jogos[jogo].sort((a, b) => a.tempo - b.tempo);
  } */

  // Mostrar na tela
  /*   mostrarNaTela.innerHTML = "";

  if (dataSelecionada) {
    mostrarNaTela.innerHTML += `<h3>Data: ${dataSelecionada}</h3><br>`;
  } */

  // Mostrar agrupado na tela
  const datasOrdenadas = Object.keys(agrupadoPorData).sort();

  datasOrdenadas.forEach((data) => {
    mostrarNaTela.innerHTML += `<h3>Data: ${data}</h3><br>`;

    const jogos = agrupadoPorData[data];

    for (const jogo in jogos) {
      const titulo = document.createElement("strong");
      titulo.textContent = `${jogo}:`;
      mostrarNaTela.appendChild(titulo);
      mostrarNaTela.appendChild(document.createElement("br"));

      // Ordenar os jogadores pelo tempo
      jogos[jogo].sort((a, b) => a.tempo - b.tempo);

      jogos[jogo].forEach((entrada, index, array) => {
        const linha = document.createElement("div");

        let medalha = "";
        if (index === 0) {
          medalha = "🥇";
        } else if (index === 1) {
          medalha = "🥈";
        } else if (index === 2) {
          medalha = "🥉";
        } else if (index === array.length - 1) {
          medalha = "🍍";
        }

        if (entrada.penalidade) {
          linha.innerHTML = `${medalha} ${entrada.nome} - ${entrada.original} + <strong style="color:red;">${entrada.penalidade}</strong> = <strong>${entrada.tempo}</strong> segundos`;
        } else {
          linha.innerHTML = `${medalha} ${entrada.nome} - <strong>${entrada.tempo}</strong> segundos`;
        }

        mostrarNaTela.appendChild(linha);
      });

      mostrarNaTela.appendChild(document.createElement("br"));
    }
  });
}

// Listeners para os dois seletores
seletorData.addEventListener("change", atualizarResultados);
seletorJogador.addEventListener("change", atualizarResultados);
