#include "pet_save.h"
#include <EEPROM.h>

static const size_t EEPROM_SIZE = 256;  // suficiente pra SaveBlock com folga

void saveInit() {
    EEPROM.begin(EEPROM_SIZE);
}

bool saveCarregar(uint32_t* horasOut) {
    SaveBlock bloco;
    EEPROM.get(0, bloco);

    if (bloco.magic != SAVE_MAGIC || bloco.versao != SAVE_VERSAO) {
        return false;
    }

    pet = bloco.pet;
    if (horasOut) *horasOut = bloco.horasTotais;
    return true;
}

void saveGravar(uint32_t horasTotais) {
    SaveBlock bloco;
    bloco.magic = SAVE_MAGIC;
    bloco.versao = SAVE_VERSAO;
    bloco.pet = pet;
    bloco.horasTotais = horasTotais;

    EEPROM.put(0, bloco);
    EEPROM.commit();
}
