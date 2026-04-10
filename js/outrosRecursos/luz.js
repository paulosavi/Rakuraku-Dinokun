import { pararDinoTelaPrincipal, telaPrincipal } from "../animacao/dinoFase1Animacao.js";
import { habilitarEsc, usoDoEsc } from "../principal/telaInicial.js";
import { getFrameJQuery } from "../frames/framesLoader.js";

var luzOn = getFrameJQuery("controles", "luzOn");
var luzOff = getFrameJQuery("controles", "luzOff");

var painelDeLuz = false;
var estadoAtualDaLuz = true;
var interruptorOn = true;

function alterarInterruptor(boleano){
    interruptorOn = boleano;
}

function alterarEstadoAtualDaLuz(boleano){
    estadoAtualDaLuz = boleano;
}

function mostrarPainelDeLuz(bolenano){
    painelDeLuz = bolenano;
}

function luz( luzOnOuOff ){
    habilitarEsc(true);
    $(".pixel").removeClass("preto");
    luzOnOuOff.toggleClass("preto");
    return
}

export { 
    luz, 
    luzOn, 
    luzOff, 
    painelDeLuz, 
    mostrarPainelDeLuz, 
    estadoAtualDaLuz, 
    alterarEstadoAtualDaLuz, 
    interruptorOn,
    alterarInterruptor
}

