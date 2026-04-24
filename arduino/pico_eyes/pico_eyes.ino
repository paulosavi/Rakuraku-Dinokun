#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "hardware/adc.h"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

#define BUZZER   6
#define BTN_NEXT 2   // GP2 - avança info
#define BTN_PREV 3   // GP3 - retrocede info

// ===============================================================
// SISTEMA DE OLHOS ESTILO VECTOR/COZMO
// ===============================================================

struct EyeShape {
  float x;
  float y;
  float w;
  float h;
  float radius;
  float lidTop;
  float lidBot;
  float lidAngleL;
  float lidAngleR;
};

EyeShape leftEye, rightEye;
EyeShape leftTarget, rightTarget;

// faixa amarela ocupa Y 0..15, área branca vai de 16..63
// centro útil = 40
const int EYE_BASE_Y  = 40;
const int LEFT_EYE_X  = 40;
const int RIGHT_EYE_X = 88;

// ---------------------------------------------------------------
// EMOÇÕES
// ---------------------------------------------------------------

void setEye(EyeShape &e, float w, float h, float r, float lt, float lb,
            float al, float ar, float ox = 0, float oy = 0) {
  e.w = w; e.h = h; e.radius = r;
  e.lidTop = lt; e.lidBot = lb;
  e.lidAngleL = al; e.lidAngleR = ar;
  e.x = ox; e.y = oy;
}

void emoNeutral()      { setEye(leftTarget, 22,22,6, 0,0, 0,0);    setEye(rightTarget, 22,22,6, 0,0, 0,0); }
void emoHappy()        { setEye(leftTarget, 22,22,6, 0,14, 0,0);   setEye(rightTarget, 22,22,6, 0,14, 0,0); }
void emoGlee()         { setEye(leftTarget, 26,26,8, 0,0, 0,0);    setEye(rightTarget, 26,26,8, 0,0, 0,0); }
void emoBlinkHigh()    { setEye(leftTarget, 22,22,6, 18,0, 0,0);   setEye(rightTarget, 22,22,6, 18,0, 0,0); }
void emoBlinkLow()     { setEye(leftTarget, 22,22,6, 0,18, 0,0);   setEye(rightTarget, 22,22,6, 0,18, 0,0); }
void emoSadDown()      { setEye(leftTarget, 22,22,6, 6,0, 0,0, 0,6);   setEye(rightTarget, 22,22,6, 6,0, 0,0, 0,6); }
void emoSadUp()        { setEye(leftTarget, 22,22,6, 0,0, 6,-6, 0,-4); setEye(rightTarget, 22,22,6, 0,0, -6,6, 0,-4); }
void emoWorried()      { setEye(leftTarget, 22,22,6, 4,0, 5,-5);   setEye(rightTarget, 22,22,6, 4,0, -5,5); }
void emoFocused()      { setEye(leftTarget, 22,14,4, 0,0, 0,0);    setEye(rightTarget, 22,14,4, 0,0, 0,0); }
void emoAnnoyed()      { setEye(leftTarget, 20,8,3, 0,0, 0,0);     setEye(rightTarget, 20,8,3, 0,0, 0,0); }
void emoSurprised()    { setEye(leftTarget, 24,24,12, 0,0, 0,0);   setEye(rightTarget, 24,24,12, 0,0, 0,0); }
void emoSkeptic()      { setEye(leftTarget, 22,22,6, 0,0, 0,0);    setEye(rightTarget, 22,14,4, 0,0, 0,0); }
void emoFrustrated()   { setEye(leftTarget, 22,22,6, 0,0, -7,7);   setEye(rightTarget, 22,22,6, 0,0, 7,-7); }
void emoUnimpressed()  { setEye(leftTarget, 22,22,6, 10,0, 0,0);   setEye(rightTarget, 22,22,6, 10,0, 0,0); }
void emoSleepy()       { setEye(leftTarget, 22,22,6, 14,4, 0,0);   setEye(rightTarget, 22,22,6, 14,4, 0,0); }
void emoSuspicious()   { setEye(leftTarget, 22,22,6, 8,8, 0,0);    setEye(rightTarget, 22,22,6, 8,8, 0,0); }
void emoSquint()       { setEye(leftTarget, 22,22,6, 6,6, 0,0);    setEye(rightTarget, 22,22,6, 6,6, 0,0); }
void emoAngry()        { setEye(leftTarget, 22,20,5, 2,0, -10,10); setEye(rightTarget, 22,20,5, 2,0, 10,-10); }
void emoFurious()      { setEye(leftTarget, 22,16,4, 0,0, -12,12); setEye(rightTarget, 22,16,4, 0,0, 12,-12); }
void emoScared()       { setEye(leftTarget, 20,18,5, 0,0, 8,-8);   setEye(rightTarget, 20,18,5, 0,0, -8,8); }
void emoAwe()          { setEye(leftTarget, 26,26,13, 0,0, 0,0);   setEye(rightTarget, 26,26,13, 0,0, 0,0); }

// ---------------------------------------------------------------
// DESENHO DOS OLHOS
// ---------------------------------------------------------------

void drawEye(int cx, int cy, EyeShape &e) {
  int x = cx - e.w / 2 + (int)e.x;
  int y = cy - e.h / 2 + (int)e.y;
  int w = (int)e.w;
  int h = (int)e.h;
  int r = (int)e.radius;

  if (w < 2 || h < 2) return;
  if (r > w / 2) r = w / 2;
  if (r > h / 2) r = h / 2;

  display.fillRoundRect(x, y, w, h, r, WHITE);

  if (e.lidTop > 0) {
    display.fillRect(x - 1, y - 1, w + 2, (int)e.lidTop + 1, BLACK);
  }
  if (e.lidBot > 0) {
    display.fillRect(x - 1, y + h - (int)e.lidBot, w + 2, (int)e.lidBot + 2, BLACK);
  }

  if (e.lidAngleL != 0 || e.lidAngleR != 0) {
    int leftDrop  = (int)e.lidAngleL;
    int rightDrop = (int)e.lidAngleR;

    int topY = y - 1;
    int x1 = x - 1;
    int x2 = x + w + 1;

    int pyL = topY + (leftDrop  > 0 ? leftDrop  : 0);
    int pyR = topY + (rightDrop > 0 ? rightDrop : 0);

    display.fillTriangle(x1, topY, x2, topY, x1, pyL, BLACK);
    display.fillTriangle(x2, topY, x1, pyL, x2, pyR, BLACK);

    if (leftDrop < 0) {
      display.fillTriangle(x1, topY, x1, topY - leftDrop, x2, topY, BLACK);
    }
    if (rightDrop < 0) {
      display.fillTriangle(x2, topY, x2, topY - rightDrop, x1, topY, BLACK);
    }
  }
}

// ---------------------------------------------------------------
// INTERPOLAÇÃO
// ---------------------------------------------------------------
float smoothLerp(float a, float b, float t) {
  return a + (b - a) * t;
}

void animateEye(EyeShape &cur, EyeShape &tgt, float speed) {
  cur.x         = smoothLerp(cur.x,         tgt.x,         speed);
  cur.y         = smoothLerp(cur.y,         tgt.y,         speed);
  cur.w         = smoothLerp(cur.w,         tgt.w,         speed);
  cur.h         = smoothLerp(cur.h,         tgt.h,         speed);
  cur.radius    = smoothLerp(cur.radius,    tgt.radius,    speed);
  cur.lidTop    = smoothLerp(cur.lidTop,    tgt.lidTop,    speed);
  cur.lidBot    = smoothLerp(cur.lidBot,    tgt.lidBot,    speed);
  cur.lidAngleL = smoothLerp(cur.lidAngleL, tgt.lidAngleL, speed);
  cur.lidAngleR = smoothLerp(cur.lidAngleR, tgt.lidAngleR, speed);
}

// ---------------------------------------------------------------
// CICLO DE EMOÇÕES
// ---------------------------------------------------------------
typedef void (*EmotionFn)();
EmotionFn emotions[] = {
  emoNeutral, emoBlinkHigh, emoHappy, emoGlee, emoBlinkLow, emoSadDown, emoSadUp,
  emoWorried, emoFocused, emoAnnoyed, emoSurprised, emoSkeptic, emoFrustrated, emoUnimpressed,
  emoSleepy, emoSuspicious, emoSquint, emoAngry, emoFurious, emoScared, emoAwe
};
const char* emotionNames[] = {
  "Neutral", "Blink Hi", "Happy", "Glee", "Blink Lo", "Sad Down", "Sad Up",
  "Worried", "Focused", "Annoyed", "Surprise", "Skeptic", "Frustr.", "Unimpres",
  "Sleepy", "Suspic.", "Squint", "Angry", "Furious", "Scared", "Awe"
};
const int NUM_EMOTIONS = sizeof(emotions) / sizeof(emotions[0]);

int currentEmotion = 0;
unsigned long lastChange = 0;
unsigned long lastBlink = 0;
bool blinking = false;
unsigned long blinkStart = 0;

EyeShape savedLeft, savedRight;

// ---------------------------------------------------------------
// BARRA DE STATUS (FAIXA AMARELA)
// ---------------------------------------------------------------

unsigned long bootTime = 0;
unsigned long lastFrame = 0;
float fps = 0;

enum InfoPage {
  PAGE_TEMP_UPTIME = 0,
  PAGE_EMOTION,
  PAGE_FPS_MEM,
  PAGE_VOLTAGE,
  NUM_PAGES
};
int currentPage = 0;

// leitura do sensor interno do RP2040 (usa SDK direto - compatível com Mbed e earlephilhower)
float readInternalTemp() {
  adc_select_input(4);                   // canal 4 = sensor interno
  uint16_t raw = adc_read();             // 12 bits
  float voltage = raw * 3.3f / 4095.0f;
  return 27.0f - (voltage - 0.706f) / 0.001721f;
}

// estimativa de RAM livre
extern "C" char* sbrk(int incr);
int freeRam() {
  char top;
  return &top - reinterpret_cast<char*>(sbrk(0));
}

void drawStatusBar() {
  display.drawFastHLine(0, 15, 128, WHITE);
  display.setTextSize(1);
  display.setTextColor(WHITE);

  switch (currentPage) {

    case PAGE_TEMP_UPTIME: {
      float t = readInternalTemp();
      display.setCursor(0, 4);
      display.print(t, 1);
      display.print((char)247);
      display.print('C');

      unsigned long up = (millis() - bootTime) / 1000;
      int hh = up / 3600;
      int mm = (up / 60) % 60;
      int ss = up % 60;
      display.setCursor(70, 4);
      if (hh > 0) {
        if (hh < 10) display.print('0');
        display.print(hh);
        display.print(':');
      }
      if (mm < 10) display.print('0');
      display.print(mm);
      display.print(':');
      if (ss < 10) display.print('0');
      display.print(ss);
      break;
    }

    case PAGE_EMOTION: {
      display.setCursor(0, 4);
      display.print("Mood: ");
      display.print(emotionNames[currentEmotion]);
      break;
    }

    case PAGE_FPS_MEM: {
      display.setCursor(0, 4);
      display.print((int)fps);
      display.print(" fps");

      int kb = freeRam() / 1024;
      display.setCursor(62, 4);
      display.print("RAM:");
      display.print(kb);
      display.print("kB");
      break;
    }

    case PAGE_VOLTAGE: {
      adc_select_input(4);
      uint16_t raw = adc_read();
      float v = raw * 3.3f / 4095.0f;
      display.setCursor(0, 4);
      display.print("Vadc: ");
      display.print(v, 3);
      display.print("V");
      break;
    }
  }

  // indicador de página (pontinhos no canto direito)
  for (int i = 0; i < NUM_PAGES; i++) {
    int px = 122 - (NUM_PAGES - 1 - i) * 3;
    if (i == currentPage) {
      display.fillRect(px, 1, 2, 2, WHITE);
    } else {
      display.drawPixel(px, 2, WHITE);
    }
  }
}

// ---------------------------------------------------------------
// BOTÕES (com debounce)
// ---------------------------------------------------------------
bool lastBtnNext = HIGH;
bool lastBtnPrev = HIGH;
unsigned long lastDebounceNext = 0;
unsigned long lastDebouncePrev = 0;
const unsigned long DEBOUNCE_MS = 40;

void beep() {
  tone(BUZZER, 1200, 30);
}

void handleButtons() {
  unsigned long now = millis();

  bool n = digitalRead(BTN_NEXT);
  if (n != lastBtnNext && (now - lastDebounceNext) > DEBOUNCE_MS) {
    lastDebounceNext = now;
    if (n == LOW) {
      currentPage = (currentPage + 1) % NUM_PAGES;
      beep();
    }
    lastBtnNext = n;
  }

  bool p = digitalRead(BTN_PREV);
  if (p != lastBtnPrev && (now - lastDebouncePrev) > DEBOUNCE_MS) {
    lastDebouncePrev = now;
    if (p == LOW) {
      currentPage = (currentPage - 1 + NUM_PAGES) % NUM_PAGES;
      beep();
    }
    lastBtnPrev = p;
  }
}

// ---------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------
void setup() {
  Wire.setSDA(0);
  Wire.setSCL(1);
  Wire.begin();

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.display();

  pinMode(BUZZER, OUTPUT);
  pinMode(BTN_NEXT, INPUT_PULLUP);
  pinMode(BTN_PREV, INPUT_PULLUP);

  // inicializa ADC e liga o sensor interno de temperatura
  adc_init();
  adc_set_temp_sensor_enabled(true);

  randomSeed(micros());

  emoNeutral();
  leftEye  = leftTarget;
  rightEye = rightTarget;

  bootTime = millis();
}

// ---------------------------------------------------------------
// LOOP
// ---------------------------------------------------------------
void loop() {
  unsigned long now = millis();

  handleButtons();

  // troca emoção automática a cada 3s (sem bip)
  if (now - lastChange > 3000) {
    lastChange = now;
    currentEmotion = (currentEmotion + 1) % NUM_EMOTIONS;
    emotions[currentEmotion]();
  }

  // blink aleatório
  if (!blinking && now - lastBlink > (unsigned long)random(2500, 5000)) {
    blinking = true;
    blinkStart = now;
    lastBlink = now;
    savedLeft = leftTarget;
    savedRight = rightTarget;
    leftTarget.h = 2;  leftTarget.lidTop = 0;  leftTarget.lidBot = 0;
    rightTarget.h = 2; rightTarget.lidTop = 0; rightTarget.lidBot = 0;
  }

  if (blinking && now - blinkStart > 120) {
    blinking = false;
    leftTarget  = savedLeft;
    rightTarget = savedRight;
  }

  float speed = blinking ? 0.45 : 0.22;
  animateEye(leftEye,  leftTarget,  speed);
  animateEye(rightEye, rightTarget, speed);

  // cálculo de FPS com média móvel
  unsigned long frameDelta = now - lastFrame;
  if (frameDelta > 0) {
    float instFps = 1000.0f / frameDelta;
    fps = fps * 0.9f + instFps * 0.1f;
  }
  lastFrame = now;

  display.clearDisplay();
  drawStatusBar();
  drawEye(LEFT_EYE_X,  EYE_BASE_Y, leftEye);
  drawEye(RIGHT_EYE_X, EYE_BASE_Y, rightEye);
  display.display();

  delay(20);
}
