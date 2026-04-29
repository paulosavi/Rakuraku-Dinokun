#pragma once
#include <Arduino.h>
#include "sprites.h"

// Tipo de referência pros sprites (16x19 escalado depois)
typedef const uint32_t (*SpriteRefT)[SPRITE_ROWS];

struct SpriteData {
    SpriteRefT ref;
    uint8_t    frames;
};

// Conjunto de sprites de uma fase/caminho do pet
struct PhaseSpriteSet {
    SpriteData idle, sleeping, sick, dirty, cold, hot;
    SpriteData bath, drinking, caressing, reading, applyingInjection;
    SpriteData swallowing, celebrating, losing;
};

// Retorna o conjunto da fase + caminho atual de pet
const PhaseSpriteSet* getCurrentPhaseSet();

// Sprites do jokenpô (sempre fase 1 no original — só existem assim)
SpriteData spritePetPlayPaper();
SpriteData spritePetPlayRock();
SpriteData spritePetPlayScissors();
SpriteData spritePlayerPaper();
SpriteData spritePlayerRock();
SpriteData spritePlayerScissors();
SpriteData spritePreparingToPlay();

// Comer — só na fase 1 (eatingX sem sufixo). idx: 0=Sandwich,1=Noodles,2=IceCream,3=Carrot,4=Apple,5=Drumstick
SpriteData spriteEating(uint8_t idx);
SpriteData spriteSelectingFood(uint8_t idx);
