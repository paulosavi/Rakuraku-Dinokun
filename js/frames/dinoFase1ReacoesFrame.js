import { getFrame } from "./framesLoader.js";

var dinoFase1Arroto = await getFrame("swallowing", 1);
var dinoFase1FelizFrame = await getFrame("celebrating", 1);
var dinoFase1RaivaFrame = await getFrame("losing", 1);

export { dinoFase1Arroto, dinoFase1FelizFrame, dinoFase1RaivaFrame };
