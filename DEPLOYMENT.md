# PromptLens — Deployment Guide

## Prerequisites
- Node.js 18+
- Vercel account (free tier works)
- Anthropic API key

---

## Local Development

```bash
# 1. Clone & install
cd promptlens
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY

# 3. Run locally
npm run dev
# Frontend: http://localhost:5173
# API proxy: handled by Vite's dev server proxy
```

For local API testing, install Vercel CLI:
```bash
npm i -g vercel
vercel dev  # serves both frontend and /api/* functions
```

---

## Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Set production env variable (ONE TIME)
vercel env add ANTHROPIC_API_KEY production
# Paste your key when prompted

# Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard (Git Integration)

1. Push this repo to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. **Environment Variables** → Add `ANTHROPIC_API_KEY` = your key
5. Click **Deploy**

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | Your Anthropic API key |
| `VERCEL_URL` | Auto-set | Auto-set by Vercel on deploy |

---

## Post-Deploy Checklist

- [ ] Visit your deployed URL and upload a test image
- [ ] Confirm prompts generate correctly
- [ ] Check browser console for any CORS errors
- [ ] Update CORS origins in `api/analyze.ts` if needed (already handles `*.vercel.app`)
- [ ] Monitor Anthropic usage at https://console.anthropic.com

---

## Cost Estimation

Using `claude-haiku-4-5-20251001`:
- Input: ~$0.80 / 1M tokens
- Output: ~$4 / 1M tokens
- Average per analysis: ~1,000 input tokens + ~500 output tokens
- **Estimated cost per analysis: ~$0.003 (less than 1 cent)**

With 10 analyses/user/day and 100 daily users:
- ~1,000 analyses/day
- **~$3/day** or **~$90/month**

---

## Scaling

The in-memory rate limiter in `api/analyze.ts` resets on cold starts (fine for Vercel serverless).

For high traffic, replace with:
- Vercel KV (Redis) for persistent rate limiting
- Upstash Redis for cross-function state

---

## Custom Domain

```bash
vercel domains add yourdomain.com
```

Then update `api/analyze.ts` CORS origins to include your domain.
