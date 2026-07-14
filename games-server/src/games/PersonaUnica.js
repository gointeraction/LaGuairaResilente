// ============================================
// JUEGO 3: SOY UNA PERSONA ÚNICA
// ============================================
// Sandbox Creativo y Muro de Autoafirmación
// Habilidad: Autoconocimiento y fortalezas
// Edad: 6-12 años

class PersonaUnica {
    constructor() {
        this.name = "Soy una Persona Única";
        this.description = "Descubre tus fortalezas y recibe reconocimiento de tus amigos";
        this.players = [];
        this.creatorId = null;
        this.emblem = null;
        this.badges = [];
        this.strengths = [
            { id: 's1', name: 'Amable', emoji: '💝', description: 'Siempre ayudo a los demás' },
            { id: 's2', name: 'Valiente', emoji: '💪', description: 'Enfrento mis miedos' },
            { id: 's3', name: 'Creativo', emoji: '🎨', description: 'Tengo muchas ideas nuevas' },
            { id: 's4', name: 'Trabajador', emoji: '🔨', description: 'Nunca me rindo fácilmente' },
            { id: 's5', name: 'Amigable', emoji: '🤝', description: 'Hago amigos fácilmente' },
            { id: 's6', name: 'Honesto', emoji: '⭐', description: 'Siempre digo la verdad' },
            { id: 's7', name: 'Paciente', emoji: '⏳', description: 'Espero mi turno sin quejarme' },
            { id: 's8', name: 'Generoso', emoji: '🎁', description: 'Comparto lo que tengo' },
            { id: 's9', name: 'Curioso', emoji: '🔍', description: 'Me encanta aprender cosas nuevas' },
            { id: 's10', name: 'Alegre', emoji: '😊', description: 'Siempre sonrío y hago reír a otros' },
            { id: 's11', name: 'Responsable', emoji: '📋', description: 'Cumplo con mis deberes' },
            { id: 's12', name: 'Resiliente', emoji: '🌱', description: 'Me recupero rápido de las dificultades' }
        ];
        this.phase = 'CREATING'; // CREATING, MIRRORING, REVEAL
        this.safeDictionary = [
            'amable', 'valiente', 'creativo', 'trabajador', 'amigable', 'honesto',
            'paciente', 'generoso', 'curioso', 'alegre', 'responsable', 'resiliente',
            'fuerte', 'inteligente', 'bondadoso', 'solidario', 'comprensivo', 'leal',
            'gracioso', 'artista', 'líder', 'puntual', 'ordenado', 'tranquilo'
        ];
    }

    start(players) {
        this.players = players;
        this.creatorId = players[0]?.id;
        this.phase = 'CREATING';
        this.emblem = null;
        this.badges = [];
    }

    getState() {
        return {
            name: this.name,
            description: this.description,
            creator: this.players.find(p => p.id === this.creatorId),
            emblem: this.emblem,
            badges: this.badges,
            availableStrengths: this.strengths,
            phase: this.phase,
            players: this.players.map(p => ({
                id: p.id,
                name: p.name,
                isCreator: p.id === this.creatorId
            }))
        };
    }

    handleAction(playerId, action, data) {
        switch (action) {
            case 'create_emblem':
                return this.handleCreateEmblem(playerId, data);
            case 'send_badge':
                return this.handleSendBadge(playerId, data);
            case 'next_creator':
                return this.handleNextCreator();
            default:
                return { error: 'Acción no reconocida' };
        }
    }

    handleCreateEmblem(playerId, { selectedStrengths, motto }) {
        if (playerId !== this.creatorId) {
            return { error: 'Solo el creador puede diseñar el emblema' };
        }

        // Validate selected strengths
        const validStrengths = this.strengths.filter(s => 
            selectedStrengths.includes(s.id)
        );

        if (validStrengths.length < 1 || validStrengths.length > 3) {
            return { error: 'Selecciona entre 1 y 3 fortalezas' };
        }

        // Sanitize motto
        const sanitizedMotto = this.sanitizeText(motto);

        this.emblem = {
            creatorId: this.creatorId,
            creatorName: this.players.find(p => p.id === this.creatorId)?.name,
            strengths: validStrengths,
            motto: sanitizedMotto,
            createdAt: Date.now()
        };

        this.phase = 'MIRRORING';

        return {
            success: true,
            emblem: this.emblem
        };
    }

    handleSendBadge(playerId, { toPlayerId, strengthId, message }) {
        if (playerId === toPlayerId) {
            return { error: 'No puedes enviarte un badge a ti mismo' };
        }

        const sender = this.players.find(p => p.id === playerId);
        const receiver = this.players.find(p => p.id === toPlayerId);
        const strength = this.strengths.find(s => s.id === strengthId);

        if (!sender || !receiver || !strength) {
            return { error: 'Datos inválidos' };
        }

        // Sanitize message
        const sanitizedMessage = this.sanitizeText(message);

        const badge = {
            id: `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            from: {
                id: sender.id,
                name: sender.name
            },
            to: {
                id: receiver.id,
                name: receiver.name
            },
            strength,
            message: sanitizedMessage,
            createdAt: Date.now()
        };

        this.badges.push(badge);

        return {
            success: true,
            badge,
            message: `${sender.name} reconoció a ${receiver.name} por ser ${strength.name}`
        };
    }

    handleNextCreator() {
        const currentIndex = this.players.findIndex(p => p.id === this.creatorId);
        const nextIndex = (currentIndex + 1) % this.players.length;
        this.creatorId = this.players[nextIndex]?.id;
        this.phase = 'CREATING';
        this.emblem = null;

        return {
            success: true,
            newCreator: this.players.find(p => p.id === this.creatorId),
            phase: this.phase
        };
    }

    sanitizeText(text) {
        if (!text) return '';
        
        const words = text.toLowerCase().split(/\s+/);
        const sanitized = words.filter(word => {
            return this.safeDictionary.some(safe => 
                word.includes(safe) || safe.includes(word)
            ) || word.length <= 3;
        });

        return sanitized.join(' ').substring(0, 100);
    }
}

module.exports = PersonaUnica;
