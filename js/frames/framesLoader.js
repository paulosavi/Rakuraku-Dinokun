// Carregador de frames - cada animação é um JSON separado em frames/pixelDino/
// Formato: { frames: [ { id, interval, matrix } ] }
// matrix: 16x19 de 0s e 1s
//
// IMPORTANTE: precisa rodar via servidor local (Live Server, etc.)
// pois fetch() não funciona com file:// na maioria dos browsers.

const cache = {};

/**
 * Carrega uma animação pelo nome (ex: "idle", "sleeping")
 * Retorna { frames: [...] }
 */
async function loadAnimation(animName) {
    if (cache[animName]) return cache[animName];

    const url = "frames/pixelDino/" + animName + ".json";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Falha ao carregar " + url + ":", response.status);
            cache[animName] = { frames: [] };
            return cache[animName];
        }
        const data = await response.json();
        cache[animName] = data;
        return data;
    } catch (e) {
        console.error("Erro ao buscar " + url + ":", e);
        cache[animName] = { frames: [] };
        return cache[animName];
    }
}

/**
 * Converte uma matriz 16x19 em objeto jQuery selecionando os pixels acesos
 */
function matrixToJQuery(matrix) {
    if (!matrix || !Array.isArray(matrix)) return $();
    const pixels = [];
    for (let r = 0; r < matrix.length; r++) {
        const row = matrix[r];
        if (!Array.isArray(row)) continue;
        for (let c = 0; c < row.length; c++) {
            if (row[c] === 1) {
                const letter = String.fromCharCode(65 + r); // A-P
                const colStr = (c + 1).toString().padStart(2, "0"); // 01-19
                pixels.push("." + letter + colStr);
            }
        }
    }
    if (pixels.length === 0) return $();
    return $(pixels.join(", "));
}

/**
 * Retorna um frame específico como objeto jQuery
 */
async function getFrame(animName, frameIdx) {
    const data = await loadAnimation(animName);
    if (!data.frames || !data.frames[frameIdx]) return $();
    return matrixToJQuery(data.frames[frameIdx].matrix);
}

/**
 * Retorna TODOS os frames de uma animação como array de objetos jQuery
 */
async function getAllFrames(animName) {
    const data = await loadAnimation(animName);
    if (!data.frames) return [];
    return data.frames.map(function(f) { return matrixToJQuery(f.matrix); });
}

/**
 * Retorna a matriz bruta de um frame (útil para manipulação direta)
 */
async function getFrameMatrix(animName, frameIdx) {
    const data = await loadAnimation(animName);
    if (!data.frames || !data.frames[frameIdx]) return null;
    return data.frames[frameIdx].matrix;
}

export { loadAnimation, matrixToJQuery, getFrame, getAllFrames, getFrameMatrix };
