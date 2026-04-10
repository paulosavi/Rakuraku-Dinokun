import { getAllFrames } from "./framesLoader.js";

// Todos os frames da animação do ovo chocando
var chocarOvoFrames = await getAllFrames("bornUsaVersion");

export { chocarOvoFrames };
