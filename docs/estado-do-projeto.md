# Rakuraku Dinokun - Estado do Projeto

## Referências Oficiais

- https://tasvideos.org/HomePages/MUGG/DinkieDino
- https://gotchi-garden.blogspot.com/p/dinkie-dino-care-sheet.html

---

## Mecânicas do Brinquedo Oficial

### Stats do Pet

| Stat | Descrição | Mecânica |
|------|-----------|----------|
| Fome | Pratos (4 unidades) | Cada prato vazio = precisa comer 2x. Diminui por hora |
| Sede | Copos (4 unidades) | Cada copo vazio = precisa beber 1x. Diminui por hora |
| Humor | 6 níveis (muito triste → muito feliz) | Diminui 1 por hora. Aumenta ao ganhar jokenpô |
| Peso | Em kg | Comida/água converte em +1kg por hora |
| Idade | Dias desde o nascimento | Correlaciona com peso e evolução |
| Educação | 5 níveis (E+ → D+ → C+ → B+ → A+) | Aumenta via estudo e carinho |
| Temperatura | Graus | AC ajusta aleatoriamente 0-8°C/hora. Ideal: 25°C |

### Sistema de Evolução

3 caminhos baseados na dieta:

| Dieta Principal | Evolução Adulta |
|----------------|-----------------|
| Frango & Hambúrguer | T-Rex |
| Maçã & Cenoura | Brontossauro |
| Macarrão / tudo | Triceratops |

Estágios: Ovo → Bebê → Criança → Adolescente → Adulto → Forma final (anjo/vampiro)

Evolução ocorre às 9h quando peso ultrapassa limites:
- Nível 1 → Nível 2: 15kg

### Degradação por Hora (Nível de Evolução 1)

- -2 pratos de comida
- -2 copos de bebida
- -1 humor
- +1kg peso (se comeu/bebeu)

### Degradação por Hora (Nível de Evolução 2)

- -1 prato de comida
- -1 copo de bebida
- -1 humor
- +1kg peso (se comeu/bebeu)

### Doenças

| Doença | Causa | Tratamento |
|--------|-------|-----------|
| Sujo | Aleatório / tempo | Banho |
| Raiva (calor) | Temperatura > 30°C | Ligar AC |
| Congelando | Temperatura < 20°C | Desligar AC |
| Doente | Aleatório / negligência | Remédio |
| Mau humor | Humor neutro ou pior | Jokenpô / sorvete |

Ao curar doença com remédio: **todos os medidores resetam para zero**.

### Ciclo de Sono

- Dorme: 21h (9pm)
- Acorda: 9h (9am)
- Luz deve ser apagada ao dormir, senão acorda doente

### Jokenpô (Pedra-Papel-Tesoura)

- 5 rodadas por partida
- Empate conta como vitória do jogador
- Vitória do dino: humor +1
- Derrota do dino: humor não muda

### Morte

- Por doença não tratada (tempo limite aleatório)
- Por velhice (forma final dura 1 dia)

### Botões

- **Seleção Esquerda**: Água, Comida, Luz, Carinho, Necessidades
- **Seleção Direita**: Brincar, Estudar, Banho, AC, Remédio
- **Enter**: Confirmar
- **Esc**: Voltar
- **Clock**: Ver hora

---

## O que JÁ está Implementado

### Funcional

- [x] Menu de navegação (esquerda/direita entre atividades)
- [x] Animação do ovo chocando
- [x] Animação do dino na tela principal (fase 1 apenas)
- [x] Animação de comer (6 tipos de comida) - fome +1, peso +1, rastreia dieta
- [x] Animação de beber - sede +1, peso +1
- [x] Animação de carinho - educação +1
- [x] Animação de estudar - educação +1
- [x] Animação de banho - remove estado sujo
- [x] Animação de medicar - cura doença, reseta stats a 0
- [x] Toggle de luz (liga/desliga visual)
- [x] Toggle de AC (liga/desliga visual)
- [x] Jokenpô funcional (5 rodadas, pontuação) - humor +1 quando dino vence
- [x] Painel de necessidades (6 telas de pixel art estática)
- [x] Relógio (hora real do sistema)
- [x] Persistência no localStorage (jogo iniciado, luz, AC, todos os stats)
- [x] Matriz de pixels 16x19
- [x] Sistema de stats numéricos (fome, sede, humor, peso, idade, educação, temperatura)
- [x] Degradação automática dos stats com o tempo (a cada hora real)
- [x] Game loop com cálculo de tempo offline (até 48h acumuladas)
- [x] Rastreamento de dieta (carne/vegetal/massa) para evolução futura
- [x] Ciclo de sono básico (21h-9h, flag dormindo)
- [x] Sistema de frames centralizado em `frames.json` (editável via `editar.html`)
- [x] Editor visual de frames (`editar.html`) com grid 16×19, pintar/apagar pixels, import/export JSON
- [x] Loader assíncrono de frames (`framesLoader.js`) com top-level await
- [x] 6 faces completas de humor (editadas no editor, carregadas do JSON)

### Frames de Pixel Art Existentes (fase 1 apenas)

- Dino parado (4 frames)
- Dino comendo + arrotando
- Dino bebendo + arrotando
- Dino estudando (4 frames)
- Dino tomando banho (3 frames)
- Dino recebendo carinho (2 frames)
- Dino sendo medicado (4 frames)
- Dino feliz / dino triste
- Ovo chocando (20 frames)
- Jokenpô: pedra, papel, tesoura (jogador e dino)
- Necessidades: humor, temperatura, sede, fome, peso/idade, estudos (estáticos)
- Relógio: números 0-9
- Luz on/off, AC on/off
- Opções de comida: hambúrguer, macarrão, sorvete, cenoura, maçã, coxa

---

## O que FALTA Implementar

### Prioridade 1 - Sistema Base ✅ CONCLUÍDO

- [x] Sistema de stats numéricos (fome, sede, humor, peso, idade, educação, temperatura)
- [x] Degradação automática dos stats com o tempo (a cada hora)
- [x] Efeito real das ações nos stats (comer reduz fome, beber reduz sede, etc.)
- [x] Persistência completa dos stats no localStorage
- [x] Game loop com cálculo de tempo offline
- [x] Rastreamento de dieta para evolução

### Prioridade 2 - Consequências Visuais ✅ CONCLUÍDO

- [x] Telas de necessidades dinâmicas (humor com 6 faces, fome/sede com indicadores, temperatura/peso/idade com números, educação com letra)
- [x] Sistema de temperatura (variação aleatória, causa doença se >30 ou <20)
- [x] Consequências do jokenpô no humor
- [x] Educação funcional (E+ → A+ via estudo/carinho)
- [x] Dieta rastrear qual comida foi dada (para evolução)

### Prioridade 2.5 - Infraestrutura de Frames ✅ CONCLUÍDO

- [x] `frames.json` como fonte de verdade dos pixel arts (100% migrado)
- [x] Editor visual `editar.html` (carrega `frames.json` automaticamente via fetch)
- [x] `framesLoader.js` async com `fetch()` + top-level await
- [x] `necessidadesDinamicas.js` refatorado para carregar do JSON
- [x] 6 humores editáveis via editor (sem tocar no código)
- [x] Pratos (4), copos (4), termômetro, peso/idade, estudos no JSON
- [x] `dinoFase1frames.js` - 4 frames do dino + feliz/raiva/arroto
- [x] `dinoFase1BanhoFrames.js` - 3 frames do banho
- [x] `dinoFase1BebendoFrames.js` - 7 frames de beber água
- [x] `dinoFase1CarinhoFrames.js` - 2 frames de carinho
- [x] `dinoFase1EstudandoFrames.js` - 2 frames de estudar
- [x] `dinoFase1MedicarFrames.js` - 4 frames de injeção/remédio
- [x] `comidasFrames.js` - hambúrguer, macarrão, sorvete, cenoura, maçã, coxa
- [x] `framesChocarOvo.js` - 20 frames da animação do ovo chocando
- [x] `luz.js` e `painelDoArCondicionado.js` - frames on/off
- [x] Arquivo antigo `necessidades.js` removido (substituído por `necessidadesDinamicas.js`)

### Prioridade 3 - Ciclos de Vida ✅ CONCLUÍDO

- [x] Ciclo de sono básico (21h-9h, flag dormindo)
- [x] Luz afeta saúde ao dormir (luz acesa enquanto dorme = doença)
- [x] Sistema de doenças visual (sprites de dormindo, sujo, doente, morto)
- [x] Sistema de alertas/piscada quando precisa de atenção (fome/sede=0 ou doente)
- [x] Morte por doença não tratada (12h doente sem remédio)
- [x] Morte por velhice (20 dias de idade)
- [x] Tela de game over com sprite de morto
- [x] Reset automático após morte (5s → aparece chavinha pra recomeçar)
- [x] Interações bloqueadas quando pet está morto

### Prioridade 4 - Evolução

- [ ] Sistema de evolução baseado em peso/idade/dieta
- [ ] Sprites para fases 2, 3 e adulta (3 ramos)
- [ ] Forma final (anjo/vampiro)
- [ ] Animações para cada fase

### Prioridade 5 - Polimento

- [ ] Ajuste de relógio pelo jogador (Esc + Enter)
- [ ] Toggle de som (Left + Right por 3 segundos)
- [ ] Reset do jogo

---

## Arquitetura de Frames (infra atual)

### Fluxo de dados

```
frames.json (fonte de verdade)
     ↓ fetch()
framesLoader.js (top-level await)
     ↓ getFramePixels()
necessidadesDinamicas.js (e outros futuros consumidores)
     ↓
renderização na grade 16×19
```

### Fluxo de edição

```
editar.html → edita visualmente → Exportar JSON → baixa frames.json
     ↓
usuário substitui frames.json no projeto
     ↓
recarrega o jogo → alterações aparecem (sem mexer no código)
```

### Requisito importante

O jogo **precisa rodar via servidor local** (VS Code Live Server, `python -m http.server`, `npx serve`, etc.) porque `fetch()` não funciona com `file://`.
