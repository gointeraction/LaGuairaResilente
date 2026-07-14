import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import GameSocket from './socket/GameSocket';

interface PhaserGameProps {
  gameType: string;
  sessionId: string;
  username: string;
  onGameOver?: (scores: any[]) => void;
  onBack?: () => void;
}

// ============================================
// SCENE: Glosario de las Emociones
// ============================================
class GlosarioScene extends Phaser.Scene {
  private selectedWords: string[] = [];

  constructor() {
    super({ key: 'GlosarioScene' });
  }

  create() {
    const { width } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Title
    this.add.text(width / 2, 30, '📖 El Glosario de las Emociones', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Character
    this.add.text(width / 2, 100, '👧', {
      fontSize: '64px'
    }).setOrigin(0.5);

    // Dialogue box
    this.add.rectangle(width / 2, 200, 700, 100, 0x2d2d44)
      .setStrokeStyle(2, 0x4a4a6a);

    this.add.text(width / 2, 200, 'María llegó a una nueva escuela...\nSe sentía nerviosa y con mariposas en el estómago.', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: 650 }
    }).setOrigin(0.5);

    // Word options
    const emotions = [
      { word: 'nervous', emoji: '😰', correct: true },
      { word: 'happy', emoji: '😊', correct: false },
      { word: 'anxious', emoji: '😟', correct: true },
      { word: 'angry', emoji: '😠', correct: false },
      { word: 'scared', emoji: '😨', correct: true },
      { word: 'lonely', emoji: '😔', correct: true }
    ];

    const startY = 320;
    const spacing = 50;

    emotions.forEach((emotion, index) => {
      const y = startY + (index * spacing);
      const btn = this.add.rectangle(width / 2, y, 300, 40, 0x4a4a6a)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.selectWord(emotion))
        .on('pointerover', () => btn.setFillStyle(0x6a6a8a))
        .on('pointerout', () => btn.setFillStyle(0x4a4a6a));

      this.add.text(width / 2 - 100, y, `${emotion.emoji} ${emotion.word}`, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial'
      }).setOrigin(0, 0.5);
    });
  }

  selectWord(emotion: { word: string; emoji: string; correct: boolean }) {
    if (emotion.correct) {
      this.selectedWords.push(emotion.word);
      this.showFeedback(`${emotion.emoji} ¡Correcto! "${emotion.word}" es una emoción`, true);
    } else {
      this.showFeedback(`${emotion.emoji} Intenta otra palabra...`, false);
    }
  }

  showFeedback(message: string, success: boolean) {
    const { width } = this.cameras.main;
    const feedback = this.add.text(width / 2, 550, message, {
      fontSize: '18px',
      color: success ? '#4ade80' : '#f87171',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      alpha: 0,
      duration: 2000,
      onComplete: () => feedback.destroy()
    });
  }
}

// ============================================
// SCENE: Los Palitos de las Emociones
// ============================================
class PalitosScene extends Phaser.Scene {
  private sticks: Phaser.GameObjects.Arc[] = [];

  constructor() {
    super({ key: 'PalitosScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Title
    this.add.text(width / 2, 30, '🥢 Los Palitos de las Emociones', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Create sticks
    const colors = [0xff4444, 0x4444ff, 0xffff44, 0x44ff44, 0xff44ff, 0xff8844];
    const emotions = ['Ira', 'Tristeza', 'Alegría', 'Envidia', 'Miedo', 'Sorpresa'];

    for (let i = 0; i < 12; i++) {
      const color = colors[i % colors.length];
      const x = 150 + Math.random() * 500;
      const y = 200 + Math.random() * 250;
      const rotation = Math.random() * Math.PI;

      const stick = this.add.circle(x, y, 8, color, 1)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(2, 0xffffff);

      this.input.setDraggable(stick);

      stick.setData('emotion', emotions[i % emotions.length]);
      stick.setData('index', i);
      stick.setData('startX', x);
      stick.setData('startY', y);

      this.sticks.push(stick);

      // Visual stick line
      const line = this.add.graphics();
      line.lineStyle(6, color, 1);
      line.lineBetween(x - 40 * Math.cos(rotation), y - 40 * Math.sin(rotation), 
                       x + 40 * Math.cos(rotation), y + 40 * Math.sin(rotation));
    }

    // Drag events
    this.input.on('drag', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Arc, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Arc) => {
      this.checkCollision(gameObject);
    });

    // Instructions
    this.add.text(width / 2, height - 40, 'Arrastra un palito para extraerlo sin mover los demás', {
      fontSize: '14px',
      color: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  checkCollision(movedStick: Phaser.GameObjects.Arc) {
    const minDistance = 50;
    
    for (const stick of this.sticks) {
      if (stick === movedStick) continue;
      
      const dist = Phaser.Math.Distance.Between(movedStick.x, movedStick.y, stick.x, stick.y);
      if (dist < minDistance) {
        this.showFeedback('¡Moviste otros palitos! Pierdes tu turno', false);
        // Reset position
        this.tweens.add({
          targets: movedStick,
          x: movedStick.getData('startX'),
          y: movedStick.getData('startY'),
          duration: 300,
          ease: 'Bounce'
        });
        return;
      }
    }

    const emotion = movedStick.getData('emotion');
    this.showFeedback(`¡Extraíste un palito de ${emotion}!`, true);
    movedStick.setAlpha(0.3);
    movedStick.disableInteractive();
  }

  showFeedback(message: string, success: boolean) {
    const { width, height } = this.cameras.main;
    const feedback = this.add.text(width / 2, height - 80, message, {
      fontSize: '18px',
      color: success ? '#4ade80' : '#f87171',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      alpha: 0,
      duration: 2000,
      onComplete: () => feedback.destroy()
    });
  }
}

// ============================================
// SCENE: Las Parejas de las Emociones
// ============================================
class ParejasScene extends Phaser.Scene {
  private cards: Phaser.GameObjects.Container[] = [];
  private flippedCards: Phaser.GameObjects.Container[] = [];
  private matchedPairs: number = 0;

  constructor() {
    super({ key: 'ParejasScene' });
  }

  create() {
    const { width } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Title
    this.add.text(width / 2, 30, '🧩 Las Parejas de las Emociones', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Card pairs
    const pairs = [
      { trigger: { text: 'Examen', emoji: '😰' }, strategy: { text: 'Respirar', emoji: '🧘' } },
      { trigger: { text: 'Reto', emoji: '😤' }, strategy: { text: 'Pasos', emoji: '📝' } },
      { trigger: { text: 'Discusión', emoji: '😠' }, strategy: { text: 'Escuchar', emoji: '👂' } },
      { trigger: { text: 'Miedo', emoji: '😨' }, strategy: { text: 'Explorar', emoji: '🔍' } },
      { trigger: { text: 'Solo', emoji: '😢' }, strategy: { text: 'Hablar', emoji: '💬' } }
    ];

    const cardWidth = 120;
    const cardHeight = 100;
    const startX = 100;
    const startY = 120;
    const cols = 4;

    // Create all cards
    const allCards: any[] = [];
    pairs.forEach((pair, pairIndex) => {
      allCards.push({ ...pair.trigger, pairIndex, type: 'trigger' });
      allCards.push({ ...pair.strategy, pairIndex, type: 'strategy' });
    });

    // Shuffle
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }

    // Create card objects
    allCards.forEach((cardData, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * (cardWidth + 20);
      const y = startY + row * (cardHeight + 20);

      const container = this.add.container(x, y);

      const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x4a4a6a)
        .setStrokeStyle(2, 0x6a6a8a);
      
      const emojiText = this.add.text(0, -15, cardData.emoji, {
        fontSize: '28px'
      }).setOrigin(0.5).setVisible(false);

      const labelText = this.add.text(0, 20, cardData.text, {
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: 'Arial'
      }).setOrigin(0.5).setVisible(false);

      const questionMark = this.add.text(0, 0, '?', {
        fontSize: '32px',
        color: '#888888'
      }).setOrigin(0.5);

      container.add([bg, emojiText, labelText, questionMark]);
      container.setSize(cardWidth, cardHeight);
      container.setInteractive({ useHandCursor: true });

      container.setData('pairIndex', cardData.pairIndex);
      container.setData('type', cardData.type);
      container.setData('isFlipped', false);
      container.setData('isMatched', false);

      container.on('pointerdown', () => this.flipCard(container));

      this.cards.push(container);
    });
  }

  flipCard(card: Phaser.GameObjects.Container) {
    if (card.getData('isFlipped') || card.getData('isMatched')) return;
    if (this.flippedCards.length >= 2) return;

    card.setData('isFlipped', true);

    this.tweens.add({
      targets: card,
      scaleX: 0,
      duration: 150,
      onComplete: () => {
        card.list.forEach((child: Phaser.GameObjects.GameObject) => {
          if (child instanceof Phaser.GameObjects.Text) {
            if (child.text === '?') child.setVisible(false);
            else child.setVisible(true);
          }
        });

        this.tweens.add({
          targets: card,
          scaleX: 1,
          duration: 150
        });
      }
    });

    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.time.delayedCall(1000, () => this.checkMatch());
    }
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;

    if (card1.getData('pairIndex') === card2.getData('pairIndex') && 
        card1.getData('type') !== card2.getData('type')) {
      card1.setData('isMatched', true);
      card2.setData('isMatched', true);
      this.matchedPairs++;

      [card1, card2].forEach(card => {
        this.tweens.add({
          targets: card,
          alpha: 0.6,
          duration: 300
        });
      });

      this.showFeedback('¡Pareja encontrada!', true);

      if (this.matchedPairs === 5) {
        this.showFeedback('¡Ganaste todas las parejas!', true);
      }
    } else {
      [card1, card2].forEach(card => {
        card.setData('isFlipped', false);
        this.tweens.add({
          targets: card,
          scaleX: 0,
          duration: 150,
          onComplete: () => {
            card.list.forEach((child: Phaser.GameObjects.GameObject) => {
              if (child instanceof Phaser.GameObjects.Text) {
                if (child.text !== '?') child.setVisible(false);
                else child.setVisible(true);
              }
            });
            this.tweens.add({
              targets: card,
              scaleX: 1,
              duration: 150
            });
          }
        });
      });
    }

    this.flippedCards = [];
  }

  showFeedback(message: string, success: boolean) {
    const { width, height } = this.cameras.main;
    const feedback = this.add.text(width / 2, height - 40, message, {
      fontSize: '18px',
      color: success ? '#4ade80' : '#f87171',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      alpha: 0,
      duration: 2000,
      onComplete: () => feedback.destroy()
    });
  }
}

// ============================================
// MAIN PHASER GAME COMPONENT
// ============================================
export default function PhaserGame({ gameType, sessionId: _sessionId, username: _username, onGameOver, onBack }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const socket = GameSocket.getInstance();
    socket.connect();

    let sceneClass: any;
    
    switch (gameType) {
      case 'glosario':
        sceneClass = GlosarioScene;
        break;
      case 'palitos':
        sceneClass = PalitosScene;
        break;
      case 'parejas':
        sceneClass = ParejasScene;
        break;
      default:
        sceneClass = GlosarioScene;
    }

    if (containerRef.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        backgroundColor: '#1a1a2e',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
          }
        },
        scene: [sceneClass],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      gameRef.current = new Phaser.Game(config);
    }

    socket.onRoomUpdated((data) => {
      setPlayers(data.players);
    });

    socket.onGameEnded((data) => {
      onGameOver?.(data.scores);
    });

    return () => {
      socket.offAllListeners();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [gameType, onGameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Game Header */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          ← Volver
        </button>
        
        <div className="text-center">
          <div className="font-medium text-gray-900">Sala: {_sessionId}</div>
        </div>
      </div>

      {/* Phaser Game Container */}
      <div 
        ref={containerRef}
        id="game-container"
        className="bg-gray-900 rounded-lg overflow-hidden shadow-xl"
      />

      {/* Game Controls */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            💡 Usa el mouse para interactuar con el juego
          </div>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            🏠 Volver al Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
