# 🚀 RESCUEFLOW — Autonomous Emergency Triage & Focus Command Center

[![Live Demo](https://img.shields.io/badge/Live_Demo-rescueflow28.vercel.app-06b6d4?style=for-the-badge&logo=vercel&logoColor=white)](https://rescueflow28.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> *"From chaos to action."*

**RescueFlow** is a next-generation, cyberpunk-styled productivity radar and emergency task triage command center designed to rescue overwhelmed operators, engineers, founders, and students facing deadline avalanches, production outages, and high-stress chaos.

---

## 🌐 Live Deployment

🚀 **Production URL:** [https://rescueflow28.vercel.app/](https://rescueflow28.vercel.app/)

---

## ✨ Features

- **🛡️ AI Triage Engine (`/api/analyze`)**:
  - Leverages Google Gemini AI to analyze task vectors and calculate real-time Productivity Recovery Scores, Chaos Levels, Tactical Mantras, and Step-by-Step Triage Sequences.
  - **Zero-Friction Offline Fallback**: Features a built-in intelligent heuristic engine that guarantees 100% full functionality out-of-the-box even without an API key or when offline.
- **⚡ Full Vector Management (CRUD)**:
  - Register, edit, delete, filter, and search tasks.
  - Granular parameters: Title, Tactical Notes, Priority (Critical/High/Med/Low), Category Domains, Risk Probability slider, Estimated Effort, and Deadline Targets.
  - Real-time `localStorage` persistence.
- **📊 2x2 Risk vs. Urgency Triage Matrix (Eisenhower 2.0)**:
  - Quadrant 1: **DO IMMEDIATELY** (Critical Fire Drill)
  - Quadrant 2: **STRATEGIC SCHEDULE** (Deep Focus)
  - Quadrant 3: **DELEGATE / AUTOMATE** (Fast Operational Vectors)
  - Quadrant 4: **DEFER / SCRAP** (Low Leverage)
- **🎯 Tactical Focus Mission HUD**:
  - Fullscreen cyberpunk mission execution overlay.
  - Active Pomodoro/Countdown focus timer with quick extension chips (+5m, +15m, +25m).
  - Step-by-step sequential checklist with live progress telemetry.
  - Mission Completed celebration screen.
  - One-click **Export Tactical Briefing** (Formatted Markdown report to clipboard).
- **🔊 Cyber Audio Synthesizer**:
  - Zero-dependency Web Audio API synthesizer for futuristic laser sweeps, tactile action clicks, radar pings, and victory fanfare (with instant mute toggle).
- **🕹️ Chaos Simulation Presets**:
  - **Startup Pitch Fire Drill** (Vercel crash, deck moat slide, demo script rehearsal)
  - **Sev-1 Production Outage** (DB migration lock, status page updates, read replica scaling)
  - **Finals & Thesis Crunch** (Neural net paper submission, loss curve figures, advisor approvals)
  - **Solo Agency Overload** (Brand deliverables, overdue retainers, e-commerce hotfixes)

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `N` | Register New Mission Vector |
| `M` | Toggle List View / 2x2 Matrix View |
| `S` | Toggle Cyber Audio SFX On/Off |
| `Esc` | Close Active Modals / Return to Radar |

---

## 🛠️ Getting Started

### 1. Installation

```bash
cd C:\Users\Admin\Downloads\Rescue-Flow
npm install
```

### 2. Environment Setup (Optional)

Create a `.env.local` file if you want to connect your Google Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

*(If no key is provided, RescueFlow automatically executes via its local heuristic engine!)*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Animations**: [React 19](https://react.dev/), [Framer Motion](https://www.framer-motion.com/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Intelligence**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini 1.5 Flash) + Local Heuristic Engine
- **Audio**: Native Web Audio API Synthesizer

---

## 📄 License

MIT License. Built for operators who turn chaos into execution.
