#include "pet_state.h"

Stats pet;

// Horarios de degradacao fieis ao Dinkie Dino original (stats.js:201-202)
static bool ehHoraDeDegradacao(uint8_t hora) {
    return hora >= 10 && hora <= 16;
}
static bool ehHoraDeHumor(uint8_t hora) {
    return hora == 10 || hora == 12 || hora == 14 || hora == 16;
}

void statsInit() {
    pet.fome = 4;
    pet.sede = 4;
    pet.humor = 5;
    pet.educacao = 0;
    pet.peso = 1;
    pet.idade = 0;
    pet.temperatura = 25;
    pet.comidaPendente = 0;
    pet.horasDoente = 0;
    pet.limiteDoenca = 0;
    pet.faseEvolucao = 1;
    pet.caminho = 0;
    pet.dietaCarne = 0;
    pet.dietaVegetal = 0;
    pet.dietaMassa = 0;
    pet.dormindo = false;
    pet.doente = false;
    pet.sujo = false;
    pet.comFrio = false;
    pet.comCalor = false;
    pet.vivo = true;
    pet.estadoLuz = true;
    pet.estadoAC = 0;
}

bool statsDegradar(uint8_t hora) {
    if (!pet.vivo) return false;

    if (pet.dormindo) {
        // Dormindo: nao degrada stats, apenas checa se a luz esta acesa (stats.js:210-214)
        if (pet.estadoLuz) pet.doente = true;
    } else {
        // Fome e sede degradam nas horas 10-16 (stats.js:217-225)
        if (ehHoraDeDegradacao(hora)) {
            uint8_t delta = (pet.faseEvolucao == 1) ? 2 : 1;  // bebe degrada 2x
            pet.fome = (pet.fome > delta) ? (pet.fome - delta) : 0;
            pet.sede = (pet.sede > delta) ? (pet.sede - delta) : 0;
        }

        // Humor degrada nas horas pares 10/12/14/16 (stats.js:228-230)
        if (ehHoraDeHumor(hora)) {
            if (pet.humor > 0) pet.humor--;
        }

        // Comida/agua pendente -> peso (1kg/hora) (stats.js:233-236)
        if (pet.comidaPendente > 0) {
            pet.peso++;
            pet.comidaPendente--;
        }

        // Temperatura: AC desligado sobe 0-8, AC ligado desce 0-8 (stats.js:241-247)
        int delta = (int)random(0, 9);
        if (pet.estadoAC == 1) {
            pet.temperatura -= delta;
            if (pet.temperatura < -20) pet.temperatura = -20;
        } else {
            pet.temperatura += delta;
            if (pet.temperatura > 60) pet.temperatura = 60;
        }
        pet.comCalor = (pet.temperatura > 30);
        pet.comFrio = (pet.temperatura < 20);

        // 10% de chance de ficar sujo por hora (stats.js:262-264)
        if (random(0, 100) < 10) pet.sujo = true;

        // Chance de ficar doente se fome=0 OU sede=0 (30% por hora) (stats.js:267-271)
        if (pet.fome == 0 || pet.sede == 0) {
            if (random(0, 100) < 30) pet.doente = true;
        }
    }

    // Timer de doenca (stats.js:275-288)
    if (pet.doente) {
        if (pet.limiteDoenca == 0) {
            pet.limiteDoenca = (uint8_t)random(1, 9);  // 1..8 horas
        }
        pet.horasDoente++;
        if (pet.horasDoente >= pet.limiteDoenca) {
            pet.vivo = false;
            return true;
        }
    } else {
        pet.horasDoente = 0;
        pet.limiteDoenca = 0;
    }

    // Morte por velhice (stats.js:291-294)
    if (pet.idade >= IDADE_MAXIMA_DIAS) {
        pet.vivo = false;
        return true;
    }

    return !pet.vivo;
}

bool statsChecarSono(uint8_t hora) {
    // dorme 21h-8h; ao acordar eh quando a evolucao e checada (gameLoop.js:62-84)
    bool deveriaDormir = (hora >= 21 || hora < 9);
    bool acordou = pet.dormindo && !deveriaDormir;
    pet.dormindo = deveriaDormir;
    return acordou;
}

void statsAtualizarIdade(uint32_t horasTotais) {
    pet.idade = (uint16_t)(horasTotais / 24);
}

bool statsChecarEvolucao() {
    uint8_t antes = pet.faseEvolucao;
    // Thresholds fieis ao original (stats.js:46-52)
    if (pet.peso >= 15 && pet.faseEvolucao < 2) pet.faseEvolucao = 2;
    if (pet.peso >= 30 && pet.faseEvolucao < 3) {
        pet.faseEvolucao = 3;
        // Define caminho por dieta (stats.js:56-62)
        uint8_t maior = max(pet.dietaCarne, max(pet.dietaVegetal, pet.dietaMassa));
        if (maior == 0) pet.caminho = 3;  // brontosaurus default
        else if (pet.dietaCarne >= pet.dietaVegetal && pet.dietaCarne >= pet.dietaMassa) pet.caminho = 1; // trex
        else if (pet.dietaVegetal >= pet.dietaCarne && pet.dietaVegetal >= pet.dietaMassa) pet.caminho = 2; // triceratops
        else pet.caminho = 3; // brontosaurus
    }
    if (pet.peso >= 50 && pet.faseEvolucao < 5) pet.faseEvolucao = 5;
    if (pet.peso >= 70 && pet.faseEvolucao < 7) pet.faseEvolucao = 7;
    if (pet.peso >= 90 && pet.faseEvolucao < 9) pet.faseEvolucao = 9;
    return pet.faseEvolucao != antes;
}
