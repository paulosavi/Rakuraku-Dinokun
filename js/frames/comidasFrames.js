import { getFrameJQuery } from "./framesLoader.js";

// hambúrguer
var hamburguerFrame1 = getFrameJQuery("comidas", "hamburguer1");
var hamburguerFrame2 = getFrameJQuery("comidas", "hamburguer2");
var hamburguerFrame3 = getFrameJQuery("comidas", "hamburguer3");
var hamburguerFrame4 = getFrameJQuery("comidas", "hamburguer4");
var hamburguerFrames = [hamburguerFrame1, hamburguerFrame2, hamburguerFrame3, hamburguerFrame4];

// macarrão
var macarraoFrame1 = getFrameJQuery("comidas", "macarrao1");
var macarraoFrame2 = getFrameJQuery("comidas", "macarrao2");
var macarraoFrames = [macarraoFrame1, macarraoFrame2, macarraoFrame2, macarraoFrame2];

// sorvete
var sorveteFrame1 = getFrameJQuery("comidas", "sorvete1");
var sorveteFrame2 = getFrameJQuery("comidas", "sorvete2");
var sorveteFrame3 = getFrameJQuery("comidas", "sorvete3");
var sorveteFrame4 = getFrameJQuery("comidas", "sorvete4");
var sorveteFrames = [sorveteFrame1, sorveteFrame2, sorveteFrame3, sorveteFrame4];

// cenoura
var cenouraFrame1 = getFrameJQuery("comidas", "cenoura1");
var cenouraFrame2 = getFrameJQuery("comidas", "cenoura2");
var cenouraFrame3 = getFrameJQuery("comidas", "cenoura3");
var cenouraFrame4 = getFrameJQuery("comidas", "cenoura4");
var cenouraFrames = [cenouraFrame1, cenouraFrame2, cenouraFrame3, cenouraFrame4];

// maçã
var macaFrame1 = getFrameJQuery("comidas", "maca1");
var macaFrame2 = getFrameJQuery("comidas", "maca2");
var macaFrame3 = getFrameJQuery("comidas", "maca3");
var macaFrames = [macaFrame1, macaFrame2, macaFrame3];

// coxa
var coxaFrame1 = getFrameJQuery("comidas", "coxa1");
var coxaFrame2 = getFrameJQuery("comidas", "coxa2");
var coxaFrame3 = getFrameJQuery("comidas", "coxa3");
var coxaFrame4 = getFrameJQuery("comidas", "coxa4");
var coxaFrames = [coxaFrame1, coxaFrame2, coxaFrame3, coxaFrame4];

export { hamburguerFrames, macarraoFrames, sorveteFrames, cenouraFrames, macaFrames, coxaFrames };
