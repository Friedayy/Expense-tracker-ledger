# Ledger — Personal Finance Dashboard

A full-stack personal finance dashboard: track income and expenses, watch a
monthly budget, and see spending broken down by category and over time.

**Stack:** React (Vite) · Tailwind CSS · Chart.js (via react-chartjs-2) · Supabase (Postgres + Auth)

---

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in your project dashboard, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates:
   - `profiles` (one row per user, holds `monthly_budget`)
   - `transactions` (each income/expense entry)
   - Row Level Security policies so each user can only see their own data
   - A trigger that auto-creates a `profiles` row when someone signs up
3. Under **Authentication → Providers**, make sure **Email** is enabled.
   (By default Supabase requires email confirmation on sign-up — you can
   turn this off in **Authentication → Settings** for faster local testing.)
4. Under **Project Settings → API**, copy your **Project URL** and
   **anon public key**.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in the two values from step 1.4:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Install and run

```bash
npm install
npm run dev
```

Visit the printed local URL (usually `http://localhost:5173`), sign up with
an email/password, and start adding transactions.

## 4. Build for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

The output lands in `dist/` — deploy it to Vercel, Netlify, Cloudflare
Pages, or any static host. Remember to set the two `VITE_SUPABASE_*`
environment variables in your host's dashboard as well.

---

## How the data model works

- **`profiles.monthly_budget`** — a single numeric goal per user, edited via
  the "Set budget" button in the header.
- **`transactions`** — each row is one income or expense entry with a
  `category`, `type` (`income`/`expense`), and `date`. The dashboard derives
  everything else (totals, chart data, remaining budget) from this table
  client-side.
- **Row Level Security** — every query is scoped to `auth.uid()`, so even
  though the anon key is public, users can only ever read or write their own
  rows.

## Project structure

```
src/
  lib/supabaseClient.js      Supabase client + category color mapping
  context/AuthContext.jsx    Session state, sign in/up/out
  hooks/useFinanceData.js    Fetch + optimistic add/delete/budget-update
  components/
    AuthScreen.jsx           Combined sign in / sign up screen
    Dashboard.jsx            Page layout, composes everything below
    SummaryStrip.jsx         Balance / income / expenses / remaining budget
    CategoryChart.jsx        Doughnut chart, expenses by category
    CashFlowChart.jsx        Line chart, net cash flow by month
    TransactionForm.jsx      Add-transaction form
    TransactionTable.jsx     Search/filter/delete transaction history
    BudgetModal.jsx          Edit monthly budget goal
```

## Notes

- New transactions and deletions update the UI optimistically (instantly),
  then reconcile with the server response, rolling back if the request
  fails.
- The cash flow chart groups transactions by month; the category chart only
  considers `expense` rows.
- Categories are constrained at the database level via a `check` constraint,
  matching the fixed list in `CATEGORIES` (`src/lib/supabaseClient.js`).
