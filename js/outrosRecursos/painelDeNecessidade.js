import { alterarContadorIntervaloSemInteracao, contadorIntervaloSemInteracao } from "../principal/intervaloSemInteracao.js";
import { habilitarEsc, usoDoEsc } from "../principal/telaInicial.js";
import { renderNecessidade } from "../frames/necessidadesDinamicas.js";


var contadorNecessidades = 0;
var contadorIntervaloNecessidade = 0;
var percorrerNecessidades = false;


function alterarContadorNecessidades(valor){
    contadorNecessidades = valor;
}

function permitirPercorrerNecessidades(boleano){
    percorrerNecessidades = boleano;
}

function necessidadesDoDino(){
        habilitarEsc(true);
        alterarContadorIntervaloSemInteracao(0);

        contadorIntervaloNecessidade = 0;
        renderNecessidade(contadorNecessidades);

}


export {necessidadesDoDino, percorrerNecessidades, permitirPercorrerNecessidades, contadorNecessidades, alterarContadorNecessidades}


