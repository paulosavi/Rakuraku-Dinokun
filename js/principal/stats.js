import { salvarEstado, carregarEstado } from "./saveSystem.js";
import { agora } from "./relogioInterno.js";

// Stats do pet - valores iniciais (recém-nascido)
var stats = {
    fome: 4,          // 0-4 (pratos cheios). 0 = faminto, 4 = satisfeito
    sede: 4,          // 0-4 (copos cheios). 0 = sedento, 4 = hidratado
    humor: 5,         // 0-5 (6 níveis). 0 = muito triste, 5 = muito feliz
    peso: 1,          // em kg, começa com 1
    idade: 0,         // dias desde o nascimento
    educacao: 0,      // 0-4 (E+, D+, C+, B+, A+)
    temperatura: 25,  // graus, ideal = 25
    faseEvolucao: 1,  // 1 = bebê, 2 = criança, 3 = adolescente, 4 = adulto
    doente: false,    // se está doente (cura: remédio)
    comFrio: false,   // temp < 20°C (cura: desligar AC)
    comCalor: false,  // temp > 30°C (cura: ligar AC)
    sujo: false,      // se está sujo
    dormindo: false,  // se está dormindo
    vivo: true,       // se está vivo

    // Rastreamento de dieta para evolução
    dietaCarne: 0,    // vezes que comeu hambúrguer ou coxa
    dietaVegetal: 0,  // vezes que comeu cenoura ou maçã
    dietaMassa: 0,    // vezes que comeu macarrão

    // Comida/água pendente para converter em peso (1kg/hora)
    comidaPendente: 0,

    // Contadores de doença/morte
    horasDoente: 0,   // quantas horas está doente sem ser tratado
    limiteDoenca: 0,  // horas até morrer (definido aleatoriamente ao ficar doente)
    causaMorte: "",   // "doenca", "velhice", ""

    // Controle de tempo
    ultimaAtualizacao: agora(),
    nascimento: agora()
};

// Limites para morte
// Timer de doença é aleatório (1-8 horas) conforme original
const IDADE_MAXIMA_DIAS = 20;     // 20 dias de vida = morte por velhice

// Nomes dos níveis de educação
const NIVEIS_EDUCACAO = ["E+", "D+", "C+", "B+", "A+"];

// Nomes dos níveis de humor
const NIVEIS_HUMOR = [
    "muito triste",
    "triste",
    "neutro",
    "levemente feliz",
    "feliz",
    "muito feliz"
];

// Mapeamento de comida para categoria de dieta
// Índices: 0=hamburguer, 1=macarrao, 2=sorvete, 3=cenoura, 4=maca, 5=coxa
const DIETA_COMIDA = {
    0: "carne",      // hambúrguer
    1: "massa",      // macarrão
    2: "especial",   // sorvete (acalma raiva)
    3: "vegetal",    // cenoura
    4: "vegetal",    // maçã
    5: "carne"       // coxa de frango
};

function obterStats() {
    return stats;
}

function alterarStat(nome, valor) {
    if (nome in stats) {
        stats[nome] = valor;
    }
}

// Alimentar o dino - recebe o índice da comida (0-5)
function alimentar(indiceComida) {
    if (stats.fome < 4) {
        stats.fome = Math.min(4, stats.fome + 1);
    }
    stats.comidaPendente += 1;

    // Rastrear dieta para evolução
    var categoria = DIETA_COMIDA[indiceComida];
    if (categoria === "carne") {
        stats.dietaCarne++;
    } else if (categoria === "vegetal") {
        stats.dietaVegetal++;
    } else if (categoria === "massa") {
        stats.dietaMassa++;
    }

    salvarStats();
}

// Dar de beber
function darAgua() {
    if (stats.sede < 4) {
        stats.sede = Math.min(4, stats.sede + 1);
    }
    stats.comidaPendente += 1;
    salvarStats();
}

// Estudar - aumenta educação
function estudar() {
    if (stats.educacao < 4) {
        stats.educacao = Math.min(4, stats.educacao + 1);
    }
    salvarStats();
}

// Fazer carinho - também aumenta educação (como no oficial)
function fazerCarinho() {
    if (stats.educacao < 4) {
        stats.educacao = Math.min(4, stats.educacao + 1);
    }
    salvarStats();
}

// Banhar - remove estado sujo
function banhar() {
    stats.sujo = false;
    salvarStats();
}

// Medicar - cura doença, mas reseta todos os medidores
function medicar() {
    if (stats.doente) {
        stats.doente = false;
        stats.horasDoente = 0;
        stats.fome = 0;
        stats.sede = 0;
        stats.humor = 0;
        stats.educacao = 0;
    }
    salvarStats();
}

// Marca o pet como morto
function matarPet(causa) {
    stats.vivo = false;
    stats.causaMorte = causa;
    salvarStats();
    console.log("💀 Pet morreu. Causa: " + causa);
}

// Resultado do jokenpô - dino venceu = humor +1
function resultadoJokenpo(dinoVenceu) {
    if (dinoVenceu) {
        stats.humor = Math.min(5, stats.humor + 1);
    }
    salvarStats();
}

// Horários de degradação conforme o Dinkie Dino original:
// 10h, 11h, 12h, 13h, 14h, 15h, 16h → fome e sede
// 10h, 12h, 14h, 16h (horas pares) → humor também
const HORAS_DEGRADACAO = [10, 11, 12, 13, 14, 15, 16];
const HORAS_HUMOR = [10, 12, 14, 16];

// Degradação por hora - chamada pelo gameLoop
// Recebe o estado da luz, AC e a hora atual do relógio interno
function degradarStats(estadoLuz, estadoAC, hora) {
    if (!stats.vivo) return false;

    // Se dormindo, só rola a checagem de luz (não degrada outros stats)
    if (stats.dormindo) {
        // Luz acesa durante o sono → pet acorda doente
        if (estadoLuz === true) {
            stats.doente = true;
        }
    } else {
        // Fome e sede só degradam nos horários específicos (10h-16h)
        if (HORAS_DEGRADACAO.includes(hora)) {
            if (stats.faseEvolucao === 1) {
                stats.fome = Math.max(0, stats.fome - 2);
                stats.sede = Math.max(0, stats.sede - 2);
            } else {
                stats.fome = Math.max(0, stats.fome - 1);
                stats.sede = Math.max(0, stats.sede - 1);
            }
        }

        // Humor só degrada nas horas pares (10h, 12h, 14h, 16h)
        if (HORAS_HUMOR.includes(hora)) {
            stats.humor = Math.max(0, stats.humor - 1);
        }

        // Conversão de comida/água pendente em peso (1kg/hora)
        if (stats.comidaPendente > 0) {
            stats.peso += 1;
            stats.comidaPendente -= 1;
        }

        // Temperatura conforme original:
        // AC desligado: sobe 0-8°C (aquece naturalmente)
        // AC ligado: desce 0-8°C (resfria)
        if (estadoAC === "ligar") {
            var variacao = Math.floor(Math.random() * 9);
            stats.temperatura = stats.temperatura - variacao;
        } else {
            var variacao = Math.floor(Math.random() * 9);
            stats.temperatura = stats.temperatura + variacao;
        }

        // Temperatura fora do ideal = estados de frio/calor (não doença)
        if (stats.temperatura > 30) {
            stats.comCalor = true;
        } else {
            stats.comCalor = false;
        }
        if (stats.temperatura < 20) {
            stats.comFrio = true;
        } else {
            stats.comFrio = false;
        }

        // Chance aleatória de ficar sujo (10%)
        if (Math.random() < 0.1) {
            stats.sujo = true;
        }

        // Chance de ficar doente se fome/sede = 0
        if (stats.fome === 0 || stats.sede === 0) {
            if (Math.random() < 0.3) {
                stats.doente = true;
            }
        }
    }

    // Contador de doença - timer aleatório conforme original
    if (stats.doente) {
        // Ao ficar doente pela primeira vez, sorteia o limite (1-8 horas)
        if (stats.limiteDoenca === 0) {
            stats.limiteDoenca = Math.floor(Math.random() * 8) + 1;
        }
        stats.horasDoente += 1;
        if (stats.horasDoente >= stats.limiteDoenca) {
            matarPet("doenca");
            return true;
        }
    } else {
        stats.horasDoente = 0;
        stats.limiteDoenca = 0;
    }

    // Morte por velhice
    if (stats.idade >= IDADE_MAXIMA_DIAS) {
        matarPet("velhice");
        return true;
    }

    salvarStats();
    return false;
}

// Salvar stats no localStorage
function salvarStats() {
    salvarEstado({ stats: stats });
}

// Carregar stats do localStorage
function carregarStats() {
    var estado = carregarEstado();
    if (estado && estado.stats) {
        stats = { ...stats, ...estado.stats };
    }
}

// Resetar stats (novo jogo)
function resetarStats() {
    stats.fome = 4;
    stats.sede = 4;
    stats.humor = 5;
    stats.peso = 1;
    stats.idade = 0;
    stats.educacao = 0;
    stats.temperatura = 25;
    stats.faseEvolucao = 1;
    stats.doente = false;
    stats.comFrio = false;
    stats.comCalor = false;
    stats.sujo = false;
    stats.dormindo = false;
    stats.vivo = true;
    stats.dietaCarne = 0;
    stats.dietaVegetal = 0;
    stats.dietaMassa = 0;
    stats.comidaPendente = 0;
    stats.horasDoente = 0;
    stats.limiteDoenca = 0;
    stats.causaMorte = "";
    stats.ultimaAtualizacao = agora();
    stats.nascimento = agora();
    salvarStats();
}

export {
    obterStats,
    alterarStat,
    alimentar,
    darAgua,
    estudar,
    fazerCarinho,
    banhar,
    medicar,
    resultadoJokenpo,
    degradarStats,
    salvarStats,
    carregarStats,
    resetarStats,
    matarPet,
    NIVEIS_EDUCACAO,
    NIVEIS_HUMOR,
    DIETA_COMIDA,
    IDADE_MAXIMA_DIAS
}
