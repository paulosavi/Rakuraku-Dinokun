import { obterStats } from "../principal/stats.js";
import { getFramePixels } from "./framesLoader.js";

// Acende uma lista de classes de pixel (strings sem ponto)
function acender(classes) {
    classes.forEach(function(c) {
        if (c) $("." + c).addClass("preto");
    });
}

// === FOME (4 pratos com pirâmide de comida) - carregados do frames.json ===
var PRATOS_CHEIOS = [
    getFramePixels("necessidades", "prato_1_cheio"),
    getFramePixels("necessidades", "prato_2_cheio"),
    getFramePixels("necessidades", "prato_3_cheio"),
    getFramePixels("necessidades", "prato_4_cheio")
];
var PRATOS_VAZIOS = [
    getFramePixels("necessidades", "prato_1_vazio"),
    getFramePixels("necessidades", "prato_2_vazio"),
    getFramePixels("necessidades", "prato_3_vazio"),
    getFramePixels("necessidades", "prato_4_vazio")
];

// === SEDE (4 copos com líquido) - carregados do frames.json ===
var COPOS_CHEIOS = [
    getFramePixels("necessidades", "copo_1_cheio"),
    getFramePixels("necessidades", "copo_2_cheio"),
    getFramePixels("necessidades", "copo_3_cheio"),
    getFramePixels("necessidades", "copo_4_cheio")
];
var COPOS_VAZIOS = [
    getFramePixels("necessidades", "copo_1_vazio"),
    getFramePixels("necessidades", "copo_2_vazio"),
    getFramePixels("necessidades", "copo_3_vazio"),
    getFramePixels("necessidades", "copo_4_vazio")
];

// === HUMOR - 6 faces completas carregadas do frames.json ===
// O usuário edita estas faces via editar.html
var FACES_HUMOR = [
    getFramePixels("necessidades", "humor_nivel_0_muito_triste"),
    getFramePixels("necessidades", "humor_nivel_1_triste"),
    getFramePixels("necessidades", "humor_nivel_2_neutro"),
    getFramePixels("necessidades", "humor_nivel_3_levemente_feliz"),
    getFramePixels("necessidades", "humor_nivel_4_feliz"),
    getFramePixels("necessidades", "humor_nivel_5_muito_feliz")
];

// === Frames base carregados do JSON ===
// Termômetro sem "25C" hardcoded (temperatura é dinâmica)
var TEMPERATURA_BASE = getFramePixels("necessidades", "temperatura_termometro");
var PESO_IDADE_BASE = getFramePixels("necessidades", "pesoEIdade");
var EDUCACAO_BASE = getFramePixels("necessidades", "estudos");

// === DÍGITOS 3x5 (para sobrepor valores no frame de educação/peso/temperatura) ===
var DIGITOS_PEQUENOS = [
    // 0
    [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,2],[3,0],[3,2],[4,0],[4,1],[4,2]],
    // 1
    [[0,1],[1,0],[1,1],[2,1],[3,1],[4,0],[4,1],[4,2]],
    // 2
    [[0,0],[0,1],[0,2],[1,2],[2,0],[2,1],[2,2],[3,0],[4,0],[4,1],[4,2]],
    // 3
    [[0,0],[0,1],[0,2],[1,2],[2,0],[2,1],[2,2],[3,2],[4,0],[4,1],[4,2]],
    // 4
    [[0,0],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],[3,2],[4,2]],
    // 5
    [[0,0],[0,1],[0,2],[1,0],[2,0],[2,1],[2,2],[3,2],[4,0],[4,1],[4,2]],
    // 6
    [[0,0],[0,1],[0,2],[1,0],[2,0],[2,1],[2,2],[3,0],[3,2],[4,0],[4,1],[4,2]],
    // 7
    [[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2]],
    // 8
    [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],[3,0],[3,2],[4,0],[4,1],[4,2]],
    // 9
    [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],[3,2],[4,0],[4,1],[4,2]]
];

function px(row, col) {
    if (row < 1 || row > 16 || col < 1 || col > 19) return null;
    return String.fromCharCode(64 + row) + (col < 10 ? "0" + col : "" + col);
}

function desenharDigitoPequeno(digito, rowIni, colIni) {
    var pixels = [];
    DIGITOS_PEQUENOS[digito].forEach(function(o) {
        var p = px(rowIni + o[0], colIni + o[1]);
        if (p) pixels.push(p);
    });
    return pixels;
}

function desenharNumeroPequeno(numero, rowIni, colIni) {
    var str = String(Math.abs(Math.floor(numero)));
    var pixels = [];
    for (var i = 0; i < str.length; i++) {
        pixels = pixels.concat(desenharDigitoPequeno(parseInt(str[i]), rowIni, colIni + (i * 4)));
    }
    return pixels;
}

// === RENDERIZADORES ===

// 0: Humor - face com expressão dinâmica
function renderHumor() {
    var stats = obterStats();
    var nivel = Math.max(0, Math.min(5, stats.humor));
    acender(FACES_HUMOR[nivel]);
}

// Desenha letra "C" 3x5 para °C
function desenharC(rowIni, colIni) {
    var pixels = [];
    var offsets = [[0,0],[0,1],[0,2],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2]];
    offsets.forEach(function(o) {
        var p = px(rowIni + o[0], colIni + o[1]);
        if (p) pixels.push(p);
    });
    return pixels;
}

// 1: Temperatura - termômetro + número dinâmico + ° + C
function renderTemperatura() {
    var stats = obterStats();
    acender(TEMPERATURA_BASE);

    var temp = Math.round(stats.temperatura);
    var str = String(Math.abs(temp));
    var pixels = [];

    // Desenhar os dígitos na posição original do "25" (row D = 4, começando col 9)
    for (var i = 0; i < str.length; i++) {
        pixels = pixels.concat(desenharDigitoPequeno(parseInt(str[i]), 4, 9 + (i * 4)));
    }

    // Adicionar "C" logo após o número
    var cCol = 9 + (str.length * 4);
    if (cCol + 2 <= 19) {
        pixels = pixels.concat(desenharC(4, cCol));

        // Adicionar a "bolinha" do grau (° ) acima, antes do C
        // No frame original era B16 quando a temperatura era 25
        var grauP = px(2, cCol - 1); // row B = 2
        if (grauP) pixels.push(grauP);
    }

    acender(pixels);
}

// 2: Sede - mostra copos dinamicamente
function renderSede() {
    var stats = obterStats();
    var pixels = [];

    for (var i = 0; i < 4; i++) {
        if (i < stats.sede) {
            pixels = pixels.concat(COPOS_CHEIOS[i]);
        } else {
            pixels = pixels.concat(COPOS_VAZIOS[i]);
        }
    }

    acender(pixels);
}

// 3: Fome - mostra pratos dinamicamente
function renderFome() {
    var stats = obterStats();
    var pixels = [];

    for (var i = 0; i < 4; i++) {
        if (i < stats.fome) {
            pixels = pixels.concat(PRATOS_CHEIOS[i]);
        } else {
            pixels = pixels.concat(PRATOS_VAZIOS[i]);
        }
    }

    acender(pixels);
}

// 4: Peso e Idade - frame original + números sobrepostos
function renderPesoEIdade() {
    var stats = obterStats();
    acender(PESO_IDADE_BASE);

    // Sobrepor peso (lado esquerdo) e idade (lado direito) em área disponível
    // Usar rows K-O como área livre
    var pxPeso = desenharNumeroPequeno(stats.peso, 11, 14); // row K = 11
    var pxIdade = desenharNumeroPequeno(stats.idade, 14, 14); // row N = 14
    acender(pxPeso.concat(pxIdade));
}

// 5: Educação - frame original + letra do nível
function renderEducacao() {
    var stats = obterStats();
    acender(EDUCACAO_BASE);

    // Sobrepor número do nível (0-4) em área livre
    var pxNivel = desenharNumeroPequeno(stats.educacao, 13, 4); // row M = 13
    acender(pxNivel);
}

// === LISTA DE RENDERIZADORES ===
// Ordem: humor, temperatura, sede, fome, pesoEIdade, estudos
var renderizadores = [renderHumor, renderTemperatura, renderSede, renderFome, renderPesoEIdade, renderEducacao];

function renderNecessidade(indice) {
    $(".pixel").removeClass("preto");
    if (indice >= 0 && indice < renderizadores.length) {
        renderizadores[indice]();
    }
}

export { renderNecessidade }
