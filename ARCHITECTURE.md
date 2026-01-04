# Erudite — Autonomous Pedagogical Teaching Agent

## 🎯 What is Erudite?

Erudite is NOT a chatbot. It's an **autonomous, context-aware teaching agent** that:

- **Understands** entire academic PDFs (lecture notes, textbooks)
- **Builds** internal concept maps showing prerequisite relationships
- **Detects** student misconceptions and corrects them before answering
- **Adapts** explanations based on difficulty level (Beginner/Intermediate/Exam-focused)
- **Tests** understanding via micro-assessments after every response
- **Tracks** learning progress and generates personalized study plans

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                         (React + Vite + Tailwind)                       │
├──────────────────┬──────────────────┬───────────────────┬───────────────┤
│   PDF Uploader   │  Chat Interface  │   Concept Map     │  Analytics    │
│   (drag-drop)    │  (teaching chat) │   (knowledge      │  (progress    │
│                  │                  │    graph)         │   charts)     │
└────────┬─────────┴────────┬─────────┴─────────┬─────────┴───────┬───────┘
         │                  │                   │                 │
         ▼                  ▼                   ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SERVICES LAYER                                 │
├─────────────────┬─────────────────────┬─────────────────────────────────┤
│  PDF Service    │   Gemini Service    │      Firestore Service          │
│  (pdf-parse)    │   (AI responses)    │      (data persistence)         │
└────────┬────────┴──────────┬──────────┴──────────────┬──────────────────┘
         │                   │                         │
         ▼                   ▼                         ▼
┌─────────────────┐ ┌───────────────────┐ ┌────────────────────────────────┐
│  Extracted      │ │  Gemini 1.5 Pro   │ │     Firebase (Free Tier)       │
│  PDF Text       │ │  + System         │ │  ┌────────────┬───────────────┐│
│  (context)      │ │    Instruction    │ │  │    Auth    │   Firestore   ││
└────────┬────────┘ │  (pedagogical     │ │  │  (email/   │ (chat history,││
         │          │   rules)          │ │  │   pass)    │  learning     ││
         │          └─────────┬─────────┘ │  │            │  state)       ││
         │                    │           │  └────────────┴───────────────┘│
         └────────────────────┴───────────┴────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PEDAGOGICAL INTELLIGENCE                              │
│                                                                          │
│  Every Gemini response MUST include:                                     │
│                                                                          │
│  1. MISCONCEPTION DETECTION                                              │
│     └─ Identify if question has false premises → correct first          │
│                                                                          │
│  2. CONCEPT-AWARE TEACHING                                               │
│     └─ Analogies + prerequisite concepts + PDF references               │
│     └─ Adapted to: Beginner | Intermediate | Exam-focused               │
│                                                                          │
│  3. MICRO-ASSESSMENT                                                     │
│     └─ End with ONE diagnostic question to test understanding           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. PDF Ingestion Flow
```
User uploads PDF → pdf-parse extracts text → Text stored in React state
                                           → Text injected into Gemini system instruction
                                           → Gemini "knows" the document before any chat
```

### 2. Teaching Chat Flow
```
User asks question → Gemini receives:
                     - System instruction (pedagogical rules)
                     - PDF content (document context)
                     - Learning state (past misconceptions)
                     - Chat history (conversation context)
                   → Gemini responds with:
                     - Misconception correction (if needed)
                     - Concept-aware explanation
                     - Micro-assessment question
                   → Response displayed in chat
                   → Learning state updated in Firestore
```

### 3. Analytics Flow
```
Learning state in Firestore → Retrieved on dashboard load
                            → Processed for visualization
                            → Displayed as:
                               - Concept map (knowledge graph)
                               - Progress charts (weak/strong topics)
                               - Study plan (personalized recommendations)
```

---

## 📦 Technology Stack

| Component | Technology | Why This Choice |
|-----------|------------|-----------------|
| Framework | React + Vite | Fast HMR, modern tooling |
| Styling | Tailwind CSS | Utility-first, dark mode support |
| Auth | Firebase Auth | Free tier, easy setup |
| Database | Firestore | Free tier, real-time sync |
| AI | Gemini 1.5 Pro | Long context window (for PDFs), free API |
| PDF Parsing | pdf-parse | Simple, reliable text extraction |
| Charts | Chart.js | Lightweight, customizable |
| Graph Viz | react-force-graph-2d | Interactive concept maps |

---

## 🔐 Security Considerations

1. **API Keys**: Stored in `.env.local`, never committed to Git
2. **Authentication**: Firebase handles password hashing, session management
3. **Firestore Rules**: Users can only access their own data
4. **Client-side PDF**: No server upload, processed locally in browser

---

## 🎨 UI/UX Principles

1. **Dark Mode First**: Easier on eyes for long study sessions
2. **Glassmorphism**: Modern, premium feel with translucent cards
3. **Clear Hierarchy**: Erudite on left, user on right in chat
4. **Loading States**: Typing indicators, skeleton loaders
5. **Responsive**: Works on tablet and desktop

---

## 📁 Key Files

```
src/
├── config/
│   ├── firebase.js      # Firebase initialization
│   └── gemini.js        # Gemini AI configuration + system prompt
├── services/
│   ├── pdfService.js    # PDF text extraction
│   ├── geminiService.js # AI chat management
│   └── firestoreService.js # Data persistence
├── components/
│   ├── chat/            # Chat interface components
│   ├── analytics/       # Graphs, concept map, study plan
│   └── pdf/             # PDF upload components
└── hooks/
    ├── useAuth.js       # Authentication logic
    ├── useChat.js       # Chat session management
    └── useLearningState.js # Learning tracking
```

---

*This architecture ensures Erudite is not just another AI wrapper, but a genuine pedagogical system that teaches, adapts, and assesses.*
