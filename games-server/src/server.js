const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Importar juegos
const GlosarioEmociones = require('./games/GlosarioEmociones');
const PalitosEmociones = require('./games/PalitosEmociones');
const PersonaUnica = require('./games/PersonaUnica');
const JugandoEmojis = require('./games/JugandoEmojis');
const ParejasEmociones = require('./games/ParejasEmociones');
const AntifazSuperheroes = require('./games/AntifazSuperheroes');
const RompecabezasFrases = require('./games/RompecabezasFrases');
const TengoControl = require('./games/TengoControl');
const GuardianesFortaleza = require('./games/GuardianesFortaleza');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// GAME SESSIONS MANAGER
// ============================================

class GameSessionManager {
    constructor() {
        this.sessions = new Map();
        this.playerToSession = new Map();
    }

    createSession(gameType, hostId, hostName) {
        const sessionId = uuidv4().substring(0, 8).toUpperCase();
        const gameClasses = {
            'glosario': GlosarioEmociones,
            'palitos': PalitosEmociones,
            'única': PersonaUnica,
            'emojis': JugandoEmojis,
            'parejas': ParejasEmociones,
            'antifaz': AntifazSuperheroes,
            'rompecabezas': RompecabezasFrases,
            'control': TengoControl,
            'guardianes': GuardianesFortaleza
        };

        const GameClass = gameClasses[gameType];
        if (!GameClass) return null;

        const session = {
            id: sessionId,
            gameType,
            host: hostId,
            players: [{
                id: hostId,
                name: hostName,
                score: 0,
                isHost: true
            }],
            gameState: 'WAITING',
            gameInstance: new GameClass(),
            createdAt: Date.now(),
            maxPlayers: 8
        };

        this.sessions.set(sessionId, session);
        this.playerToSession.set(hostId, sessionId);

        return session;
    }

    joinSession(sessionId, playerId, playerName) {
        const session = this.sessions.get(sessionId);
        if (!session) return { error: 'Sala no encontrada' };
        if (session.players.length >= session.maxPlayers) return { error: 'Sala llena' };
        if (session.gameState !== 'WAITING') return { error: 'Juego ya iniciado' };

        const player = {
            id: playerId,
            name: playerName,
            score: 0,
            isHost: false
        };

        session.players.push(player);
        this.playerToSession.set(playerId, sessionId);

        return { session };
    }

    removePlayer(playerId) {
        const sessionId = this.playerToSession.get(playerId);
        if (!sessionId) return null;

        const session = this.sessions.get(sessionId);
        if (!session) return null;

        session.players = session.players.filter(p => p.id !== playerId);
        this.playerToSession.delete(playerId);

        if (session.players.length === 0) {
            this.sessions.delete(sessionId);
            return { sessionDeleted: true };
        }

        // If host left, assign new host
        if (session.host === playerId && session.players.length > 0) {
            session.host = session.players[0].id;
            session.players[0].isHost = true;
        }

        return { session };
    }

    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }

    getSessionByPlayer(playerId) {
        const sessionId = this.playerToSession.get(playerId);
        return sessionId ? this.sessions.get(sessionId) : null;
    }
}

const sessionManager = new GameSessionManager();

// ============================================
// API ROUTES
// ============================================

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', activeSessions: sessionManager.sessions.size });
});

app.get('/api/sessions/:id', (req, res) => {
    const session = sessionManager.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    
    const { gameInstance, ...sessionData } = session;
    res.json(sessionData);
});

// ============================================
// SOCKET.IO EVENTS
// ============================================

io.on('connection', (socket) => {
    console.log(`🔌 Usuario conectado: ${socket.id}`);

    // ==========================================
    // ROOM MANAGEMENT
    // ==========================================

    socket.on('create_room', ({ gameType, username }, callback) => {
        const session = sessionManager.createSession(gameType, socket.id, username);
        if (!session) {
            return callback({ error: 'Tipo de juego no válido' });
        }

        socket.join(session.id);
        callback({ sessionId: session.id, session: { ...session, gameInstance: undefined } });
        console.log(`🎮 Sala creada: ${session.id} por ${username} (${gameType})`);
    });

    socket.on('join_room', ({ sessionId, username }, callback) => {
        const result = sessionManager.joinSession(sessionId, socket.id, username);
        if (result.error) {
            return callback({ error: result.error });
        }

        socket.join(sessionId);
        const { gameInstance, ...sessionData } = result.session;
        
        io.to(sessionId).emit('room_updated', sessionData);
        callback({ session: sessionData });
        console.log(`👤 ${username} se unió a sala ${sessionId}`);
    });

    socket.on('leave_room', () => {
        const session = sessionManager.removePlayer(socket.id);
        if (session && !session.sessionDeleted) {
            const { gameInstance, ...sessionData } = session.session;
            io.to(session.session.id).emit('room_updated', sessionData);
        }
        socket.leave(session?.session?.id || '');
    });

    // ==========================================
    // GAME FLOW
    // ==========================================

    socket.on('start_game', ({ sessionId }) => {
        const session = sessionManager.getSession(sessionId);
        if (!session || session.host !== socket.id) return;

        session.gameState = 'PLAYING';
        session.gameInstance.start(session.players);
        
        const initialState = session.gameInstance.getState();
        io.to(sessionId).emit('game_started', {
            gameType: session.gameType,
            state: initialState
        });
        console.log(`▶️ Juego iniciado en sala ${sessionId}`);
    });

    socket.on('game_action', ({ sessionId, action, data }, callback) => {
        const session = sessionManager.getSession(sessionId);
        if (!session || session.gameState !== 'PLAYING') {
            return callback?.({ error: 'Sesión no válida' });
        }

        // Process action through game instance
        const result = session.gameInstance.handleAction(socket.id, action, data);
        
        if (result.error) {
            return callback?.({ error: result.error });
        }

        // Broadcast updated state to all players
        const newState = session.gameInstance.getState();
        io.to(sessionId).emit('game_state_update', {
            action,
            playerId: socket.id,
            state: newState,
            result
        });

        callback?.({ success: true, result });
    });

    socket.on('end_game', ({ sessionId }) => {
        const session = sessionManager.getSession(sessionId);
        if (!session || session.host !== socket.id) return;

        session.gameState = 'FINISHED';
        const finalScores = session.players.map(p => ({
            id: p.id,
            name: p.name,
            score: p.score
        }));

        io.to(sessionId).emit('game_ended', { scores: finalScores });
        console.log(`⏹️ Juego finalizado en sala ${sessionId}`);
    });

    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on('disconnect', () => {
        const result = sessionManager.removePlayer(socket.id);
        if (result && !result.sessionDeleted) {
            const { gameInstance, ...sessionData } = result.session;
            io.to(result.session.id).emit('player_disconnected', {
                playerId: socket.id,
                session: sessionData
            });
        }
        console.log(`🔌 Usuario desconectado: ${socket.id}`);
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║   🎮 Servidor de Juegos de Resiliencia                   ║
║   🌊 La Guaira Resiliente Digital                        ║
║   🚀 Puerto: ${PORT}                                         ║
║   📡 WebSocket: ws://localhost:${PORT}                      ║
╚══════════════════════════════════════════════════════════╝
    `);
});

module.exports = { app, server, io, sessionManager };
