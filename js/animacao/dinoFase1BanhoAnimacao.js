import { banhoDinoFase1Frames } from "../frames/dinoFase1BanhoFrames.js";
import { dinoFase1Feliz } from "./dinoFase1FelizAnimacao.js";
import { banhar } from "../principal/stats.js";

function banharDinoFase1(){
    let contador = 0;

    var intervalo = setInterval(() =>{
        $(".pixel").removeClass("preto");
        banhoDinoFase1Frames[contador].addClass("preto");

        contador++;

        if(contador >= banhoDinoFase1Frames.length){
            clearInterval(intervalo);
            banhar();
            dinoFase1Feliz();
        }
    }, 1500);
}

export { banharDinoFase1 }
