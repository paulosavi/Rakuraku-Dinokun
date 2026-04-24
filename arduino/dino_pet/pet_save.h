#pragma once
#include <Arduino.h>
#include "pet_state.h"

// Bloco persistido em EEPROM
struct SaveBlock {
    uint32_t magic;         // validacao
    uint16_t versao;        // pra futuras migracoes
    Stats pet;
    uint32_t horasTotais;   // relogio virtual persistido
};

#define SAVE_MAGIC 0xD190D110
#define SAVE_VERSAO 2   // bump: struct Stats foi estendida (dieta*, humor 0-5, horasDoente)

void saveInit();                    // chamar uma vez no setup
bool saveCarregar(uint32_t* horasOut); // retorna true se havia save valido
void saveGravar(uint32_t horasTotais);
