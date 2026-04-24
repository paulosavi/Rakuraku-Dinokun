#pragma once
#include <Arduino.h>

// Tempo real (ms) por hora virtual do jogo.
// DEV lento:   60000    -> 1min real = 1h virtual (minutos virtuais passam 1/seg)
// DEV rapido:  10000    -> 10s = 1h (degrada em segundos, mas minutos virtuais passam rapido demais)
// PROD:        3600000  -> 1h real = 1h virtual (fiel ao original)
#ifndef MILLIS_POR_HORA
#define MILLIS_POR_HORA 60000UL
#endif

// Hora virtual inicial quando nao ha save (0..23)
// Uso 8: uma hora antes da primeira hora de degradacao (10) — da tempo do pet se ambientar
#define HORA_INICIAL_DEFAULT 8

void clockInit(uint32_t horasPersistidas);
void clockTick();                // chamar no loop
uint8_t clockGetHour();          // 0..23
uint8_t clockGetMinute();        // 0..59 (interpolado dentro da hora virtual)
uint8_t clockGetSecond();        // 0..59 (interpolado dentro da hora virtual)
uint32_t clockGetTotalHours();   // horas totais desde o nascimento
bool clockHourChanged();         // true uma unica vez por nova hora virtual
