import { carinhoFrame1, carinhoFrame2 } from "../frames/dinoFase1CarinhoFrames.js";
import { voltarParaTelaPrincipal } from "../principal/telaPrincipal.js";
import { estaNatelaPrincipal } from "../principal/telaPrincipal.js";
import { fazerCarinho as fazerCarinhoStats } from "../principal/stats.js";

function fazerCarinhoNoDino(){
    estaNatelaPrincipal(false);
    let contador = 1;
    var intervalo = setInterval(() =>{
        if(contador == 1){  
            $(".pixel").removeClass("preto");
            carinhoFrame1.toggleClass("preto");
        }
        if(contador === 2){
            carinhoFrame2.toggleClass("preto");
            clearInterval(intervalo);
            fazerCarinhoStats();
            voltarParaTelaPrincipal();
        }  

        contador ++;

    }, 1050);
}

export { fazerCarinhoNoDino }