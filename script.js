// Definimos 22 cartas que son los sabores y unas cuantas resetas de Jarabes San Pedro
const cartas = [
    'Horchata', 'Tamarindo', 'Fresa', 'Mango', 'Guanabana',
    'Guayaba', 'Maracuya', 'Piña', 'Limon', 'Grosella',
    'Uva', 'Naranja', 'Mandarina', 'Manzana', 'Jamaica',
    'Jarabe Natural', 'Piña Colada', 'Hielo', 'Vitrolero', 'Bolis', 'Frutas', 'Vaso'
];

// Variables que guardaran las acciones realizadas dentro del juego
let players = [];
let mazo = [...cartas]; 
let juegoActivo = true; 
let ganador = null;

// Funcion que actualiza el numero de jugadores
function updatePlayerNames() {
    const numPlayers = parseInt(document.getElementById("num-players").value);
    const playersContainer = document.getElementById("players-container");

    playersContainer.innerHTML = '';

    // Crear los contenedores o tableros de jugadores según la cantidad seleccionada
    players = [];
    for (let i = 1; i <= numPlayers; i++) {
        const playerDiv = document.createElement("div");
        playerDiv.id = `player${i}`;
        playerDiv.innerHTML = `
            <h2 class="player-name">Jugador ${i}</h2>
            <div class="cartas"></div>
        `;
        playersContainer.appendChild(playerDiv);
        players.push({ id: `player${i}`, cards: [], marcadas: [] }); // Añadir array para cartas marcadas
    }

    // Habilitar el botón de iniciar solo si se seleccionó un número de jugadores
    const startBtn = document.getElementById("startBtn");
    if (numPlayers) {
        startBtn.disabled = false; // Habilitar el botón si hay jugadores seleccionados
    } else {
        startBtn.disabled = true; // Deshabilitar si no hay selección
    }
}

// Generar las cartas para cada jugador
function generateCards(playerId) {
    const container = document.querySelector(`#${playerId} .cartas`);
    let cards = [...cartas]; // Copiar el arreglo de cartas

    // Seleccionar 8 cartas para el jugador se pueden agregar mas o menos cartas por tablero del jugador
    let selectedCards = [];
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        selectedCards.push(cards.splice(randomIndex, 1)[0]); // Eliminar y devolver la carta seleccionada
    }

    // Asignar las cartas al jugador
    const player = players.find(p => p.id === playerId);
    player.cards = selectedCards;

    // Mostrar las cartas en pantalla
    selectedCards.forEach(carta => {
        const cartaDiv = document.createElement("div");
        cartaDiv.classList.add("carta");
        cartaDiv.innerText = carta;
        cartaDiv.setAttribute("data-carta", carta);
        cartaDiv.onclick = () => marcarCarta(playerId, cartaDiv, carta);
        container.appendChild(cartaDiv);
    });
}

// Marcar una carta de un jugador
function marcarCarta(playerId, cartaDiv, carta) {
    if (!juegoActivo) return;

    cartaDiv.classList.add("marcada");

    // Verificar si el jugador tiene esa carta
    const player = players.find(p => p.id === playerId);
    if (!player.marcadas.includes(carta)) {
        player.marcadas.push(carta);
    }

    // Verificar si el jugador ganó
    checkWinner(playerId);
}

// Comenzar el juego
function startGame() {
    // Ocultar el selector de jugadores despues de dar unicio
    document.getElementById("players-selection").style.display = "none";

    // Generar las cartas para todos los jugadores es completamemte al azar
    players.forEach(player => generateCards(player.id));

    document.getElementById("drawCardBtn").disabled = false;

    // Deshabilitar el botón de inicio cuando esta el juego en curso
    document.getElementById("startBtn").disabled = true;

    // Mostrar los títulos de los jugadores
    players.forEach(player => {
        document.querySelector(`#${player.id} .player-name`).style.display = "block";
    });

    // Bloquear la interacción con las cartas del jugador para que ellos no puedan seleccionar (Hacer trampa)
    blockPlayerBoard();
}

// Sorteo de una carta
function drawCard() {
    if (!juegoActivo) return;

    if (mazo.length === 0) {
        alert("Ya no hay cartas en el mazo.");
        return;
    }

    // Seleccionar una carta aleatoria del mazo
    const randomIndex = Math.floor(Math.random() * mazo.length);
    const cartaSorteada = mazo.splice(randomIndex, 1)[0]; // Eliminar y obtener la carta del maso de 22 cartas

    // Mostrar la carta sorteada
    document.getElementById("carta-sorteada").innerText = cartaSorteada;

    // Verificar si alguno de los jugadores tiene esa carta
    players.forEach(player => {
        markCardIfPlayerHasCard(player.id, cartaSorteada);
    });

    // Verificar si algún jugador ganó
    if (!ganador) {
        players.forEach(player => checkWinner(player.id));
    }
}

// Marcar la carta en el tablero del jugador si la tiene
function markCardIfPlayerHasCard(playerId, carta) {
    const cartaDiv = document.querySelector(`#${playerId} .carta[data-carta="${carta}"]`);
    if (cartaDiv) {
        cartaDiv.classList.add("marcada");

        // Añadir la carta marcada al jugador
        const player = players.find(p => p.id === playerId);
        if (!player.marcadas.includes(carta)) {
            player.marcadas.push(carta);
        }
    }
}

// Verificar si un jugador ganó
function checkWinner(playerId) {
    if (!juegoActivo || ganador) return;

    const player = players.find(p => p.id === playerId);
    if (player.marcadas.length === 8) { // Verificar si ha marcado todas sus cartas
        juegoActivo = false; // Desactivar el juego
        ganador = playerId; // Asignar al jugador como ganador
        document.getElementById("status").innerText = `${playerId === "player1" ? "Jugador 1" : playerId === "player2" ? "Jugador 2" : "Jugador 3"} ¡Ganó!`;
        document.getElementById("drawCardBtn").disabled = true;

        // Mostrar el botón de reiniciar juego solo cuando exista un ganador
        document.getElementById("resetBtn").style.display = "inline-block";
    }
}

// Función para reiniciar el juego solo aparecera cuando alguien gano
function resetGame() {
    // Limpiar las cartas de los jugadores
    players.forEach(player => {
        player.cards = [];
        player.marcadas = [];
    });

    // Limpiar el estado del juego
    document.getElementById("carta-sorteada").innerText = '';
    document.getElementById("status").innerText = '';

    // Limpiar el contenedor de jugadores
    document.getElementById("players-container").innerHTML = '';

    // Volver a la selección de número de jugadores
    document.getElementById("num-players").value = ''; // Restaurar el valor a vacío
    document.getElementById("startBtn").disabled = true; // Deshabilitar el botón de inicio

    // Reiniciar el mazo
    mazo = [...cartas];

    // Ocultar el botón de reiniciar juego
    document.getElementById("resetBtn").style.display = "none";

    // Volver a habilitar el selector de jugadores
    document.getElementById("num-players").disabled = false;
    document.getElementById("drawCardBtn").disabled = true;

    // Mostrar de nuevo el cuadro de selección de jugadores
    document.getElementById("players-selection").style.display = "block";

    // Reactivar el juego
    juegoActivo = true;
    ganador = null; 
}

// Función para bloquear la interacción con el tablero de los jugadores
function blockPlayerBoard() {
    const cartasJugador = document.querySelectorAll('.cartas .carta');
    cartasJugador.forEach(carta => {
        carta.style.pointerEvents = "none";
    });
}
