// ============================================
// JUEGO 4: JUGANDO CON EMOJIS
// ============================================
// Batalla del Tablero de Expresiones
// Habilidad: Expresión y gestión emocional
// Edad: 4-10 años

class JugandoEmojis {
    constructor() {
        this.name = "Jugando con Emojis";
        this.description = "Recrea patrones de emojis para gestionar emociones";
        this.players = [];
        this.currentPattern = [];
        this.playerPatterns = {};
        this.round = 1;
        this.maxRounds = 5;
        this.timer = null;
        this.timeLeft = 30;
        this.totalScore = 0;
        this.difficulty = 1;
        this.phase = 'SHOW'; // SHOW, PLAYING, RESULT

        this.emojiCategories = {
            happy: ['😊', '😄', '🥰', '😍', '🤩', '😃', '😁', '🥳'],
            sad: ['😢', '😭', '😞', '😔', '😿', '😥', '🥺', '😢'],
            angry: ['😠', '😡', '🤬', '😤', '💢', '👿', '👊', '😡'],
            scared: ['😨', '😱', '😰', '😥', '🤯', '😳', '🫣', '😬'],
            surprised: ['😲', '🤯', '😮', '😱', '🤩', '😳', '🫢', '😮'],
            neutral: ['😐', '😑', '😶', '🫥', '🤔', '🧐', '😏', '🫡']
        };

        this.situations = [
            { 
                situation: "Tu mejor amigo se mudó a otra ciudad", 
                pattern: ["😢", "😢", "😔", "😢", "😞"],
                resolution: ["😊", "🤝", "💪", "❤️", "✨"]
            },
            {
                situation: "Te dieron un regalo sorpresa", 
                pattern: ["😲", "😮", "🤩", "😄", "🥳"],
                resolution: ["😄", "🥰", "💝", "😊", "✨"]
            },
            {
                situation: "Alguien te dijo algo feo", 
                pattern: ["😢", "😠", "😤", "😡", "😢"],
                resolution: ["😌", "💪", "🧘", "😊", "✨"]
            },
            {
                situation: "Tienes un examen difícil mañana", 
                pattern: ["😰", "😟", "😨", "😬", "😰"],
                resolution: ["💪", "📚", "🧘", "😊", "✨"]
            },
            {
                situation: "Hiciste algo que te enorgullece", 
                pattern: ["😊", "😤", "😄", "🥳", "😁"],
                resolution: ["✨", "💪", "🌟", "🎉", "✨"]
            }
        ];
    }

    start(players) {
        this.players = players;
        this.round = 1;
        this.totalScore = 0;
        this.playerPatterns = {};
        this.generateNewPattern();
        this.phase = 'SHOW';
    }

    generateNewPattern() {
        const situation = this.situations[(this.round - 1) % this.situations.length];
        const patternLength = Math.min(3 + this.difficulty, 7);
        
        this.currentPattern = {
            situation: situation.situation,
            sequence: situation.pattern.slice(0, patternLength),
            resolution: situation.resolution.slice(0, patternLength)
        };

        this.timeLeft = 30 - (this.difficulty * 2);
    }

    getState() {
        return {
            name: this.name,
            description: this.description,
            currentPattern: this.currentPattern,
            round: this.round,
            maxRounds: this.maxRounds,
            timer: this.timeLeft,
            totalScore: this.totalScore,
            phase: this.phase,
            difficulty: this.difficulty,
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                score: p.score,
                isReady: !!this.playerPatterns[p.id]
            })),
            emojiCategories: this.emojiCategories
        };
    }

    handleAction(playerId, action, data) {
        switch (action) {
            case 'submit_pattern':
                return this.handleSubmitPattern(playerId, data);
            case 'skip_round':
                return this.handleSkipRound();
            default:
                return { error: 'Acción no reconocida' };
        }
    }

    handleSubmitPattern(playerId, { selectedEmojis }) {
        if (!this.playerPatterns[playerId]) {
            this.playerPatterns[playerId] = [];
        }

        this.playerPatterns[playerId] = selectedEmojis;

        // Check if pattern matches
        const isCorrect = this.checkPatternMatch(selectedEmojis, this.currentPattern.resolution);

        let score = 0;
        if (isCorrect) {
            score = 20 + (this.timeLeft * 2);
            this.totalScore += score;

            const player = this.players.find(p => p.id === playerId);
            if (player) {
                player.score += score;
            }
        }

        return {
            success: true,
            isCorrect,
            score,
            correctPattern: this.currentPattern.resolution,
            submittedPattern: selectedEmojis,
            allSubmitted: Object.keys(this.playerPatterns).length === this.players.length
        };
    }

    checkPatternMatch(submitted, correct) {
        if (submitted.length !== correct.length) return false;
        
        let matches = 0;
        for (let i = 0; i < submitted.length; i++) {
            if (submitted[i] === correct[i]) {
                matches++;
            }
        }

        return matches >= correct.length * 0.6; // 60% match threshold
    }

    handleSkipRound() {
        if (this.round < this.maxRounds) {
            this.round++;
            this.difficulty = Math.ceil(this.round / 2);
            this.generateNewPattern();
            this.playerPatterns = {};
            this.phase = 'SHOW';
        } else {
            this.phase = 'FINISHED';
        }

        return {
            success: true,
            round: this.round,
            phase: this.phase
        };
    }
}

module.exports = JugandoEmojis;
