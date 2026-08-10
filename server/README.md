# PRobe

**Probe every line. Ship with confidence.**

PRobe is a full-stack web application that lets developers paste any GitHub Pull Request URL and receive an instant, structured AI-powered code review. It identifies bugs, security vulnerabilities, performance issues, and style improvements — and maintains a per-user history of all PR reviews.

**Theme:** AI-augmented developer tools

---

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Frontend     | React 18 + Vite + Tailwind CSS                |
| Backend      | Node.js + Express.js                          |
| Database     | Neon (PostgreSQL) + Prisma ORM                |
| Auth         | JWT + bcrypt                                  |
| AI           | OpenRouter (Claude / Qwen Coder)              |
| GitHub       | GitHub REST API v3                            |

---

## UI Design

### Design Philosophy

PRobe's UI is intentionally designed to resonate with GitHub's aesthetic — familiar to developers, minimal friction, zero learning curve.

- **Color theme** — mirrors GitHub's dark UI to feel native to the developer workflow; if you live on GitHub, PRobe feels like a natural extension
- **Logo** — inspired by GitHub's Octocat; the character has eyes because it's *reading* your PR — a subtle visual metaphor for code review
- **Overall feel** — clean, focused, and developer-first; no clutter, just the review

---

## Share Feature

PRobe lets you share any PR review with teammates or reviewers via a public link — no login required to view a shared review.

- Click **Share** on any review in your history
- Copy the generated link and send it to anyone
- Recipients can view the full AI review without needing a PRobe account

---

## Project Structure

```
probe-ai/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── context/         # Auth & Toast contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # API client
│   ├── vercel.json
│   └── vite.config.js
├── server/                  # Express backend
│   ├── src/
│   │   ├── routes/          # Auth, Review, User routes
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── services/        # GitHub & Claude integrations
│   │   └── lib/             # Prisma client singleton
│   └── prisma/
│       └── schema.prisma
├── docs/                    # Project documentation
│   ├── apis.md
│   ├── architecture.md
│   ├── deployment.md
│   ├── structure.md
│   ├── summary.md
│   └── workflow.md
└── README.md
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- Neon account (or local PostgreSQL)
- OpenRouter API key

### 1. Clone and install

```bash
git clone <repo-url>
cd probe-ai

# Install dependencies
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**server/.env**

| Variable              | Description                           |
| --------------------- | ------------------------------------- |
| `DATABASE_URL`        | Neon PostgreSQL connection string     |
| `JWT_SECRET`          | Secret key for JWT signing            |
| `OPENROUTER_API_KEY`  | OpenRouter API key                    |
| `GITHUB_TOKEN`        | (Optional) Default GitHub token       |
| `PORT`                | Server port (default: 5000)           |
| `CLIENT_URL`          | Frontend URL (default: localhost:5173)|

**client/.env**

| Variable         | Description   |
| ---------------- | ------------- |
| `VITE_API_URL`   | Backend URL   |

### 3. Database setup

```bash
cd server
npx prisma migrate dev --name init
```

### 4. Run locally

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

Client runs on `http://localhost:5173`, server on `http://localhost:5000`.

---

## Deployment

### Frontend — Vercel

1. Push the `client/` folder as a Vercel project (or set root directory to `client`)
2. Add environment variable: `VITE_API_URL=<your-render-backend-url>`
3. Deploy — Vercel auto-detects Vite and uses `dist/` output

### Backend — Render

1. Create a new Web Service, point at the `server/` directory
2. **Build Command:**
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy
   ```
3. **Start Command:**
   ```bash
   npm start
   ```
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OPENROUTER_API_KEY`
   - `CLIENT_URL` (your Vercel frontend URL)
   - `NODE_ENV=production`

---

Built for BeingInfinity Hackathon — June 2026
