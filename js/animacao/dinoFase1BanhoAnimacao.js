import { carregarFramesPorFase } from "../frames/dinoFase1frames.js";
import { dinoFase1Feliz } from "./dinoFase1FelizAnimacao.js";
import { banhar } from "../principal/stats.js";

async function banharDinoFase1(){
    var frames = await carregarFramesPorFase("bath");
    let contador = 0;

    var intervalo = setInterval(() =>{
        $(".pixel").removeClass("preto");
        frames[contador].addClass("preto");

        contador++;

        if(contador >= frames.length){
            clearInterval(intervalo);
            banhar();
            dinoFase1Feliz();
        }
    }, 1500);
}

export { banharDinoFase1 }
