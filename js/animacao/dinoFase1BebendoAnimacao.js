import { dinoArrotando } from "./dinoFase1Arrotando.js";
import { carregarFramesPorFase } from "../frames/dinoFase1frames.js";

async function dinoFase1Bebendo(){
    var frames = await carregarFramesPorFase("drinking");
    let contador = 0;

    var intervalo = setInterval(() =>{
        $(".pixel").removeClass("preto");
        frames[contador].addClass("preto");

        contador++;

        if(contador >= frames.length){
            clearInterval(intervalo);
            dinoArrotando();
            return;
        }
    }, 1050);
}

export { dinoFase1Bebendo }
