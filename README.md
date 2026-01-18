# Git Roaster 🔥

**A playful, data-driven tool that analyzes GitHub repositories and generates roasts or praise based on actual metrics.**

Git Roaster takes a GitHub repository URL, analyzes its history and health (activity, churn, contributors, tests/CI, releases), and generates either a humorous "Roast" or supportive "Praise" - all grounded in real data with transparent "Receipts" showing exactly which metrics were used.

## ✨ Features

- **🔍 Comprehensive Analysis**: Analyzes repository activity, bus factor, code churn, test coverage, releases, and documentation
- **🔥 Roast Mode**: Playful, fact-based critiques that never invent facts or attack individuals
- **✨ Praise Mode**: Supportive feedback highlighting what's going well
- **📊 Scorecards**: Six badges (Pulse, Stability, Bus Factor, Tests, Releases, Docs) plus an overall Vibe Score
- **📈 Visualizations**: Charts showing commit trends and code churn over time
- **📋 Receipts**: Transparent evidence panel showing exactly which metrics support each claim
- **🤖 Optional LLM Mode**: Uses local Ollama for more creative roasts (with template fallback)
- **💾 Export & Share**: Copy share links, narrative text, or export full analysis as JSON
- **⚡ Fast & Cached**: Results are cached for 1 hour to reduce API calls

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- (Optional) Ollama installed locally if you want to use LLM mode

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. (Optional) Create a `.env.local` file for configuration:

```bash
# Optional: GitHub Personal Access Token
# Get one at: https://github.com/settings/tokens
# Increases rate limits and allows access to private repos
GITHUB_TOKEN=ghp_your_token_here

# Optional: Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

1. **Enter a GitHub Repository URL**: Paste any public GitHub repository URL (e.g., `https://github.com/owner/repo`)
2. **Choose Mode**: Toggle between "Roast" (playful critique) or "Praise" (supportive feedback)
3. **Optional Settings**:
   - Enable "Spicy AI (Ollama)" to use your local Ollama instance for more creative roasts
   - Add a GitHub token for private repos or higher rate limits
4. **Click "Roast it!"** and wait for the analysis
5. **Explore Results**:
   - Read the narrative (roast or praise)
   - Check the scorecard badges
   - View commit and churn trends
   - Expand "Receipts" to see exact metrics used
   - Share, copy, or export the analysis

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: TailwindCSS with dark theme
- **Charts**: Recharts
- **Caching**: LRU cache (in-memory)
- **API**: GitHub REST API

### Project Structure

```
git-roaster/
├── app/
│   ├── api/analyze/route.ts    # Analysis API endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   └── globals.css             # Global styles
├── components/
│   ├── Charts.tsx              # Chart visualizations
│   ├── Receipts.tsx           # Evidence panel
│   └── ScoreBadge.tsx          # Score badge component
├── lib/
│   ├── github/
│   │   └── client.ts           # GitHub API client
│   ├── metrics/
│   │   └── compute.ts          # Metrics computation & scoring
│   ├── roast/
│   │   ├── index.ts            # Narrative generation orchestrator
│   │   ├── templates.ts        # Template-based roasts/praises
│   │   └── ollama.ts           # Ollama LLM integration
│   └── utils.ts                # Utility functions
├── types/
│   └── index.ts                # TypeScript type definitions
└── tests/                      # Unit tests
```

## 📊 Metrics Computed

### Pulse
- Days since last commit
- Commits in last 7/30/90 days
- Commit trend (increasing/decreasing/stable)

### Bus Factor
- Percentage of commits by top contributor
- Number of unique contributors in last 90 days

### Churn
- Total additions/deletions in last 90 days
- Churn ratio (lines changed per commit)

### Tests & CI
- Presence of test directories
- Presence of CI/CD workflows

### Releases
- Total release count
- Days since last release
- Release frequency (per month)

### Documentation
- README presence and length

## 🎯 Scoring System

Each repository receives six scores (0-100):

1. **Pulse** (25% weight): Activity and recency
2. **Stability** (20% weight): Code churn and stability
3. **Bus Factor** (15% weight): Distribution of contributions
4. **Tests** (15% weight): Test coverage and CI/CD
5. **Releases** (15% weight): Release frequency and recency
6. **Docs** (10% weight): Documentation quality

The **Vibe Score** is a weighted average of all six scores.

## 🔒 Safety & Ethics

- **Fact-Based**: All roasts are grounded in actual repository metrics
- **No Harassment**: Never attacks individuals or uses slurs
- **Codebase Focus**: Critiques repository behavior (missing tests, inactivity), not people
- **No Security Claims**: MVP avoids making security assessments
- **Transparent**: Every claim shows its evidence in the Receipts panel

## 🧪 Testing

Run tests with:

```bash
npm test
```

Tests cover:
- URL parsing and validation
- Template selection logic
- Claim-to-evidence mapping
- Metrics computation

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Set these in your deployment environment:

- `GITHUB_TOKEN` (optional): GitHub Personal Access Token
- `OLLAMA_URL` (optional): Ollama API URL (default: `http://localhost:11434`)
- `OLLAMA_MODEL` (optional): Ollama model name (default: `llama3.2:1b`)

### Rate Limits

- **Without token**: 60 requests/hour per IP
- **With token**: 5,000 requests/hour

If you hit rate limits, add a GitHub token in the UI or environment variables.

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- Additional metrics (code complexity, dependency health, etc.)
- More template variations
- Better error handling
- Performance optimizations
- UI/UX enhancements

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [GitHub API](https://docs.github.com/en/rest)
- [Ollama](https://ollama.ai/) (optional)

## 📸 Screenshots

_(Add screenshots of the app here)_

## 🐛 Known Issues

- Large repositories (>200 commits) may take longer to analyze
- Private repositories require a GitHub token
- Ollama integration requires local Ollama instance running

## 🔮 Future Enhancements

- [ ] "Roast intensity" slider (mild → savage, but still safe)
- [ ] Compare two repositories side-by-side
- [ ] Chrome extension overlay
- [ ] More sophisticated metrics (code complexity, dependency health)
- [ ] Historical analysis (how has the repo changed over time?)
- [ ] Export to PDF
- [ ] Social sharing with preview cards

---

**Made with ❤️ and a healthy dose of humor**
