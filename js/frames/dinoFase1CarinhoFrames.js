import { getAllFrames } from "./framesLoader.js";

const caressingFrames = await getAllFrames("caressing");

var carinhoFrame1 = caressingFrames[0] || $();
var carinhoFrame2 = caressingFrames[1] || $();

export { carinhoFrame1, carinhoFrame2 };
