import {
    idleFrames,
    dinoFase1Frame1,
    dinoDormindoFrame, dinoSujoFrame, dinoDoenteFrame, dinoMortoFrame,
    dormindoFrames, dormindoLuzApagadaFrames, sujoFrames, doenteFrames, frioFrames, calorFrames, mortoFrames
} from "../frames/dinoFase1frames.js";
import { obterStats } from "../principal/stats.js";
import { estadoAtualDaLuz } from "../outrosRecursos/luz.js";

var telaPrincipal = false;
var frameAtualTelaPrincipal;

function pararDinoTelaPrincipal(boleano){
    telaPrincipal = boleano;
}

function deslizarTelaPrincipalParaEsquerda(){
    frameAtualTelaPrincipal.removeClass("preto");
    frameAtualTelaPrincipal.prev().addClass("preto");
    frameAtualTelaPrincipal = frameAtualTelaPrincipal.prev().addClass("preto");
}

// Retorna os frames e intervalo corretos baseado no estado atual do pet
// Prioridade: morto > dormindo > doente > calor > frio > sujo > idle
// Usa imports diretos (live bindings) — atualizam ao recarregar frames por fase
function getFramesAtuais() {
    var stats = obterStats();
    if (!stats.vivo) return { frames: mortoFrames, intervalo: 1000 };
    if (stats.dormindo) {
        if (!estadoAtualDaLuz) return { frames: dormindoLuzApagadaFrames, intervalo: 1000 };
        return { frames: dormindoFrames, intervalo: 1000 };
    }
    if (stats.doente) return { frames: doenteFrames, intervalo: 1000 };
    if (stats.comCalor) return { frames: calorFrames, intervalo: 1000 };
    if (stats.comFrio) return { frames: frioFrames, intervalo: 1000 };
    if (stats.sujo) return { frames: sujoFrames, intervalo: 1000 };
    return { frames: idleFrames, intervalo: 1000 };
}

function dinoFase1(boleano) {
    telaPrincipal = boleano;
    let contador = 0;
    let estadoAnterior = null;
    let intervaloAtual = null;

    function iniciarLoop() {
        var atual = getFramesAtuais();
        estadoAnterior = atual;
        contador = 0;

        intervaloAtual = setInterval(() => {
            if(!telaPrincipal){
                clearInterval(intervaloAtual);
                return;
            }

            // Checa se o estado mudou (ex: ficou doente, acordou, etc.)
            var novo = getFramesAtuais();
            if (novo.frames !== estadoAnterior.frames) {
                clearInterval(intervaloAtual);
                iniciarLoop();
                return;
            }

            $(".pixel").removeClass("preto");
            if (novo.frames.length > 0) {
                frameAtualTelaPrincipal = novo.frames[contador % novo.frames.length].addClass("preto");
            }

            contador++;
            if(contador >= novo.frames.length){
                contador = 0;
            }
        }, atual.intervalo);
    }

    iniciarLoop();
}

export {
    dinoFase1,
    pararDinoTelaPrincipal,
    frameAtualTelaPrincipal,
    telaPrincipal,
    deslizarTelaPrincipalParaEsquerda
}
