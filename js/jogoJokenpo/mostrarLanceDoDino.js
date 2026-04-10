import { intervaloSemInteracao, pararIntervaloSemInteracao } from "../principal/intervaloSemInteracao.js";
import { habilitarEsc } from "../principal/telaInicial.js";
import { compararLances } from "./compararLances.js";
import { alterarVezDoJogador, lanceAtualDoJogador, vezDoJogador } from "./escolherLanceDoJogador.js";
import { tiposDeLance } from "./iniciarJokenpo.js";
import { lancesDoDinoFrames } from "./jogoJokenpoFrames.js";

var lanceDoDino = "";
var pontosDoDino = 0;

function alterarPontosDoDino(valor){
    pontosDoDino = valor;
}

function mostrarlanceDoDino(){

    habilitarEsc(false);
    pararIntervaloSemInteracao(true);
    alterarVezDoJogador(false);

    let indiceAleatorio = Math.floor(Math.random() * 3);
    lanceDoDino = tiposDeLance[indiceAleatorio];
    let contador = 0;

    const intervalo = setInterval(()=>{
        $(".pixel").removeClass("preto");

        if(contador == 0){
           lancesDoDinoFrames[indiceAleatorio].addClass("preto");
        }
        if(contador == 1){
            lanceAtualDoJogador.addClass("preto");
        }
        if(contador == 2){
            clearInterval(intervalo);
            compararLances();
        }
        contador++;
    }, 1500)

}

export { mostrarlanceDoDino, lanceDoDino, pontosDoDino, alterarPontosDoDino }
