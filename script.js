// VARIÁVEIS DO JOGO
let pontuacao = 0;
let erros = 0;

// Referências aos elementos HTML
const containerLixeiras = document.getElementById('container-lixeiras');
const placarPontos = document.getElementById('pontuacao');
const placarErros = document.getElementById('erros');
const feedbackMensagem = document.getElementById('mensagem-feedback');

// A lista de itens pode ser dinâmica, então a pegamos sempre que necessário ou no início
let todosItens = document.querySelectorAll('.item');
let itemSendoArrastado = null;

// --- FUNÇÕES DE LÓGICA E VISUAL ---

function atualizarPlacar() {
    placarPontos.textContent = pontuacao;
    placarErros.textContent = erros;
}

// Função para mostrar feedback visual de acerto/erro
function mostrarFeedback(mensagem, tipo) {
    feedbackMensagem.textContent = mensagem;
    feedbackMensagem.className = 'visivel ' + tipo; // Adiciona classe de cor e visibilidade

    // Adiciona animação no placar
    const placarElement = tipo === 'acerto' ? placarPontos : placarErros;
    placarElement.style.transform = 'scale(1.2)';

    setTimeout(() => {
        feedbackMensagem.className = 'escondido'; // Esconde a mensagem
        placarElement.style.transform = 'scale(1)';
    }, 800);
}

// Funções de Acerto e Erro
function acerto(itemElement) {
    pontuacao += 10;
    atualizarPlacar();
    mostrarFeedback("+10 PONTOS!", 'acerto');
    
    // Remove o item com um pequeno atraso para dar tempo de ver a animação
    setTimeout(() => {
        itemElement.remove();
        verificarFimDeJogo();
    }, 100); 
}

function erro(lixeiraElement) {
    erros += 1; // Erros contam como 1
    atualizarPlacar();
    mostrarFeedback("ERRO! -1 Erro", 'erro');
    
    // Adiciona a animação de tremor na lixeira
    lixeiraElement.classList.add('erro-animacao');
    
    // Remove a classe de animação após o término
    setTimeout(() => {
        lixeiraElement.classList.remove('erro-animacao');
    }, 500);
}

function verificarFimDeJogo() {
    if (document.querySelectorAll('.item').length === 0) {
        setTimeout(() => {
            alert(`🎉 Jogo Finalizado! Você reciclou tudo e salvou o dia!\nPontuação Final: ${pontuacao} (Erros: ${erros})`);
            document.getElementById('btn-novo-jogo').style.display = 'block';
        }, 500);
    }
}

function iniciarNovoJogo() {
    window.location.reload(); 
}

// --- LÓGICA DE ARRASTAR E SOLTAR (DRAG AND DROP) ---

function configurarDragAndDrop() {
    // 1. Início e Fim do Arraste nos Itens
    todosItens.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            itemSendoArrastado = e.target;
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-tipo'));
            e.target.classList.add('arrastando');
        });

        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('arrastando');
            itemSendoArrastado = null;
        });
    });

    // 2. Eventos nas Lixeiras (Áreas de Soltura)
    const lixeiras = document.querySelectorAll('.lixeira');

    lixeiras.forEach(lixeira => {
        // Drag Over: Previne o padrão e adiciona estilo
        lixeira.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            // Verifica se o item sendo arrastado existe
            if (itemSendoArrastado) {
                 lixeira.classList.add('arrastando-sobre');
            }
        });

        // Drag Leave: Remove o estilo
        lixeira.addEventListener('dragleave', (e) => {
            lixeira.classList.remove('arrastando-sobre');
        });

        // 3. Soltar (Drop)
        lixeira.addEventListener('drop', (e) => {
            e.preventDefault();
            lixeira.classList.remove('arrastando-sobre');

            const tipoItemArrastado = e.dataTransfer.getData('text/plain');
            const tipoLixeira = lixeira.getAttribute('data-tipo');
            
            // Lógica de Acerto/Erro
            if (tipoItemArrastado === tipoLixeira) {
                acerto(itemSendoArrastado); 
            } else {
                erro(lixeira);
            }
        });
    });
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    atualizarPlacar();
    configurarDragAndDrop();
});