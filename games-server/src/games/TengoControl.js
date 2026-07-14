// ============================================
// JUEGO 8: YO TENGO EL CONTROL
// ============================================
// Simulador de Escenarios Críticos / "Elige tu propia aventura"
// Habilidad: Toma de decisiones resiliente
// Edad: 7-12 años

class TengoControl {
    constructor() {
        this.name = "Yo Tengo el Control";
        this.description = "Toma decisiones importantes en situaciones difíciles";
        this.players = [];
        this.votes = {};
        this.currentScenarioIndex = 0;
        this.totalScore = 0;
        this.phase = 'STORY'; // STORY, CHOOSING, VOTING, RESULT
        this.storyPath = [];
        this.decisionHistory = [];
        this.votingTimer = null;
        this.votingTimeLeft = 30;

        this.scenarios = [
            {
                id: 1,
                title: "El Cyberbullying",
                description: "Tu amigo Teo está siendo molestado en las redes sociales por otros compañeros. Teo está muy triste y no sabe qué hacer.",
                character: { name: "Teo", emoji: "😢" },
                choices: [
                    {
                        id: 'c1',
                        text: "Hablar con un adulto de confianza (profesor o padre)",
                        consequence: "El adulto intervino y ayudó a resolver la situación. Teo se siente apoyado.",
                        points: 30,
                        isResilient: true
                    },
                    {
                        id: 'c2',
                        text: "Responder defendiendo a Teo en las redes",
                        consequence: "Tu defensa ayudó, pero también generó más conflicto. Aprendiste que a veces es mejor buscar ayuda.",
                        points: 15,
                        isResilient: false
                    },
                    {
                        id: 'c3',
                        text: "Ignorar la situación",
                        consequence: "La situación empeoró. Teo se sintió más solo y abandonado.",
                        points: 5,
                        isResilient: false
                    },
                    {
                        id: 'c4',
                        text: "Hablar directamente con Teo y ofrecerle apoyo",
                        consequence: "Teo se siente mejor sabiendo que tiene un amigo. Juntos decidieron buscar ayuda adulta.",
                        points: 25,
                        isResilient: true
                    }
                ],
                outcome: {
                    positive: "Al buscar ayuda y apoyar a tu amigo, la situación se resolvió y Teo recuperó su confianza.",
                    negative: "Las decisiones tomadas no fueron las mejores, pero aprendiste para futuras situaciones."
                }
            },
            {
                id: 2,
                title: "La Exclusión del Grupo",
                description: "En el recreo, un grupo de niños no quiere que una nueva compañera se una a su juego. Ella está mirando triste desde lejos.",
                character: { name: "Lucía", emoji: "😞" },
                choices: [
                    {
                        id: 'c1',
                        text: "Invitar a Lucía a jugar con tu grupo",
                        consequence: "Lucía se siente bienvenida y todos se divierten juntos. Hiciste una nueva amiga.",
                        points: 30,
                        isResilient: true
                    },
                    {
                        id: 'c2',
                        text: "Hablar con los niños para incluirla",
                        consequence: "Al principio se resistieron, pero con tu ayuda entendieron que todos merecen ser incluidos.",
                        points: 25,
                        isResilient: true
                    },
                    {
                        id: 'c3',
                        text: "Unirte al grupo que excluye",
                        consequence: "Te sentiste parte del grupo, pero Lucía se sintió más sola. No fue una buena decisión.",
                        points: 5,
                        isResilient: false
                    },
                    {
                        id: 'c4',
                        text: "Ignorar la situación",
                        consequence: "Lucía se fue a casa sintiéndose triste. Podrías haber hecho la diferencia.",
                        points: 5,
                        isResilient: false
                    }
                ],
                outcome: {
                    positive: "Tu actitud inclusiva creó un ambiente mejor para todos en la escuela.",
                    negative: "A veces es difícil actuar, pero cada decisión importa."
                }
            },
            {
                id: 3,
                title: "El Error Inesperado",
                description: "Estás en una competencia importante y cometes un error que hace que tu equipo pierda puntos. Tus compañeros están frustrados.",
                character: { name: "Tu Equipo", emoji: "😤" },
                choices: [
                    {
                        id: 'c1',
                        text: "Pedir disculpas y proponer una nueva estrategia",
                        consequence: "Tu equipo entendió y trabajaron juntos para recuperar los puntos. El error los hizo más fuertes.",
                        points: 30,
                        isResilient: true
                    },
                    {
                        id: 'c2',
                        text: "Culparte y retirarte del equipo",
                        consequence: "Tu equipo te extrañó y no pudieron recuperarse. A veces los errores nos paralizan.",
                        points: 5,
                        isResilient: false
                    },
                    {
                        id: 'c3',
                        text: "Culpar a otros compañeros",
                        consequence: "El equipo se dividió y no pudieron trabajar juntos. La responsabilidad es individual.",
                        points: 5,
                        isResilient: false
                    },
                    {
                        id: 'c4',
                        text: "Aprender del error y motivar al equipo",
                        consequence: "El equipo se inspiró y logró superar el obstáculo juntos. Los errores son oportunidades.",
                        points: 25,
                        isResilient: true
                    }
                ],
                outcome: {
                    positive: "Transformaron el error en motivación y lograron su objetivo.",
                    negative: "Los errores duelan, pero siempre hay oportunidad de mejorar."
                }
            }
        ];
    }

    start(players) {
        this.players = players;
        this.currentScenarioIndex = 0;
        this.totalScore = 0;
        this.votes = {};
        this.decisionHistory = [];
        this.phase = 'STORY';
    }

    getState() {
        const scenario = this.scenarios[this.currentScenarioIndex];
        return {
            name: this.name,
            description: this.description,
            currentScenario: scenario,
            scenarioIndex: this.currentScenarioIndex,
            totalScenarios: this.scenarios.length,
            phase: this.phase,
            votingTimeLeft: this.votingTimeLeft,
            currentVotes: this.votes,
            totalScore: this.totalScore,
            decisionHistory: this.decisionHistory,
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                hasVoted: !!this.votes[p.id]
            }))
        };
    }

    handleAction(playerId, action, data) {
        switch (action) {
            case 'vote':
                return this.handleVote(playerId, data);
            case 'next_story':
                return this.handleNextStory();
            default:
                return { error: 'Acción no reconocida' };
        }
    }

    handleVote(playerId, { choiceId }) {
        const scenario = this.scenarios[this.currentScenarioIndex];
        if (!scenario) return { error: 'Escenario no encontrado' };

        // Check if player already voted
        if (this.votes[playerId]) {
            return { error: 'Ya has votado' };
        }

        const choice = scenario.choices.find(c => c.id === choiceId);
        if (!choice) return { error: 'Opción no encontrada' };

        this.votes[playerId] = {
            choiceId,
            choice,
            timestamp: Date.now()
        };

        // Check if all players have voted
        const allVoted = this.players.every(p => !!this.votes[p.id]);

        return {
            success: true,
            voteCount: Object.keys(this.votes).length,
            totalPlayers: this.players.length,
            allVoted,
            currentVotes: this.getVoteResults()
        };
    }

    getVoteResults() {
        const results = {};
        Object.values(this.votes).forEach(vote => {
            if (!results[vote.choiceId]) {
                results[vote.choiceId] = {
                    choice: vote.choice,
                    count: 0,
                    voters: []
                };
            }
            results[vote.choiceId].count++;
        });

        return results;
    }

    handleNextStory() {
        // Calculate results of current scenario
        const results = this.getVoteResults();
        const winnerId = Object.entries(results)
            .sort(([, a], [, b]) => b.count - a.count)[0]?.[0];

        const scenario = this.scenarios[this.currentScenarioIndex];
        const winnerChoice = scenario.choices.find(c => c.id === winnerId);

        // Add points based on winner
        if (winnerChoice) {
            this.totalScore += winnerChoice.points;
            this.players.forEach(p => {
                p.score += winnerChoice.points;
            });
        }

        // Record decision
        this.decisionHistory.push({
            scenario: scenario.title,
            chosen: winnerChoice?.text || 'Sin decisión',
            isResilient: winnerChoice?.isResilient || false,
            points: winnerChoice?.points || 0
        });

        // Move to next scenario or end
        if (this.currentScenarioIndex < this.scenarios.length - 1) {
            this.currentScenarioIndex++;
            this.votes = {};
            this.phase = 'STORY';
        } else {
            this.phase = 'FINISHED';
        }

        return {
            success: true,
            results,
            winner: winnerChoice,
            scenarioOutcome: winnerChoice?.isResilient ? scenario.outcome.positive : scenario.outcome.negative,
            phase: this.phase,
            totalScore: this.totalScore
        };
    }
}

module.exports = TengoControl;
