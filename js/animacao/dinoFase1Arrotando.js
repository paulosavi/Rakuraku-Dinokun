import { dinoFase1Frame1 } from "../frames/dinoFase1frames.js";
import { dinoFase1Arroto } from "../frames/dinoFase1ReacoesFrame.js";
import { opcoesDeComida, contadorComida, permitirPercorrerComidas } from "../outrosRecursos/opcoesDeComida.js";
import { atividade, habilitarEventosIniciais } from "../principal/telaInicial.js";
import { intervaloSemInteracao, pararIntervalo, pararIntervaloSemInteracao } from "../principal/intervaloSemInteracao.js";
import { dinoEstaComendo, indicarSeDinoEstaComendo } from "./dinoComendo.js";
import { estaNatelaPrincipal, tela, voltarParaTelaPrincipal } from "../principal/telaPrincipal.js";
import { alimentar, darAgua } from "../principal/stats.js";

function dinoArrotando(){
    const frames = [dinoFase1Frame1, dinoFase1Arroto, dinoFase1Frame1, dinoFase1Arroto];
    let contador = 0;

    const intervalo = setInterval(()=>{
        $(".pixel").removeClass("preto");
        frames[contador].addClass("preto");

        contador++;

        if(contador >= frames.length){
            clearInterval(intervalo);

            if(atividade === "beber"){
                darAgua();
                return voltarParaTelaPrincipal();
            }

            // Voltou de comer - registra a comida e mostra opções de novo
            pararIntervaloSemInteracao(false);
            intervaloSemInteracao();
            permitirPercorrerComidas(true);
            indicarSeDinoEstaComendo(false);
            alimentar(contadorComida);
            return opcoesDeComida();
        }
    }, 1000);
}

export { dinoArrotando }
