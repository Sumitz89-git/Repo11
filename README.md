# ThreatPrep — TPAD01 v4.9
**AI Exam Prep · Proofpoint Certified Threat Protection Administrator**

> 🔒 Auth-gated via Supabase · Deployed on Vercel · Invite-only access

---

## Folder Structure
```
threatprep-tpad01/
├── src/
│   ├── App.jsx        ← Main app (with Supabase auth gate)
│   └── main.jsx       ← React entry point
├── index.html
├── vite.config.js
├── package.json
├── .env.example       ← Copy → .env.local for local dev
└── .gitignore
```

---

## Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. **Authentication → Providers → Email** → Enable it
3. Optional: Turn off "Confirm email" for frictionless magic links during testing
4. **Invite users manually:**
   - Supabase Dashboard → Authentication → Users → **Invite User**
   - Enter each user's email → they get a magic link / set-password email
5. Copy your keys from **Settings → API**:
   - `Project URL` → this is your `VITE_SUPABASE_URL`
   - `anon / public` key → this is your `VITE_SUPABASE_ANON_KEY`

---

## Step 2 — GitHub Repo

```bash
git init
git add .
git commit -m "ThreatPrep v4.9 — Supabase auth gate"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/threatprep-tpad01.git
git push -u origin main
```

---

## Step 3 — Vercel Deploy

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import from GitHub
2. Select your `threatprep-tpad01` repo
3. Framework: **Vite** (auto-detected)
4. **Environment Variables** — add both:
   ```
   VITE_SUPABASE_URL        = https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY   = eyJhbGci...
   ```
5. Click **Deploy** → Vercel builds and gives you a URL like:
   `https://threatprep-tpad01.vercel.app`

---

## Step 4 — Share the URL

Send users:
- The Vercel URL
- They sign in with Email + Password (if you set a password for them)
- OR use **Magic Link** tab — they enter email and click the link in inbox

---

## Auth Behaviour Summary

| Scenario | What happens |
|---|---|
| Not logged in | Shows ThreatPrep branded login screen |
| Email + Password | Standard sign-in |
| Magic Link | Passwordless — link sent to inbox |
| Supabase env vars missing | App loads without auth (local dev mode) |
| Sign out | ⏻ button in top-right header |

---

## Local Dev

```bash
cp .env.example .env.local
# fill in your Supabase URL + anon key

npm install
npm run dev
# → http://localhost:5173
```

---

## Version History
- **v4.9** — Supabase Auth Gate · Email/Password + Magic Link · Vercel-ready
- **v4.8** — Auth removed (local use)
- **v4.6** — ExamScreen Android full-height fix
- **v4.5** — AI deep-dive error handling · Study search bar
- **v4.4** — Certiverse validator · Retry engine · Quarantine
