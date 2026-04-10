import { getFrameJQuery } from "./framesLoader.js";

var dinoFase1Frame1 = getFrameJQuery("dinoFase1", "frame1");
var dinoFase1Frame2 = getFrameJQuery("dinoFase1", "frame2");
var dinoFase1Frame3 = getFrameJQuery("dinoFase1", "frame3");
var dinoFase1Frame4 = getFrameJQuery("dinoFase1", "frame4");

// Estados passivos
var dinoDormindoFrame = getFrameJQuery("dinoFase1", "dormindo");
var dinoSujoFrame = getFrameJQuery("dinoFase1", "sujo");
var dinoDoenteFrame = getFrameJQuery("dinoFase1", "doente");
var dinoMortoFrame = getFrameJQuery("dinoFase1", "morto");

export {
    dinoFase1Frame1, dinoFase1Frame2, dinoFase1Frame3, dinoFase1Frame4,
    dinoDormindoFrame, dinoSujoFrame, dinoDoenteFrame, dinoMortoFrame
};
