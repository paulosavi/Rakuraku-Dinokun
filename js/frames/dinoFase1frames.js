import { getAllFrames, getFrame } from "./framesLoader.js";
import { obterStats } from "../principal/stats.js";

// Cache de frames já carregados (evita recarregar toda vez)
var cache = {};

async function carregarFrames(nome) {
    if (!cache[nome]) {
        cache[nome] = await getAllFrames(nome);
    }
    return cache[nome];
}

// Retorna o sufixo do nome do frame baseado na fase e caminho de evolução
function getSufixoFase() {
    var stats = obterStats();
    var fase = stats.faseEvolucao;
    var caminho = stats.caminhoEvolucao;

    if (fase === 1) return "";           // idle.json
    if (fase === 2) return "2";          // idle2.json
    // Fase 3+ usa caminho de evolução
    if (caminho) return fase + caminho;  // idle3tyrannosaurus.json
    return fase + "brontosaurus";        // fallback
}

// Carrega frames para o estado atual do pet (fase + caminho)
async function carregarFramesPorFase(tipo) {
    var sufixo = getSufixoFase();
    var nome = tipo + sufixo;
    try {
        var frames = await carregarFrames(nome);
        if (frames && frames.length > 0) return frames;
    } catch(e) {}
    // Fallback: tenta sem sufixo (frame base)
    return await carregarFrames(tipo);
}

// Pré-carrega os frames da fase 1 (inicialização)
var idleFrames = await carregarFrames("idle");
var dormindoFrames = await carregarFrames("sleeping");
var dormindoLuzApagadaFrames = await carregarFrames("sleeping_mode_original");
var sujoFrames = await carregarFrames("dirty");
var doenteFrames = await carregarFrames("sick");
var frioFrames = await carregarFrames("cold");
var calorFrames = await carregarFrames("hot");
var mortoFrames = await carregarFrames("deadNeglect");

var dinoFase1Frame1 = idleFrames[0] || $();

// Mantém exports individuais para compatibilidade
var dinoDormindoFrame = dormindoFrames[0] || $();
var dinoSujoFrame = sujoFrames[0] || $();
var dinoDoenteFrame = doenteFrames[0] || $();
var dinoMortoFrame = mortoFrames[0] || $();

// Recarrega todos os frames para a fase atual
async function recarregarFramesParaFaseAtual() {
    idleFrames = await carregarFramesPorFase("idle");
    dormindoFrames = await carregarFramesPorFase("sleeping");
    sujoFrames = await carregarFramesPorFase("dirty");
    doenteFrames = await carregarFramesPorFase("sick");
    frioFrames = await carregarFramesPorFase("cold");
    calorFrames = await carregarFramesPorFase("hot");
    dinoFase1Frame1 = idleFrames[0] || $();
    dinoDormindoFrame = dormindoFrames[0] || $();
    dinoSujoFrame = sujoFrames[0] || $();
    dinoDoenteFrame = doenteFrames[0] || $();
}

export {
    dinoFase1Frame1,
    idleFrames,
    dinoDormindoFrame, dinoSujoFrame, dinoDoenteFrame, dinoMortoFrame,
    dormindoFrames, dormindoLuzApagadaFrames, sujoFrames, doenteFrames, frioFrames, calorFrames, mortoFrames,
    recarregarFramesParaFaseAtual, getSufixoFase, carregarFramesPorFase
};
