// ============================================
// EL GLOSARIO DE LAS EMOCIONES - Data
// ============================================

const glosarioData = {
    scenarios: [
        {
            id: 1,
            title: "El Primer Día de Escuela",
            description: "María llega a una nueva escuela y no conoce a nadie. Se siente nerviosa y sola.",
            character: {
                name: "María",
                age: 8,
                emoji: "👧"
            },
            dialogue: [
                { speaker: "María", text: "Mi stomach feels funny... like butterflies inside!" },
                { speaker: "María", text: "I don't know anyone here. Everyone seems to have friends already." }
            ],
            correctWords: ["nervous", "anxious", "scared", "lonely"],
            options: [
                { id: "w1", word: "nervous", correct: true, emoji: "😰" },
                { id: "w2", word: "happy", correct: false, emoji: "😊" },
                { id: "w3", word: "anxious", correct: true, emoji: "😟" },
                { id: "w4", word: "angry", correct: false, emoji: "😠" },
                { id: "w5", word: "scared", correct: true, emoji: "😨" },
                { id: "w6", word: "lonely", correct: true, emoji: "😔" },
                { id: "w7", word: "excited", correct: false, emoji: "🤩" },
                { id: "w8", word: "bored", correct: false, emoji: "😴" }
            ],
            emotionalIndex: 0
        },
        {
            id: 2,
            title: "El Juguete Roto",
            description: "Carlos accidentally broke his favorite toy. He feels terrible about it.",
            character: {
                name: "Carlos",
                age: 7,
                emoji: "👦"
            },
            dialogue: [
                { speaker: "Carlos", text: "Oh no! My dinosaur... it broke in two pieces!" },
                { speaker: "Carlos", text: "I was being so careful, but it still happened..." }
            ],
            correctWords: ["sad", "guilty", "frustrated", "disappointed"],
            options: [
                { id: "w1", word: "sad", correct: true, emoji: "😢" },
                { id: "w2", word: "guilty", correct: true, emoji: "😔" },
                { id: "w3", word: "happy", correct: false, emoji: "😄" },
                { id: "w4", word: "frustrated", correct: true, emoji: "😤" },
                { id: "w5", word: "disappointed", correct: true, emoji: "😞" },
                { id: "w6", word: "angry", correct: false, emoji: "😡" },
                { id: "w7", word: "calm", correct: false, emoji: "😌" },
                { id: "w8", word: "proud", correct: false, emoji: "😌" }
            ],
            emotionalIndex: 0
        },
        {
            id: 3,
            title: "La Mejor Amiga",
            description: "Ana's best friend is moving to another city. She's trying to hold back tears.",
            character: {
                name: "Ana",
                age: 9,
                emoji: "👧"
            },
            dialogue: [
                { speaker: "Ana", text: "Lucía is leaving next week... We've been friends since kindergarten." },
                { speaker: "Ana", text: "I want to be happy for her, but my heart feels heavy." }
            ],
            correctWords: ["sad", "nostalgic", "grateful", "bittersweet"],
            options: [
                { id: "w1", word: "sad", correct: true, emoji: "😢" },
                { id: "w2", word: "nostalgic", correct: true, emoji: "🥹" },
                { id: "w3", word: "angry", correct: false, emoji: "😠" },
                { id: "w4", word: "grateful", correct: true, emoji: "🙏" },
                { id: "w5", word: "bittersweet", correct: true, emoji: "😔" },
                { id: "w6", word: "jealous", correct: false, emoji: "😒" },
                { id: "w7", word: "excited", correct: false, emoji: "🤩" },
                { id: "w8", word: "tired", correct: false, emoji: "😴" }
            ],
            emotionalIndex: 0
        },
        {
            id: 4,
            title: "El Premio Inesperado",
            description: "Diego won a science competition he didn't think he could win!",
            character: {
                name: "Diego",
                age: 10,
                emoji: "👦"
            },
            dialogue: [
                { speaker: "Diego", text: "I can't believe it! My project actually won!" },
                { speaker: "Diego", text: "All those weeks of work... it was worth it!" }
            ],
            correctWords: ["surprised", "proud", "happy", "relieved"],
            options: [
                { id: "w1", word: "surprised", correct: true, emoji: "😲" },
                { id: "w2", word: "proud", correct: true, emoji: "😤" },
                { id: "w3", word: "sad", correct: false, emoji: "😢" },
                { id: "w4", word: "happy", correct: true, emoji: "😄" },
                { id: "w5", word: "relieved", correct: true, emoji: "😮‍💨" },
                { id: "w6", word: "confused", correct: false, emoji: "😕" },
                { id: "w7", word: "angry", correct: false, emoji: "😠" },
                { id: "w8", word: "scared", correct: false, emoji: "😨" }
            ],
            emotionalIndex: 0
        },
        {
            id: 5,
            title: "El Día Lluvioso",
            description: "Sofía had planned a picnic with her friends, but it's raining heavily.",
            character: {
                name: "Sofía",
                age: 7,
                emoji: "👧"
            },
            dialogue: [
                { speaker: "Sofía", text: "The rain won't stop... Our picnic is ruined!" },
                { speaker: "Sofía", text: "I was so looking forward to playing in the park..." }
            ],
            correctWords: ["disappointed", "frustrated", "sad", "bored"],
            options: [
                { id: "w1", word: "disappointed", correct: true, emoji: "😞" },
                { id: "w2", word: "frustrated", correct: true, emoji: "😤" },
                { id: "w3", word: "happy", correct: false, emoji: "😊" },
                { id: "w4", word: "sad", correct: true, emoji: "😢" },
                { id: "w5", word: "bored", correct: true, emoji: "😴" },
                { id: "w6", word: "excited", correct: false, emoji: "🤩" },
                { id: "w7", word: "proud", correct: false, emoji: "😌" },
                { id: "w8", word: "calm", correct: false, emoji: "😌" }
            ],
            emotionalIndex: 0
        }
    ],

    vocabulary: [
        { word: "nervous", definition: "Feeling worried or anxious about something", emoji: "😰", category: "anxiety" },
        { word: "sad", definition: "Feeling unhappy or sorrowful", emoji: "😢", category: "sadness" },
        { word: "happy", definition: "Feeling joy or pleasure", emoji: "😊", category: "joy" },
        { word: "angry", definition: "Feeling strong displeasure", emoji: "😠", category: "anger" },
        { word: "scared", definition: "Feeling afraid or frightened", emoji: "😨", category: "fear" },
        { word: "frustrated", definition: "Feeling upset because you can't do something", emoji: "😤", category: "frustration" },
        { word: "proud", definition: "Feeling good about what you achieved", emoji: "😤", category: "pride" },
        { word: "lonely", definition: "Feeling alone without friends", emoji: "😔", category: "sadness" },
        { word: "excited", definition: "Feeling very happy and enthusiastic", emoji: "🤩", category: "joy" },
        { word: "calm", definition: "Feeling peaceful and relaxed", emoji: "😌", category: "peace" },
        { word: "guilty", definition: "Feeling bad about doing something wrong", emoji: "😔", category: "guilt" },
        { word: "surprised", definition: "Feeling amazed by something unexpected", emoji: "😲", category: "surprise" },
        { word: "disappointed", definition: "Feeling sad because something wasn't as expected", emoji: "😞", category: "sadness" },
        { word: "nostalgic", definition: "Feeling sentimental about the past", emoji: "🥹", category: "nostalgia" },
        { word: "anxious", definition: "Feeling worried about what might happen", emoji: "😟", category: "anxiety" }
    ]
};

module.exports = glosarioData;
