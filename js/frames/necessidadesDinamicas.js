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
    acenderMatriz(temperaturaMatrix);
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

function renderPesoEIdade() {
    acenderMatriz(weightAgeMatrix);
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
