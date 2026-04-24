#pragma once
#include <Arduino.h>

#define IDADE_MAXIMA_DIAS 20

// Estrutura persistida em EEPROM — fiel ao js/principal/stats.js
struct Stats {
    uint8_t fome;          // 0..4  (0 = faminto, 4 = satisfeito)
    uint8_t sede;          // 0..4
    uint8_t humor;         // 0..5  (6 niveis, inicia em 5)
    uint8_t educacao;      // 0..4  (E+, D+, C+, B+, A+)
    uint16_t peso;         // kg (inicia em 1)
    uint16_t idade;        // dias vividos
    int8_t temperatura;    // graus C (ideal = 25)
    uint8_t comidaPendente; // kg a converter em peso (1kg/hora enquanto acordado)
    uint8_t horasDoente;    // horas contadas desde ficou doente
    uint8_t limiteDoenca;   // horas ate morrer (sorteado 1..8 ao ficar doente; 0 = nao doente)
    uint8_t faseEvolucao;   // 1..9
    uint8_t caminho;        // 0=nenhum, 1=tyrannosaurus, 2=triceratops, 3=brontosaurus
    uint8_t dietaCarne;
    uint8_t dietaVegetal;
    uint8_t dietaMassa;
    bool dormindo;
    bool doente;
    bool sujo;
    bool comFrio;
    bool comCalor;
    bool vivo;
    bool estadoLuz;    // luz acesa?
    uint8_t estadoAC;  // 0=desligado, 1=ligado
};

extern Stats pet;

void statsInit();                               // zera pra valores iniciais de bebe
bool statsDegradar(uint8_t hora);               // aplica uma hora de degradacao; retorna true se morreu
bool statsChecarSono(uint8_t hora);             // atualiza pet.dormindo; retorna true se acordou agora
void statsAtualizarIdade(uint32_t horasTotais); // recalcula idade em dias (e marca morte por velhice)
bool statsChecarEvolucao();                     // retorna true se evoluiu (Fase 4+)
