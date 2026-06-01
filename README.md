# 📚 Bookstrava: Reading Tracker & Social Hub

Bookstrava is a highly crafted, high-performance web application designed for reading enthusiasts. Emulating the active, community-driven spirit of Strava, Bookstrava allows readers to track physical pages and digital screens, map milestones, celebrate finishes, analyze consistency, and discuss systems architecture tradeoffs.

Featuring a dark, premium visual skin (**Cosmic Dark Theme**) accented by a signature active high-contrast orange color (`#FC5200`), Bookstrava provides both interactive social elements and an educational whiteboard playground for systems architecture.

---

## ✨ Features

- 🏋️ **Reading Workout Logger**: Active session tracker featuring real-time stopwatch controls, format selectors (Physical 📚 vs. Digital 📱), and dynamic speed calculations.
- 📊 **Rich Literacy Analytics**: Circular contribution charts for reading format ratios, page volume history bars (past 7 days), avg pace computation, and completion milestones.
- 🤝 **Bookstrava Social Feed**: Simulate peer activity feeds, share congratulations, applaud milestones with **Leaf kudos** 🍁, and exchange constructive thoughts.
- 🎨 **Systems Architect Whiteboard**: Interactive planning board evaluating deployment platforms (Web, Native, Hybrid), data engines (NoSQL Firestore vs. PostgreSQL SQL), event sourcing synchronizations, and developer checklists.
- 🤖 **Strategic AI Companion**: An advanced system design assistant powered server-side by the **Gemini API (`@google/genai`)** to consult and troubleshoot production architectural trade-offs.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion (Framer Motion)
- **Backend & Bundler**: Node.js, Express, Vite 6, tsx running TypeScript natively, esbuild for ultra-fast compilation compiles server into `dist/server.cjs`
- **AI Core**: Gemini API via `@google/genai` (Server-side proxy structure)

---

## 🚀 How to Run Locally

Follow these steps to download, install, and run this application on your local workstation.

### Prerequisites

You must have the following tools installed:
- **Node.js** (v18.0 or newer recommended)
- **npm** (usually bundled with Node.js)
- **Git** (for version control)

---

### Step 1: Install Dependencies

Open your terminal in the root directory of the project and run:

```bash
npm install
```

This command will install both frontend and backend development dependencies, including the Vite bundler, React, Express, esbuild, and other required scripts.

---

### Step 2: Configure Environment Variables

Create a file named `.env` in the root directory (based on the provided `.env.example` file):

```bash
cp .env.example .env
```

Open `.env` and configure your API Keys:

```env
# Your Gemini API Key for Server-Side consultations
GEMINI_API_KEY="your_actual_gemini_api_key_here"

# The local development URL
APP_URL="http://localhost:3000"
```

*Note: The system handles missing keys gracefully by informing you in the consulting chat to set up your environment variables.*

---

### Step 3: Start the Development Server

Bookstrava has a dual-mode local server. In development, the Express server proxies both API endpoints and boots the Vite asset compile system seamlessly on **port 3000**:

```bash
npm run dev
```

Your server will boot up and be accessible at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

### Step 4: Build for Production

To compile Bookstrava into an optimized, bundled single production-ready node module, run:

```bash
npm run build
```

This compiles your client-side assets to `/dist` and uses `esbuild` to compile `server.ts` into a fast, standalone backend CommonJS script at `/dist/server.cjs` that excludes external runtime weights.

---

### Step 5: Start the Compiled Application

Once the build successfully completes, you can spin up the optimized server:

```bash
npm run start
```

Your production app will be running securely on **port 3000**.

---

## 🐙 How to Push to Your GitHub Account

Here is a step-by-step guide to uploading this repository directly to your GitHub profile: **[vedant-vaidya-77](https://github.com/vedant-vaidya-77)**.

### 1. Create a New Repository on GitHub
1. Open your web browser and go to: **[https://github.com/new](https://github.com/new)**
2. In the **Repository name** field, type: `bookstrava`
3. Description *(Optional)*: `A premium reading tracker & social hub with system design whiteboard metrics.`
4. Keep the repository as **Public**.
5. **CRITICAL:** Do **NOT** check "Add a README file", "Add .gitignore", or "Choose a license". We want to import our existing, completely styled workspace directly! Keep it completely empty.
6. Click **Create repository**.

---

### 2. Prepare the Codebase Locally
Unlock your terminal and change directories into the project root path. Run the following actions:

```bash
# Initialize a local Git repository
git init

# Add all files to stage (excluding node_modules or secret files defined in .gitignore)
git add .

# Create the first local commit
git commit -m "feat: complete initial release of Bookstrava with system design whiteboard and chatbot"
```

---

### 3. Rename the Main Branch
To follow GitHub standard naming conventions, ensure your primary branch is named `main`:

```bash
git branch -M main
```

---

### 4. Link the Remote GitHub Repository
Instruct your local git client where your online GitHub home resides replacing your ID details:

```bash
git remote add origin https://github.com/vedant-vaidya-77/bookstrava.git
```

---

### 5. Push the Code
Upload your main branch tracking progress:

```bash
git push -u origin main
```

*(Note: If Github requests your credentials inside your terminal, do not enter your general account password. Instead, use your GitHub **Personal Access Token (PAT)** or configure an **SSH Key** to complete authentication securely. You can generate a PAT in your account at Profile Setting -> Developer Settings -> Personal Access Tokens).*

---

### 6. Verify Upload
Now refresh your browser page at: **[https://github.com/vedant-vaidya-77/bookstrava](https://github.com/vedant-vaidya-77/bookstrava)**. You should see all files, folders, and this Markdown formatted guide beautifully presented!
