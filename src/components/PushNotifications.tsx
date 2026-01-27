"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Analysis } from "@/types/analysis";
import { Card } from "./Card";
import { Button } from "./Button";
import { Toggle } from "./Toggle";
import { showToast } from "./Toasts";

interface PushNotificationsProps {
  analysis: Analysis | null;
}

export function PushNotifications({ analysis }: PushNotificationsProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; body: string; timestamp: number }>>([]);

  useEffect(() => {
    // Check notification permission
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      showToast("Notifications not supported in this browser");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      showToast("Notifications enabled!");
      setIsEnabled(true);
    } else {
      showToast("Notification permission denied");
    }
  };

  const sendTestNotification = () => {
    if (permission !== "granted") {
      showToast("Please enable notifications first");
      return;
    }

    const notification = new Notification("Git Roaster Alert", {
      body: analysis 
        ? `Analysis complete for ${analysis.repo.fullName}! Vibe score: ${analysis.scores.vibe}`
        : "Test notification from Git Roaster",
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      tag: "git-roaster-notification",
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        title: "Git Roaster Alert",
        body: notification.body || "",
        timestamp: Date.now(),
      },
      ...prev,
    ].slice(0, 10));
  };

  const simulateAlert = (type: "health-drop" | "new-commit" | "pr-opened" | "issue-closed") => {
    if (permission !== "granted" || !isEnabled) {
      showToast("Enable notifications to receive alerts");
      return;
    }

    const messages = {
      "health-drop": {
        title: "Repo Health Alert",
        body: "Your repo's health score dropped by 15% this week",
      },
      "new-commit": {
        title: "New Commit",
        body: "New commit pushed to main branch",
      },
      "pr-opened": {
        title: "Pull Request",
        body: "New pull request opened",
      },
      "issue-closed": {
        title: "Issue Resolved",
        body: "An issue was closed",
      },
    };

    const message = messages[type];
    const notification = new Notification(message.title, {
      body: message.body,
      icon: "/icon-192x192.png",
      tag: `git-roaster-${type}`,
    });

    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        title: message.title,
        body: message.body,
        timestamp: Date.now(),
      },
      ...prev,
    ].slice(0, 10));
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔔</span>
          <div>
            <h3 className="text-xl font-bold">Push Notifications</h3>
            <p className="text-sm text-zinc-400">Browser notifications for significant events</p>
          </div>
        </div>
        <Toggle
          checked={isEnabled && permission === "granted"}
          onChange={() => {
            if (permission !== "granted") {
              requestPermission();
            } else {
              setIsEnabled(!isEnabled);
            }
          }}
        />
      </div>

      {permission === "default" && (
        <div className="glass rounded-lg p-4 border border-yellow-500/50">
          <p className="text-sm text-zinc-300 mb-3">
            Enable browser notifications to receive alerts about repo changes, health drops, and important events.
          </p>
          <Button onClick={requestPermission} variant="primary" size="sm">
            Enable Notifications
          </Button>
        </div>
      )}

      {permission === "denied" && (
        <div className="glass rounded-lg p-4 border border-red-500/50">
          <p className="text-sm text-red-300">
            Notifications are blocked. Please enable them in your browser settings.
          </p>
        </div>
      )}

      {permission === "granted" && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={sendTestNotification} variant="secondary" size="sm">
              Test Notification
            </Button>
            <Button onClick={() => simulateAlert("health-drop")} variant="secondary" size="sm">
              Simulate Health Alert
            </Button>
            <Button onClick={() => simulateAlert("new-commit")} variant="secondary" size="sm">
              Simulate Commit
            </Button>
          </div>

          {notifications.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="text-sm font-semibold text-zinc-400">Recent Notifications</h4>
              {notifications.map((notif) => (
                <div key={notif.id} className="p-3 glass rounded-lg text-sm">
                  <div className="font-medium">{notif.title}</div>
                  <div className="text-zinc-400 text-xs mt-1">{notif.body}</div>
                  <div className="text-zinc-500 text-xs mt-1">
                    {new Date(notif.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-zinc-500">
        💡 Notifications work even when the browser is closed (if supported by your browser).
      </div>
    </Card>
  );
}
