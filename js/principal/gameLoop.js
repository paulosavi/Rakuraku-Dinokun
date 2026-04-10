import { obterStats, degradarStats, alterarStat, salvarStats } from "./stats.js";
import { carregarEstado } from "./saveSystem.js";
import { agora, getHoras } from "./relogioInterno.js";

var intervaloGameLoop = null;
var callbackMorte = null;  // callback chamado quando o pet morre

// Intervalo em ms para cada "tick" do jogo
// No oficial, degradação acontece a cada hora real
// Usamos 1 hora = 3600000ms
const INTERVALO_HORA = 3600000;

// Retorna true se a luz está acesa atualmente
function luzEstaAcesa() {
    var estado = carregarEstado();
    return estado && estado.estadoLuz === true;
}

// Checa quantas horas passaram desde a última atualização
// e aplica a degradação acumulada (para quando o browser esteve fechado)
function aplicarTempoOffline() {
    var stats = obterStats();
    var timestampAtual = agora();
    var diferenca = timestampAtual - stats.ultimaAtualizacao;
    var horasPassadas = Math.floor(diferenca / INTERVALO_HORA);

    if (horasPassadas > 0) {
        horasPassadas = Math.min(horasPassadas, 48);
        var estadoLuz = luzEstaAcesa();

        for (var i = 0; i < horasPassadas; i++) {
            var morreu = degradarStats(estadoLuz);
            atualizarIdade();
            if (morreu) break;
        }

        alterarStat("ultimaAtualizacao", timestampAtual);
        salvarStats();
    }
}

// Atualiza a idade baseado no tempo desde o nascimento
function atualizarIdade() {
    var stats = obterStats();
    var diasVividos = Math.floor((agora() - stats.nascimento) / (INTERVALO_HORA * 24));
    alterarStat("idade", diasVividos);
}

// Checa ciclo de sono baseado na hora real
function checarSono() {
    var horaAtual = getHoras();
    var stats = obterStats();

    // Dorme entre 21h e 9h
    if (horaAtual >= 21 || horaAtual < 9) {
        if (!stats.dormindo) {
            alterarStat("dormindo", true);
            salvarStats();
        }
    } else {
        if (stats.dormindo) {
            alterarStat("dormindo", false);
            salvarStats();
        }
    }
}

// Tick principal - executado a cada hora
function tick() {
    var stats = obterStats();
    if (!stats.vivo) {
        pararGameLoop();
        if (callbackMorte) callbackMorte();
        return;
    }

    checarSono();
    var morreu = degradarStats(luzEstaAcesa());
    atualizarIdade();
    alterarStat("ultimaAtualizacao", agora());
    salvarStats();

    if (morreu) {
        pararGameLoop();
        if (callbackMorte) callbackMorte();
    }
}

// Inicia o game loop
function iniciarGameLoop(onMorteCallback) {
    if (intervaloGameLoop) return;

    if (onMorteCallback) callbackMorte = onMorteCallback;

    aplicarTempoOffline();
    checarSono();

    // Se já morreu no tempo offline, dispara callback e não inicia
    var stats = obterStats();
    if (!stats.vivo) {
        if (callbackMorte) callbackMorte();
        return;
    }

    // Tick a cada hora
    intervaloGameLoop = setInterval(tick, INTERVALO_HORA);

    // Também checar sono a cada minuto
    setInterval(checarSono, 60000);
}

// Para o game loop
function pararGameLoop() {
    if (intervaloGameLoop) {
        clearInterval(intervaloGameLoop);
        intervaloGameLoop = null;
    }
}

export {
    iniciarGameLoop,
    pararGameLoop,
    checarSono,
    aplicarTempoOffline
}
