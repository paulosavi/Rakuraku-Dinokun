# Converte PNGs da pasta img/ em bitmaps 12x12 monocromáticos (C header)
# Uso: python convert_icons.py > ../icons.h

from PIL import Image
import os
import sys

ICON_W = 32
ICON_H = 32

ALVOS = [
    ("agua",     "AGUA"),
    ("comida",   "COMIDA"),
    ("luz",      "LUZ"),
    ("carinho",  "CARINHO"),
    ("tarefas",  "NECESSIDADES"),
    ("brincar",  "BRINCAR"),
    ("estudar",  "ESTUDAR"),
    ("banho",    "BANHO"),
    ("ar",       "AR"),
    ("medico",   "MEDICO"),
    ("seta",     "SETA"),
]

def converter(arquivo, nome):
    raiz = os.path.dirname(os.path.abspath(__file__))
    img_path = os.path.join(raiz, "..", "..", "..", "img", arquivo + ".png")
    img = Image.open(img_path).convert("RGBA")

    # Fundo branco onde alpha=0 (evita que PNG transparente vire preto)
    bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    img = Image.alpha_composite(bg, img).convert("L")

    # 1) binariza com threshold no original (tudo vira 0 ou 255)
    bin_img = img.point(lambda p: 0 if p < 128 else 255, mode='L')

    # 2) bounding box da parte preta (pixels = 0)
    inverted = Image.eval(bin_img, lambda p: 255 - p)  # preto vira 255 pra getbbox
    bbox = inverted.getbbox()
    if bbox:
        bin_img = bin_img.crop(bbox)

    # 3) pad pra ficar quadrado (centraliza), assim nao distorce
    w, h = bin_img.size
    lado = max(w, h)
    quadrado = Image.new("L", (lado, lado), 255)  # fundo branco
    quadrado.paste(bin_img, ((lado - w) // 2, (lado - h) // 2))

    # 4) redimensiona para ICON_W x ICON_H
    img_small = quadrado.resize((ICON_W, ICON_H), Image.LANCZOS)

    # 5) threshold final (um pouco mais tolerante pra preservar tracos finos)
    linhas = []
    for y in range(ICON_H):
        bits = 0
        for x in range(ICON_W):
            lum = img_small.getpixel((x, y))
            if lum < 160:   # threshold mais alto pra preservar forma
                bits |= (1 << x)
        linhas.append(bits)
    return linhas

def imprimir():
    out = []
    out.append("// Gerado por tools/convert_icons.py")
    out.append(f"// Icones {ICON_W}x{ICON_H} em bitmap. Cada linha e um uint32_t (bit 0 = coluna 0).")
    out.append("#pragma once")
    out.append("#include <Arduino.h>")
    out.append(f"#define ICON_W {ICON_W}")
    out.append(f"#define ICON_H {ICON_H}")
    out.append("")

    for arq, simbolo in ALVOS:
        linhas = converter(arq, simbolo)
        out.append(f"// {arq}")
        out.append(f"const uint32_t ICON_{simbolo}[ICON_H] PROGMEM = {{")
        for i, b in enumerate(linhas):
            virg = "," if i < ICON_H - 1 else ""
            out.append(f"  0x{b:08x}{virg}")
        out.append("};")
        out.append("")

    print("\n".join(out))

if __name__ == "__main__":
    imprimir()
