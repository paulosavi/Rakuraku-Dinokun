import { dinoArrotando } from "./dinoFase1Arrotando.js";
import { aguaFrame1, aguaFrame2, aguaFrame3, aguaFrame4, aguaFrame5, aguaFrame6, aguaFrame7} from "../frames/dinoFase1BebendoFrames.js";

const framesDinoBebendo = [aguaFrame1, aguaFrame2, aguaFrame3, aguaFrame4, aguaFrame5, aguaFrame6, aguaFrame7];

function dinoFase1Bebendo(){
    let contador = 0;

    var intervalo = setInterval(() =>{
        $(".pixel").removeClass("preto");
        framesDinoBebendo[contador].addClass("preto");

        contador++;

        if(contador >= framesDinoBebendo.length){
            clearInterval(intervalo);
            dinoArrotando();
            return;
        }
    }, 1050);
}

export { dinoFase1Bebendo }
