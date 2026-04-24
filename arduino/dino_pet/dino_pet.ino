// =====================================================================
// RAKURAKU DINOKUN - Port para Raspberry Pi Pico (earlephilhower core)
// Fase 3: menu de acoes (banho, comida, beber, medicar, carinho, ler, luz, AC)
// =====================================================================
//
// >>> PREENCHA OS GPIOs DOS SEUS 6 BOTOES AQUI <<<
//
// Todos configurados como INPUT_PULLUP: o botao aterra o pino quando pressionado
// (ligacao: um lado do botao no GPIO, outro lado no GND)

#define BTN_UP      3    // direcional cima
#define BTN_DOWN    2    // direcional baixo
#define BTN_LEFT    4    // direcional esquerda
#define BTN_RIGHT   5    // direcional direita
#define BTN_ENTER   6    // confirmar / acao
#define BTN_ESC     7    // voltar / cancelar

// --- perifericos ---
#define BUZZER      8    // saida do buzzer (tone)
#define OLED_SDA    0    // I2C0 SDA
#define OLED_SCL    1    // I2C0 SCL
#define OLED_ADDR   0x3C // endereco I2C do SSD1306 (padrao)

// =====================================================================

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "sprites.h"
#include "icons.h"
#include "pet_state.h"
#include "pet_clock.h"
#include "pet_save.h"

#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT 64
#define STATUS_BAR_H  16     // faixa amarela superior (0..15)
#define AREA_AZUL_Y   16     // inicio da area azul (16..63)
#define SPRITE_SCALE  3      // 16x19 logico -> 48x57 na tela (tamanho cheio)

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Tipos compartilhados (antes de qualquer funcao, senao o auto-prototype do Arduino quebra)
typedef const uint32_t (*SpriteRef)[SPRITE_ROWS];

struct SpriteAnim {
    SpriteRef data;
    uint8_t frames;
    const char* nome;
};

struct ItemMenu {
    const char* label;
    uint8_t acao;
};

enum UIMode {
    UI_PRINCIPAL,
    UI_SELECAO,            // navega entre as 10 atividades
    UI_SUBMENU_COMIDA,     // navega entre as 6 comidas
    UI_PAINEL_LUZ,         // switch ligar/desligar luz
    UI_PAINEL_AC,          // switch ligar/desligar ar cond
    UI_NECESSIDADES,       // 6 sub-telas de stats (humor/temp/sede/fome/peso/edu)
    UI_STATS,              // tela textual completa (ESC)
    UI_EXECUTANDO_ACAO
};

enum Acao {
    ACAO_BANHO,
    ACAO_ABRIR_COMIDA,
    ACAO_BEBER,
    ACAO_MEDICAR,
    ACAO_CARINHO,
    ACAO_LER,
    ACAO_ABRIR_LUZ,        // abre painel ligar/desligar
    ACAO_ABRIR_AC,         // abre painel ligar/desligar
    ACAO_JOGAR,
    ACAO_NECESSIDADES
};

struct Atividade {
    const char* nome;
    const uint32_t* icone;  // bitmap 32x32
    uint8_t acao;
};

// ---------------------------------------------------------------------
// SPRITE RENDERER
// Desenha um sprite de 16 linhas x 19 colunas escalado por SCALE
// ---------------------------------------------------------------------
void drawSprite(const uint32_t sprite[][SPRITE_ROWS], uint8_t frame,
                int originX, int originY, uint8_t scale) {
    for (int y = 0; y < SPRITE_ROWS; y++) {
        uint32_t bits = pgm_read_dword(&sprite[frame][y]);
        for (int x = 0; x < SPRITE_COLS; x++) {
            if (bits & (1UL << x)) {
                int px = originX + x * scale;
                int py = originY + y * scale;
                display.fillRect(px, py, scale, scale, WHITE);
            }
        }
    }
}

// ---------------------------------------------------------------------
// LISTA DE ATIVIDADES (10 itens)
// Na tela principal, aperta ESQ/DIR -> entra no modo selecao.
// Durante a selecao, ESQ/DIR navega, ENTER executa, ESC volta.
// ---------------------------------------------------------------------
const Atividade ATIVIDADES[] = {
    { "Agua",         ICON_AGUA,         ACAO_BEBER },
    { "Brincar",      ICON_BRINCAR,      ACAO_JOGAR },
    { "Comida",       ICON_COMIDA,       ACAO_ABRIR_COMIDA },
    { "Estudar",      ICON_ESTUDAR,      ACAO_LER },
    { "Luz",          ICON_LUZ,          ACAO_ABRIR_LUZ },
    { "Banho",        ICON_BANHO,        ACAO_BANHO },
    { "Carinho",      ICON_CARINHO,      ACAO_CARINHO },
    { "Ar cond",      ICON_AR,           ACAO_ABRIR_AC },
    { "Necessidades", ICON_NECESSIDADES, ACAO_NECESSIDADES },
    { "Medico",       ICON_MEDICO,       ACAO_MEDICAR }
};
const uint8_t NUM_ATIVIDADES = sizeof(ATIVIDADES) / sizeof(ATIVIDADES[0]);

// ---------------------------------------------------------------------
// COMIDAS — 6 opcoes (stats.js:99-106): carne/massa/especial/vegetal
// ---------------------------------------------------------------------
struct Comida {
    const char* nome;
    SpriteRef icone;       uint8_t iconeFrames;   // selectingX
    SpriteRef anim;        uint8_t animFrames;    // eatingX
    uint8_t categoria;     // 1=carne, 2=massa, 3=especial, 4=vegetal
};

const Comida COMIDAS[] = {
    { "Hamburger", SPRITE_SELECTINGSANDWICH, SPRITE_SELECTINGSANDWICH_FRAMES, SPRITE_EATINGSANDWICH, SPRITE_EATINGSANDWICH_FRAMES, 1 },
    { "Macarrao",  SPRITE_SELECTINGNOODLES,  SPRITE_SELECTINGNOODLES_FRAMES,  SPRITE_EATINGNOODLES,  SPRITE_EATINGNOODLES_FRAMES,  2 },
    { "Sorvete",   SPRITE_SELECTINGICECREAM, SPRITE_SELECTINGICECREAM_FRAMES, SPRITE_EATINGICECREAM, SPRITE_EATINGICECREAM_FRAMES, 3 },
    { "Cenoura",   SPRITE_SELECTINGCARROT,   SPRITE_SELECTINGCARROT_FRAMES,   SPRITE_EATINGCARROT,   SPRITE_EATINGCARROT_FRAMES,   4 },
    { "Maca",      SPRITE_SELECTINGAPPLE,    SPRITE_SELECTINGAPPLE_FRAMES,    SPRITE_EATINGAPPLE,    SPRITE_EATINGAPPLE_FRAMES,    4 },
    { "Coxa",      SPRITE_SELECTINGDRUMSTICK,SPRITE_SELECTINGDRUMSTICK_FRAMES,SPRITE_EATINGDRUMSTICK,SPRITE_EATINGDRUMSTICK_FRAMES,1 }
};
const uint8_t NUM_COMIDAS = sizeof(COMIDAS) / sizeof(COMIDAS[0]);
uint8_t comidaSel = 0;

// Estado dos paineis de switch (luz/ar): 0=ligar (switchOn), 1=desligar (switchOff)
uint8_t switchEscolha = 0;

// Sub-tela atual de necessidades: 0=humor,1=temp,2=sede,3=fome,4=pesoIdade,5=edu
uint8_t necessSel = 0;

// Tabelas dos sprites por nivel (stats)
SpriteRef SPRITES_FEED[5]      = { SPRITE_FEED0, SPRITE_FEED1, SPRITE_FEED2, SPRITE_FEED3, SPRITE_FEED4 };
SpriteRef SPRITES_HYDRATION[5] = { SPRITE_HYDRATION0, SPRITE_HYDRATION1, SPRITE_HYDRATION2, SPRITE_HYDRATION3, SPRITE_HYDRATION4 };
SpriteRef SPRITES_HAPPINESS[6] = { SPRITE_HAPPINESS0, SPRITE_HAPPINESS1, SPRITE_HAPPINESS2, SPRITE_HAPPINESS3, SPRITE_HAPPINESS4, SPRITE_HAPPINESS5 };
SpriteRef SPRITES_SCHOOL[5]    = { SPRITE_SCHOOL0, SPRITE_SCHOOL1, SPRITE_SCHOOL2, SPRITE_SCHOOL3, SPRITE_SCHOOL4 };

uint8_t atividadeSel = 0;

// forward decls: definidos mais abaixo, usados em draw*
extern SpriteAnim currentAnim;
extern uint8_t currentFrame;

// Desenha icone 32x32 em (x,y)
void drawIcon32(const uint32_t* bmp, int x, int y) {
    for (int row = 0; row < ICON_H; row++) {
        uint32_t bits = pgm_read_dword(&bmp[row]);
        for (int col = 0; col < ICON_W; col++) {
            if (bits & (1UL << col)) {
                display.drawPixel(x + col, y + row, WHITE);
            }
        }
    }
}

// Faixa amarela: HH:MM | [nome da atividade OU estado] | indicador
void drawFaixaAmarela(const char* centroOverride = nullptr) {
    display.setTextSize(1);
    display.setTextColor(WHITE);

    display.setCursor(0, 4);
    uint8_t h = clockGetHour();
    uint8_t m = clockGetMinute();
    if (h < 10) display.print('0');
    display.print(h); display.print(':');
    if (m < 10) display.print('0');
    display.print(m);

    if (centroOverride) {
        int largura = strlen(centroOverride) * 6;
        display.setCursor((SCREEN_WIDTH - largura) / 2, 4);
        display.print(centroOverride);
    }

    const char* indic = nullptr;
    if (!pet.vivo) indic = "X";
    else if (pet.doente) indic = "Sic";
    else if (pet.dormindo) indic = "Zz";
    else if (pet.sujo) indic = "Suj";
    else if (pet.comFrio) indic = "Frio";
    else if (pet.comCalor) indic = "Cal";
    if (indic) {
        int largura = strlen(indic) * 6;
        display.setCursor(SCREEN_WIDTH - largura, 4);
        display.print(indic);
    }

    display.drawFastHLine(0, STATUS_BAR_H - 1, SCREEN_WIDTH, WHITE);
}

// Tela principal: faixa amarela + dino em tamanho cheio (SCALE=3)
void drawTelaPrincipal() {
    drawFaixaAmarela();

    int spriteW = SPRITE_COLS * SPRITE_SCALE;   // 57
    int spriteH = SPRITE_ROWS * SPRITE_SCALE;   // 48
    int originX = (SCREEN_WIDTH - spriteW) / 2; // 35
    int originY = AREA_AZUL_Y;                  // 16 (dino 48 de altura cabe exato)
    drawSprite(currentAnim.data, currentFrame, originX, originY, SPRITE_SCALE);
}

// Tela de selecao de atividade: icone 32x32 grande no centro + nome na amarela
void drawTelaSelecao() {
    drawFaixaAmarela(ATIVIDADES[atividadeSel].nome);
    int x = (SCREEN_WIDTH - ICON_W) / 2;
    int y = AREA_AZUL_Y + ((SCREEN_HEIGHT - AREA_AZUL_Y - ICON_H) / 2);
    drawIcon32(ATIVIDADES[atividadeSel].icone, x, y);

    // setinhas
    display.fillTriangle(0, SCREEN_HEIGHT / 2 + 4, 6, SCREEN_HEIGHT / 2, 6, SCREEN_HEIGHT / 2 + 8, WHITE);
    display.fillTriangle(SCREEN_WIDTH - 7, SCREEN_HEIGHT / 2, SCREEN_WIDTH - 1, SCREEN_HEIGHT / 2 + 4, SCREEN_WIDTH - 7, SCREEN_HEIGHT / 2 + 8, WHITE);
}

// Submenu de comida: mostra sprite selectingX da comida atual + nome
void drawTelaComida() {
    drawFaixaAmarela(COMIDAS[comidaSel].nome);
    // sprite 16x19 escalado 2x (38x32 aprox). Centralizado
    int scale = 2;
    int spriteW = SPRITE_COLS * scale;
    int spriteH = SPRITE_ROWS * scale;
    int originX = (SCREEN_WIDTH - spriteW) / 2;
    int originY = AREA_AZUL_Y + ((SCREEN_HEIGHT - AREA_AZUL_Y - spriteH) / 2);
    drawSprite(COMIDAS[comidaSel].icone, 0, originX, originY, scale);

    display.fillTriangle(0, SCREEN_HEIGHT / 2 + 4, 6, SCREEN_HEIGHT / 2, 6, SCREEN_HEIGHT / 2 + 8, WHITE);
    display.fillTriangle(SCREEN_WIDTH - 7, SCREEN_HEIGHT / 2, SCREEN_WIDTH - 1, SCREEN_HEIGHT / 2 + 4, SCREEN_WIDTH - 7, SCREEN_HEIGHT / 2 + 8, WHITE);
}

// Painel Luz/AC: mostra switchOn ou switchOff conforme escolha, titulo na amarela
void drawTelaPainelSwitch(const char* titulo) {
    char buf[24];
    snprintf(buf, sizeof(buf), "%s: %s", titulo, switchEscolha == 0 ? "Ligar" : "Desligar");
    drawFaixaAmarela(buf);

    SpriteRef sprite = (switchEscolha == 0) ? SPRITE_SWITCHON : SPRITE_SWITCHOFF;
    int scale = 2;
    int spriteW = SPRITE_COLS * scale;
    int spriteH = SPRITE_ROWS * scale;
    int originX = (SCREEN_WIDTH - spriteW) / 2;
    int originY = AREA_AZUL_Y + ((SCREEN_HEIGHT - AREA_AZUL_Y - spriteH) / 2);
    drawSprite(sprite, 0, originX, originY, scale);

    // setinhas
    display.fillTriangle(0, SCREEN_HEIGHT / 2 + 4, 6, SCREEN_HEIGHT / 2, 6, SCREEN_HEIGHT / 2 + 8, WHITE);
    display.fillTriangle(SCREEN_WIDTH - 7, SCREEN_HEIGHT / 2, SCREEN_WIDTH - 1, SCREEN_HEIGHT / 2 + 4, SCREEN_WIDTH - 7, SCREEN_HEIGHT / 2 + 8, WHITE);
}

// Tela de Necessidades: 6 sub-telas usando sprites do original + valor textual quando aplicavel
void drawTelaNecessidades() {
    const char* titulo;
    SpriteRef spriteBase = nullptr;
    char extraValor[24] = "";

    switch (necessSel) {
        case 0: // humor
            titulo = "Humor";
            spriteBase = SPRITES_HAPPINESS[pet.humor > 5 ? 5 : pet.humor];
            snprintf(extraValor, sizeof(extraValor), "%d/5", pet.humor);
            break;
        case 1: // temperatura
            titulo = "Temperatura";
            spriteBase = SPRITE_TEMPERATURE;
            snprintf(extraValor, sizeof(extraValor), "%dC", pet.temperatura);
            break;
        case 2: // sede
            titulo = "Sede";
            spriteBase = SPRITES_HYDRATION[pet.sede > 4 ? 4 : pet.sede];
            snprintf(extraValor, sizeof(extraValor), "%d/4", pet.sede);
            break;
        case 3: // fome
            titulo = "Fome";
            spriteBase = SPRITES_FEED[pet.fome > 4 ? 4 : pet.fome];
            snprintf(extraValor, sizeof(extraValor), "%d/4", pet.fome);
            break;
        case 4: // peso/idade
            titulo = "Peso/Idade";
            spriteBase = SPRITE_WEIGHTAGE;
            snprintf(extraValor, sizeof(extraValor), "%dkg %dd", pet.peso, pet.idade);
            break;
        case 5: // educacao
            titulo = "Educacao";
            spriteBase = SPRITES_SCHOOL[pet.educacao > 4 ? 4 : pet.educacao];
            snprintf(extraValor, sizeof(extraValor), "%d/4", pet.educacao);
            break;
        default:
            titulo = "?"; spriteBase = SPRITE_IDLE; break;
    }

    drawFaixaAmarela(titulo);

    int scale = 2;
    int spriteW = SPRITE_COLS * scale;
    int spriteH = SPRITE_ROWS * scale;
    int originX = (SCREEN_WIDTH - spriteW) / 2;
    int originY = AREA_AZUL_Y + 1;
    drawSprite(spriteBase, 0, originX, originY, scale);

    // valor textual em baixo, area azul final
    if (extraValor[0]) {
        int largura = strlen(extraValor) * 6;
        display.setTextSize(1);
        display.setTextColor(WHITE);
        display.setCursor((SCREEN_WIDTH - largura) / 2, SCREEN_HEIGHT - 8);
        display.print(extraValor);
    }

    // setinhas
    display.fillTriangle(0, SCREEN_HEIGHT / 2 + 4, 6, SCREEN_HEIGHT / 2, 6, SCREEN_HEIGHT / 2 + 8, WHITE);
    display.fillTriangle(SCREEN_WIDTH - 7, SCREEN_HEIGHT / 2, SCREEN_WIDTH - 1, SCREEN_HEIGHT / 2 + 4, SCREEN_WIDTH - 7, SCREEN_HEIGHT / 2 + 8, WHITE);
}

// Tela de stats detalhados (acessada via ESC)
// Titulo na faixa amarela + dados na area azul
void drawTelaStats() {
    display.setTextSize(1);
    display.setTextColor(WHITE);

    // titulo na faixa amarela
    display.setCursor(36, 4);
    display.print("= Stats =");
    display.drawFastHLine(0, STATUS_BAR_H - 1, SCREEN_WIDTH, WHITE);

    // dados na area azul (linhas de 8px comecando em Y=17)
    int y = AREA_AZUL_Y + 1;
    display.setCursor(0, y);
    display.print("Fome:"); display.print(pet.fome); display.print("/4 Sede:");
    display.print(pet.sede); display.print("/4");

    y += 8;
    display.setCursor(0, y);
    display.print("Humor:"); display.print(pet.humor); display.print("/5 Edu:");
    display.print(pet.educacao); display.print("/4");

    y += 8;
    display.setCursor(0, y);
    display.print("Peso:"); display.print(pet.peso); display.print("kg Idade:");
    display.print(pet.idade); display.print("d");

    y += 8;
    display.setCursor(0, y);
    display.print("Temp:"); display.print(pet.temperatura);
    display.print((char)247); display.print("C Fase:"); display.print(pet.faseEvolucao);

    y += 8;
    display.setCursor(0, y);
    display.print("Luz:"); display.print(pet.estadoLuz ? "On" : "Off");
    display.print(" Ar:"); display.print(pet.estadoAC ? "On" : "Off");

    y += 8;
    display.setCursor(0, y);
    if (!pet.vivo) display.print("Morto");
    else if (pet.doente) display.print("Doente");
    else if (pet.dormindo) display.print("Dormindo");
    else if (pet.sujo) display.print("Sujo");
    else if (pet.comFrio) display.print("Com frio");
    else if (pet.comCalor) display.print("Com calor");
    else display.print("Estado: Bem");
}

// ---------------------------------------------------------------------
// BOTOES (com debounce simples)
// ---------------------------------------------------------------------
const uint8_t BTN_PINS[6] = { BTN_UP, BTN_DOWN, BTN_LEFT, BTN_RIGHT, BTN_ENTER, BTN_ESC };
const char* BTN_NAMES[6]  = { "CIMA", "BAIXO",  "ESQ",    "DIR",     "ENTER",   "ESC"   };
bool btnLastState[6] = { HIGH, HIGH, HIGH, HIGH, HIGH, HIGH };
unsigned long btnLastDebounce[6] = { 0 };
const unsigned long DEBOUNCE_MS = 40;

// ---------------------------------------------------------------------
// MODO DA UI
// ---------------------------------------------------------------------
UIMode uiMode = UI_PRINCIPAL;

// Execucao de acao
SpriteAnim acaoAnim = { SPRITE_IDLE, SPRITE_IDLE_FRAMES, "idle" };
unsigned long acaoInicio = 0;
unsigned long acaoDuracaoMs = 2500;
unsigned long acaoFrameMs = 1000;  // ms por frame durante a acao

void iniciarAcao(uint8_t acao) {
    // Fiel ao js/principal/stats.js — comer/beber sobe 1; carinho sobe EDUCACAO; medicar zera medidores
    switch (acao) {
        case ACAO_BANHO:
            pet.sujo = false;
            acaoAnim = { SPRITE_BATH, SPRITE_BATH_FRAMES, "banho" };
            break;
        case ACAO_BEBER:
            if (pet.sede < 4) pet.sede++;
            if (pet.comidaPendente < 200) pet.comidaPendente++;
            acaoAnim = { SPRITE_DRINKING, SPRITE_DRINKING_FRAMES, "beber" };
            break;
        case ACAO_MEDICAR:
            // Cura, mas zera os medidores (stats.js:170-180)
            if (pet.doente) {
                pet.doente = false;
                pet.horasDoente = 0;
                pet.limiteDoenca = 0;
                pet.fome = 0;
                pet.sede = 0;
                pet.humor = 0;
                pet.educacao = 0;
            }
            acaoAnim = { SPRITE_APPLYINGINJECTION, SPRITE_APPLYINGINJECTION_FRAMES, "medicar" };
            break;
        case ACAO_CARINHO:
            if (pet.educacao < 4) pet.educacao++;
            acaoAnim = { SPRITE_CARESSING, SPRITE_CARESSING_FRAMES, "carinho" };
            break;
        case ACAO_LER:
            if (pet.educacao < 4) pet.educacao++;
            acaoAnim = { SPRITE_READING, SPRITE_READING_FRAMES, "ler" };
            break;
        case ACAO_ABRIR_LUZ:
            switchEscolha = pet.estadoLuz ? 0 : 1;  // reflete estado atual
            uiMode = UI_PAINEL_LUZ;
            return;
        case ACAO_ABRIR_AC:
            switchEscolha = (pet.estadoAC == 1) ? 0 : 1;
            uiMode = UI_PAINEL_AC;
            return;
        case ACAO_JOGAR:
            tone(BUZZER, 600, 120); delay(140);
            tone(BUZZER, 400, 180);
            uiMode = UI_PRINCIPAL;
            return;
        case ACAO_NECESSIDADES:
            necessSel = 0;
            uiMode = UI_NECESSIDADES;
            return;
    }
    acaoInicio = millis();
    acaoDuracaoMs = 2500;
    acaoFrameMs = 1000;
    uiMode = UI_EXECUTANDO_ACAO;
    saveGravar(clockGetTotalHours());
}

// Come uma comida especifica: animacao + stats + dieta
void comerComida(uint8_t idx) {
    const Comida& c = COMIDAS[idx];
    if (pet.fome < 4) pet.fome++;
    if (pet.comidaPendente < 200) pet.comidaPendente++;
    switch (c.categoria) {
        case 1: if (pet.dietaCarne   < 255) pet.dietaCarne++;   break;
        case 2: if (pet.dietaMassa   < 255) pet.dietaMassa++;   break;
        case 4: if (pet.dietaVegetal < 255) pet.dietaVegetal++; break;
        // 3 (especial/sorvete) nao conta dieta
    }
    acaoAnim = { c.anim, c.animFrames, c.nome };
    acaoInicio = millis();
    acaoDuracaoMs = 2500;
    acaoFrameMs = 1000;
    uiMode = UI_EXECUTANDO_ACAO;
    saveGravar(clockGetTotalHours());
}

// Aplica a escolha do painel Luz/AC e volta pra tela principal
void aplicarSwitchLuz() {
    pet.estadoLuz = (switchEscolha == 0);  // 0=ligar
    tone(BUZZER, pet.estadoLuz ? 1600 : 800, 80);
    saveGravar(clockGetTotalHours());
    uiMode = UI_PRINCIPAL;
}
void aplicarSwitchAC() {
    pet.estadoAC = (switchEscolha == 0) ? 1 : 0;
    tone(BUZZER, pet.estadoAC ? 1600 : 800, 80);
    saveGravar(clockGetTotalHours());
    uiMode = UI_PRINCIPAL;
}

// Renascimento: reseta stats e toca animacao de ovo chocando
void iniciarNascimento() {
    statsInit();
    saveGravar(0);
    clockInit(0);

    // bip de nascimento
    tone(BUZZER, 1800, 120); delay(140);
    tone(BUZZER, 1400, 120); delay(140);
    tone(BUZZER, 2200, 200);

    acaoAnim = { SPRITE_BORNUSAVERSION, SPRITE_BORNUSAVERSION_FRAMES, "nascendo" };
    acaoInicio = millis();
    acaoFrameMs = 500;  // fiel ao original (js/animacao/iniciarJogo.js)
    acaoDuracaoMs = (unsigned long)SPRITE_BORNUSAVERSION_FRAMES * acaoFrameMs;
    uiMode = UI_EXECUTANDO_ACAO;
    Serial.println("Novo pet nascendo do ovo!");
}

// callback: recebe indice (0..5) do botao recem pressionado
void onButtonPressed(uint8_t idx) {
    tone(BUZZER, 1200, 20);
    Serial.print("Botao: "); Serial.println(BTN_NAMES[idx]);

    switch (uiMode) {
        case UI_PRINCIPAL:
            if (idx == 3) { uiMode = UI_SELECAO; atividadeSel = 0; }
            else if (idx == 2) { uiMode = UI_SELECAO; atividadeSel = NUM_ATIVIDADES - 1; }
            else if (idx == 5) { uiMode = UI_STATS; }
            break;

        case UI_SELECAO:
            if (idx == 3) atividadeSel = (atividadeSel + 1) % NUM_ATIVIDADES;
            else if (idx == 2) atividadeSel = (atividadeSel + NUM_ATIVIDADES - 1) % NUM_ATIVIDADES;
            else if (idx == 4) {
                uint8_t acao = ATIVIDADES[atividadeSel].acao;
                if (acao == ACAO_ABRIR_COMIDA) {
                    uiMode = UI_SUBMENU_COMIDA;
                    comidaSel = 0;
                } else {
                    iniciarAcao(acao);
                }
            }
            else if (idx == 5) uiMode = UI_PRINCIPAL;
            break;

        case UI_SUBMENU_COMIDA:
            if (idx == 3) comidaSel = (comidaSel + 1) % NUM_COMIDAS;
            else if (idx == 2) comidaSel = (comidaSel + NUM_COMIDAS - 1) % NUM_COMIDAS;
            else if (idx == 4) comerComida(comidaSel);
            else if (idx == 5) uiMode = UI_SELECAO;
            break;

        case UI_PAINEL_LUZ:
            if (idx == 2) switchEscolha = 0;  // ESQ = ligar
            else if (idx == 3) switchEscolha = 1;  // DIR = desligar
            else if (idx == 4) aplicarSwitchLuz();
            else if (idx == 5) uiMode = UI_SELECAO;
            break;

        case UI_PAINEL_AC:
            if (idx == 2) switchEscolha = 0;
            else if (idx == 3) switchEscolha = 1;
            else if (idx == 4) aplicarSwitchAC();
            else if (idx == 5) uiMode = UI_SELECAO;
            break;

        case UI_NECESSIDADES:
            if (idx == 3) necessSel = (necessSel + 1) % 6;
            else if (idx == 2) necessSel = (necessSel + 5) % 6;
            else if (idx == 5 || idx == 4) uiMode = UI_SELECAO;
            break;

        case UI_STATS:
            uiMode = UI_PRINCIPAL;
            break;

        case UI_EXECUTANDO_ACAO:
            if (idx == 5) uiMode = UI_PRINCIPAL;
            break;
    }
}

void handleButtons() {
    unsigned long now = millis();
    for (uint8_t i = 0; i < 6; i++) {
        bool s = digitalRead(BTN_PINS[i]);
        if (s != btnLastState[i] && (now - btnLastDebounce[i]) > DEBOUNCE_MS) {
            btnLastDebounce[i] = now;
            if (s == LOW) onButtonPressed(i);
            btnLastState[i] = s;
        }
    }
}

// ---------------------------------------------------------------------
// HOLD DO ESC -> RESET/RENASCIMENTO
// Segurar ESC por 5 segundos reseta o pet e toca animacao de nascimento.
// ---------------------------------------------------------------------
const unsigned long HOLD_RESET_MS = 5000;
unsigned long escHoldInicio = 0;  // 0 = nao esta segurando
bool holdResetDisparado = false;

void checarHoldReset() {
    bool pressionado = (digitalRead(BTN_ESC) == LOW);
    if (pressionado) {
        if (escHoldInicio == 0) {
            escHoldInicio = millis();
            holdResetDisparado = false;
        } else if (!holdResetDisparado && (millis() - escHoldInicio) >= HOLD_RESET_MS) {
            holdResetDisparado = true;
            iniciarNascimento();
        }
    } else {
        escHoldInicio = 0;
        holdResetDisparado = false;
    }
}

void desenharOverlayHoldReset() {
    if (escHoldInicio == 0 || holdResetDisparado) return;
    unsigned long decorrido = millis() - escHoldInicio;
    if (decorrido < 600) return;  // evita flash em toque curto

    // caixa centralizada
    const int boxX = 8;
    const int boxY = 24;
    const int boxW = 112;
    const int boxH = 26;

    display.fillRect(boxX, boxY, boxW, boxH, BLACK);
    display.drawRect(boxX, boxY, boxW, boxH, WHITE);

    display.setTextSize(1);
    display.setTextColor(WHITE);

    unsigned long restante = (decorrido < HOLD_RESET_MS)
        ? (HOLD_RESET_MS - decorrido) / 1000 + 1 : 0;
    display.setCursor(boxX + 4, boxY + 4);
    display.print("Renascer em ");
    display.print(restante);
    display.print("s");

    // barra de progresso
    int largura = (int)((decorrido * (boxW - 8)) / HOLD_RESET_MS);
    if (largura > boxW - 8) largura = boxW - 8;
    display.drawRect(boxX + 4, boxY + 16, boxW - 8, 5, WHITE);
    display.fillRect(boxX + 4, boxY + 16, largura, 5, WHITE);
}

// ---------------------------------------------------------------------
// ANIMACAO: selecao de sprite por estado + ciclo de frames
// Prioridade: morto > dormindo > doente > calor > frio > sujo > idle
// ---------------------------------------------------------------------
const unsigned long FRAME_MS = 1000;  // 1s por frame (fiel ao original)

SpriteAnim currentAnim = { SPRITE_IDLE, SPRITE_IDLE_FRAMES, "idle" };
uint8_t currentFrame = 0;
unsigned long lastFrameTime = 0;

SpriteAnim escolherSpriteAtual() {
    if (!pet.vivo)       return { SPRITE_DEADNEGLECT, SPRITE_DEADNEGLECT_FRAMES, "morto" };
    if (pet.dormindo) {
        if (!pet.estadoLuz) return { SPRITE_SLEEPING_MODE_ORIGINAL, SPRITE_SLEEPING_MODE_ORIGINAL_FRAMES, "dormindo(luz off)" };
        return { SPRITE_SLEEPING, SPRITE_SLEEPING_FRAMES, "dormindo" };
    }
    if (pet.doente)      return { SPRITE_SICK, SPRITE_SICK_FRAMES, "doente" };
    if (pet.comCalor)    return { SPRITE_HOT, SPRITE_HOT_FRAMES, "calor" };
    if (pet.comFrio)     return { SPRITE_COLD, SPRITE_COLD_FRAMES, "frio" };
    if (pet.sujo)        return { SPRITE_DIRTY, SPRITE_DIRTY_FRAMES, "sujo" };
    return { SPRITE_IDLE, SPRITE_IDLE_FRAMES, "idle" };
}

void atualizarAnimacao() {
    SpriteAnim nova;
    unsigned long frameMs = FRAME_MS;

    if (uiMode == UI_EXECUTANDO_ACAO) {
        unsigned long now = millis();
        if (now - acaoInicio >= acaoDuracaoMs) {
            uiMode = UI_PRINCIPAL;
            nova = escolherSpriteAtual();
        } else {
            nova = acaoAnim;
            frameMs = acaoFrameMs;
        }
    } else {
        nova = escolherSpriteAtual();
    }

    if (nova.data != currentAnim.data) {
        currentAnim = nova;
        currentFrame = 0;
        lastFrameTime = millis();
        Serial.print("Sprite -> ");
        Serial.println(nova.nome);
    }

    unsigned long now = millis();
    if (now - lastFrameTime >= frameMs) {
        lastFrameTime = now;
        currentFrame = (currentFrame + 1) % currentAnim.frames;
    }
}

// (drawTelaComida substituiu o menu textual antigo de comidas)

// ---------------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------------
void setup() {
    Serial.begin(115200);

    Wire.setSDA(OLED_SDA);
    Wire.setSCL(OLED_SCL);
    Wire.begin();

    display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);
    display.clearDisplay();
    display.display();

    pinMode(BUZZER, OUTPUT);
    for (uint8_t i = 0; i < 6; i++) pinMode(BTN_PINS[i], INPUT_PULLUP);

    randomSeed(analogRead(A0) ^ micros());

    // Save / stats / relogio
    saveInit();
    uint32_t horasSalvas = 0;

    // Segurando ESC no boot -> reseta save
    delay(100); // estabiliza pull-ups
    bool resetar = (digitalRead(BTN_ESC) == LOW);

    if (resetar || !saveCarregar(&horasSalvas)) {
        statsInit();
        horasSalvas = 0;
        saveGravar(0);
        Serial.println(resetar ? "RESET via ESC: pet novo" : "Save vazio: pet novo");
        tone(BUZZER, 1800, 200);
    } else {
        Serial.print("Save carregado. Horas=");
        Serial.println(horasSalvas);
    }
    clockInit(horasSalvas);

    // bip de boot
    tone(BUZZER, 800, 60);  delay(80);
    tone(BUZZER, 1200, 60); delay(80);
}

// ---------------------------------------------------------------------
// LOOP
// ---------------------------------------------------------------------
void loop() {
    unsigned long now = millis();

    handleButtons();
    checarHoldReset();
    atualizarAnimacao();

    // relogio virtual
    clockTick();
    if (clockHourChanged()) {
        uint8_t h = clockGetHour();
        bool morreu = statsDegradar(h);
        bool acordou = statsChecarSono(h);
        if (acordou) {
            if (statsChecarEvolucao()) {
                Serial.print("Evoluiu para a fase ");
                Serial.println(pet.faseEvolucao);
            }
        }
        statsAtualizarIdade(clockGetTotalHours());
        saveGravar(clockGetTotalHours());

        Serial.print("[hora="); Serial.print(h);
        Serial.print("] Fome="); Serial.print(pet.fome);
        Serial.print(" Sede="); Serial.print(pet.sede);
        Serial.print(" Humor="); Serial.print(pet.humor);
        Serial.print(" Temp="); Serial.print(pet.temperatura);
        Serial.print(" Dormindo="); Serial.print(pet.dormindo);
        Serial.print(" Doente="); Serial.print(pet.doente);
        Serial.print(" Vivo="); Serial.println(pet.vivo);

        if (morreu) tone(BUZZER, 200, 500);
    }

    display.clearDisplay();

    switch (uiMode) {
        case UI_STATS:           drawTelaStats(); break;
        case UI_SELECAO:         drawTelaSelecao(); break;
        case UI_SUBMENU_COMIDA:  drawTelaComida(); break;
        case UI_PAINEL_LUZ:      drawTelaPainelSwitch("Luz"); break;
        case UI_PAINEL_AC:       drawTelaPainelSwitch("Ar"); break;
        case UI_NECESSIDADES:    drawTelaNecessidades(); break;
        case UI_PRINCIPAL:
        case UI_EXECUTANDO_ACAO:
        default:
            drawTelaPrincipal();
            break;
    }

    desenharOverlayHoldReset();

    display.display();
    delay(20);
}
