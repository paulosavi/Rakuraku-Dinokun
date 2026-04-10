import { getFrame, getAllFrames } from "./framesLoader.js";

// Ícones para SELEÇÃO (mostrados quando o jogador navega entre as comidas)
var hamburguerIcone = await getFrame("selectingSandwich", 0);
var macarraoIcone = await getFrame("selectingNoodles", 0);
var sorveteIcone = await getFrame("selectingIceCream", 0);
var cenouraIcone = await getFrame("selectingCarrot", 0);
var macaIcone = await getFrame("selectingApple", 0);
var coxaIcone = await getFrame("selectingDrumstick", 0);

// Frames de COMER (animação do dino comendo cada comida)
var hamburguerFrames = await getAllFrames("eatingSandwich");
var macarraoFrames = await getAllFrames("eatingNoodles");
var sorveteFrames = await getAllFrames("eatingIceCream");
var cenouraFrames = await getAllFrames("eatingCarrot");
var macaFrames = await getAllFrames("eatingApple");
var coxaFrames = await getAllFrames("eatingDrumstick");

// Arrays organizados para uso em opcoesDeComida.js
var iconesDasComidas = [hamburguerIcone, macarraoIcone, sorveteIcone, cenouraIcone, macaIcone, coxaIcone];
var framesDasComidas = [hamburguerFrames, macarraoFrames, sorveteFrames, cenouraFrames, macaFrames, coxaFrames];

export { iconesDasComidas, framesDasComidas };
