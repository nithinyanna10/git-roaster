// Get current GitHub repo from active tab
async function getCurrentRepo() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.url && tab.url.includes('github.com')) {
    const match = tab.url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return `${match[1]}/${match[2]}`;
    }
  }
  return null;
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  const repoInput = document.getElementById('repoInput');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const statusDiv = document.getElementById('status');
  const modeButtons = document.querySelectorAll('.mode-buttons button');
  
  let selectedMode = 'roast';
  
  // Get current repo from GitHub page
  const currentRepo = await getCurrentRepo();
  if (currentRepo) {
    repoInput.value = currentRepo;
  }
  
  // Mode selection
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMode = btn.dataset.mode;
    });
  });
  
  // Analyze button
  analyzeBtn.addEventListener('click', async () => {
    const repo = repoInput.value.trim();
    if (!repo) {
      showStatus('Please enter a repository', 'error');
      return;
    }
    
    analyzeBtn.disabled = true;
    showStatus('Analyzing...', 'loading');
    
    try {
      // Get the base URL from storage or use default
      const result = await chrome.storage.sync.get(['gitRoasterUrl']);
      const baseUrl = result.gitRoasterUrl || 'http://localhost:3000';
      
      // Open Git Roaster in new tab
      const repoUrl = repo.includes('/') && !repo.includes('github.com') 
        ? `https://github.com/${repo}` 
        : repo;
      
      const url = new URL(baseUrl);
      url.searchParams.set('repo', repoUrl);
      url.searchParams.set('mode', selectedMode);
      
      chrome.tabs.create({ url: url.toString() });
      window.close();
    } catch (error) {
      showStatus('Error: ' + error.message, 'error');
      analyzeBtn.disabled = false;
    }
  });
  
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    if (type !== 'loading') {
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 3000);
    }
  }
});
