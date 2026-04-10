import {
    dinoFase1Frame1, dinoFase1Frame2, dinoFase1Frame3, dinoFase1Frame4,
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

const framesDinoFase1 = [dinoFase1Frame1, dinoFase1Frame2, dinoFase1Frame3, dinoFase1Frame2, dinoFase1Frame4];
const framesDoente = [dinoDoenteFrame, dinoDoenteFrame];  // estático, só repete
const framesSujo = [dinoSujoFrame, dinoSujoFrame];
const framesDormindo = [dinoDormindoFrame, dinoDormindoFrame];
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
        let piscaAlerta = false;
        const intervalo = setInterval(() => {
            if(!telaPrincipal){
                clearInterval(intervalo);
                return
            }

            var stats = obterStats();
            var frames = getFramesAtuais();

            $(".pixel").removeClass("preto");

            // Pisca (efeito de alerta) quando precisa urgente de atenção
            // Só pisca se estiver vivo; quando morto, frame fica estático
            var precisaAtencao = stats.vivo && (stats.fome === 0 || stats.sede === 0 || stats.doente);

            if (precisaAtencao && piscaAlerta) {
                // Frame escondido (tela vazia) para efeito de piscada
                piscaAlerta = false;
            } else {
                frameAtualTelaPrincipal = frames[contador % frames.length].addClass("preto");
                piscaAlerta = precisaAtencao;
            }

            contador ++;
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
