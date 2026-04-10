# Rakuraku Dinokun - Estado do Projeto

## Referências Oficiais

- https://tasvideos.org/HomePages/MUGG/DinkieDino
- https://gotchi-garden.blogspot.com/p/dinkie-dino-care-sheet.html

---

## Mecânicas do Brinquedo Oficial (implementadas)

### Stats do Pet

| Stat | Descrição | Mecânica |
|------|-----------|----------|
| Fome | Pratos (0-4) | Degrada às 10h-16h. Bebê -2, demais -1 |
| Sede | Copos (0-4) | Degrada às 10h-16h. Bebê -2, demais -1 |
| Humor | 6 níveis (0-5) | Degrada apenas horas pares (10h, 12h, 14h, 16h). +1 ao dino vencer jokenpô |
| Peso | Em kg | Comida/água vai para `comidaPendente`, converte +1kg/hora |
| Idade | Dias desde nascimento | Calculado por timestamp |
| Educação | 5 níveis (E+ → A+) | +1 via estudo ou carinho. Reseta a 0 com remédio |
| Temperatura | Graus | AC ligado: desce 0-8°C/hora. AC desligado: sobe 0-8°C/hora. Ideal: 25°C |

### Sistema de Temperatura e AC

- **AC desligado**: temperatura sobe 0-8°C por hora (aquece naturalmente)
- **AC ligado**: temperatura desce 0-8°C por hora (resfria)
- **Temp > 30°C**: estado `comCalor` → animação hot.json → cura: ligar AC
- **Temp < 20°C**: estado `comFrio` → animação cold.json → cura: desligar AC
- Estados de frio/calor limpam automaticamente quando temp volta ao range 20-30°C
- Frio/calor são estados separados de doença (doença só cura com remédio)

### Sistema de Evolução

Evolução ocorre às 9h quando o pet acorda e o peso ultrapassa o threshold:

| Fase | Peso Mínimo | Descrição |
|------|-------------|-----------|
| 1 | 1kg | Bebê |
| 2 | 15kg | Filhote (genérico) |
| 3 | 30kg | Jovem (caminho por dieta) |
| 5 | 50kg | Adolescente |
| 7 | 70kg | Adulto |
| 9 | 90kg | Adulto final |

3 caminhos baseados na dieta a partir da fase 3:

| Dieta Principal | Evolução |
|----------------|----------|
| Frango & Hambúrguer (carne) | Tyrannosaurus |
| Maçã & Cenoura (vegetal) | Triceratops |
| Macarrão / misto (massa) | Brontosaurus |

Frames existem para todas as fases e caminhos (idle, sleeping, sick, dirty, cold, hot).

### Degradação por Horários (conforme original)

| Horário | Fome/Sede | Humor |
|---------|-----------|-------|
| 10h | -1 (-2 bebê) | -1 |
| 11h | -1 (-2 bebê) | — |
| 12h | -1 (-2 bebê) | -1 |
| 13h | -1 (-2 bebê) | — |
| 14h | -1 (-2 bebê) | -1 |
| 15h | -1 (-2 bebê) | — |
| 16h | -1 (-2 bebê) | -1 |

Temperatura, sujeira e conversão de peso ocorrem toda hora acordado.

### Peso por Conversão Horária

- Ao comer/beber, `comidaPendente` incrementa (não peso direto)
- A cada hora, se `comidaPendente > 0`: peso +1, comidaPendente -1
- Exemplo: come 3 vezes → leva 3 horas pra ganhar 3kg

### Doenças e Estados

| Estado | Causa | Tratamento | Animação |
|--------|-------|-----------|----------|
| Sujo | 10% chance/hora | Banho | dirty.json (2 frames) |
| Com Calor | Temp > 30°C | Ligar AC | hot.json (2 frames) |
| Com Frio | Temp < 20°C | Desligar AC | cold.json (2 frames) |
| Doente | Fome/sede 0 (30% chance), luz acesa dormindo | Remédio | sick.json (2 frames) |
| Mau humor | Humor neutro ou pior | Jokenpô | — |

Ao curar doença com remédio: **fome, sede, humor e educação resetam para zero**.

### Morte

- **Por doença**: timer aleatório de 1-8 horas (sorteado ao ficar doente)
- **Por velhice**: 20 dias de idade
- Tela de game over com sprite morto (deadNeglect.json, 2 frames)

### Ciclo de Sono

- Dorme: 21h (9pm)
- Acorda: 9h (9am) — evolução é checada neste momento
- Luz acesa enquanto dorme → fica doente
- Dormindo com luz apagada: animação sleeping_mode_original.json (Z's na tela escura)

### Jokenpô (Pedra-Papel-Tesoura)

- 5 rodadas por partida
- Ambas as mãos aparecem simultaneamente (como no original)
- Vitória do dino: humor +1
- Empate ou derrota do dino: humor não muda
- Botões bloqueados durante animações de resultado (vezDoJogador flag)
- Ao final das 5 rodadas: animação feliz/raiva conforme resultado geral

### Prioridade de Animação

`morto > dormindo > doente > calor > frio > sujo > idle`

### Botões

- **Seleção Esquerda**: Água, Comida, Luz, Carinho, Necessidades
- **Seleção Direita**: Brincar, Estudar, Banho, AC, Remédio
- **Enter**: Confirmar (no painel AC/Luz: confirma e salva estado)
- **Esc**: Voltar
- **Clock**: Ver hora

### Painel do AR Condicionado

- Enter abre o painel (mostra ON por padrão)
- Esquerda/Direita alterna entre ligar/desligar
- Enter confirma a escolha, salva estado e cura frio/calor conforme direção
- Funciona igual ao painel de luz (antes bugava, resetava para "ligar" ao reabrir)

---

## O que JÁ está Implementado

### Funcional

- [x] Menu de navegação (esquerda/direita entre atividades)
- [x] Animação do ovo chocando
- [x] Animação do dino na tela principal (com carregamento dinâmico por fase)
- [x] Animação de comer (6 tipos de comida) — fome +1, comidaPendente +1, rastreia dieta
- [x] Animação de beber — sede +1, comidaPendente +1
- [x] Animação de carinho — educação +1
- [x] Animação de estudar — educação +1
- [x] Animação de banho — remove estado sujo
- [x] Animação de medicar — cura doença, reseta fome/sede/humor/educação a 0
- [x] Toggle de luz (liga/desliga visual + efeito no sono)
- [x] Toggle de AC (liga/desliga + efeito na temperatura + cura frio/calor)
- [x] Jokenpô funcional (5 rodadas, mãos simultâneas, botões bloqueados durante animação)
- [x] Painel de necessidades dinâmico (temperatura, peso, idade com dígitos reais)
- [x] Relógio interno configurável
- [x] Persistência no localStorage
- [x] Matriz de pixels 16x19
- [x] Sistema de stats completo com degradação por horários específicos
- [x] Game loop com cálculo de tempo offline (até 48h, hora a hora simulada)
- [x] Conversão de peso por hora (comidaPendente → peso)
- [x] Estados de temperatura separados (comFrio/comCalor com animações próprias)
- [x] Sistema de evolução por peso e dieta — lógica de stats apenas (5 fases, 3 caminhos)
- [~] Carregamento dinâmico de frames por fase/caminho — estrutura criada mas não funcional
- [x] Ciclo de sono (21h-9h) com evolução ao acordar
- [x] Morte por doença (timer aleatório 1-8h) e velhice (20 dias)
- [x] Animações de estados passivos (doente, sujo, dormindo, morto, frio, calor — 2 frames cada)
- [x] Dormindo com luz apagada: animação sleeping_mode_original
- [x] Testes automatizados (129 testes via Node.js)

### Painel de Debug

Acessível via double-click na imagem do tamagotchi:

- Campos editáveis: fome, sede, humor, peso, idade, educação, temperatura, fase evolução, dietas
- Checkboxes: doente, com calor, com frio, sujo, dormindo, vivo
- Seção Ambiente: checkboxes de Luz e AR Condicionado
- Relógio interno: definir hora/minuto
- Botão "Forçar Tick": simula 1 hora, avança relógio, mostra mudanças no log
- Botão "Testar Degradação 24h": simula ciclo completo e valida horários
- Botão "Aplicar Stats": salva alterações
- Botão "Reset": limpa tudo e recarrega

### Frames de Pixel Art

- Todas as fases e caminhos de evolução (idle, sleeping, sick, dirty, cold, hot, dead)
- Fase 1 (bebê): idle.json, sleeping.json, sick.json, dirty.json, cold.json, hot.json
- Fase 2 (filhote): idle2.json, sleeping2.json, sick2.json, dirty2.json, cold2.json, hot2.json
- Fases 3/5/7/9 por caminho: idle3tyrannosaurus.json, sleeping3triceratops.json, etc.
- Dormindo luz apagada: sleeping_mode_original.json
- Morto: deadNeglect.json, deadOldAge.json
- Jokenpô: pedra, papel, tesoura (jogador e dino)
- Necessidades: humor (6 níveis), fome (5), sede (5), educação (5), temperatura, peso/idade
- Comidas: hambúrguer, macarrão, sorvete, cenoura, maçã, coxa
- Luz on/off, AC on/off

### Testes Automatizados

Arquivo: `tests/stats.node.test.mjs` — rodar com `node tests/stats.node.test.mjs`

| Teste | Cobertura |
|-------|-----------|
| Degradação por horários | 24 horas, verifica fome/sede/humor em cada |
| Bebê degrada mais | -2 vs -1 por fase |
| Peso conversão horária | comidaPendente → peso com delay |
| Temperatura AC | 100 iterações: AC esfria, sem AC esquenta |
| Estados frio/calor | Ativam >30/<20, limpam ao voltar ao range |
| AC cura estados | Ligar cura calor, desligar cura frio |
| Jokenpô e humor | Dino vence +1, jogador vence sem mudança, cap em 5 |
| Remédio reseta stats | Fome/sede/humor/educação → 0 |
| Dormindo não degrada | Stats ficam iguais |
| Luz acesa dormindo | Fica doente |
| Morte por doença | Timer aleatório 1-8h, morte no timing certo |
| Evolução por peso | Thresholds, caminhos por dieta, pulo de fases |

---

## O que FALTA Implementar

### Prioridade 4 - Evolução Visual (PENDENTE)

- [ ] Troca real de sprites ao evoluir (idle, sleeping, sick, dirty, cold, hot)
- [ ] Animações de ações por fase (comer, beber, estudar, banhar, medicar, carinho)
- [ ] Animações de reação por fase (feliz, raiva)
- [ ] Frames de jokenpô por fase
- [ ] Animação de transição visual ao evoluir
- [ ] Transformação em anjo ou vampiro (fase final)
- [ ] 1 dia na forma final → morte inevitável

### Prioridade 5 - Polimento

- [ ] Ajuste de relógio pelo jogador (Esc + Enter)
- [ ] Toggle de som (Left + Right por 3 segundos)
- [ ] Sistema de alertas sonoros (beep quando stats críticos)

---

## Arquitetura de Frames

### Estrutura de pastas

```
frames/
  pixelDino/
    idle.json              # Fase 1 (bebê)
    idle2.json             # Fase 2 (filhote)
    idle3tyrannosaurus.json # Fase 3 caminho carne
    idle3triceratops.json   # Fase 3 caminho vegetal
    idle3brontosaurus.json  # Fase 3 caminho massa
    ...
```

Cada arquivo JSON segue o formato:

```json
{
  "frames": [
    { "id": 1, "interval": 1000, "matrix": [[0,0,...], [0,1,...], ...] },
    { "id": 2, "interval": 1000, "matrix": [[...]] }
  ]
}
```

A `matrix` é 16 linhas × 19 colunas de 0s (pixel apagado) e 1s (pixel aceso).

### Carregamento dinâmico por fase

```
obterStats().faseEvolucao + caminhoEvolucao
     ↓ getSufixoFase()
     ↓ ex: "3tyrannosaurus"
     ↓
carregarFramesPorFase("idle")
     ↓ tenta "idle3tyrannosaurus"
     ↓ fallback: "idle" (frame base)
     ↓
framesLoader.js (fetch + cache)
     ↓
animação renderizada na matriz
```

### Requisito importante

O jogo **precisa rodar via servidor local** (VS Code Live Server, `python -m http.server`, `npx serve`, etc.) porque `fetch()` não funciona com `file://`.
