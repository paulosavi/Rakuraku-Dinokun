import { habilitarEsc, usoDoEsc } from "../principal/telaInicial.js";
import { getFrameJQuery } from "../frames/framesLoader.js";

var arcondicionadoOn = getFrameJQuery("controles", "arOn");
var arcondicionadoOff = getFrameJQuery("controles", "arOff");

var painelDoArcondicionado = false;
var estadoAtualDoArcondicionado = "ligar";

function alterarEstadoAtualDoArcondicionado(boleano){
    estadoAtualDoArcondicionado = boleano;
}

function mostrarPainelDoArcondionado(bolenano){
    painelDoArcondicionado = bolenano;
}

function arcondicionado( painel ){
    habilitarEsc(true);
    $(".pixel").removeClass("preto");
    painel.toggleClass("preto");
    return
}

export { arcondicionadoOff, arcondicionadoOn, painelDoArcondicionado, estadoAtualDoArcondicionado, alterarEstadoAtualDoArcondicionado, mostrarPainelDoArcondionado, arcondicionado }
