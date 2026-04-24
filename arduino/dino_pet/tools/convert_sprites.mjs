// Conversor de frames JSON -> header C
// Cada frame é matriz 16 linhas x 19 colunas de 0/1
// Gera uint32_t bitmask por linha (bit 0 = coluna 0, bit 18 = coluna 18)
// Uso: node convert_sprites.mjs <lista|all> > saida.h

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMES_DIR = path.resolve(__dirname, "../../../frames/pixelDino");
const ROWS = 16;
const COLS = 19;

function lerFrames(arquivo) {
    var full = path.join(FRAMES_DIR, arquivo + ".json");
    var raw = fs.readFileSync(full, "utf8");
    var data = JSON.parse(raw);
    return data.frames.map(function (f) {
        var linhas = [];
        for (var y = 0; y < ROWS; y++) {
            var bits = 0;
            for (var x = 0; x < COLS; x++) {
                if (f.matrix[y][x]) bits |= (1 << x);
            }
            linhas.push(bits);
        }
        return linhas;
    });
}

function sanitizar(nome) {
    return nome.replace(/[^A-Za-z0-9]/g, "_").toUpperCase();
}

function gerar(arquivos) {
    var saida = [];
    saida.push("// Arquivo gerado por tools/convert_sprites.mjs");
    saida.push("// Cada sprite tem ROWS=16 linhas de uint32_t, bit 0=coluna 0");
    saida.push("#pragma once");
    saida.push("#include <Arduino.h>");
    saida.push("#define SPRITE_ROWS 16");
    saida.push("#define SPRITE_COLS 19");
    saida.push("");

    arquivos.forEach(function (arq) {
        try {
            var frames = lerFrames(arq);
            var nome = sanitizar(arq);
            saida.push("// " + arq + ": " + frames.length + " frame(s)");
            saida.push("const uint32_t SPRITE_" + nome + "[" + frames.length + "][SPRITE_ROWS] PROGMEM = {");
            frames.forEach(function (linhas, idx) {
                var bloco = linhas.map(function (b) { return "0x" + b.toString(16).padStart(5, "0"); }).join(", ");
                saida.push("  { " + bloco + " }" + (idx < frames.length - 1 ? "," : ""));
            });
            saida.push("};");
            saida.push("const uint8_t SPRITE_" + nome + "_FRAMES = " + frames.length + ";");
            saida.push("");
        } catch (e) {
            saida.push("// ERRO em " + arq + ": " + e.message);
            saida.push("");
        }
    });

    return saida.join("\n");
}

var args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Uso: node convert_sprites.mjs <nome1> [nome2] ... | all");
    process.exit(1);
}

var alvos;
if (args[0] === "all") {
    alvos = fs.readdirSync(FRAMES_DIR)
        .filter(function (f) { return f.endsWith(".json"); })
        .map(function (f) { return f.replace(/\.json$/, ""); });
} else {
    alvos = args;
}

process.stdout.write(gerar(alvos));
