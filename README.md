# 🎓 Erudite — Autonomous Pedagogical Teaching Agent

<div align="center">

![Erudite Logo](https://img.shields.io/badge/Erudite-Pedagogical_AI-8b5cf6?style=for-the-badge&logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Free_Tier-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Pro-4285F4?style=for-the-badge&logo=google&logoColor=white)

**An AI teaching system that understands your study materials, detects misconceptions, and adapts to your learning level.**

[Live Demo](#) • [Documentation](#features) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## 🚀 What is Erudite?

**Erudite is NOT a chatbot.** It's an autonomous pedagogical teaching agent that:

- 📚 **Understands** entire academic PDFs (lecture notes, textbooks)
- 🧠 **Builds** visual concept maps showing prerequisite relationships  
- 🔍 **Detects** student misconceptions and corrects them before answering
- 🎯 **Adapts** explanations to your level (Beginner / Intermediate / Exam-focused)
- ✅ **Tests** understanding with micro-assessments after every response
- 📊 **Tracks** learning progress and generates personalized study plans
- 📝 **Creates** revision sheets based on your weak areas

---

## ✨ Features

### 📄 PDF Upload & Context Injection
Upload any academic PDF. Erudite extracts the text and "knows" your material before teaching.

### 🎓 Pedagogical Intelligence
Every response follows a strict teaching protocol:
1. **Misconception Detection** — Identifies false premises in questions
2. **Concept-Aware Teaching** — Uses analogies and document references
3. **Micro-Assessment** — Ends with a diagnostic question

### 🗺️ Concept Map Visualization
Interactive force-directed graph showing:
- Key concepts from your document
- Prerequisite relationships
- Color-coded categories

### 📈 Learning Analytics
- Weekly study activity charts
- Concept mastery tracking
- Misconception history
- Simulated marks vs rank analysis (for what-if scenarios)

### 📋 Study Plan Generator
AI-generated study plans based on:
- Your uploaded PDF content
- Your identified weak areas
- Optimal learning order

### 📝 Revision Sheet Generator
One-page summary focusing on:
- Key definitions
- Important formulas
- Common pitfalls
- Quick self-test questions

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 + Vite | Fast, modern SPA |
| **Styling** | Tailwind CSS 3 | Dark mode, glassmorphism |
| **Auth** | Firebase Auth | Email/Password authentication |
| **Database** | Firestore | Learning state persistence |
| **AI** | Gemini 1.5 Pro | Teaching intelligence |
| **PDF** | PDF.js | Client-side text extraction |
| **Charts** | Chart.js | Analytics visualization |
| **Graph** | react-force-graph-2d | Concept map rendering |

> 💡 **All services use FREE tiers only!**

---

## 📁 Project Structure

```
erudite/
├── src/
│   ├── components/
│   │   ├── auth/          # Login, Register
│   │   ├── chat/          # ChatInterface, MessageBubble, TypingIndicator
│   │   ├── pdf/           # PDFUploader
│   │   ├── analytics/     # ConceptMap, LearningProgress, StudyPlan
│   │   └── ui/            # Button, Card, Sidebar
│   ├── config/
│   │   ├── firebase.js    # Firebase initialization
│   │   └── gemini.js      # Gemini AI + System Prompt
│   ├── services/
│   │   ├── pdfService.js      # PDF text extraction
│   │   ├── geminiService.js   # Chat session management
│   │   └── firestoreService.js # Database operations
│   ├── context/           # AuthContext, PDFContext
│   ├── hooks/             # useAuth, useChat, useLearningState
│   ├── pages/             # Dashboard, Learn, Analytics
│   ├── App.jsx
│   └── main.jsx
├── .env.example           # Environment variables template
├── tailwind.config.js     # Tailwind configuration
└── package.json
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Firebase Account** ([Create Free](https://firebase.google.com/))
- **Google AI Studio API Key** ([Get Free Key](https://aistudio.google.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/erudite.git
cd erudite
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (disable Google Analytics if prompted)
3. Click **"Add app"** → Choose **Web** (</>)
4. Register app with nickname "erudite"
5. Copy the config object values

**Enable Authentication:**
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**

**Enable Firestore:**
1. Go to **Firestore Database** → **Create database**
2. Start in **test mode** (for development)
3. Choose a region close to you

### Step 4: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **"Get API Key"**
3. Create a new key or use existing

### Step 5: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your keys (use any text editor)
```

Fill in your values:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Step 6: Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎬 Recording a Demo Video

For a 3-minute hackathon demo:

1. **0:00-0:30** — Show login/register flow
2. **0:30-1:00** — Upload a PDF, show loading animation
3. **1:00-2:00** — Chat with Erudite:
   - Ask a question with wrong assumption (show misconception detection)
   - Ask for beginner vs exam-focused explanation
   - Show micro-assessment at end of response
4. **2:00-2:30** — Navigate to Concept Map, show interactive graph
5. **2:30-3:00** — Show Analytics, generate Study Plan

---

## 🔒 Security Notes

- API keys are client-side (this is normal for Firebase)
- Firestore rules should be configured for production:

```javascript
// firestore.rules (for production)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /learningStates/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /chatSessions/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /studySessions/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 📜 License

MIT License — feel free to use for your own projects!

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the AI backbone
- [Firebase](https://firebase.google.com/) for free-tier backend
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [react-force-graph](https://github.com/vasturiano/react-force-graph) for concept visualization

---

<div align="center">

**Built with ❤️ for learning**

*If you find this useful, please ⭐ the repo!*

</div>
