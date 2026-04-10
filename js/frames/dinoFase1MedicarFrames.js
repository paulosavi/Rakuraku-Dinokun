import { getFrameJQuery } from "./framesLoader.js";

var injecaoDinoFase1Frame1 = getFrameJQuery("dinoMedicar", "injecao1");
var injecaoDinoFase1Frame2 = getFrameJQuery("dinoMedicar", "injecao2");
var injecaoDinoFase1Frame3 = getFrameJQuery("dinoMedicar", "injecao3");
var injecaoDinoFase1Frame4 = getFrameJQuery("dinoMedicar", "injecao4");

var injecaoDinoFase1Frames = [injecaoDinoFase1Frame1, injecaoDinoFase1Frame2, injecaoDinoFase1Frame3, injecaoDinoFase1Frame4];

export { injecaoDinoFase1Frames };
