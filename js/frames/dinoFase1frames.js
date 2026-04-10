import { getAllFrames, getFrame } from "./framesLoader.js";

// Todos os 5 frames do idle (animação de andar)
// Frame 1: centro, 2: bounce, 3: esquerda, 4: bounce, 5: direita
var idleFrames = await getAllFrames("idle");

var dinoFase1Frame1 = idleFrames[0] || $();
var dinoFase1Frame2 = idleFrames[1] || $();
var dinoFase1Frame3 = idleFrames[2] || $();
var dinoFase1Frame4 = idleFrames[3] || $();
var dinoFase1Frame5 = idleFrames[4] || $();

// Estados passivos - cada um tem 2 frames alternando a 500ms
var dormindoFrames = await getAllFrames("sleeping");
var dormindoLuzApagadaFrames = await getAllFrames("sleeping_mode_original");
var sujoFrames = await getAllFrames("dirty");
var doenteFrames = await getAllFrames("sick");
var mortoFrames = await getAllFrames("deadNeglect");

// Mantém exports individuais para compatibilidade
var dinoDormindoFrame = dormindoFrames[0] || $();
var dinoSujoFrame = sujoFrames[0] || $();
var dinoDoenteFrame = doenteFrames[0] || $();
var dinoMortoFrame = mortoFrames[0] || $();

export {
    dinoFase1Frame1, dinoFase1Frame2, dinoFase1Frame3, dinoFase1Frame4, dinoFase1Frame5,
    idleFrames,
    dinoDormindoFrame, dinoSujoFrame, dinoDoenteFrame, dinoMortoFrame,
    dormindoFrames, dormindoLuzApagadaFrames, sujoFrames, doenteFrames, mortoFrames
};
