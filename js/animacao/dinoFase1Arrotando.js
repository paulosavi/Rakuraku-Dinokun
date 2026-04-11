import { carregarFramesPorFase, idleFrames } from "../frames/dinoFase1frames.js";
import { opcoesDeComida, contadorComida, permitirPercorrerComidas } from "../outrosRecursos/opcoesDeComida.js";
import { atividade, habilitarEventosIniciais } from "../principal/telaInicial.js";
import { intervaloSemInteracao, pararIntervalo, pararIntervaloSemInteracao } from "../principal/intervaloSemInteracao.js";
import { dinoEstaComendo, indicarSeDinoEstaComendo } from "./dinoComendo.js";
import { estaNatelaPrincipal, tela, voltarParaTelaPrincipal } from "../principal/telaPrincipal.js";
import { alimentar, darAgua } from "../principal/stats.js";

async function dinoArrotando(){
    var swallowingFrames = await carregarFramesPorFase("swallowing");
    var frameNormal = idleFrames[0] || $();
    var frameArroto = swallowingFrames[1] || swallowingFrames[0] || $();
    const frames = [frameNormal, frameArroto, frameNormal, frameArroto];
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
