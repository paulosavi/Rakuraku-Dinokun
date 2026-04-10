import { getAllFrames } from "./framesLoader.js";

const drinkingFrames = await getAllFrames("drinking");

var aguaFrame1 = drinkingFrames[0] || $();
var aguaFrame2 = drinkingFrames[1] || $();
var aguaFrame3 = drinkingFrames[2] || $();
var aguaFrame4 = drinkingFrames[3] || $();
var aguaFrame5 = drinkingFrames[4] || $();
var aguaFrame6 = drinkingFrames[5] || $();
var aguaFrame7 = drinkingFrames[6] || $();

export { aguaFrame1, aguaFrame2, aguaFrame3, aguaFrame4, aguaFrame5, aguaFrame6, aguaFrame7 };
