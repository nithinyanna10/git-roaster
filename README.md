# Git Roaster v3

**Turn any repo into a story: vibe, health, drama, receipts.**

A cinematic, founder-grade web app that analyzes GitHub repositories and produces interactive roasts, praise, audits, and investor snapshots with full evidence trails.

## ✨ Features

### 4 Analysis Modes
- **🔥 Roast** - Playful, fact-based critiques
- **✨ Praise** - Supportive, encouraging feedback
- **🧾 Audit** - Comprehensive technical review
- **📈 Investor** - Investment-grade snapshot

### Signature Visualizations
- **Repo MRI** - Interactive health scan with concentric rings
- **Scrub-to-Replay** - Timeline replay with keyframes
- **Bento Dashboard** - Modular metrics grid with 13+ tiles
- **Momentum Strip** - Sparkline charts for stars, issues, PRs

### Evidence System
- **Receipts Room** - Every claim connected to real data
- **Inline Citations** - Clickable [1][2][3] markers in narrative
- **Confidence Scores** - Each metric shows confidence level
- **Source Attribution** - GitHub API endpoints documented

### Share & Export
- **Poster Studio** - 5 templates (Minimal, Bold Neon, Investor Memo, Meme, Dark Glass)
- **Download PNG** - High-quality share cards
- **Copy to Clipboard** - One-click sharing
- **Export JSON** - Full analysis data

### Interactive Controls
- **Cursor Modes**: Normal / Inspector / Arcade
- **Sound Toggle** (default off)
- **Reduce Motion** support
- **Live GitHub Mode** (optional, with token)
- **Keyboard Shortcuts** (1/2/3/4 for modes, I/A for cursor, R for remix, P for poster)

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📊 How It Works

### Default: Mock Mode
By default, Git Roaster uses **realistic mock data** so you can explore the UI immediately without API keys or rate limits.

### Live GitHub Mode (Optional)
1. Toggle "Live GitHub" in the hero section
2. (Optional) Add a GitHub Personal Access Token for:
   - Private repository access
   - Higher rate limits (5,000/hour vs 60/hour)
   - More accurate data

To get a token:
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select `public_repo` scope (or `repo` for private)
4. Paste token in the drawer

### Analysis Process
1. Enter GitHub repo URL (full URL or `owner/repo`)
2. Select mode (Roast/Praise/Audit/Investor)
3. Click "Ignite →"
4. Watch the scan sequence
5. Explore the reveal card, MRI, timeline, dashboard, and receipts

## 🎨 UI Features

### Scroll-Driven Chapters
- **Hero/Ignition** - Input console with mode selection
- **Scan Sequence** - Animated loading with progress
- **Reveal Card** - Cinematic narrative with citations
- **Repo MRI** - Interactive health visualization
- **Scrub-to-Replay** - Timeline with keyframes
- **Dashboard** - Bento grid with 13+ metric tiles
- **Receipts** - Evidence room with claim-to-metric connections

### Cosmic Background
- Animated star field
- Vibe-score reactive glow
- GPU-optimized (CSS + light canvas)
- Respects reduce motion

### Glassmorphism Design
- Frosted glass cards
- Soft blur effects
- Subtle borders and glows
- Premium feel

## 📈 Metrics Computed

### Core Metrics
- **Pulse**: Activity and commit frequency
- **Churn**: Code stability and change rate
- **Bus Factor**: Contributor distribution
- **Tests & CI**: Quality signals
- **Releases**: Shipping cadence
- **Docs**: Documentation quality

### Advanced Metrics
- **Issue Response Time**: Median hours to first response
- **Issue Closure Rate**: Opened vs closed ratio
- **PR Merge Rate**: Merge efficiency
- **PR Cycle Time**: Time to merge
- **Star Velocity**: Growth rate
- **Contributor Velocity**: New contributors
- **Risk Level**: Computed risk score
- **Ops Health**: Healthy / At Risk / Unmaintained

### Verdicts
- **Ops Health**: Healthy / At Risk / Unmaintained
- **Momentum**: Rising / Flat / Falling
- **Risk Level**: Low / Medium / High
- **Persona Badge**: Digital Fossil, CI Gremlin, Bus Factor Bomb, etc.

## 🎯 Keyboard Shortcuts

- `1` - Switch to Roast mode
- `2` - Switch to Praise mode
- `3` - Switch to Audit mode
- `4` - Switch to Investor mode
- `I` - Toggle Inspector cursor
- `A` - Toggle Arcade cursor
- `R` - Remix narrative
- `P` - Open Poster Studio
- `Esc` - Close modals

## 🧾 Evidence & Citations

Every claim in the narrative is backed by evidence:
- Click citation markers `[1]` `[2]` to jump to evidence
- Evidence cards show:
  - Metric key and value
  - Source (GitHub API endpoint)
  - Confidence level (0-100%)
  - Explanation
- Claims highlight related dashboard tiles
- Raw JSON available for power users

## 🎴 Poster Studio

Generate shareable cards with:
- 5 template styles
- Repo name and vibe score
- Best roast/praise lines
- Key receipts
- Sticker badges
- QR-like share element
- Download PNG or copy to clipboard

## 🔧 Technical Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Framer Motion** (animations)
- **Recharts** (charts)
- **Zustand** (state management)
- **Zod** (validation)
- **html-to-image** (poster generation)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts    # Analysis endpoint
│   │   └── poster/route.ts    # Poster endpoint (stub)
│   ├── layout.tsx
│   └── page.tsx                # Main page
├── components/
│   ├── BackgroundCosmos.tsx
│   ├── HeroIgnition.tsx
│   ├── ScanSequence.tsx
│   ├── RevealCard.tsx
│   ├── RepoMRI.tsx
│   ├── ScrubToReplay.tsx
│   ├── BentoDashboard.tsx
│   ├── MomentumStrip.tsx
│   ├── ReceiptsEvidenceRoom.tsx
│   ├── PosterStudio.tsx
│   ├── RightToolbar.tsx
│   ├── CursorModes.tsx
│   ├── Toasts.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   ├── Button.tsx
│   ├── Badge.tsx
│   └── Toggle.tsx
├── lib/
│   ├── mockAnalysis.ts         # Mock data generator
│   ├── github.ts               # GitHub API client
│   ├── scoring.ts              # Score computation
│   ├── narrative.ts            # Narrative generation
│   └── utils.ts                # Utilities
├── store/
│   └── useAppStore.ts          # Zustand store
├── types/
│   └── analysis.ts             # TypeScript types
└── styles/
    └── globals.css             # Global styles
```

## 🎨 Design Philosophy

- **Cinematic**: Scroll-driven story chapters
- **Transparent**: Every claim has receipts
- **Interactive**: Hover, click, scrub, play
- **Accessible**: Keyboard nav, reduce motion, contrast
- **Performant**: Lightweight, GPU-friendly, cached

## 🔒 Safety & Ethics

- All roasts are **fact-based** (no invented metrics)
- No personal attacks or harassment
- Focuses on **codebase/process**, not individuals
- Transparent evidence for every claim
- No security claims in MVP

## 🐛 Troubleshooting

**Build Errors?**
- Run `npm install` to ensure dependencies are installed
- Check Node.js version (18+ required)

**Rate Limit Errors?**
- Add GitHub token in hero section
- Or use mock mode (default)

**Poster Generation Fails?**
- Ensure browser supports Clipboard API
- Try download instead of copy

## 📝 License

MIT License

## 🙏 Acknowledgments

Built with:
- Next.js
- Framer Motion
- Recharts
- Zustand
- GitHub API

---

**Git Roaster v3** - Because every repo deserves a story with receipts. 🧾
