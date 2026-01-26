"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { showToast } from "./Toasts";

export function PWASetup() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      showToast("Install prompt not available");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      showToast("App installed successfully!");
      setIsInstalled(true);
      setIsInstallable(false);
    } else {
      showToast("Installation cancelled");
    }
    
    setDeferredPrompt(null);
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Progressive Web App</h3>
        <p className="text-zinc-400 text-sm">Install as native app with offline support</p>
      </div>

      <div className="space-y-4">
        {isInstalled ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-zinc-300 font-bold mb-2">App Installed!</p>
            <p className="text-sm text-zinc-400">Git Roaster is installed as a PWA</p>
          </div>
        ) : isInstallable ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl mb-2">📱</div>
              <p className="text-zinc-300 mb-4">Install Git Roaster as an app</p>
              <Button onClick={handleInstall} variant="primary" size="lg" className="w-full">
                📲 Install App
              </Button>
            </div>
            <div className="glass rounded-lg p-4 space-y-2 text-sm text-zinc-400">
              <p><strong>Benefits:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Works offline with cached data</li>
                <li>App-like experience</li>
                <li>Push notifications</li>
                <li>Faster loading</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400">
            <div className="text-6xl mb-4">📱</div>
            <p>Install prompt will appear when available</p>
            <p className="text-xs mt-2">(Usually on mobile devices or Chrome desktop)</p>
          </div>
        )}

        <div className="glass rounded-lg p-4 bg-blue-900/20 border border-blue-700/50">
          <p className="text-sm text-blue-300">
            💡 <strong>PWA Features:</strong> Offline support, push notifications, app-like experience, and background sync.
          </p>
        </div>
      </div>
    </Card>
  );
}
