// Add Git Roaster button to GitHub repo pages
(function() {
  'use strict';
  
  function addRoasterButton() {
    // Check if button already exists
    if (document.getElementById('git-roaster-btn')) {
      return;
    }
    
    // Find the GitHub action buttons area
    const actionsBar = document.querySelector('.pagehead-actions') || 
                      document.querySelector('.d-flex.flex-items-center');
    
    if (!actionsBar) {
      return;
    }
    
    // Create button
    const button = document.createElement('a');
    button.id = 'git-roaster-btn';
    button.className = 'btn btn-sm';
    button.style.cssText = 'background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; border: none; margin-left: 8px;';
    button.textContent = '🔥 Roast';
    button.title = 'Analyze with Git Roaster';
    
    // Get current repo
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const owner = pathParts[0];
      const repo = pathParts[1];
      
      // Get base URL from storage or use default
      chrome.storage.sync.get(['gitRoasterUrl'], (result) => {
        const baseUrl = result.gitRoasterUrl || 'http://localhost:3000';
        const url = new URL(baseUrl);
        url.searchParams.set('repo', `${owner}/${repo}`);
        url.searchParams.set('mode', 'roast');
        button.href = url.toString();
        button.target = '_blank';
      });
    }
    
    actionsBar.appendChild(button);
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addRoasterButton);
  } else {
    addRoasterButton();
  }
  
  // Re-run on navigation (GitHub uses SPA)
  const observer = new MutationObserver(() => {
    addRoasterButton();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
