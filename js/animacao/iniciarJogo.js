import { chocarOvoFrames } from "../frames/framesChocarOvo.js";
import { habilitarEventosIniciais } from "../principal/telaInicial.js";
import { dinoFase1 } from "./dinoFase1Animacao.js";
import { salvarEstado } from "../principal/saveSystem.js";
import { resetarStats } from "../principal/stats.js";
import { iniciarGameLoop } from "../principal/gameLoop.js";

function chocarOvo() {
    let idx = 0;

    const intervalo = setInterval(() => {
        if (idx >= chocarOvoFrames.length) {
            clearInterval(intervalo);
            $(".pixel").removeClass("preto");
            habilitarEventosIniciais(true);
            dinoFase1(true);
            resetarStats();
            iniciarGameLoop(window.__aoMorrer);
            salvarEstado({ jogoIniciado: true, estadoLuz: true });
            return;
        }

        $(".pixel").removeClass("preto");
        chocarOvoFrames[idx].addClass("preto");
        idx++;
    }, 500);
}

export { chocarOvo };
