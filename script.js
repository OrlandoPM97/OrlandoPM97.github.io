// Definir las 17 cartas de la lotería
const cartas = [
    'Horchata', 'Tamarindo', 'Fresa', 'Mango', 'Guanabana',
    'Guayaba', 'Maracuya', 'Piña', 'Limon', 'Grosella',
    'Uva', 'Naranja', 'Mandarina', 'Manzana', 'Jamaica',
    'Jarabe Natural', 'Piña Colada'
];

// Variables para los jugadores
let players = [];
let mazo = [...cartas];  // Mazo de cartas que se va a sortear

// Actualizar la cantidad de jugadores visibles en la interfaz
function updatePlayerNames() {
    const numPlayers = parseInt(document.getElementById("num-players").value);
    const playersContainer = document.getElementById("players-container");

    // Limpiar la interfaz
    playersContainer.innerHTML = '';

    // Crear los contenedores de jugadores según la cantidad seleccionada
    players = [];
    for (let i = 1; i <= numPlayers; i++) {
        const playerDiv = document.createElement("div");
        playerDiv.id = `player${i}`;
        playerDiv.innerHTML = `
            <h2 class="player-name">Jugador ${i}</h2>
            <div class="cartas"></div>
        `;
        playersContainer.appendChild(playerDiv);
        players.push({ id: `player${i}`, cards: [] });
    }

    // Habilitar el botón de iniciar solo si se seleccionó un número válido
    const startBtn = document.getElementById("startBtn");
    if (numPlayers) {
        startBtn.disabled = false;  // Habilitar el botón si hay jugadores seleccionados
    } else {
        startBtn.disabled = true;   // Deshabilitar si no hay selección
    }
}

// Generar las cartas para cada jugador
function generateCards(playerId) {
    const container = document.querySelector(`#${playerId} .cartas`);
    let cards = [...cartas];  // Copiar el arreglo de cartas
    
    // Seleccionar 8 cartas para el jugador
    let selectedCards = [];
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        selectedCards.push(cards.splice(randomIndex, 1)[0]);  // Eliminar y devolver la carta seleccionada
    }

    // Asignar las cartas al jugador
    const player = players.find(p => p.id === playerId);
    player.cards = selectedCards;

    // Mostrar las cartas en pantalla
    selectedCards.forEach(carta => {
        const cartaDiv = document.createElement("div");
        cartaDiv.classList.add("carta");
        cartaDiv.innerText = carta;
        cartaDiv.setAttribute("data-carta", carta); // Añadir un atributo para identificarla
        cartaDiv.onclick = () => marcarCarta(playerId, cartaDiv, carta);
        container.appendChild(cartaDiv);
    });
}

// Marcar una carta de un jugador
function marcarCarta(playerId, cartaDiv, carta) {
    cartaDiv.classList.add("marcada");

    // Verificar si el jugador tiene esa carta
    const player = players.find(p => p.id === playerId);
    const index = player.cards.indexOf(carta);
    if (index !== -1) {
        player.cards.splice(index, 1);
    }

    // Verificar si el jugador ganó
    checkWinner(playerId);
}

// Comenzar el juego
function startGame() {
    // Ocultar el selector de jugadores
    document.getElementById("players-selection").style.display = "none";  // Ocultar la sección de selección de jugadores

    // Generar las cartas para todos los jugadores
    players.forEach(player => generateCards(player.id));

    // Habilitar el botón de sorteo
    document.getElementById("drawCardBtn").disabled = false;

    // Deshabilitar el botón de inicio
    document.getElementById("startBtn").disabled = true;

    // Mostrar los títulos de los jugadores
    players.forEach(player => {
        document.querySelector(`#${player.id} .player-name`).style.display = "block";
    });

    // Bloquear la interacción con las cartas del jugador
    blockPlayerBoard();
}

// Sorteo de una carta
function drawCard() {
    if (mazo.length === 0) {
        alert("Ya no hay cartas en el mazo.");
        return;
    }

    // Seleccionar una carta aleatoria del mazo
    const randomIndex = Math.floor(Math.random() * mazo.length);
    const cartaSorteada = mazo.splice(randomIndex, 1)[0]; // Eliminar y obtener la carta

    // Mostrar la carta sorteada
    document.getElementById("carta-sorteada").innerText = cartaSorteada;

    // Verificar si alguno de los jugadores tiene esa carta
    players.forEach(player => {
        markCardIfPlayerHasCard(player.id, cartaSorteada);
    });

    // Verificar si algún jugador ganó
    players.forEach(player => checkWinner(player.id));
}

// Marcar la carta en el tablero del jugador si la tiene
function markCardIfPlayerHasCard(playerId, carta) {
    const cartaDiv = document.querySelector(`#${playerId} .carta[data-carta="${carta}"]`);
    if (cartaDiv) {
        cartaDiv.classList.add("marcada");
        // Eliminar la carta del jugador
        const player = players.find(p => p.id === playerId);
        const index = player.cards.indexOf(carta);
        if (index !== -1) player.cards.splice(index, 1);
    }
}

// Verificar si un jugador ganó
function checkWinner(playerId) {
    const player = players.find(p => p.id === playerId);
    if (player.cards.length === 0) {
        document.getElementById("status").innerText = `${playerId === "player1" ? "Jugador 1" : playerId === "player2" ? "Jugador 2" : "Jugador 3"} ¡Ganó!`;
        document.getElementById("drawCardBtn").disabled = true;

        // Mostrar el botón de reiniciar juego
        document.getElementById("resetBtn").style.display = "inline-block";
    }
}

// Función para reiniciar el juego
function resetGame() {
    // Limpiar las cartas de los jugadores
    players.forEach(player => player.cards = []);

    // Limpiar el estado del juego
    document.getElementById("carta-sorteada").innerText = '';
    document.getElementById("status").innerText = '';
    
    // Limpiar el contenedor de jugadores
    document.getElementById("players-container").innerHTML = '';

    // Volver a la selección de número de jugadores
    document.getElementById("num-players").value = '';  // Restaurar el valor a vacío
    document.getElementById("startBtn").disabled = true;  // Deshabilitar el botón de inicio

    // Reiniciar el mazo
    mazo = [...cartas];

    // Ocultar el botón de reiniciar juego
    document.getElementById("resetBtn").style.display = "none";

    // Volver a habilitar el selector de jugadores
    document.getElementById("num-players").disabled = false;
    document.getElementById("drawCardBtn").disabled = true;

    // Mostrar de nuevo el cuadro de selección de jugadores
    document.getElementById("players-selection").style.display = "block";  // Volver a mostrar el cuadro de selección de jugadores
}

// Función para bloquear la interacción con el tablero de los jugadores
function blockPlayerBoard() {
    const cartasJugador = document.querySelectorAll('.cartas .carta');
    cartasJugador.forEach(carta => {
        carta.style.pointerEvents = "none";  // Deshabilitar la interacción con las cartas
    });
}
