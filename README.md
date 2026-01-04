# 🎓 Erudite - Autonomous Pedagogical Teaching Agent

<div align="center">

![Erudite Logo](https://img.shields.io/badge/Erudite-AI%20Teaching%20Agent-8B5CF6?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)

**An intelligent teaching assistant that adapts to your learning style**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 🌟 Overview

Erudite is an AI-powered teaching agent that goes beyond simple Q&A. It uses pedagogical principles to:

- **Detect misconceptions** before answering your questions
- **Adapt explanations** based on your difficulty level
- **Generate concept maps** from your study materials
- **Create personalized study plans** and revision sheets

Upload any PDF document, and Erudite becomes your personal tutor for that subject.

---

## ✨ Features

### 📚 Learn (Teaching Chat)
- Upload PDF documents for AI-assisted learning
- Three difficulty levels: **Beginner**, **Intermediate**, **Exam-Focused**
- Misconception detection and correction
- Micro-assessments after each explanation

### 💬 Chat (Aletheia)
- General-purpose AI assistant
- Markdown-formatted responses
- Persistent conversation history

### 🗺️ Concept Map
- Visual representation of document concepts
- Interactive force-directed graph
- Color-coded by concept category

### 📋 Study Plan
- AI-generated personalized study schedules
- 30-minute study session breakdowns
- Key formulas and definitions

### 📝 Revision Sheet
- One-page summary of important concepts
- Quick facts and memory tricks
- 5-question self-assessment quiz

### 📊 Analytics
- Learning progress tracking
- Concept mastery visualization
- What-if grade analysis

---

## 🎥 Demo

### Getting Started
1. Create an account or login
2. Upload a PDF document
3. Ask questions about the material
4. Explore concept maps and study plans

### Difficulty Levels
| Level | Description |
|-------|-------------|
| **Beginner** | Simple analogies, no jargon, tiny steps |
| **Intermediate** | Technical terms with explanations |
| **Exam-Focused** | Key formulas, common test patterns |

---

## 🚀 Installation

### Prerequisites
- Node.js v18+ 
- npm or yarn
- Google Cloud account (for Gemini API)
- Firebase account (for authentication)

### 1. Clone the Repository
```bash
git clone https://github.com/ShyamAlancode/erudite.git
cd erudite
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Configure Environment Variables

**Frontend** (`.env.local` in root):
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Backend** (`server/.env`):
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

### 5. Get API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Enable "Generative Language API" in Google Cloud Console

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Copy config to `.env.local`

---

## 💻 Usage

### Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Access the App
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Force Graph | Concept Map Visualization |
| React Markdown | Message Rendering |
| React Dropzone | PDF Upload |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | API Server |
| Google Generative AI | Gemini Integration |
| CORS | Cross-Origin Support |
| dotenv | Environment Variables |

### Services
| Service | Purpose |
|---------|---------|
| Firebase Auth | User Authentication |
| Firebase Firestore | Data Persistence |
| Gemini AI | Teaching & Analysis |

---

## 📁 Project Structure

```
erudite/
├── src/
│   ├── components/
│   │   ├── analytics/       # ConceptMap, StudyPlan, LearningProgress
│   │   ├── auth/            # Login, Register
│   │   ├── chat/            # ChatInterface, MessageBubble, DeepSeekChat
│   │   ├── pdf/             # PDFUploader
│   │   └── ui/              # Button, Card, Sidebar
│   ├── config/
│   │   ├── firebase.js      # Firebase configuration
│   │   └── gemini.js        # Gemini prompts & config
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state
│   │   ├── ChatContext.jsx  # Chat state persistence
│   │   └── PDFContext.jsx   # PDF content state
│   ├── hooks/
│   │   ├── useAuth.js       # Auth hook
│   │   ├── useChat.js       # Chat hook
│   │   └── useLearningState.js
│   ├── pages/
│   │   ├── Dashboard.jsx    # Main app shell
│   │   ├── Learn.jsx        # PDF + Chat view
│   │   └── Analytics.jsx    # Progress tracking
│   └── services/
│       ├── aletheiaService.js
│       ├── geminiService.js
│       ├── firestoreService.js
│       └── pdfService.js
├── server/
│   ├── index.js             # Express API server
│   ├── package.json
│   └── .env                 # Backend environment
├── .env.local               # Frontend environment
├── tailwind.config.js
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | General chat with Aletheia |
| `POST` | `/api/chat/context` | PDF-based teaching chat |
| `POST` | `/api/concept-map` | Extract concepts from PDF |
| `POST` | `/api/study-plan` | Generate study plan |
| `POST` | `/api/revision-sheet` | Generate revision sheet |

---

## 🎨 Design System

- **Theme**: Dark mode with glassmorphism
- **Primary Color**: Purple (#8B5CF6)
- **Accent Colors**: Cyan (#06B6D4), Blue (#3B82F6)
- **Typography**: Inter font family

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**Shyam Alan**
- GitHub: [@ShyamAlancode](https://github.com/ShyamAlancode)

---

## 🙏 Acknowledgments

- Google Gemini AI for powering the teaching capabilities
- Firebase for authentication and database
- The React and Vite communities

---

<div align="center">

**Made with ❤️ for learners everywhere**

</div>
