import re, os

raiz = os.path.dirname(os.path.abspath(__file__))
h_path = os.path.join(raiz, "..", "icons.h")

with open(h_path) as f:
    src = f.read()

# acha cada bloco ICON_<NOME>[ICON_H] PROGMEM = { linhas }
padrao = re.compile(r"const uint16_t ICON_(\w+)\[ICON_H\] PROGMEM = \{([^}]+)\};")
for m in padrao.finditer(src):
    nome = m.group(1)
    corpo = m.group(2)
    hexes = re.findall(r"0x([0-9a-fA-F]+)", corpo)
    print(f"{nome}")
    for h in hexes:
        v = int(h, 16)
        linha = "".join("#" if (v >> x) & 1 else "." for x in range(12))
        print("  " + linha)
    print()
