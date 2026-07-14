// ============================================
// JUEGO 6: EL ANTIFAZ DE LOS SUPERHÉROES
// ============================================
// Creador de Avatares RPG con Árbol de Habilidades
// Habilidad: Autoeficacia y confianza
// Edad: 4-9 años

class AntifazSuperheroes {
    constructor() {
        this.name = "El Antifaz de los Superhéroes";
        this.description = "Crea tu alter-ego resiliente con poderes especiales";
        this.players = [];
        this.avatars = {};
        this.phase = 'CREATING'; // CREATING, BATTLE, RESULT

        this.accessories = {
            masks: [
                { id: 'm1', name: 'Máscara de la Paciencia', emoji: '🎭', defense: 5, cost: 10 },
                { id: 'm2', name: 'Antifaz de la Valentía', emoji: '🦸', defense: 8, cost: 15 },
                { id: 'm3', name: 'Visor de la Concentración', emoji: '🥽', defense: 6, cost: 12 }
            ],
            shields: [
                { id: 's1', name: 'Escudo de la Amabilidad', emoji: '🛡️', defense: 7, cost: 12 },
                { id: 's2', name: 'Barrera de la Fortaleza', emoji: '💪', defense: 10, cost: 18 },
                { id: 's3', name: 'Capa de la Empatía', emoji: '🧣', defense: 6, cost: 10 }
            ],
            boots: [
                { id: 'b1', name: 'Botas de la Perseverancia', emoji: '👟', speed: 5, cost: 10 },
                { id: 'b2', name: 'Alas de la Resiliencia', emoji: '🦽', speed: 8, cost: 15 },
                { id: 'b3', name: 'Zapatillas de la Alegría', emoji: '🥿', speed: 6, cost: 12 }
            ],
            weapons: [
                { id: 'w1', name: 'Espada de la Honestidad', emoji: '⚔️', attack: 7, cost: 12 },
                { id: 'w2', name: 'Bastón de la Sabiduría', emoji: '🪄', attack: 6, cost: 10 },
                { id: 'w3', name: 'Arco del Optimismo', emoji: '🏹', attack: 8, cost: 15 }
            ]
        };

        this.obstacles = [
            { name: 'Frustración', emoji: '😤', hp: 20, weakness: 'paciencia' },
            { name: 'Error Inesperado', emoji: '❌', hp: 25, weakness: 'perseverancia' },
            { name: 'Crítica Negativa', emoji: '😠', hp: 15, weakness: 'fortaleza' },
            { name: 'Miedo al Fracaso', emoji: '😨', hp: 25, weakness: 'valentía' },
            { name: 'Soledad', emoji: '😔', hp: 20, weakness: 'empatía' }
        ];
    }

    start(players) {
        this.players = players;
        this.avatars = {};
        this.phase = 'CREATING';
        
        // Initialize effort points for each player
        players.forEach(p => {
            this.avatars[p.id] = {
                name: p.name,
                effortPoints: 30,
                equipped: {
                    mask: null,
                    shield: null,
                    boots: null,
                    weapon: null
                },
                stats: {
                    defense: 0,
                    speed: 0,
                    attack: 0,
                    hp: 100
                }
            };
        });
    }

    getState() {
        return {
            name: this.name,
            description: this.description,
            accessories: this.accessories,
            avatars: this.avatars,
            phase: this.phase,
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                avatar: this.avatars[p.id]
            }))
        };
    }

    handleAction(playerId, action, data) {
        switch (action) {
            case 'equip_item':
                return this.handleEquipItem(playerId, data);
            case 'unequip_item':
                return this.handleUnequipItem(playerId, data);
            case 'start_battle':
                return this.handleStartBattle();
            case 'battle_action':
                return this.handleBattleAction(playerId, data);
            default:
                return { error: 'Acción no reconocida' };
        }
    }

    handleEquipItem(playerId, { category, itemId }) {
        const avatar = this.avatars[playerId];
        if (!avatar) return { error: 'Avatar no encontrado' };

        const items = this.accessories[category];
        const item = items.find(i => i.id === itemId);
        if (!item) return { error: 'Item no encontrado' };

        // Check if player has enough points
        if (avatar.effortPoints < item.cost) {
            return { error: 'Puntos de esfuerzo insuficientes' };
        }

        // Unequip current item if any
        if (avatar.equipped[category]) {
            const currentItem = items.find(i => i.id === avatar.equipped[category]);
            if (currentItem) {
                avatar.effortPoints += currentItem.cost;
                this.removeStats(avatar, currentItem);
            }
        }

        // Equip new item
        avatar.equipped[category] = itemId;
        avatar.effortPoints -= item.cost;
        this.addStats(avatar, item);

        return {
            success: true,
            avatar,
            equipped: item,
            remainingPoints: avatar.effortPoints
        };
    }

    handleUnequipItem(playerId, { category }) {
        const avatar = this.avatars[playerId];
        if (!avatar) return { error: 'Avatar no encontrado' };

        const itemId = avatar.equipped[category];
        if (!itemId) return { error: 'No hay item equipado' };

        const items = this.accessories[category];
        const item = items.find(i => i.id === itemId);
        if (item) {
            avatar.effortPoints += item.cost;
            this.removeStats(avatar, item);
        }

        avatar.equipped[category] = null;

        return {
            success: true,
            avatar,
            unequipped: item
        };
    }

    addStats(avatar, item) {
        if (item.defense) avatar.stats.defense += item.defense;
        if (item.speed) avatar.stats.speed += item.speed;
        if (item.attack) avatar.stats.attack += item.attack;
    }

    removeStats(avatar, item) {
        if (item.defense) avatar.stats.defense -= item.defense;
        if (item.speed) avatar.stats.speed -= item.speed;
        if (item.attack) avatar.stats.attack -= item.attack;
    }

    handleStartBattle() {
        this.phase = 'BATTLE';
        const obstacle = this.obstacles[Math.floor(Math.random() * this.obstacles.length)];
        
        return {
            success: true,
            phase: this.phase,
            obstacle,
            avatars: this.avatars
        };
    }

    handleBattleAction(playerId, { action }) {
        const avatar = this.avatars[playerId];
        if (!avatar) return { error: 'Avatar no encontrado' };

        let damage = 0;
        let message = '';

        switch (action) {
            case 'attack':
                damage = avatar.stats.attack + Math.floor(Math.random() * 5);
                message = `${avatar.name} ataca con fuerza ${damage}!`;
                break;
            case 'defend':
                damage = avatar.stats.defense + Math.floor(Math.random() * 3);
                message = `${avatar.name} se defiende con resistencia ${damage}!`;
                break;
            case 'special':
                damage = (avatar.stats.attack + avatar.stats.speed) / 2 + Math.floor(Math.random() * 8);
                message = `${avatar.name} usa su poder especial con fuerza ${Math.floor(damage)}!`;
                break;
            default:
                return { error: 'Acción no válida' };
        }

        return {
            success: true,
            damage: Math.floor(damage),
            message,
            avatar: {
                name: avatar.name,
                stats: avatar.stats
            }
        };
    }
}

module.exports = AntifazSuperheroes;
