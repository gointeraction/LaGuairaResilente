// ============================================
// JUEGO 7: ROMPECABEZAS CON FRASES
// ============================================
// Lienzo Colaborativo Multitáctil
// Habilidad: Pensamiento positivo grupal
// Edad: 6-12 años

class RompecabezasFrases {
    constructor() {
        this.name = "Rompecabezas con Frases";
        this.description = "Forma frases motivacionales arrastrando palabras";
        this.players = [];
        this.words = [];
        this.lockedPieces = {};
        this.placedWords = {};
        this.totalScore = 0;
        this.phase = 'PLAYING'; // PLAYING, RESULT
        this.currentPhraseIndex = 0;

        this.phrases = [
            { text: "El fracaso es oportunidad de aprender", category: "crecimiento" },
            { text: "Cada día es una nueva oportunidad", category: "esperanza" },
            { text: "Juntos somos más fuertes", category: "colaboración" },
            { text: "Los errores me hacen crecer", category: "resiliencia" },
            { text: "Confío en mis habilidades", category: "autoconfianza" },
            { text: "La paciencia es la madre del éxito", category: "perseverancia" },
            { text: "Soy capaz de superar cualquier obstáculo", category: "fortaleza" },
            { text: "Mi esfuerzo siempre tiene recompensa", category: "motivación" }
        ];

        this.solutionArea = {
            x: 50,
            y: 400,
            width: 700,
            height: 100
        };
    }

    start(players) {
        this.players = players;
        this.currentPhraseIndex = 0;
        this.totalScore = 0;
        this.generatePhrase();
        this.phase = 'PLAYING';
    }

    generatePhrase() {
        const phrase = this.phrases[this.currentPhraseIndex % this.phrases.length];
        const words = phrase.text.split(' ');

        this.words = words.map((word, index) => ({
            id: `word-${index}`,
            text: word,
            originalIndex: index,
            x: 50 + Math.random() * 600,
            y: 100 + Math.random() * 200,
            isLocked: false,
            lockedBy: null,
            isPlaced: false,
            placedPosition: null
        }));

        this.placedWords = {};
        this.lockedPieces = {};
    }

    getState() {
        return {
            name: this.name,
            description: this.description,
            words: this.words,
            phrase: this.phrases[this.currentPhraseIndex % this.phrases.length],
            phraseIndex: this.currentPhraseIndex,
            totalPhrases: this.phrases.length,
            placedWords: Object.keys(this.placedWords).length,
            totalWords: this.words.length,
            solutionArea: this.solutionArea,
            phase: this.phase,
            totalScore: this.totalScore,
            players: this.players.map(p => ({
                id: p.id,
                name: p.name
            }))
        };
    }

    handleAction(playerId, action, data) {
        switch (action) {
            case 'lock_piece':
                return this.handleLockPiece(playerId, data);
            case 'move_piece':
                return this.handleMovePiece(playerId, data);
            case 'release_piece':
                return this.handleReleasePiece(playerId, data);
            case 'check_solution':
                return this.handleCheckSolution();
            default:
                return { error: 'Acción no reconocida' };
        }
    }

    handleLockPiece(playerId, { wordId }) {
        const word = this.words.find(w => w.id === wordId);
        if (!word) return { error: 'Palabra no encontrada' };

        // Check if piece is already locked by someone else
        if (word.isLocked && word.lockedBy !== playerId) {
            return { error: 'La pieza está bloqueada por otro jugador' };
        }

        word.isLocked = true;
        word.lockedBy = playerId;
        this.lockedPieces[wordId] = playerId;

        return {
            success: true,
            wordId,
            lockedBy: playerId
        };
    }

    handleMovePiece(playerId, { wordId, x, y }) {
        const word = this.words.find(w => w.id === wordId);
        if (!word) return { error: 'Palabra no encontrada' };

        if (word.lockedBy !== playerId) {
            return { error: 'No tienes control de esta pieza' };
        }

        // Validate position is within bounds
        if (x < 0 || x > 750 || y < 0 || y > 500) {
            return { error: 'Posición fuera de límites' };
        }

        word.x = x;
        word.y = y;

        return {
            success: true,
            wordId,
            x,
            y
        };
    }

    handleReleasePiece(playerId, { wordId }) {
        const word = this.words.find(w => w.id === wordId);
        if (!word) return { error: 'Palabra no encontrada' };

        if (word.lockedBy !== playerId) {
            return { error: 'No tienes control de esta pieza' };
        }

        word.isLocked = false;
        word.lockedBy = null;
        delete this.lockedPieces[wordId];

        // Check if word is in solution area
        if (word.y >= this.solutionArea.y && 
            word.y <= this.solutionArea.y + this.solutionArea.height) {
            word.isPlaced = true;
            word.placedPosition = { x: word.x, y: word.y };
            this.placedWords[wordId] = word;
        }

        return {
            success: true,
            wordId,
            isPlaced: word.isPlaced
        };
    }

    handleCheckSolution() {
        const phrase = this.phrases[this.currentPhraseIndex % this.phrases.length];
        const correctWords = phrase.text.split(' ');
        
        const placedWords = Object.values(this.placedWords).sort((a, b) => a.x - b.x);
        const playerAnswer = placedWords.map(w => w.text).join(' ');

        const isCorrect = playerAnswer.toLowerCase() === phrase.text.toLowerCase();

        if (isCorrect) {
            this.totalScore += 50;
            this.players.forEach(p => {
                p.score += 25;
            });
        }

        return {
            success: true,
            isCorrect,
            playerAnswer,
            correctAnswer: phrase.text,
            score: this.totalScore
        };
    }
}

module.exports = RompecabezasFrases;
