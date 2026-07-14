import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class GameSocket {
  private socket: Socket | null = null;
  private static instance: GameSocket;

  private constructor() {}

  static getInstance(): GameSocket {
    if (!GameSocket.instance) {
      GameSocket.instance = new GameSocket();
    }
    return GameSocket.instance;
  }

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
    }

    if (!this.socket.connected) {
      this.socket.connect();
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Room events
  createRoom(gameType: string, username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('create_room', { gameType, username }, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  joinRoom(sessionId: string, username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('join_room', { sessionId, username }, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  leaveRoom(): void {
    const socket = this.getSocket();
    if (socket) {
      socket.emit('leave_room');
    }
  }

  startGame(sessionId: string): void {
    const socket = this.getSocket();
    if (socket) {
      socket.emit('start_game', { sessionId });
    }
  }

  sendGameAction(sessionId: string, action: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const socket = this.getSocket();
      if (!socket) return reject(new Error('Not connected'));

      socket.emit('game_action', { sessionId, action, data }, (response: any) => {
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  endGame(sessionId: string): void {
    const socket = this.getSocket();
    if (socket) {
      socket.emit('end_game', { sessionId });
    }
  }

  // Event listeners
  onRoomUpdated(callback: (data: any) => void): void {
    const socket = this.getSocket();
    if (socket) {
      socket.on('room_updated', callback);
    }
  }

  onGameStarted(callback: (data: any) => void): void {
    const socket = this.getSocket();
    if (socket) {
      socket.on('game_started', callback);
    }
  }

  onGameStateUpdate(callback: (data: any) => void): void {
    const socket = this.getSocket();
    if (socket) {
      socket.on('game_state_update', callback);
    }
  }

  onGameEnded(callback: (data: any) => void): void {
    const socket = this.getSocket();
    if (socket) {
      socket.on('game_ended', callback);
    }
  }

  onPlayerDisconnected(callback: (data: any) => void): void {
    const socket = this.getSocket();
    if (socket) {
      socket.on('player_disconnected', callback);
    }
  }

  offAllListeners(): void {
    const socket = this.getSocket();
    if (socket) {
      socket.off('room_updated');
      socket.off('game_started');
      socket.off('game_state_update');
      socket.off('game_ended');
      socket.off('player_disconnected');
    }
  }
}

export default GameSocket;
