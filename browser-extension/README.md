# Git Roaster Browser Extension

A browser extension that adds a "Roast" button to GitHub repository pages for quick analysis.

## Installation

### Chrome/Edge
1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `browser-extension` folder

### Firefox
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `manifest.json` from the `browser-extension` folder

## Features

- **Quick Analysis**: Click "🔥 Roast" button on any GitHub repo page
- **Popup**: Click extension icon to analyze any repo
- **Mode Selection**: Choose Roast, Praise, Audit, or Investor mode
- **Auto-detect**: Automatically detects current GitHub repo

## Configuration

1. Click the extension icon
2. The extension uses `http://localhost:3000` by default
3. To change the base URL, modify `popup.js` and `content.js` or add storage sync

## Usage

1. Navigate to any GitHub repository
2. Click the "🔥 Roast" button in the GitHub action bar
3. Or click the extension icon and enter a repo URL

## Development

To customize the extension:
- Edit `popup.html` and `popup.js` for the popup interface
- Edit `content.js` for the GitHub page integration
- Edit `manifest.json` for permissions and configuration
