#pragma once
#include <Arduino.h>

// Sons sintetizados via tone() — sequencias nao-bloqueantes.
// Reproduz a logica do js/principal/som.js usando notas musicais.
enum SomTipo {
    SOM_BEEP    = 0,  // botao apertado
    SOM_HAPPY   = 1,  // dinoFase1Feliz (banho ok / jokenpo vitoria)
    SOM_SAD     = 2,  // dinoFase1Raiva (jokenpo derrota)
    SOM_ALERT   = 3,  // tick com stats criticos
    SOM_PLAYING = 4   // iniciarJokenpo
};

void somInit(uint8_t pinoBuzzer);
void somTocar(uint8_t tipo);   // dispara uma sequencia
void somAtualizar();           // chamar no loop — avanca a nota atual
void somLigar(bool ligado);
bool somEstaLigado();
