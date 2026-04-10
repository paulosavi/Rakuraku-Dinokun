import { iconesDasComidas, framesDasComidas } from "../frames/comidasFrames.js";
import { alterarContadorIntervaloSemInteracao, contadorIntervaloSemInteracao, intervaloSemInteracao } from "../principal/intervaloSemInteracao.js";
import { habilitarEsc, usoDoEsc } from "../principal/telaInicial.js";

var comidaAtual = null;
var contadorComida = 0;
var percorrerComida;
var enterComida = false;
var escComida = false;

function permitirPercorrerComidas(boleano){
    percorrerComida = boleano;
}

function alterarContadorComida(valor){
    contadorComida = valor;
}

function permitirComerComida(boleano){
    enterComida = boleano;
}

function opcoesDeComida(){
        habilitarEsc(true);
        alterarContadorIntervaloSemInteracao(0);

        $(".pixel").removeClass("preto");
        iconesDasComidas[contadorComida].addClass("preto");
        comidaAtual = framesDasComidas[contadorComida];
        escComida = true;

}

export {
    opcoesDeComida,
    alterarContadorComida,
    contadorComida,
    percorrerComida,
    permitirPercorrerComidas,
    permitirComerComida,
    enterComida,
    comidaAtual
}
