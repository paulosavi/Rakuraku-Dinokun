import { getAllFrames } from "./framesLoader.js";

const readingFrames = await getAllFrames("reading");

var dinoFase1EstudandoFrame1 = readingFrames[0] || $();
var dinoFase1EstudandoFrame2 = readingFrames[1] || $();

export { dinoFase1EstudandoFrame1, dinoFase1EstudandoFrame2 };
