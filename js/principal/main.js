import { criarMatriz } from "./matriz.js";
import { esconderIcones, habilitarEventosIniciais } from "./telaInicial.js";
import { carregarEstado } from "./saveSystem.js";
import { inicializarRelogio } from "./relogioInterno.js";

esconderIcones();
criarMatriz();
inicializarRelogio();

const estadoSalvo = carregarEstado();

if (estadoSalvo && estadoSalvo.jogoIniciado) {
    $("#img-chavinha").hide();
    $("#iniciar-jogo").hide();
    habilitarEventosIniciais(false);
} else {
    habilitarEventosIniciais(false);
}










