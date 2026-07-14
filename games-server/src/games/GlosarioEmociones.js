// ============================================
// JUEGO 1: EL GLOSARIO DE LAS EMOCIONES
// ============================================
// Aventura Gráfica / Novela Visual Cooperativa
// Habilidad: Vocabulario emocional
// Edad: 6-12 años

const glosarioData = require('../data/glosarioData');

class GlosarioEmociones {
    constructor() {
        this.name = "El Glosario de las Emociones";
        this.description = "Explora escenarios y descubre palabras para expresar emociones";
        this.currentScenarioIndex = 0;
        this.discoveredWords = [];
        this.emotionalIndex = 0;
        this.totalScore = 0;
        this.players = [];
        this.phase = 'INTRO'; // INTRO, DIALOGUE, SELECTION, RESULT
        this.votes = {};
        this.timer = null;
    }

    start(players) {
        this.players = players;
        this.currentScenarioIndex = 0;
        this.discoveredWords = [];
        this.emotionalIndex = 0;
        this.phase = 'DIALOGUE';
    }

    getState() {
        const scenario = glosarioData.scenarios[this.currentScenarioIndex];
        return {
            name: this.name,
            description: this.description,
            currentScenario: scenario,
            scenarioIndex: this.currentScenarioIndex,
            totalScenarios: glosarioData.scenarios.length,
            discoveredWords: this.discoveredWords,
            emotionalIndex: this.emotionalIndex,
            phase: this.phase,
            vocabularySize: glosarioData.vocabulary.length
        };
    }

    handleAction(playerId, action, data) {
        switch (action) {
            case 'select_word':
                return this.handleWordSelection(playerId, data);
            case 'next_dialogue':
                return this.handleNextDialogue();
            case 'vote_word':
                return this.handleVote(playerId, data);
            default:
                return { error: 'Acción no reconocida' };
        }
    }

    handleWordSelection(playerId, { wordId }) {
        const scenario = glosarioData.scenarios[this.currentScenarioIndex];
        const selectedWord = scenario.options.find(o => o.id === wordId);

        if (!selectedWord) {
            return { error: 'Palabra no encontrada' };
        }

        if (!this.discoveredWords.includes(selectedWord.word)) {
            this.discoveredWords.push(selectedWord.word);
        }

        if (selectedWord.correct) {
            this.emotionalIndex += 10;
            this.totalScore += 25;

            const player = this.players.find(p => p.id === playerId);
            if (player) {
                player.score += 25;
            }

            return {
                success: true,
                correct: true,
                word: selectedWord.word,
                emoji: selectedWord.emoji,
                definition: glosarioData.vocabulary.find(v => v.word === selectedWord.word)?.definition,
                emotionalIndex: this.emotionalIndex,
                score: this.totalScore
            };
        } else {
            this.emotionalIndex = Math.max(0, this.emotionalIndex - 5);

            return {
                success: true,
                correct: false,
                word: selectedWord.word,
                emoji: selectedWord.emoji,
                message: "¡No es una emoción correcta! Intenta con otra palabra.",
                emotionalIndex: this.emotionalIndex
            };
        }
    }

    handleNextDialogue() {
        if (this.phase === 'DIALOGUE') {
            this.phase = 'SELECTION';
        } else if (this.currentScenarioIndex < glosarioData.scenarios.length - 1) {
            this.currentScenarioIndex++;
            this.phase = 'DIALOGUE';
        }

        return {
            success: true,
            phase: this.phase,
            scenarioIndex: this.currentScenarioIndex
        };
    }

    handleVote(playerId, { wordId }) {
        if (!this.votes[wordId]) {
            this.votes[wordId] = [];
        }

        if (!this.votes[wordId].includes(playerId)) {
            this.votes[wordId].push(playerId);
        }

        return {
            success: true,
            voteCount: this.votes[wordId].length,
            totalVotes: Object.values(this.votes).reduce((a, b) => a + b.length, 0)
        };
    }

    getDiscoveredWords() {
        return glosarioData.vocabulary.filter(v => 
            this.discoveredWords.includes(v.word)
        );
    }
}

module.exports = GlosarioEmociones;
