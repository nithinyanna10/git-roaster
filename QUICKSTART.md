# Git Roaster - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. (Optional) Configure Environment
Copy `.env.example` to `.env.local` and add your GitHub token if needed:
```bash
cp .env.example .env.local
# Edit .env.local and add GITHUB_TOKEN if you want higher rate limits
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start roasting repos! 🔥

## 🎯 Try It Out

1. Go to any public GitHub repository
2. Copy the URL (e.g., `https://github.com/vercel/next.js`)
3. Paste it into Git Roaster
4. Click "Roast it!" and enjoy the analysis

## 🔧 Optional: Enable Ollama Mode

If you have Ollama installed locally:

1. Start Ollama and pull a model:
```bash
ollama pull llama3.2:1b
```

2. Toggle "Spicy AI (Ollama)" in the UI
3. Get more creative roasts powered by your local LLM!

## 📊 What Gets Analyzed?

- **Pulse**: Activity and commit frequency
- **Bus Factor**: How distributed the contributions are
- **Churn**: Code changes and stability
- **Tests**: Test coverage and CI/CD setup
- **Releases**: Release frequency and recency
- **Docs**: Documentation quality

## 🐛 Troubleshooting

**Rate Limit Errors?**
- Add a GitHub token in `.env.local` or use the UI token input
- Get a token at: https://github.com/settings/tokens

**Ollama Not Working?**
- Make sure Ollama is running: `ollama serve`
- Check `OLLAMA_URL` in `.env.local` matches your Ollama instance
- The app will automatically fall back to templates if Ollama fails

**Build Errors?**
- Run `npm install` again
- Check Node.js version (needs 18+)

## 🎉 You're Ready!

That's it! Start analyzing repositories and have fun with Git Roaster.
