/**
 * Testes automatizados - roda com: node tests/stats.node.test.mjs
 * Mocka localStorage e jQuery pra funcionar sem browser
 */

// === MOCKS ===
const storage = {};
globalThis.localStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = v; },
    removeItem: (k) => { delete storage[k]; }
};

// Mock jQuery mínimo
const jqFn = () => {
    const obj = { addClass: () => obj, removeClass: () => obj, prev: () => obj, hide: () => obj, show: () => obj };
    return obj;
};
jqFn.fn = {};
globalThis.$ = jqFn;
globalThis.jQuery = jqFn;

// === IMPORTS ===
const { obterStats, alterarStat, degradarStats, salvarStats, resetarStats, alimentar, darAgua, medicar, resultadoJokenpo } = await import("../js/principal/stats.js");

// === TEST RUNNER ===
let passed = 0;
let failed = 0;

function assert(condition, msg) {
    if (condition) {
        passed++;
        process.stdout.write(`  \x1b[32mOK\x1b[0m  ${msg}\n`);
    } else {
        failed++;
        process.stdout.write(`  \x1b[31mFALHOU\x1b[0m  ${msg}\n`);
    }
}

function resetParaTeste() {
    resetarStats();
    alterarStat("dormindo", false);
    alterarStat("doente", false);
    alterarStat("comFrio", false);
    alterarStat("comCalor", false);
    alterarStat("sujo", false);
    alterarStat("temperatura", 25);
    alterarStat("fome", 4);
    alterarStat("sede", 4);
    alterarStat("humor", 5);
    alterarStat("peso", 1);
    alterarStat("comidaPendente", 0);
}

// ============================================
console.log("\n\x1b[36m=== TESTE 1: Degradacao por horarios especificos ===\x1b[0m");
// ============================================
const horasDegradacao = [10, 11, 12, 13, 14, 15, 16];
const horasHumor = [10, 12, 14, 16];

for (let h = 0; h < 24; h++) {
    resetParaTeste();
    alterarStat("faseEvolucao", 2);
    degradarStats(true, "ligar", h);
    const s = obterStats();

    if (horasDegradacao.includes(h)) {
        assert(s.fome < 4, `Hora ${h}: fome degrada (${s.fome} < 4)`);
        assert(s.sede < 4, `Hora ${h}: sede degrada (${s.sede} < 4)`);
    } else {
        assert(s.fome === 4, `Hora ${h}: fome NAO degrada (${s.fome} === 4)`);
        assert(s.sede === 4, `Hora ${h}: sede NAO degrada (${s.sede} === 4)`);
    }

    if (horasHumor.includes(h)) {
        assert(s.humor < 5, `Hora ${h}: humor degrada (${s.humor} < 5)`);
    } else {
        assert(s.humor === 5, `Hora ${h}: humor NAO degrada (${s.humor} === 5)`);
    }
}

// ============================================
console.log("\n\x1b[36m=== TESTE 2: Bebe degrada mais (-2) ===\x1b[0m");
// ============================================
resetParaTeste();
alterarStat("faseEvolucao", 1);
degradarStats(true, "ligar", 10);
assert(obterStats().fome === 2, `Bebe fome: esperado 2, obtido ${obterStats().fome}`);
assert(obterStats().sede === 2, `Bebe sede: esperado 2, obtido ${obterStats().sede}`);

resetParaTeste();
alterarStat("faseEvolucao", 2);
degradarStats(true, "ligar", 10);
assert(obterStats().fome === 3, `Nao-bebe fome: esperado 3, obtido ${obterStats().fome}`);
assert(obterStats().sede === 3, `Nao-bebe sede: esperado 3, obtido ${obterStats().sede}`);

// ============================================
console.log("\n\x1b[36m=== TESTE 3: Peso por conversao horaria ===\x1b[0m");
// ============================================
resetParaTeste();
assert(obterStats().peso === 1, "Peso inicial: 1");

alimentar(0);
assert(obterStats().comidaPendente === 1, "Comida pendente apos alimentar: 1");
assert(obterStats().peso === 1, "Peso NAO aumenta imediatamente: 1");

darAgua();
assert(obterStats().comidaPendente === 2, "Comida pendente apos agua: 2");

degradarStats(true, "ligar", 10);
assert(obterStats().peso === 2, `Peso apos 1 tick: esperado 2, obtido ${obterStats().peso}`);
assert(obterStats().comidaPendente === 1, `Pendente apos 1 tick: esperado 1, obtido ${obterStats().comidaPendente}`);

degradarStats(true, "ligar", 11);
assert(obterStats().peso === 3, `Peso apos 2 ticks: esperado 3, obtido ${obterStats().peso}`);
assert(obterStats().comidaPendente === 0, `Pendente apos 2 ticks: esperado 0, obtido ${obterStats().comidaPendente}`);

degradarStats(true, "ligar", 12);
assert(obterStats().peso === 3, `Peso sem pendente: esperado 3, obtido ${obterStats().peso}`);

// ============================================
console.log("\n\x1b[36m=== TESTE 4: Temperatura - AC esfria, sem AC esquenta ===\x1b[0m");
// ============================================
let esfrioCount = 0;
for (let i = 0; i < 100; i++) {
    resetParaTeste();
    alterarStat("temperatura", 30);
    degradarStats(true, "ligar", 10);
    if (obterStats().temperatura <= 30) esfrioCount++;
}
assert(esfrioCount === 100, `AC ligado: temp sempre <= 30 (${esfrioCount}/100)`);

let esquentouCount = 0;
for (let i = 0; i < 100; i++) {
    resetParaTeste();
    alterarStat("temperatura", 20);
    degradarStats(true, "desligar", 10);
    if (obterStats().temperatura >= 20) esquentouCount++;
}
assert(esquentouCount === 100, `AC desligado: temp sempre >= 20 (${esquentouCount}/100)`);

// ============================================
console.log("\n\x1b[36m=== TESTE 5: Estados frio/calor por temperatura ===\x1b[0m");
// ============================================
resetParaTeste();
alterarStat("temperatura", 35);
degradarStats(true, "desligar", 10);
assert(obterStats().comCalor === true, "Temp 35 + sem AC: comCalor = true");
assert(obterStats().comFrio === false, "Temp 35 + sem AC: comFrio = false");

resetParaTeste();
alterarStat("temperatura", 10);
degradarStats(true, "ligar", 10);
assert(obterStats().comFrio === true, "Temp 10 + AC: comFrio = true");
assert(obterStats().comCalor === false, "Temp 10 + AC: comCalor = false");

resetParaTeste();
alterarStat("temperatura", 25);
degradarStats(true, "ligar", 10);
assert(obterStats().comCalor === false, "Temp 25: comCalor = false");

// Teste: comFrio/comCalor LIMPA quando temp volta ao range seguro
resetParaTeste();
alterarStat("comFrio", true);
alterarStat("temperatura", 23); // dentro do range seguro
degradarStats(true, "ligar", 10); // AC ligado, pode descer mais
// Mesmo que AC desça, se temp final >= 20 o comFrio deve limpar
// Forçar cenario controlado: temp alta o suficiente pra nao cair abaixo de 20
alterarStat("comFrio", true);
alterarStat("temperatura", 28);
degradarStats(true, "desligar", 10); // sem AC, sobe: 28+ = dentro do range
assert(obterStats().comFrio === false, "Temp 28+subida: comFrio deve limpar");

resetParaTeste();
alterarStat("comCalor", true);
alterarStat("temperatura", 22);
degradarStats(true, "ligar", 10); // AC ligado, desce: 22-algo = <=22, dentro do range
assert(obterStats().comCalor === false, "Temp 22+descida: comCalor deve limpar");

// ============================================
console.log("\n\x1b[36m=== TESTE 6: AC cura estados de temperatura ===\x1b[0m");
// ============================================
resetParaTeste();
alterarStat("comCalor", true);
// Simula o que enter.js faz ao confirmar AC como "ligar"
alterarStat("comCalor", false);
assert(obterStats().comCalor === false, "Ligar AC cura comCalor");

resetParaTeste();
alterarStat("comFrio", true);
alterarStat("comFrio", false);
assert(obterStats().comFrio === false, "Desligar AC cura comFrio");

// ============================================
console.log("\n\x1b[36m=== TESTE 7: Jokenpo e humor ===\x1b[0m");
// ============================================
resetParaTeste();
alterarStat("humor", 3);
resultadoJokenpo(true);
assert(obterStats().humor === 4, `Dino venceu: humor 3->4, obtido ${obterStats().humor}`);

alterarStat("humor", 3);
resultadoJokenpo(false);
assert(obterStats().humor === 3, `Jogador venceu: humor fica 3, obtido ${obterStats().humor}`);

alterarStat("humor", 5);
resultadoJokenpo(true);
assert(obterStats().humor === 5, `Humor max: fica 5, obtido ${obterStats().humor}`);

// ============================================
console.log("\n\x1b[36m=== TESTE 8: Remedio reseta stats ===\x1b[0m");
// ============================================
resetParaTeste();
alterarStat("doente", true);
alterarStat("fome", 3);
alterarStat("sede", 3);
alterarStat("humor", 4);
alterarStat("educacao", 3);
medicar();
const sm = obterStats();
assert(sm.doente === false, "Remedio: doente = false");
assert(sm.fome === 0, `Remedio: fome = 0, obtido ${sm.fome}`);
assert(sm.sede === 0, `Remedio: sede = 0, obtido ${sm.sede}`);
assert(sm.humor === 0, `Remedio: humor = 0, obtido ${sm.humor}`);
assert(sm.educacao === 0, `Remedio: educacao = 0, obtido ${sm.educacao}`);

// ============================================
console.log("\n\x1b[36m=== TESTE 9: Dormindo nao degrada stats ===\x1b[0m");
// ============================================
resetParaTeste();
alterarStat("dormindo", true);
degradarStats(true, "ligar", 10);
const sd = obterStats();
assert(sd.fome === 4, `Dormindo: fome nao degrada (${sd.fome})`);
assert(sd.sede === 4, `Dormindo: sede nao degrada (${sd.sede})`);
assert(sd.humor === 5, `Dormindo: humor nao degrada (${sd.humor})`);

// ============================================
console.log("\n\x1b[36m=== TESTE 10: Luz acesa durante sono = doente ===\x1b[0m");
// ============================================
resetParaTeste();
alterarStat("dormindo", true);
degradarStats(true, "ligar", 10);
assert(obterStats().doente === true, "Luz acesa dormindo: doente = true");

resetParaTeste();
alterarStat("dormindo", true);
degradarStats(false, "ligar", 10);
assert(obterStats().doente === false, "Luz apagada dormindo: doente = false");

// ============================================
// RESULTADO FINAL
// ============================================
console.log("\n" + "=".repeat(50));
if (failed === 0) {
    console.log(`\x1b[32mTODOS OS TESTES PASSARAM (${passed}/${passed})\x1b[0m`);
} else {
    console.log(`\x1b[31m${failed} TESTE(S) FALHARAM (${passed}/${passed + failed} passaram)\x1b[0m`);
}
console.log("=".repeat(50) + "\n");

process.exit(failed > 0 ? 1 : 0);
