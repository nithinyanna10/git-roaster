"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, RSSSubscription } from "@/store/useAppStore";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Toggle } from "./Toggle";
import { showToast } from "./Toasts";

export function RSSFeedsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { rssSubscriptions, addRSSSubscription, removeRSSSubscription } = useAppStore();
  const [formData, setFormData] = useState({
    repoUrl: "",
    repoName: "",
  });

  const generateFeedUrl = (repoUrl: string) => {
    // Generate RSS feed URL for the repo
    const match = repoUrl.match(/(?:github\.com\/)?([^\/]+)\/([^\/]+)/);
    if (match) {
      const [, owner, repo] = match;
      return `${window.location.origin}/api/rss/${owner}/${repo}`;
    }
    return "";
  };

  const handleSubscribe = () => {
    if (!formData.repoUrl) {
      showToast("Repository URL is required");
      return;
    }

    const feedUrl = generateFeedUrl(formData.repoUrl);
    if (!feedUrl) {
      showToast("Invalid repository URL");
      return;
    }

    const match = formData.repoUrl.match(/(?:github\.com\/)?([^\/]+)\/([^\/]+)/);
    const repoName = match ? `${match[1]}/${match[2]}` : formData.repoUrl;

    addRSSSubscription({
      id: Date.now().toString(),
      repoUrl: formData.repoUrl,
      repoName,
      feedUrl,
      enabled: true,
      createdAt: Date.now(),
    });

    showToast("RSS feed subscribed!");
    setFormData({ repoUrl: "", repoName: "" });
  };

  const handleUnsubscribe = (id: string) => {
    if (confirm("Unsubscribe from this RSS feed?")) {
      removeRSSSubscription(id);
      showToast("Unsubscribed");
    }
  };

  const copyFeedUrl = (feedUrl: string) => {
    navigator.clipboard.writeText(feedUrl);
    showToast("Feed URL copied!");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="RSS Feeds">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Subscribe Form */}
        <div className="glass rounded-lg p-4 space-y-4">
          <h3 className="font-bold text-lg mb-4">Subscribe to Repo Updates</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Repository URL</label>
            <input
              type="text"
              value={formData.repoUrl}
              onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
              placeholder="https://github.com/owner/repo or owner/repo"
              className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <Button onClick={handleSubscribe} variant="primary" size="sm" className="w-full">
            Subscribe
          </Button>
        </div>

        {/* Subscriptions */}
        <div>
          <h3 className="font-bold text-lg mb-4">Your RSS Subscriptions</h3>
          {rssSubscriptions.length === 0 ? (
            <p className="text-zinc-400 text-sm">No RSS subscriptions yet.</p>
          ) : (
            <div className="space-y-2">
              {rssSubscriptions.map((subscription) => (
                <motion.div
                  key={subscription.id}
                  className="glass rounded-lg p-4 space-y-2 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{subscription.repoName}</span>
                        <Toggle
                          checked={subscription.enabled}
                          onChange={(enabled) => {
                            // Would need updateRSSSubscription function
                            showToast("Toggle requires backend integration");
                          }}
                        />
                      </div>
                      <div className="text-sm text-zinc-400 space-y-1">
                        <div className="flex items-center gap-2">
                          <span>🔗 {subscription.feedUrl}</span>
                          <button
                            onClick={() => copyFeedUrl(subscription.feedUrl)}
                            className="text-purple-400 hover:text-purple-300 text-xs"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnsubscribe(subscription.id)}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-lg p-4 bg-blue-900/20 border border-blue-700/50">
          <p className="text-sm text-blue-300 mb-2">
            📡 <strong>How to use RSS feeds:</strong>
          </p>
          <ol className="text-sm text-blue-300/80 space-y-1 list-decimal list-inside">
            <li>Copy the feed URL</li>
            <li>Add it to your RSS reader (Feedly, Inoreader, etc.)</li>
            <li>Get notified when repos are analyzed or updated</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
}
