#include "pet_som.h"

struct Nota { uint16_t freq; uint16_t durMs; };

// freq=0 = silencio (gap)
static const Nota SEQ_BEEP[]    = { { 1200,  30 } };
static const Nota SEQ_HAPPY[]   = { { 1500,  90 }, {    0,  40 }, { 1900,  90 }, {    0,  40 }, { 2400, 160 } };
static const Nota SEQ_SAD[]     = { { 1000, 130 }, {    0,  60 }, {  800, 130 }, {    0,  60 }, {  600, 220 } };
static const Nota SEQ_ALERT[]   = { { 2200, 100 }, {    0,  90 }, { 2200, 100 }, {    0,  90 }, { 2200, 100 } };
static const Nota SEQ_PLAYING[] = { { 1500,  70 }, {    0,  40 }, { 1900,  70 }, {    0,  40 }, { 1500,  70 }, {    0,  40 }, { 2400, 130 } };

static const Nota* const SEQS[5] = {
    SEQ_BEEP, SEQ_HAPPY, SEQ_SAD, SEQ_ALERT, SEQ_PLAYING
};
static const uint8_t SEQ_LENS[5] = {
    sizeof(SEQ_BEEP)    / sizeof(Nota),
    sizeof(SEQ_HAPPY)   / sizeof(Nota),
    sizeof(SEQ_SAD)     / sizeof(Nota),
    sizeof(SEQ_ALERT)   / sizeof(Nota),
    sizeof(SEQ_PLAYING) / sizeof(Nota)
};

static uint8_t pinoBuzzer = 0;
static const Nota* seqAtual = nullptr;
static uint8_t seqLen = 0;
static uint8_t seqIdx = 0;
static uint32_t notaInicioMs = 0;
static bool ligado = true;

static void aplicarNota(const Nota& n) {
    if (n.freq > 0) tone(pinoBuzzer, n.freq);
    else            noTone(pinoBuzzer);
}

void somInit(uint8_t pino) {
    pinoBuzzer = pino;
    pinMode(pino, OUTPUT);
}

void somTocar(uint8_t tipo) {
    if (!ligado) return;
    if (tipo > SOM_PLAYING) return;
    seqAtual = SEQS[tipo];
    seqLen = SEQ_LENS[tipo];
    seqIdx = 0;
    notaInicioMs = millis();
    aplicarNota(seqAtual[0]);
}

void somAtualizar() {
    if (!seqAtual) return;
    if (millis() - notaInicioMs < seqAtual[seqIdx].durMs) return;

    seqIdx++;
    if (seqIdx >= seqLen) {
        noTone(pinoBuzzer);
        seqAtual = nullptr;
        return;
    }
    aplicarNota(seqAtual[seqIdx]);
    notaInicioMs = millis();
}

void somLigar(bool l) {
    ligado = l;
    if (!l) {
        noTone(pinoBuzzer);
        seqAtual = nullptr;
    }
}
bool somEstaLigado() { return ligado; }
