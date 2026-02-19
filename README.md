# IQ Test MVP (Vercel-safe)

This is a **client-side MVP** designed to avoid Vercel build headaches:
- **No database**
- **No Prisma**
- **No API routes**
- **No env vars required**

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
- Import the repo
- Framework preset: Next.js
- No environment variables needed for MVP

## Notes
- Timer: 30 minutes, warning at 10:00, critical at 2:00 (grows + color + mild pulse)
- No back button, auto-advance after selection
- Lightweight focus monitoring for "Anti-Cheat Systems" aura
- Post-paywall is simulated via an "Unlock full report" button (no payment integration in this MVP)
