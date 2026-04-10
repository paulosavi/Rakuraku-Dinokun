import { dinoFase1Frame1 } from "../frames/dinoFase1frames.js";
import { dinoFase1RaivaFrame } from "../frames/dinoFase1ReacoesFrame.js";
import { iniciarJokenpo } from "../jogoJokenpo/iniciarJokenpo.js";

function dinoFase1Raiva(){
   const frames = [dinoFase1Frame1, dinoFase1RaivaFrame, dinoFase1Frame1, dinoFase1RaivaFrame];
   let contador = 0;

   const intervalo = setInterval(()=>{
       $(".pixel").removeClass("preto");
       frames[contador].addClass("preto");

       contador++;

       if(contador >= frames.length){
           clearInterval(intervalo);
           iniciarJokenpo();
       }
   }, 1000);
}

export { dinoFase1Raiva }
