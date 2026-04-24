#include "pet_clock.h"

static uint32_t horasTotais = 0;
static uint32_t millisUltimaHora = 0;
static bool sinalizadorNovaHora = false;

void clockInit(uint32_t horasPersistidas) {
    horasTotais = horasPersistidas;
    millisUltimaHora = millis();
    sinalizadorNovaHora = false;
}

void clockTick() {
    uint32_t agora = millis();
    if (agora - millisUltimaHora >= MILLIS_POR_HORA) {
        uint32_t horasAvancadas = (agora - millisUltimaHora) / MILLIS_POR_HORA;
        horasTotais += horasAvancadas;
        millisUltimaHora += horasAvancadas * MILLIS_POR_HORA;
        sinalizadorNovaHora = true;
    }
}

uint8_t clockGetHour() {
    return (uint8_t)((HORA_INICIAL_DEFAULT + horasTotais) % 24);
}

// Fracao da hora virtual atual mapeada para 0..3599 (minutos*60 + segundos)
static uint32_t dentroDaHoraVirtual() {
    uint32_t delta = millis() - millisUltimaHora;
    if (delta >= MILLIS_POR_HORA) delta = MILLIS_POR_HORA - 1;
    return (delta * 3600UL) / MILLIS_POR_HORA;
}

uint8_t clockGetMinute() {
    return (uint8_t)(dentroDaHoraVirtual() / 60);
}

uint8_t clockGetSecond() {
    return (uint8_t)(dentroDaHoraVirtual() % 60);
}

uint32_t clockGetTotalHours() {
    return horasTotais;
}

bool clockHourChanged() {
    if (sinalizadorNovaHora) {
        sinalizadorNovaHora = false;
        return true;
    }
    return false;
}
