import { carregarEstado, salvarEstado } from "./saveSystem.js";

// Relógio interno do pet - igual ao brinquedo original
// O usuário define a hora/minuto e o relógio avança em tempo real a partir daí.
//
// Funciona assim:
// - ancora: timestamp real (Date.now()) do momento em que o relógio foi ajustado
// - tempoBase: timestamp interno correspondente ao momento da âncora
// - Tempo atual interno: tempoBase + (Date.now() - ancora)
//
// Se o usuário adiantar o relógio, o pet "vive" esse tempo (igual no original)

var ancora = Date.now();
var tempoBase = Date.now();
var inicializado = false;

function inicializarRelogio() {
    var estado = carregarEstado();
    if (estado && estado.relogio) {
        ancora = estado.relogio.ancora;
        tempoBase = estado.relogio.tempoBase;
        inicializado = true;
    }
}

function salvarRelogio() {
    salvarEstado({
        relogio: { ancora: ancora, tempoBase: tempoBase }
    });
}

// Define o relógio interno para uma hora/minuto específicos (mantém o dia atual)
function definirHora(hora, minuto) {
    var agoraDate = new Date();
    var novoTempo = new Date(
        agoraDate.getFullYear(), agoraDate.getMonth(), agoraDate.getDate(),
        hora, minuto || 0, 0, 0
    );

    ancora = Date.now();
    tempoBase = novoTempo.getTime();
    inicializado = true;
    salvarRelogio();
}

// Retorna o relógio já foi configurado
function relogioConfigurado() {
    return inicializado;
}

// Retorna o timestamp interno (substitui Date.now() em todo o jogo)
function agora() {
    return tempoBase + (Date.now() - ancora);
}

// Retorna um objeto Date com o tempo interno
function getDate() {
    return new Date(agora());
}

function getHoras() {
    return getDate().getHours();
}

function getMinutos() {
    return getDate().getMinutes();
}

function getSegundos() {
    return getDate().getSeconds();
}

export {
    inicializarRelogio,
    salvarRelogio,
    definirHora,
    relogioConfigurado,
    agora,
    getDate,
    getHoras,
    getMinutos,
    getSegundos
};
