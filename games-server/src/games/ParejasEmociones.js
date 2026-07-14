// ============================================
// JUEGO 5: LAS PAREJAS DE LAS EMOCIONES
// ============================================
// Memorama Multijugador Sincronizado
// Habilidad: Memoria emocional
// Edad: 5-10 años

class ParejasEmociones {
    constructor() {
        this.name = "Las Parejas de las Emociones";
        this.description = "Encuentra las parejas de emociones y estrategias";
        this.players = [];
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = [];
        this.activeTurn = null;
        this.turnIndex = 0;
        this.totalScore = 0;
        this.phase = 'PLAYING'; // PLAYING, CHECKING, RESULT

        this.emotionPairs = [
            { 
                trigger: { text: "Suspense en examen", emoji: "😰" },
                strategy: { text: "Respiración profunda y reintento", emoji: "🧘" }
            },
            {
                trigger: { text: "Reto difícil", emoji: "😤" },
                strategy: { text: "Dividir en pasos pequeños", emoji: "📝" }
            },
            {
                trigger: { text: "Discusión con amigo", emoji: "😠" },
                strategy: { text: "Escuchar y hablar con calma", emoji: "👂" }
            },
            {
                trigger: { text: "Miedo a lo nuevo", emoji: "😨" },
                strategy: { text: "Preguntar y explorar con curiosidad", emoji: "🔍" }
            },
            {
                trigger: { text: "No me incluyen", emoji: "😢" },
                strategy: { text: "Expresar cómo me siento", emoji: "💬" }
            },
            {
                trigger: { text: "Algo sale mal", emoji: "😞" },
                strategy: { text: "Intentar de otra manera", emoji: "🔄" }
            },
            {
                trigger: { text: "Siento envidia", emoji: "😒" },
                strategy: { text: "Pensar en mis propias fortalezas", emoji: "💪" }
            },
            {
                trigger: { text: "Me siento solo", emoji: "😔" },
                strategy: { text: "Buscar a alguien de confianza", emoji: "🤝" }
            }
        ];
    }

    start(players) {
        this.players = players;
        this.turnIndex = 0;
        this.activeTurn = players[0]?.id;
        this.matchedPairs = [];
        this.totalScore = 0;
        this.generateCards();
        this.phase = 'PLAYING';
    }

    generateCards() {
        const numPairs = Math.min(6, this.players.length + 3);
        const selectedPairs = this.emotionPairs.slice(0, numPairs);
        
        this.cards = [];
        let cardId = 0;

        selectedPairs.forEach((pair, pairIndex) => {
            // Trigger card
            this.cards.push({
                id: cardId++,
                pairId: pairIndex,
                type: 'trigger',
                content: pair.trigger,
                isFlipped: false,
                isMatched: false
            });

            // Strategy card
            this.cards.push({
                id: cardId++,
                pairId: pairIndex,
                type: 'strategy',
                content: pair.strategy,
                isFlipped: false,
                isMatched: false
            });
        });

        // Shuffle cards
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    getState() {
        return {
            name: this.name,
            description: this.description,
            cards: this.cards.map(c => ({
                id: c.id,
                pairId: c.pairId,
                type: c.type,
                content: c.isFlipped || c.isMatched ? c.content : null,
                isFlipped: c.isFlipped,
                isMatched: c.isMatched
            })),
            matchedPairs: this.matchedPairs.length,
            totalPairs: this.cards.length / 2,
            activeTurn: this.activeTurn,
            currentPlayer: this.players[this.turnIndex]?.name,
            phase: this.phase,
            totalScore: this.totalScore,
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                score: p.score
            }))
        };
    }

    handleAction(playerId, action, data) {
        switch (action) {
            case 'flip_card':
                return this.handleFlipCard(playerId, data);
            case 'check_match':
                return this.handleCheckMatch();
            default:
                return { error: 'Acción no reconocida' };
        }
    }

    handleFlipCard(playerId, { cardId }) {
        if (playerId !== this.activeTurn) {
            return { error: 'No es tu turno' };
        }

        const card = this.cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) {
            return { error: 'Carta no disponible' };
        }

        card.isFlipped = true;
        this.flippedCards.push(card);

        return {
            success: true,
            card: {
                id: card.id,
                pairId: card.pairId,
                type: card.type,
                content: card.content
            },
            flippedCount: this.flippedCards.length
        };
    }

    handleCheckMatch() {
        if (this.flippedCards.length !== 2) {
            return { error: 'Selecciona dos cartas primero' };
        }

        const [card1, card2] = this.flippedCards;
        let isMatch = false;

        // Check if cards form a valid pair (trigger + strategy from same pair)
        if (card1.pairId === card2.pairId && card1.type !== card2.type) {
            isMatch = true;
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs.push(card1.pairId);

            // Award points
            const score = 30;
            this.totalScore += score;
            const player = this.players.find(p => p.id === this.activeTurn);
            if (player) {
                player.score += score;
            }
        }

        // Reset flipped cards after delay
        setTimeout(() => {
            this.flippedCards.forEach(c => {
                if (!c.isMatched) {
                    c.isFlipped = false;
                }
            });
            this.flippedCards = [];
        }, 1500);

        // Check for game over
        const gameOver = this.matchedPairs.length === this.cards.length / 2;
        if (gameOver) {
            this.phase = 'FINISHED';
        }

        // Next turn
        if (!gameOver) {
            this.turnIndex = (this.turnIndex + 1) % this.players.length;
            this.activeTurn = this.players[this.turnIndex]?.id;
        }

        return {
            success: true,
            isMatch,
            matchedPair: isMatch ? { card1: card1.id, card2: card2.id } : null,
            score: this.totalScore,
            gameOver,
            nextTurn: this.activeTurn
        };
    }
}

module.exports = ParejasEmociones;
