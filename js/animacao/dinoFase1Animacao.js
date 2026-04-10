import {
    idleFrames,
    dinoFase1Frame1,
    dinoDormindoFrame, dinoSujoFrame, dinoDoenteFrame, dinoMortoFrame
} from "../frames/dinoFase1frames.js";
import { obterStats } from "../principal/stats.js";

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

// Animação idle: usa todos os 5 frames do Remagotchi
// centro → bounce → esquerda → bounce → direita
const framesDinoFase1 = idleFrames;

// Estados passivos usam 2 frames iguais (ficam estáticos)
const framesDoente = [dinoDoenteFrame];
const framesSujo = [dinoSujoFrame];
const framesDormindo = [dinoDormindoFrame];
const framesMorto = [dinoMortoFrame];

// Retorna os frames corretos baseado no estado atual do pet
// Prioridade: morto > doente > sujo > dormindo > normal
function getFramesAtuais() {
    var stats = obterStats();
    if (!stats.vivo) return framesMorto;
    if (stats.doente) return framesDoente;
    if (stats.sujo) return framesSujo;
    if (stats.dormindo) return framesDormindo;
    return framesDinoFase1;
}

function dinoFase1(boleano) {
    telaPrincipal = boleano;
    let contador = 0;

    const intervalo = setInterval(() => {
        if(!telaPrincipal){
            clearInterval(intervalo);
            return;
        }

        var frames = getFramesAtuais();

        $(".pixel").removeClass("preto");
        if (frames.length > 0) {
            frameAtualTelaPrincipal = frames[contador % frames.length].addClass("preto");
        }

        contador++;
        if(contador >= frames.length){
            contador = 0;
        }
    }, 1000);
}

export {
    dinoFase1,
    pararDinoTelaPrincipal,
    frameAtualTelaPrincipal,
    telaPrincipal,
    deslizarTelaPrincipalParaEsquerda
}
