import { carregarFramesPorFase, idleFrames } from "../frames/dinoFase1frames.js";
import { iniciarJokenpo } from "../jogoJokenpo/iniciarJokenpo.js";

async function dinoFase1Raiva(){
   var losingFrames = await carregarFramesPorFase("losing");
   var frameNormal = idleFrames[0] || $();
   var frameRaiva = losingFrames[1] || losingFrames[0] || $();
   const frames = [frameNormal, frameRaiva, frameNormal, frameRaiva];
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
