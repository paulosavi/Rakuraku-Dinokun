const SAVE_KEY = "rakuraku-dinokun-save";

function carregarEstado() {
    try {
        const dados = localStorage.getItem(SAVE_KEY);
        if (dados) {
            return JSON.parse(dados);
        }
    } catch (e) {
        console.warn("Erro ao carregar save:", e);
    }
    return null;
}

function salvarEstado(estado) {
    try {
        const dadosAtuais = carregarEstado() || {};
        const novoEstado = { ...dadosAtuais, ...estado };
        localStorage.setItem(SAVE_KEY, JSON.stringify(novoEstado));
    } catch (e) {
        console.warn("Erro ao salvar:", e);
    }
}

function limparEstado() {
    localStorage.removeItem(SAVE_KEY);
}

export { carregarEstado, salvarEstado, limparEstado }
