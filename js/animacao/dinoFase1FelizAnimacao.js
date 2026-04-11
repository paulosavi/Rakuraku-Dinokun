import { carregarFramesPorFase, idleFrames } from "../frames/dinoFase1frames.js";
import { iniciarJokenpo } from "../jogoJokenpo/iniciarJokenpo.js";
import { atividade } from "../principal/telaInicial.js"
import { voltarParaTelaPrincipal } from "../principal/telaPrincipal.js"
import { tocar } from "../principal/som.js";

async function dinoFase1Feliz(){
   tocar("happy");
   var celebratingFrames = await carregarFramesPorFase("celebrating");
   var frameNormal = idleFrames[0] || $();
   var frameFeliz = celebratingFrames[1] || celebratingFrames[0] || $();
   const frames = [frameNormal, frameFeliz, frameNormal, frameFeliz];
   let contador = 0;

   const intervalo = setInterval(()=>{
       $(".pixel").removeClass("preto");
       frames[contador].addClass("preto");

       contador++;

       if(contador >= frames.length){
           clearInterval(intervalo);
           if(atividade == "banhar"){
              voltarParaTelaPrincipal();
           } else {
               iniciarJokenpo();
           }
       }
   }, 1000);
}

export { dinoFase1Feliz }
