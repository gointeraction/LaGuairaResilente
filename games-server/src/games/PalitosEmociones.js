// ============================================
// JUEGO 2: LOS PALITOS DE LAS EMOCIONES
// ============================================
// Extracción Física Virtual / Tiempo Real
// Habilidad: Identificación emocional
// Edad: 5-12 años

class PalitosEmociones {
    constructor() {
        this.name = "Los Palitos de las Emociones";
        this.description = "Extrae palitos del montón sin mover los demás";
        this.sticks = [];
        this.activeTurn = null;
        this.turnIndex = 0;
        this.removedSticks = [];
        this.totalScore = 0;
        this.players = [];
        this.phase = 'SETUP'; // SETUP, PLAYING, TRIVIA, RESULT
        this.currentTrivia = null;
        this.triviaTimer = null;
        this.triviaTimeLeft = 10;

        this.emotionColors = {
            red: { emotion: 'Ira', emoji: '😠', trivia: '¿Qué puedes hacer cuando sientes ira?' },
            blue: { emotion: 'Tristeza', emoji: '😢', trivia: '¿Cómo expresas cuando estás triste?' },
            yellow: { emotion: 'Alegría', emoji: '😊', trivia: '¿Qué te hace sentir feliz?' },
            green: { emotion: 'Envidia', emoji: '😒', trivia: '¿Qué haces cuando envidias a alguien?' },
            purple: { emotion: 'Miedo', emoji: '😨', trivia: '¿Cómo enfrentas tus miedos?' },
            orange: { emotion: 'Sorpresa', emoji: '😲', trivia: '¿Qué haces cuando te sorprenden?' }
        };
    }

    start(players) {
        this.players = players;
        this.turnIndex = 0;
        this.activeTurn = players[0]?.id;
        this.removedSticks = [];
        this.phase = 'PLAYING';
        this.generateSticks();
    }

    generateSticks() {
        const colors = Object.keys(this.emotionColors);
        this.sticks = [];

        for (let i = 0; i < 15; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.sticks.push({
                id: `stick-${i}`,
                color,
                emotion: this.emotionColors[color].emotion,
                emoji: this.emotionColors[color].emoji,
                x: 100 + Math.random() * 400,
                y: 300 + Math.random() * 200,
                rotation: Math.random() * 180 - 90,
                isRemoved: false,
                isStabilizing: false
            });
        }

        // Add some overlap for visual interest
        this.sticks.forEach((stick, index) => {
            stick.zIndex = index;
        });
    }

    getState() {
        return {
            name: this.name,
            description: this.description,
            sticks: this.sticks.filter(s => !s.isRemoved),
            removedSticks: this.removedSticks,
            activeTurn: this.activeTurn,
            turnIndex: this.turnIndex,
            currentPlayer: this.players[this.turnIndex]?.name,
            phase: this.phase,
            currentTrivia: this.currentTrivia,
            triviaTimeLeft: this.triviaTimeLeft,
            totalScore: this.totalScore,
            emotionColors: this.emotionColors
        };
    }

    handleAction(playerId, action, data) {
        switch (action) {
            case 'remove_stick':
                return this.handleRemoveStick(playerId, data);
            case 'answer_trivia':
                return this.handleTriviaAnswer(playerId, data);
            case 'next_turn':
                return this.handleNextTurn();
            default:
                return { error: 'Acción no reconocida' };
        }
    }

    handleRemoveStick(playerId, { stickId }) {
        if (playerId !== this.activeTurn) {
            return { error: 'No es tu turno' };
        }

        const stickIndex = this.sticks.findIndex(s => s.id === stickId);
        if (stickIndex === -1) {
            return { error: 'Palito no encontrado' };
        }

        const stick = this.sticks[stickIndex];

        // Check for collision (simplified)
        const nearbySticks = this.sticks.filter(s => 
            !s.isRemoved && 
            s.id !== stickId &&
            Math.abs(s.x - stick.x) < 30 &&
            Math.abs(s.y - stick.y) < 30
        );

        if (nearbySticks.length > 0) {
            // Collision detected - lose turn
            return {
                success: false,
                collision: true,
                message: '¡Ups! Moviste otros palitos. Pierdes tu turno.',
                nearbySticks: nearbySticks.map(s => s.id)
            };
        }

        // Successful removal
        stick.isRemoved = true;
        this.removedSticks.push(stick);

        // Generate trivia for the emotion
        this.currentTrivia = {
            stickId: stick.id,
            emotion: stick.emotion,
            color: stick.color,
            emoji: stick.emoji,
            question: this.emotionColors[stick.color].trivia,
            options: this.generateTriviaOptions(stick.color)
        };

        this.phase = 'TRIVIA';
        this.triviaTimeLeft = 15;

        const player = this.players.find(p => p.id === playerId);
        if (player) {
            player.score += 15;
        }

        return {
            success: true,
            removedStick: stick,
            trivia: this.currentTrivia,
            score: 15
        };
    }

    generateTriviaOptions(correctColor) {
        const allOptions = [
            { text: 'Hablar con un adulto de confianza', correct: true },
            { text: 'Gritar fuerte', correct: false },
            { text: 'Guardarlo para mí', correct: false },
            { text: 'Hacer ejercicio o jugar', correct: true },
            { text: 'Llorar si necesito', correct: true },
            { text: 'Hacerme daño', correct: false }
        ];

        // Shuffle and return 4 options
        return allOptions.sort(() => Math.random() - 0.5).slice(0, 4);
    }

    handleTriviaAnswer(playerId, { correct }) {
        if (correct) {
            this.totalScore += 10;
            const player = this.players.find(p => p.id === playerId);
            if (player) {
                player.score += 10;
            }
        }

        this.currentTrivia = null;
        this.phase = 'PLAYING';

        // Check if game is over
        if (this.sticks.filter(s => !s.isRemoved).length === 0) {
            this.phase = 'FINISHED';
            return { success: true, gameOver: true, totalScore: this.totalScore };
        }

        return {
            success: true,
            correct,
            score: this.totalScore
        };
    }

    handleNextTurn() {
        this.turnIndex = (this.turnIndex + 1) % this.players.length;
        this.activeTurn = this.players[this.turnIndex]?.id;

        return {
            success: true,
            activeTurn: this.activeTurn,
            currentPlayer: this.players[this.turnIndex]?.name
        };
    }
}

module.exports = PalitosEmociones;
