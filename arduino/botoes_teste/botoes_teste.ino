// Teste simples dos 6 botoes + buzzer no OLED 128x64
// Mostra estado atual de cada botao e o ultimo pressionado

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define BTN_UP     2
#define BTN_DOWN   3
#define BTN_LEFT   4
#define BTN_RIGHT  5
#define BTN_ENTER  6
#define BTN_ESC    7
#define BUZZER     8

#define OLED_SDA   0
#define OLED_SCL   1
#define OLED_ADDR  0x3C
#define SCREEN_W   128
#define SCREEN_H   64

Adafruit_SSD1306 display(SCREEN_W, SCREEN_H, &Wire, -1);

const uint8_t PINS[6]       = { BTN_UP, BTN_DOWN, BTN_LEFT, BTN_RIGHT, BTN_ENTER, BTN_ESC };
const char* const NOMES[6]  = { "CIMA",  "BAIXO", "ESQ",    "DIR",     "ENTER",   "ESC"   };

bool estadoAnterior[6]          = { HIGH, HIGH, HIGH, HIGH, HIGH, HIGH };
unsigned long ultimoDebounce[6] = { 0 };
const unsigned long DEBOUNCE_MS = 40;

int8_t ultimoBotao = -1;          // indice do ultimo pressionado
uint32_t contagem[6] = { 0 };      // quantas vezes cada um foi apertado

void setup() {
    Serial.begin(115200);

    Wire.setSDA(OLED_SDA);
    Wire.setSCL(OLED_SCL);
    Wire.begin();

    display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);
    display.clearDisplay();
    display.display();

    pinMode(BUZZER, OUTPUT);
    for (uint8_t i = 0; i < 6; i++) pinMode(PINS[i], INPUT_PULLUP);

    tone(BUZZER, 1200, 60); delay(80);
    tone(BUZZER, 1800, 60); delay(80);

    Serial.println("== Teste de botoes iniciado ==");
}

void loop() {
    unsigned long agora = millis();

    // leitura com debounce
    for (uint8_t i = 0; i < 6; i++) {
        bool s = digitalRead(PINS[i]);
        if (s != estadoAnterior[i] && (agora - ultimoDebounce[i]) > DEBOUNCE_MS) {
            ultimoDebounce[i] = agora;
            if (s == LOW) {
                ultimoBotao = i;
                contagem[i]++;
                tone(BUZZER, 1400, 25);
                Serial.print("Pressionado: GP");
                Serial.print(PINS[i]);
                Serial.print(" (");
                Serial.print(NOMES[i]);
                Serial.print(")  total=");
                Serial.println(contagem[i]);
            }
            estadoAnterior[i] = s;
        }
    }

    // render
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);

    // titulo
    display.setCursor(0, 0);
    display.print("Teste de botoes");
    display.drawFastHLine(0, 9, SCREEN_W, WHITE);

    // lista de botoes em 2 colunas de 3 linhas
    const uint8_t linhaY[3] = { 14, 28, 42 };
    for (uint8_t i = 0; i < 6; i++) {
        uint8_t col = i / 3;      // 0 = esquerda, 1 = direita
        uint8_t lin = i % 3;
        int x = col * 64;
        int y = linhaY[lin];

        bool pressionado = (digitalRead(PINS[i]) == LOW);

        // bola: cheia se pressionado
        if (pressionado) display.fillCircle(x + 4, y + 3, 3, WHITE);
        else             display.drawCircle(x + 4, y + 3, 3, WHITE);

        display.setCursor(x + 12, y);
        display.print(NOMES[i]);
        display.print(" GP");
        display.print(PINS[i]);
    }

    // ultimo botao + contagem total
    display.drawFastHLine(0, 54, SCREEN_W, WHITE);
    display.setCursor(0, 57);
    if (ultimoBotao < 0) {
        display.print("Pressione um botao");
    } else {
        display.print("Ult: ");
        display.print(NOMES[ultimoBotao]);
        display.print(" x");
        display.print(contagem[ultimoBotao]);
    }

    display.display();
    delay(20);
}
