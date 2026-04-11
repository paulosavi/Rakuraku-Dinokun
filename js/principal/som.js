// Sistema de som do jogo
// Sons extraídos do Remagotchi (pixelDino)

var somLigado = true;

const sons = {
    beep: new Audio("sfx/beep.wav"),
    happy: new Audio("sfx/happy.wav"),
    sad: new Audio("sfx/sad.wav"),
    alert: new Audio("sfx/alert_dino.wav"),
    playing: new Audio("sfx/pet_playing.wav")
};

function tocar(nome) {
    if (!somLigado) return;
    var audio = sons[nome];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

function alterarSom(ligado) {
    somLigado = ligado;
}

function somEstaLigado() {
    return somLigado;
}

export { tocar, alterarSom, somEstaLigado };
