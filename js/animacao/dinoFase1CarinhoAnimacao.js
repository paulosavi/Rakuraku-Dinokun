import { carinhoFrame1, carinhoFrame2 } from "../frames/dinoFase1CarinhoFrames.js";
import { voltarParaTelaPrincipal } from "../principal/telaPrincipal.js";
import { estaNatelaPrincipal } from "../principal/telaPrincipal.js";
import { fazerCarinho as fazerCarinhoStats } from "../principal/stats.js";

function fazerCarinhoNoDino(){
    estaNatelaPrincipal(false);
    const frames = [carinhoFrame1, carinhoFrame2];
    let contador = 0;

    var intervalo = setInterval(() =>{
        $(".pixel").removeClass("preto");
        frames[contador].addClass("preto");

        contador++;

        if(contador >= frames.length){
            clearInterval(intervalo);
            fazerCarinhoStats();
            voltarParaTelaPrincipal();
        }
    }, 1050);
}

export { fazerCarinhoNoDino }
