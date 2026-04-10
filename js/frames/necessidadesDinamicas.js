import { obterStats } from "../principal/stats.js";
import { getFrameMatrix } from "./framesLoader.js";

// Pré-carrega todas as matrizes dos painéis de stats
// Cada arquivo (feed0.json, feed1.json, etc.) tem um único frame

// Fome (5 níveis: 0 a 4)
const feedMatrices = [
    await getFrameMatrix("feed0", 0),
    await getFrameMatrix("feed1", 0),
    await getFrameMatrix("feed2", 0),
    await getFrameMatrix("feed3", 0),
    await getFrameMatrix("feed4", 0)
];

// Sede (5 níveis: 0 a 4)
const hydrationMatrices = [
    await getFrameMatrix("hydration0", 0),
    await getFrameMatrix("hydration1", 0),
    await getFrameMatrix("hydration2", 0),
    await getFrameMatrix("hydration3", 0),
    await getFrameMatrix("hydration4", 0)
];

// Humor (6 níveis: 0 a 5)
const happinessMatrices = [
    await getFrameMatrix("happiness0", 0),
    await getFrameMatrix("happiness1", 0),
    await getFrameMatrix("happiness2", 0),
    await getFrameMatrix("happiness3", 0),
    await getFrameMatrix("happiness4", 0),
    await getFrameMatrix("happiness5", 0)
];

// Educação (5 níveis: 0 a 4)
const schoolMatrices = [
    await getFrameMatrix("school0", 0),
    await getFrameMatrix("school1", 0),
    await getFrameMatrix("school2", 0),
    await getFrameMatrix("school3", 0),
    await getFrameMatrix("school4", 0)
];

// Telas estáticas
const temperaturaMatrix = await getFrameMatrix("temperature", 0);
const weightAgeMatrix = await getFrameMatrix("weightAge", 0);

// Dígitos 3x5 pixels para renderizar números na tela
const DIGITOS = {
    0: [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
    1: [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
    2: [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
    3: [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
    4: [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
    5: [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
    6: [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
    7: [[1,1,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
    8: [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
    9: [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]]
};

// Acende os pixels de uma matriz 16x19 na tela
function acenderMatriz(matriz) {
    if (!matriz || !Array.isArray(matriz)) return;
    for (let r = 0; r < matriz.length; r++) {
        const row = matriz[r];
        if (!Array.isArray(row)) continue;
        for (let c = 0; c < row.length; c++) {
            if (row[c] === 1) {
                const letter = String.fromCharCode(65 + r);
                const colStr = (c + 1).toString().padStart(2, "0");
                $("." + letter + colStr).addClass("preto");
            }
        }
    }
}

// === RENDERIZADORES ===

function renderHumor() {
    const stats = obterStats();
    const nivel = Math.max(0, Math.min(5, stats.humor));
    acenderMatriz(happinessMatrices[nivel]);
}

function renderTemperatura() {
    // Renderiza o frame base (termômetro e °C)
    // Depois sobrescreve os dígitos com o valor real da temperatura
    const stats = obterStats();
    var temp = Math.max(0, Math.min(99, Math.round(stats.temperatura)));
    var dezena = Math.floor(temp / 10);
    var unidade = temp % 10;

    // Copia a matriz base para não modificar o original
    var matriz = temperaturaMatrix.map(row => [...row]);

    // Limpa a área dos dígitos (linhas 3-7, colunas 8-10 e 12-14)
    for (let r = 3; r <= 7; r++) {
        for (let c = 8; c <= 10; c++) matriz[r][c] = 0;
        for (let c = 12; c <= 14; c++) matriz[r][c] = 0;
    }

    // Desenha o dígito da dezena (linhas 3-7, colunas 8-10)
    var digitoDezena = DIGITOS[dezena];
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
            matriz[r + 3][c + 8] = digitoDezena[r][c];
        }
    }

    // Desenha o dígito da unidade (linhas 3-7, colunas 12-14)
    var digitoUnidade = DIGITOS[unidade];
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
            matriz[r + 3][c + 12] = digitoUnidade[r][c];
        }
    }

    acenderMatriz(matriz);
}

function renderSede() {
    const stats = obterStats();
    const nivel = Math.max(0, Math.min(4, stats.sede));
    acenderMatriz(hydrationMatrices[nivel]);
}

function renderFome() {
    const stats = obterStats();
    const nivel = Math.max(0, Math.min(4, stats.fome));
    acenderMatriz(feedMatrices[nivel]);
}

function desenharDigito(matriz, digito, linhaInicio, colunaInicio) {
    var pixels = DIGITOS[digito];
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
            matriz[linhaInicio + r][colunaInicio + c] = pixels[r][c];
        }
    }
}

function renderPesoEIdade() {
    const stats = obterStats();
    var matriz = weightAgeMatrix.map(row => [...row]);

    // === PESO (3 dígitos, linhas 2-6, colunas 0-2, 4-6, 8-10) ===
    var peso = Math.max(0, Math.min(999, Math.round(stats.peso)));
    var centena = Math.floor(peso / 100);
    var dezena = Math.floor((peso % 100) / 10);
    var unidade = peso % 10;

    // Limpa área dos 3 dígitos
    for (let r = 2; r <= 6; r++) {
        for (let c = 0; c <= 2; c++) matriz[r][c] = 0;
        for (let c = 4; c <= 6; c++) matriz[r][c] = 0;
        for (let c = 8; c <= 10; c++) matriz[r][c] = 0;
    }

    if (peso >= 100) {
        desenharDigito(matriz, centena, 2, 0);
        desenharDigito(matriz, dezena, 2, 4);
        desenharDigito(matriz, unidade, 2, 8);
    } else if (peso >= 10) {
        desenharDigito(matriz, dezena, 2, 4);
        desenharDigito(matriz, unidade, 2, 8);
    } else {
        desenharDigito(matriz, unidade, 2, 8);
    }

    // === IDADE (até 2 dígitos, linhas 11-15) ===
    var idade = Math.max(0, Math.min(99, stats.idade));
    var idadeDezena = Math.floor(idade / 10);
    var idadeUnidade = idade % 10;

    // Limpa área dos dígitos de idade (colunas 12-14 e 16-18)
    for (let r = 11; r <= 15; r++) {
        for (let c = 12; c <= 14; c++) matriz[r][c] = 0;
        for (let c = 16; c <= 18; c++) matriz[r][c] = 0;
    }

    if (idade >= 10) {
        desenharDigito(matriz, idadeDezena, 11, 12);
        desenharDigito(matriz, idadeUnidade, 11, 16);
    } else {
        desenharDigito(matriz, idadeUnidade, 11, 16);
    }

    acenderMatriz(matriz);
}

function renderEducacao() {
    const stats = obterStats();
    const nivel = Math.max(0, Math.min(4, stats.educacao));
    acenderMatriz(schoolMatrices[nivel]);
}

// Ordem: humor, temperatura, sede, fome, pesoEIdade, estudos
const renderizadores = [renderHumor, renderTemperatura, renderSede, renderFome, renderPesoEIdade, renderEducacao];

function renderNecessidade(indice) {
    $(".pixel").removeClass("preto");
    if (indice >= 0 && indice < renderizadores.length) {
        renderizadores[indice]();
    }
}

export { renderNecessidade };
