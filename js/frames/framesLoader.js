// Carregador de frames a partir do frames.json
// Usa top-level await: todos os módulos que importarem daqui vão aguardar
// o JSON ser carregado antes de executarem seus corpos.
//
// IMPORTANTE: precisa rodar via servidor local (Live Server, etc.)
// pois fetch() não funciona com file:// na maioria dos browsers.

let FRAMES_DATA = {};

try {
    const response = await fetch("frames.json");
    if (response.ok) {
        FRAMES_DATA = await response.json();
        console.log("✓ frames.json carregado com sucesso");
    } else {
        console.error("Falha ao carregar frames.json:", response.status);
    }
} catch (e) {
    console.error("Erro ao buscar frames.json:", e);
    console.warn("Certifique-se de estar rodando via servidor local (Live Server, etc.)");
}

/**
 * Retorna a string bruta de pixels do frame (ex: "B03,B09,C03,...")
 */
function getFrameString(category, name) {
    if (FRAMES_DATA[category] && FRAMES_DATA[category][name] !== undefined) {
        return FRAMES_DATA[category][name];
    }
    console.warn("Frame não encontrado:", category + "/" + name);
    return "";
}

/**
 * Retorna um array de classes de pixel (ex: ["B03", "B09", "C03"])
 */
function getFramePixels(category, name) {
    const str = getFrameString(category, name);
    if (!str) return [];
    return str.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
}

/**
 * Retorna um objeto jQuery que seleciona todos os pixels do frame
 * (usa a sintaxe ".B03, .B09, .C03, ...")
 */
function getFrameJQuery(category, name) {
    const pixels = getFramePixels(category, name);
    if (pixels.length === 0) return $();
    const selectors = pixels.map(function(p) { return "." + p; }).join(", ");
    return $(selectors);
}

export { FRAMES_DATA, getFrameString, getFramePixels, getFrameJQuery };
