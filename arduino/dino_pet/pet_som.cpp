#include "pet_som.h"

struct Nota { uint16_t freq; uint16_t durMs; };

// Frequencias MIDI oitava 6 (de 1175Hz a ~2KHz)
#define NOTE_B6   1976

// Frequencias MIDI oitava 7 (de ~2.3KHz a ~4KHz) — alvo dos sons originais
#define NOTE_D7   2349
#define NOTE_DS7  2489
#define NOTE_E7   2637
#define NOTE_F7   2794
#define NOTE_FS7  2960
#define NOTE_G7   3136
#define NOTE_GS7  3322
#define NOTE_A7   3520
#define NOTE_AS7  3729
#define NOTE_B7   3951

// Melodias derivadas dos WAVs originais (sfx/*.wav).
// Extraidas via librosa.pyin (fmin=C4, fmax=C8) a 120 BPM e ajustadas
// manualmente quando o espectrograma revela timing diferente.
// Divisores -> ms a 120 BPM: 4=500, 8=250, 16=125 (com gap de 20ms entre notas)

// beep: 1 pulso curto de B7 (~4 kHz) — espectrograma mostra ~25ms a ~4 kHz
static const Nota SEQ_BEEP[] = {
    { NOTE_B7, 35 }
};

// alert_dino: 3 pulsos de ~F#7 (~3KHz) com gaps — espectrograma de alert_dino.wav
// mostra pulso 200ms / silencio 150ms / pulso 150ms / silencio 100ms / pulso 200ms
static const Nota SEQ_ALERT[] = {
    { NOTE_FS7, 200 }, { 0, 150 },
    { NOTE_FS7, 150 }, { 0, 100 },
    { NOTE_FS7, 200 }
};

// happy: escala ascendente D7→G#7 + tremolo no fim — espectrograma de happy.wav
// total ~1.5s, com semitons cromáticos curtos como passagens
static const Nota SEQ_HAPPY[] = {
    { NOTE_G7,  60  }, { 0, 15 },   // ataque inicial breve
    { NOTE_D7,  180 }, { 0, 15 },
    { NOTE_DS7, 60  }, { 0, 10 },   // passagem cromática
    { NOTE_E7,  180 }, { 0, 15 },
    { NOTE_F7,  180 }, { 0, 15 },
    { NOTE_FS7, 60  }, { 0, 10 },   // passagem cromática
    { NOTE_G7,  180 }, { 0, 15 },
    { NOTE_GS7, 100 }, { 0, 15 },   // tremolo G7-G#7-G7-G#7
    { NOTE_G7,  100 }, { 0, 15 },
    { NOTE_GS7, 100 }, { 0, 15 },
    { NOTE_G7,  100 }
};

// sad: escala descendente G7→D7 + subida abrupta + tremolo G7-F#7-G7
// Espectrograma de sad.wav (~1.4s total) — escadinha clara descendo
static const Nota SEQ_SAD[] = {
    { NOTE_G7,  150 }, { 0, 15 },   // climax inicial
    { NOTE_FS7, 50  }, { 0, 10 },   // passagem cromática
    { NOTE_F7,  250 }, { 0, 15 },   // desce
    { NOTE_E7,  250 }, { 0, 15 },   // desce mais
    { NOTE_DS7, 50  }, { 0, 10 },   // passagem
    { NOTE_D7,  250 }, { 0, 15 },   // ponto mais grave (clímax triste)
    { NOTE_G7,  250 }, { 0, 15 },   // sobe abruptamente
    { NOTE_FS7, 50  }, { 0, 10 },   // tremolo
    { NOTE_G7,  150 }                // resolução
};

// pet_playing: 3 pulsos D7-FS7-D7 — espectrograma de pet_playing.wav (~850ms total)
// pulso 150ms / silêncio 100ms / pulso 250ms agudo / silêncio 150ms / pulso 200ms
static const Nota SEQ_PLAYING[] = {
    { NOTE_D7,  150 }, { 0, 100 },
    { NOTE_FS7, 250 }, { 0, 150 },
    { NOTE_D7,  200 }
};

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
