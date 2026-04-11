import { botaoClock } from "../funcoesDosBotoes/clock.js";
import { botaoEnter } from "../funcoesDosBotoes/enter.js";
import { botaoEsc } from "../funcoesDosBotoes/esc.js";
import { botaoIniciar } from "../funcoesDosBotoes/iniciarJogo.js";
import { botaoDireito } from "../funcoesDosBotoes/botaoSelecaoDireita/selecaoDireita.js";
import { botaoEsquerdo } from "../funcoesDosBotoes/botaoSelecaoEsqueda/selecaoEsquerda.js";
import { carregarEstado } from "./saveSystem.js";
import { dinoFase1, pararDinoTelaPrincipal } from "../animacao/dinoFase1Animacao.js";
import { alterarEstadoAtualDaLuz } from "../outrosRecursos/luz.js";
import { alterarEstadoAtualDoArcondicionado } from "../outrosRecursos/painelDoArCondicionado.js";
import { habilitarEventosIniciais } from "./telaInicial.js";
import { carregarStats, obterStats } from "./stats.js";
import { iniciarGameLoop } from "./gameLoop.js";
import { tocar } from "./som.js";

function pressionarBotao(elemento){
    let heightBotao = $(elemento).css("height");
    heightBotao =  `${heightBotao.substring(0, 2) - 3}px`;
    $(elemento).css("height", heightBotao);

    setTimeout(()=>{
        let heightBotao = $(elemento).css("height");
        heightBotao =  `${Number(heightBotao.substring(0, 2)) + 3}px`;
        $(elemento).css("height", heightBotao);
    }, 100);
}

// Handler chamado quando o pet morre
function aoMorrer() {
    habilitarEventosIniciais(false);
    // pararDinoTelaPrincipal(false) não é chamado aqui porque queremos que dinoFase1
    // continue rodando e mostre o frame de morto (getFramesAtuais detecta vivo=false)

    // Após 5 segundos, mostrar a chavinha novamente para reiniciar
    setTimeout(function() {
        pararDinoTelaPrincipal(false);
        $(".pixel").removeClass("preto");
        $("#img-chavinha").fadeIn(1000);
        $("#iniciar-jogo").fadeIn(1000);
        // NÃO limpa o estado inteiro - senão perde jogoIniciado no F5
        // O resetarStats() dentro de iniciarJogo já cuida de zerar os stats
        $("#iniciar-jogo").one("click", botaoIniciar);
    }, 5000);
}

const estadoSalvo = carregarEstado();

if (estadoSalvo && estadoSalvo.jogoIniciado) {
    carregarStats();

    var stats = obterStats();

    if (!stats.vivo) {
        // Pet já estava morto quando o save foi carregado
        if (estadoSalvo.estadoLuz !== false) {
            alterarEstadoAtualDaLuz(true);
            dinoFase1(true);
        } else {
            alterarEstadoAtualDaLuz(false);
            $(".pixel").addClass("preto");
        }
        aoMorrer();
    } else {
        iniciarGameLoop(aoMorrer);

        if (estadoSalvo.estadoLuz === false) {
            alterarEstadoAtualDaLuz(false);
            $(".pixel").addClass("preto");
        } else {
            alterarEstadoAtualDaLuz(true);
            habilitarEventosIniciais(true);
            dinoFase1(true);
        }

        if (estadoSalvo.estadoAC) {
            alterarEstadoAtualDoArcondicionado(estadoSalvo.estadoAC);
        }
    }
} else {
    $("#iniciar-jogo").one("click", botaoIniciar);
}

// Exporta para outros módulos usarem (ex: iniciarJogo.js precisa registrar o callback)
window.__aoMorrer = aoMorrer;

$("#enter").on("click", function(){
    pressionarBotao(this);
    tocar("beep");
    botaoEnter();
});

$("#botao-select-esquerdo").on("click", function(){
    pressionarBotao(this);
    tocar("beep");
    botaoEsquerdo();
});

$("#botao-select-direito").on("click", function(){
    pressionarBotao(this);
    tocar("beep");
    botaoDireito();
});

$("#esc").on("click", function(){
    pressionarBotao(this);
    tocar("beep");
    botaoEsc();
});

$("#clock").on("click", function(){
    pressionarBotao(this);
    tocar("beep");
    botaoClock();
});
