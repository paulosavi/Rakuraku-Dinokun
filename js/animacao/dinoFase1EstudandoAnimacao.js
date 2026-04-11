import { carregarFramesPorFase } from "../frames/dinoFase1frames.js";
import { estaNatelaPrincipal, voltarParaTelaPrincipal } from "../principal/telaPrincipal.js";
import { estudar } from "../principal/stats.js";

async function dinoFase1Estudando(){
    estaNatelaPrincipal(false);
    var frames = await carregarFramesPorFase("reading");
    // Alterna: frame1, frame2, frame2, frame1
    var sequencia = frames.length >= 2
        ? [frames[0], frames[1], frames[1], frames[0]]
        : frames;
    let contador = 0;

    var intervalo = setInterval(() =>{
        $(".pixel").removeClass("preto");
        sequencia[contador].addClass("preto");

        contador++;

        if(contador >= sequencia.length){
            clearInterval(intervalo);
            estudar();
            voltarParaTelaPrincipal();
        }
    }, 1050);
}

export { dinoFase1Estudando }
