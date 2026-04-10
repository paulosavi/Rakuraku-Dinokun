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

    // Mostra as duas mãos ao mesmo tempo (como no original)
    $(".pixel").removeClass("preto");
    lanceAtualDoJogador.addClass("preto");
    lancesDoDinoFrames[indiceAleatorio].addClass("preto");

    // Após 2 segundos exibindo ambas, compara os lances
    setTimeout(()=>{
        compararLances();
    }, 2000)

}

export { mostrarlanceDoDino, lanceDoDino, pontosDoDino, alterarPontosDoDino }
