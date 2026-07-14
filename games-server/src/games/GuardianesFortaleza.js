// ============================================
// JUEGO 9: GUARDIANES DE LA FORTALEZA
// ============================================
// Tower Defense Emocional / Estrategia Cooperativa
// Habilidad: Resiliencia ante obstáculos
// Edad: 4-12 años

class GuardianesFortaleza {
    constructor() {
        this.name = "Guardianes de la Fortaleza";
        this.description = "Defiende la fortaleza contra obstáculos emocionales";
        this.players = [];
        this.fortress = null;
        this.defenses = [];
        this.obstacles = [];
        this.resources = 0;
        this.wave = 0;
        this.maxWaves = 5;
        this.totalScore = 0;
        this.phase = 'BUILDING'; // BUILDING, WAVE, RESULT
        this.gameLoop = null;
        this.waveTimer = null;

        this.defenseTypes = [
            { 
                id: 'd1', 
                name: 'Fuente de Empatía', 
                emoji: '💗', 
                cost: 20, 
                power: 15,
                effect: 'heal',
                description: 'Cura 15 HP de la fortaleza cada 5 segundos'
            },
            { 
                id: 'd2', 
                name: 'Torre de Comunicación Asertiva', 
                emoji: '🗣️', 
                cost: 30, 
                power: 25,
                effect: 'attack',
                description: 'Ataca a los obstáculos con fuerza 25'
            },
            { 
                id: 'd3', 
                name: 'Zona de Descanso Mental', 
                emoji: '🧘', 
                cost: 25, 
                power: 10,
                effect: 'slow',
                description: 'Reduce la velocidad de los obstáculos'
            },
            { 
                id: 'd4', 
                name: 'Escudo de Positividad', 
                emoji: '🛡️', 
                cost: 35, 
                power: 30,
                effect: 'shield',
                description: 'Protege contra el siguiente ataque'
            },
            { 
                id: 'd5', 
                name: 'Torre de Creatividad', 
                emoji: '🎨', 
                cost: 40, 
                power: 35,
                effect: 'ultimate',
                description: 'Ataque poderoso que daña a todos los obstáculos'
            }
        ];

        this.obstacleTypes = [
            { name: 'Frustración', emoji: '😤', hp: 30, damage: 10, speed: 1 },
            { name: 'Error Inesperado', emoji: '❌', hp: 25, damage: 15, speed: 1.2 },
            { name: 'Crítica Negativa', emoji: '😠', hp: 20, damage: 20, speed: 0.8 },
            { name: 'Miedo al Fracaso', emoji: '😨', hp: 35, damage: 8, speed: 0.6 },
            { name: 'Soledad', emoji: '😔', hp: 25, damage: 12, speed: 1 },
            { name: 'Ansiedad', emoji: '😰', hp: 30, damage: 14, speed: 1.1 }
        ];

        this.paths = [
            { x: 0, y: 300 },
            { x: 150, y: 300 },
            { x: 150, y: 150 },
            { x: 400, y: 150 },
            { x: 400, y: 350 },
            { x: 600, y: 350 },
            { x: 600, y: 200 },
            { x: 750, y: 200 }
        ];
    }

    start(players) {
        this.players = players;
        this.fortress = {
            hp: 100,
            maxHp: 100,
            x: 750,
            y: 200
        };
        this.defenses = [];
        this.obstacles = [];
        this.resources = 50;
        this.wave = 0;
        this.totalScore = 0;
        this.phase = 'BUILDING';
    }

    getState() {
        return {
            name: this.name,
            description: this.description,
            fortress: this.fortress,
            defenses: this.defenses,
            obstacles: this.obstacles.map(o => ({
                id: o.id,
                type: o.type,
                hp: o.hp,
                x: o.x,
                y: o.y,
                progress: o.progress
            })),
            resources: this.resources,
            wave: this.wave,
            maxWaves: this.maxWaves,
            defenseTypes: this.defenseTypes,
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
            case 'build_defense':
                return this.handleBuildDefense(playerId, data);
            case 'start_wave':
                return this.handleStartWave();
            case 'use_ability':
                return this.handleUseAbility(playerId, data);
            case 'upgrade_defense':
                return this.handleUpgradeDefense(playerId, data);
            default:
                return { error: 'Acción no reconocida' };
        }
    }

    handleBuildDefense(playerId, { defenseTypeId, x, y }) {
        const defenseType = this.defenseTypes.find(d => d.id === defenseTypeId);
        if (!defenseType) return { error: 'Tipo de defensa no encontrado' };

        if (this.resources < defenseType.cost) {
            return { error: 'Recursos insuficientes' };
        }

        // Check if position is valid (not on path)
        const isOnPath = this.paths.some(p => 
            Math.abs(p.x - x) < 50 && Math.abs(p.y - y) < 50
        );
        if (isOnPath) {
            return { error: 'No puedes construir en el camino' };
        }

        const defense = {
            id: `defense-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            type: defenseType,
            x,
            y,
            level: 1,
            cooldown: 0
        };

        this.defenses.push(defense);
        this.resources -= defenseType.cost;

        return {
            success: true,
            defense,
            remainingResources: this.resources
        };
    }

    handleStartWave() {
        if (this.wave >= this.maxWaves) {
            return { error: 'Todas las oleadas completadas' };
        }

        this.wave++;
        this.phase = 'WAVE';

        // Generate obstacles for this wave
        const numObstacles = 3 + (this.wave * 2);
        
        for (let i = 0; i < numObstacles; i++) {
            const obstacleType = this.obstacleTypes[
                Math.floor(Math.random() * this.obstacleTypes.length)
            ];

            const obstacle = {
                id: `obstacle-${Date.now()}-${i}`,
                type: { ...obstacleType },
                hp: obstacleType.hp + (this.wave * 5),
                maxHp: obstacleType.hp + (this.wave * 5),
                x: this.paths[0].x,
                y: this.paths[0].y,
                progress: 0,
                pathIndex: 0,
                speed: obstacleType.speed
            };

            this.obstacles.push(obstacle);
        }

        // Start game loop
        this.startGameLoop();

        return {
            success: true,
            wave: this.wave,
            numObstacles,
            phase: this.phase
        };
    }

    startGameLoop() {
        if (this.gameLoop) clearInterval(this.gameLoop);

        this.gameLoop = setInterval(() => {
            this.updateGame();
        }, 100); // 100ms tick
    }

    updateGame() {
        // Move obstacles
        this.obstacles.forEach(obstacle => {
            if (obstacle.pathIndex < this.paths.length - 1) {
                const target = this.paths[obstacle.pathIndex + 1];
                const dx = target.x - obstacle.x;
                const dy = target.y - obstacle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 5) {
                    obstacle.pathIndex++;
                } else {
                    obstacle.x += (dx / dist) * obstacle.speed * 2;
                    obstacle.y += (dy / dist) * obstacle.speed * 2;
                }
            }
        });

        // Defenses attack obstacles
        this.defenses.forEach(defense => {
            if (defense.cooldown > 0) {
                defense.cooldown--;
                return;
            }

            // Find nearest obstacle in range
            const nearestObstacle = this.obstacles
                .filter(o => o.hp > 0)
                .sort((a, b) => {
                    const distA = Math.sqrt(Math.pow(a.x - defense.x, 2) + Math.pow(a.y - defense.y, 2));
                    const distB = Math.sqrt(Math.pow(b.x - defense.x, 2) + Math.pow(b.y - defense.y, 2));
                    return distA - distB;
                })[0];

            if (nearestObstacle) {
                const dist = Math.sqrt(
                    Math.pow(nearestObstacle.x - defense.x, 2) + 
                    Math.pow(nearestObstacle.y - defense.y, 2)
                );

                if (dist < 150) {
                    nearestObstacle.hp -= defense.type.power;
                    defense.cooldown = 30; // 3 second cooldown
                }
            }
        });

        // Remove dead obstacles
        this.obstacles = this.obstacles.filter(o => o.hp > 0);

        // Check if obstacles reached fortress
        this.obstacles.forEach(obstacle => {
            if (obstacle.pathIndex >= this.paths.length - 1) {
                this.fortress.hp -= obstacle.type.damage;
                obstacle.hp = 0; // Remove obstacle
            }
        });

        this.obstacles = this.obstacles.filter(o => o.hp > 0);

        // Check win/lose conditions
        if (this.fortress.hp <= 0) {
            this.phase = 'LOST';
            this.endGame();
        } else if (this.obstacles.length === 0 && this.phase === 'WAVE') {
            this.phase = 'BUILDING';
            this.resources += 25 + (this.wave * 5);
            this.totalScore += this.wave * 50;

            if (this.wave >= this.maxWaves) {
                this.phase = 'WON';
                this.endGame();
            }
        }
    }

    handleUseAbility(playerId, { defenseId, ability }) {
        const defense = this.defenses.find(d => d.id === defenseId);
        if (!defense) return { error: 'Defensa no encontrada' };

        let result = {};

        switch (ability) {
            case 'heal':
                this.fortress.hp = Math.min(this.fortress.maxHp, this.fortress.hp + 15);
                result = { healed: 15, newHp: this.fortress.hp };
                break;
            case 'attack':
                this.obstacles.forEach(o => {
                    o.hp -= 25;
                });
                result = { damaged: this.obstacles.length };
                break;
            case 'slow':
                this.obstacles.forEach(o => {
                    o.speed *= 0.5;
                });
                result = { slowed: this.obstacles.length };
                break;
            case 'shield':
                // Next obstacle damage is reduced
                result = { shielded: true };
                break;
            case 'ultimate':
                this.obstacles.forEach(o => {
                    o.hp -= 35;
                });
                result = { ultimateDamage: 35 };
                break;
        }

        return {
            success: true,
            ability,
            result
        };
    }

    handleUpgradeDefense(playerId, { defenseId }) {
        const defense = this.defenses.find(d => d.id === defenseId);
        if (!defense) return { error: 'Defensa no encontrada' };

        const upgradeCost = defense.type.cost * 0.5 * defense.level;
        if (this.resources < upgradeCost) {
            return { error: 'Recursos insuficientes para mejorar' };
        }

        defense.level++;
        defense.type.power = Math.floor(defense.type.power * 1.3);
        this.resources -= upgradeCost;

        return {
            success: true,
            defense,
            remainingResources: this.resources
        };
    }

    endGame() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }

        // Distribute final scores
        this.players.forEach(p => {
            p.score += this.totalScore;
        });
    }
}

module.exports = GuardianesFortaleza;
