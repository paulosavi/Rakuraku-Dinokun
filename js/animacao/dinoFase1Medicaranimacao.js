import { carregarFramesPorFase } from "../frames/dinoFase1frames.js";
import { estaNatelaPrincipal, voltarParaTelaPrincipal } from "../principal/telaPrincipal.js";
import { medicar } from "../principal/stats.js";

async function medicarDinoFase1(){
    estaNatelaPrincipal(false);
    var frames = await carregarFramesPorFase("applyingInjection");
    let contador = 0;

    const intervaloMedicar = setInterval(() =>{
        $(".pixel").removeClass("preto");
        if (contador < frames.length) {
            frames[contador].addClass("preto");
        }

        contador++;

        if(contador >= frames.length){
            clearInterval(intervaloMedicar);
            medicar();
            voltarParaTelaPrincipal();
        }
    }, 1500);
}

export { medicarDinoFase1 }
