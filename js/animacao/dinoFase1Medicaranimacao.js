import { injecaoDinoFase1Frames } from "../frames/dinoFase1MedicarFrames.js";
import { habilitarEventosIniciais } from "../principal/telaInicial.js";
import { dinoFase1 } from "./dinoFase1Animacao.js";
import { estaNatelaPrincipal, voltarParaTelaPrincipal } from "../principal/telaPrincipal.js";
import { medicar } from "../principal/stats.js";

function medicarDinoFase1(){
    estaNatelaPrincipal(false);
    let contador = 0;

    const intervaloMedicar = setInterval(() =>{
        $(".pixel").removeClass("preto");
        if (contador < injecaoDinoFase1Frames.length) {
            injecaoDinoFase1Frames[contador].addClass("preto");
        }

        contador++;

        if(contador >= injecaoDinoFase1Frames.length){
            clearInterval(intervaloMedicar);
            medicar();
            voltarParaTelaPrincipal();
        }
    }, 1500);
}

export { medicarDinoFase1 }
