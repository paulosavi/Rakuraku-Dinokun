import { alterarPontosDoJogador, lanceDoJogador, pontosDoJogador } from "./escolherLanceDoJogador.js";
import { alterarPontosDoDino, lanceDoDino, pontosDoDino } from "./mostrarLanceDoDino.js";
import { resultadoDosLances } from "./resultadoDoJogo.js";
import { resultadoJokenpo } from "../principal/stats.js";

var rodadas = 0;
var dinoVenceu; 
var valorParaJogador = 0;
var valorParaDino = 0;

function alterarRodadas(valor){
    rodadas = valor;
}


function compararLances(){
    rodadas++;
    if((lanceDoJogador === "papel" && lanceDoDino === "tesoura") || (lanceDoJogador === "pedra" && lanceDoDino === "papel") || (lanceDoJogador === "tesoura" && lanceDoDino === "pedra")){
        dinoVenceu = true;
        resultadoJokenpo(true);
        resultadoDosLances();
        valorParaDino++;
        alterarPontosDoDino(valorParaDino);
    }

    //dino não venceu
    if(lanceDoJogador === lanceDoDino){
        dinoVenceu = false;
        resultadoJokenpo(false);
        resultadoDosLances();
    }

    if((lanceDoJogador === "papel" && lanceDoDino === "pedra") || (lanceDoJogador === "pedra" && lanceDoDino === "tesoura") || (lanceDoJogador === "tesoura" && lanceDoDino === "papel")){
        dinoVenceu = false;
        resultadoJokenpo(false);
        resultadoDosLances();
        valorParaJogador++;
        alterarPontosDoJogador(valorParaJogador);

    }
}

export { rodadas, compararLances, dinoVenceu, alterarRodadas }