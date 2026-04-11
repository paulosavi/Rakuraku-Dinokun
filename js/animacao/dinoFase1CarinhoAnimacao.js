import { carregarFramesPorFase } from "../frames/dinoFase1frames.js";
import { voltarParaTelaPrincipal } from "../principal/telaPrincipal.js";
import { estaNatelaPrincipal } from "../principal/telaPrincipal.js";
import { fazerCarinho as fazerCarinhoStats } from "../principal/stats.js";

async function fazerCarinhoNoDino(){
    estaNatelaPrincipal(false);
    var frames = await carregarFramesPorFase("caressing");
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
