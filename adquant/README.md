# AdQuant — Ad Risk Intelligence Platform
### Phase 1: Instagram USA | MVP Build

> Know your ad risk before you spend.

---

## 🚀 Quick Deploy to Vercel

### 1. Clone & Install
```bash
git init && git add . && git commit -m "Initial AdQuant MVP"
# Push to GitHub, then import in Vercel dashboard
```
Or use Vercel CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```

### 2. Set Environment Variables

In your **Vercel Dashboard → Project → Settings → Environment Variables**, add:

| Variable | Where to get it |
|---|---|
| `VITE_SUPABASE_URL` | [supabase.com](https://supabase.com) → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `VITE_ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |

> ⚠️ Never commit `.env.local` to git. It's already in `.gitignore`.

---

## 🗄️ Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:

```sql
create table simulations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  niche text,
  cost_price numeric,
  selling_price numeric,
  risk_score numeric,
  failure_probability text,
  break_even_roas numeric,
  net_profit_margin numeric,
  recommended_budget_min numeric,
  recommended_budget_max numeric,
  risk_category text,
  ai_explanation text,
  inputs jsonb,
  created_at timestamptz default now()
);

alter table simulations enable row level security;

create policy "Users see own simulations" on simulations
  for all using (auth.uid() = user_id);
```

3. Enable **Email Auth** in Authentication → Providers

---

## 💻 Local Development

```bash
# 1. Copy env template
cp .env.example .env.local
# Fill in your keys in .env.local

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Run tests
npm test
```

---

## 🧪 Running the Test Suite

```bash
npm test
```

All 10 unit test cases from the build plan are in `src/__tests__/scoring.test.js`.

---

## 📁 Project Structure

```
src/
├── engine/
│   ├── scoring.js       # Core 5-pillar risk formula (AdQuant IP)
│   ├── budget.js        # Budget recommendation engine
│   └── benchmarks.js   # CPM benchmark data (12 niches)
├── components/
│   ├── SimForm.jsx      # Simulation input form
│   ├── ScoreCard.jsx    # Results score display
│   ├── PillarBreakdown.jsx  # 5-pillar visual bars
│   ├── AIExplainer.jsx  # Claude AI risk explanation
│   ├── MetaAdLibrary.jsx # Meta Ad Library link generator
│   ├── SimHistory.jsx   # Saved simulations list
│   └── Navbar.jsx       # Navigation
├── lib/
│   ├── supabase.js      # Supabase client
│   └── claude.js        # Anthropic API + prompt builder
├── hooks/
│   ├── useAuth.js       # Auth state management
│   └── useSimulation.js # Simulation run + save logic
├── pages/
│   ├── Home.jsx         # Landing page
│   ├── Simulator.jsx    # Main simulator page
│   ├── History.jsx      # Simulation history page
│   └── Auth.jsx         # Login / signup page
└── __tests__/
    └── scoring.test.js  # 10 unit tests
```

---

## 🔢 The Risk Scoring Formula

```
Risk Score = (0.30 × Margin) + (0.20 × CPM) + (0.20 × Saturation) + (0.20 × Friction) + (0.10 × Brand)
```

| Score | Category | Failure Probability | Action |
|---|---|---|---|
| 0–30 | 🟢 LOW | < 25% | Launch with confidence |
| 31–55 | 🟡 MODERATE | 25–50% | Test with small budget |
| 56–75 | 🟠 HIGH | 50–75% | Fix risk factors first |
| 76–100 | 🔴 CRITICAL | > 75% | Do not launch |

---

## ⚠️ Legal Disclaimer

AdQuant provides probabilistic estimates based on historical benchmarks. Actual ad performance may vary. This is not financial advice.

---

*AdQuant CTO Build Plan v1.0 · Phase 1 — Instagram USA · March 2026*
