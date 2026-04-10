import { deslizarTelaPrincipalParaEsquerda } from "../animacao/dinoFase1Animacao.js";
import {  deslizarHoraAtualDig1ParaEsqueda, deslizarDoisPontosParaEsqueda,  deslizarPeriodoAtualParaEsqueda, deslizarMinutoAtualDig1ParaEsqueda, deslizarMinutoAtualDig2ParaEsqueda, deslizarHoraAtualDig2ParaEsqueda, deslizarHoraAtualParaEsqueda } from "../relogio/ocultarPainelDoRelogio.js";
import { getHoras } from "../principal/relogioInterno.js";


function deslizarRelogioParaEsquerda(){
    const hora = getHoras();
  
    let horasString = String(hora).split('');
  
    deslizarTelaPrincipalParaEsquerda();

    deslizarDoisPontosParaEsqueda();
    
    deslizarPeriodoAtualParaEsqueda();
  
    if(horasString.length === 1 || hora > 12 && hora <= 21){
       deslizarHoraAtualParaEsqueda();
    }
  
    if(hora > 9 && hora <= 12 || hora > 21){
      deslizarHoraAtualDig1ParaEsqueda();
      deslizarHoraAtualDig2ParaEsqueda();
  
    }
  
      deslizarMinutoAtualDig1ParaEsqueda();
      deslizarMinutoAtualDig2ParaEsqueda();
  
  }

  export { deslizarRelogioParaEsquerda }