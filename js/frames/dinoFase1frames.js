import { getAllFrames, getFrame } from "./framesLoader.js";

// Todos os 5 frames do idle (animação de andar)
// Frame 1: centro, 2: bounce, 3: esquerda, 4: bounce, 5: direita
var idleFrames = await getAllFrames("idle");

var dinoFase1Frame1 = idleFrames[0] || $();
var dinoFase1Frame2 = idleFrames[1] || $();
var dinoFase1Frame3 = idleFrames[2] || $();
var dinoFase1Frame4 = idleFrames[3] || $();
var dinoFase1Frame5 = idleFrames[4] || $();

// Estados passivos
var dinoDormindoFrame = await getFrame("sleeping", 0);
var dinoSujoFrame = await getFrame("dirty", 1);
var dinoDoenteFrame = await getFrame("sick", 0);
var dinoMortoFrame = await getFrame("deadNeglect", 0);

export {
    dinoFase1Frame1, dinoFase1Frame2, dinoFase1Frame3, dinoFase1Frame4, dinoFase1Frame5,
    idleFrames,
    dinoDormindoFrame, dinoSujoFrame, dinoDoenteFrame, dinoMortoFrame
};
