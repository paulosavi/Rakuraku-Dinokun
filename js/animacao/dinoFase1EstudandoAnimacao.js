import { dinoFase1EstudandoFrame1, dinoFase1EstudandoFrame2 } from "../frames/dinoFase1EstudandoFrames.js";
import { habilitarEventosIniciais } from "../principal/telaInicial.js";
import { dinoFase1 } from "./dinoFase1Animacao.js";
import { estaNatelaPrincipal, voltarParaTelaPrincipal } from "../principal/telaPrincipal.js";
import { estudar } from "../principal/stats.js";

function dinoFase1Estudando(){
    estaNatelaPrincipal(false);
    const frames = [dinoFase1EstudandoFrame1, dinoFase1EstudandoFrame2, dinoFase1EstudandoFrame2, dinoFase1EstudandoFrame1];
    let contador = 0;

    var intervalo = setInterval(() =>{
        $(".pixel").removeClass("preto");
        frames[contador].addClass("preto");

        contador++;

        if(contador >= frames.length){
            clearInterval(intervalo);
            estudar();
            voltarParaTelaPrincipal();
        }
    }, 1050);
}

export { dinoFase1Estudando }
