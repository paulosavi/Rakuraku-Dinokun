import { dinoFase1Frame1 } from "../frames/dinoFase1frames.js";
import { dinoFase1FelizFrame } from "../frames/dinoFase1ReacoesFrame.js";
import { iniciarJokenpo } from "../jogoJokenpo/iniciarJokenpo.js";
import { atividade } from "../principal/telaInicial.js"
import { voltarParaTelaPrincipal } from "../principal/telaPrincipal.js"

function dinoFase1Feliz(){
   const frames = [dinoFase1Frame1, dinoFase1FelizFrame, dinoFase1Frame1, dinoFase1FelizFrame];
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
