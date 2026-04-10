import { pararDinoTelaPrincipal, telaPrincipal } from "../animacao/dinoFase1Animacao.js";
import { habilitarEsc, usoDoEsc } from "../principal/telaInicial.js";
import { getFrame } from "../frames/framesLoader.js";

var luzOn = await getFrame("switchOn", 0);
var luzOff = await getFrame("switchOff", 0);

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
    luzOnOuOff.addClass("preto");
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

