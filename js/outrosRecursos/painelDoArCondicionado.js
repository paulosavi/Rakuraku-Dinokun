import { habilitarEsc, usoDoEsc } from "../principal/telaInicial.js";
import { getFrame } from "../frames/framesLoader.js";

var arcondicionadoOn = await getFrame("switchOn", 0);
var arcondicionadoOff = await getFrame("switchOff", 0);

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
    painel.addClass("preto");
    return
}

export { arcondicionadoOff, arcondicionadoOn, painelDoArcondicionado, estadoAtualDoArcondicionado, alterarEstadoAtualDoArcondicionado, mostrarPainelDoArcondionado, arcondicionado }
