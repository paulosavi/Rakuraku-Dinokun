import { pararIntervalo, pararIntervaloSemInteracao } from "../principal/intervaloSemInteracao.js";
import { habilitarEsc, usoDoEsc } from "../principal/telaInicial.js";
import { dinoArrotando } from "./dinoFase1Arrotando.js";
import { estaNatelaPrincipal } from "../principal/telaPrincipal.js";
var dinoEstaComendo = false;

function indicarSeDinoEstaComendo(boleano){
    dinoEstaComendo = boleano;
}

function comer(lista){
    estaNatelaPrincipal(false)
    habilitarEsc(false);
    pararIntervaloSemInteracao(true);
    dinoEstaComendo = true;

    let contador = 0;

    const intervalo = setInterval(() =>{
        $(".pixel").removeClass("preto");

        if(contador < lista.length){
            lista[contador].addClass("preto");
        }

        contador++;

        if(contador >= lista.length){
            clearInterval(intervalo);
            dinoArrotando();
            return;
        }
    }, 1000);
}

export { comer, dinoEstaComendo, indicarSeDinoEstaComendo }
