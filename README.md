# SkillPassport

> **Your degree tells where you studied. Your SkillPassport shows what you can do.**

SkillPassport is an AI-powered, portable professional identity platform that verifies and represents skills through evidence — projects, GitHub, certificates, assessments, and internships.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop (for PostgreSQL + AI service)
- Python 3.12+ (if running AI service locally without Docker)

### 1. Clone & Install

```bash
cd skillpassport
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` — the defaults work for local Docker setup.

### 3. Start Database & AI Service

```bash
docker compose up -d
```

This starts:
- PostgreSQL on port 5432
- Python AI Service on port 8000 (mock mode — no API key needed)

### 4. Set Up Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎭 Demo Accounts

| Name | Email | Password |
|------|-------|----------|
| Alex Chen | alex@skillpassport.dev | demo123456 |
| Priya Sharma | priya@skillpassport.dev | demo123456 |

Public profiles:
- [/passport/alex-chen](http://localhost:3000/passport/alex-chen)
- [/passport/priya-sharma](http://localhost:3000/passport/priya-sharma)

---

## 🏗️ Architecture

```
skillpassport/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Login, Register
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   ├── api/                # API routes
│   │   └── passport/           # Public profiles
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── charts/             # Recharts wrappers
│   │   └── forms/              # Form components
│   ├── lib/                    # Utilities, prisma client
│   └── types/                  # TypeScript types
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Demo data
├── ai-service/                 # Python FastAPI AI microservice
│   ├── main.py
│   ├── ai/                     # AI modules
│   └── routes/                 # API routes
└── docker-compose.yml
```

### Services

| Service | Port | Tech |
|---------|------|------|
| Next.js App | 3000 | Next.js 15, TypeScript, Tailwind |
| AI Service | 8000 | Python 3.12, FastAPI, Pydantic |
| PostgreSQL | 5432 | PostgreSQL 16 |

---

## 🤖 AI Features

The AI service runs in **mock mode by default** (no API key needed). To use real LLM:

```bash
# In .env.local
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=gpt-4o
```

Or pass it to Docker:
```bash
OPENAI_API_KEY=your-key docker compose up -d
```

---

## 📋 Feature List

### Core
- ✅ Authentication (email/password, JWT)
- ✅ 5-step onboarding flow
- ✅ Dashboard with skill analytics
- ✅ Evidence management (projects, certs, internships, etc.)
- ✅ AI evidence analysis + skill extraction
- ✅ Skill confidence scoring
- ✅ Skill gap analysis
- ✅ Career matching
- ✅ Personalized learning roadmap
- ✅ Public SkillPassport profile
- ✅ AI-generated profile summaries

### Advanced
- ✅ GitHub repo analysis (public repos, no OAuth needed)
- ✅ AI skill assessments
- ✅ Analytics charts (Recharts)
- ✅ Share profile (copy link, LinkedIn, QR code)
- ✅ Employer skill view
- ✅ "Why?" explainability for every AI score
- ✅ Demo data (two full demo users)

---

## 🗄️ Database Commands

```bash
# Reset + reseed
npx prisma migrate reset

# View DB in browser
npx prisma studio

# Generate after schema changes
npx prisma generate
```

---

## 🧪 Running AI Service Locally (without Docker)

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🎨 Tech Stack

**Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Recharts, Framer Motion, Lucide React

**Backend**: Next.js API Routes, NextAuth.js, Prisma ORM, PostgreSQL

**AI Service**: Python 3.12, FastAPI, Pydantic, OpenAI SDK (mock mode by default)

---

## 📄 API Reference

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/[...nextauth]` — NextAuth endpoints

### Profile
- `GET /api/profile` — Get current user profile
- `PUT /api/profile` — Update profile

### Skills
- `GET /api/skills` — Get user skills
- `POST /api/skills` — Add skill
- `PUT /api/skills/:id` — Update skill
- `DELETE /api/skills/:id` — Remove skill

### Evidence
- `GET /api/evidence` — Get evidence
- `POST /api/evidence` — Add evidence
- `DELETE /api/evidence/:id` — Remove evidence

### AI
- `POST /api/ai/analyze-evidence` — Analyze evidence
- `POST /api/ai/skill-gap` — Generate skill gap analysis
- `POST /api/ai/career-match` — Career match calculation
- `POST /api/ai/generate-roadmap` — Generate roadmap
- `POST /api/ai/generate-summary` — AI profile summary

### GitHub
- `POST /api/github/connect` — Connect GitHub username
- `GET /api/github/repositories` — Fetch public repos

### Assessment
- `POST /api/assessment/generate` — Generate assessment
- `POST /api/assessment/submit` — Submit answers

### Public
- `GET /api/passport/:username` — Public profile data

---

## 🌍 International / Borderless Feature

Users can set:
- **Current country** and **target country**
- **Target industry** and **role**

The system compares skills against the target role regardless of location, enabling global skill portability.

> ⚠️ SkillPassport does not provide legal immigration or visa advice.

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT sessions (NextAuth)
- API route authentication middleware
- Input validation with Zod
- No API keys exposed to frontend
- Public profiles respect `isPublic` flag
- Rate limiting on AI endpoints

---

Built with ❤️ for the hackathon. **This is not just a resume. This is evidence of what you can actually do.**
