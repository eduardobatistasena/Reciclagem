let score = 0;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const item = document.getElementById(data);
    const binId = ev.target.id;

    // Verificar se a lixeira está correta
    if (binId === "papel" && item.id === "item1") {
        score += 10;
    } else if (binId === "plastico" && item.id === "item2") {
        score += 10;
    } else if (binId === "vidro" && item.id === "item3") {
        score += 10;
    } else {
        score -= 5;
    }

    document.getElementById("score").innerText = score;

    // Mover o item para dentro da lixeira
    ev.target.appendChild(item);
    item.setAttribute("draggable", "false"); // Não pode ser arrastado depois de colocado

    // Recolocar um novo item após um curto tempo
    setTimeout(() => {
        resetItems();
    }, 1000);
}

function resetItems() {
    const items = document.querySelectorAll(".item");
    items.forEach(item => {
        item.setAttribute("draggable", "true");
        const randomPos = Math.floor(Math.random() * 3);
        const randomItem = document.querySelectorAll(".game-area .item")[randomPos];
        item.style.transform = "none"; // resetando
        randomItem.appendChild(item); // movendo para uma nova posição
    });
}