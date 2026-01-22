"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, EmailReport } from "@/store/useAppStore";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Toggle } from "./Toggle";
import { showToast } from "./Toasts";

export function EmailReportsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { emailReports, addEmailReport, removeEmailReport } = useAppStore();
  const [formData, setFormData] = useState<{
    repoUrl: string;
    repoName: string;
    email: string;
    frequency: "weekly" | "monthly";
    mode: "roast" | "praise" | "audit" | "investor";
  }>({
    repoUrl: "",
    repoName: "",
    email: "",
    frequency: "weekly",
    mode: "roast",
  });

  const handleAdd = () => {
    if (!formData.repoUrl || !formData.email) {
      showToast("Repository URL and email are required");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Please enter a valid email address");
      return;
    }

    addEmailReport({
      id: Date.now().toString(),
      ...formData,
      enabled: true,
      createdAt: Date.now(),
    });

    showToast("Email report scheduled! (Note: Backend email service required)");
    setFormData({
      repoUrl: "",
      repoName: "",
      email: "",
      frequency: "weekly",
      mode: "roast",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Stop sending email reports for this repo?")) {
      removeEmailReport(id);
      showToast("Email report removed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Reports">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Add Report Form */}
        <div className="glass rounded-lg p-4 space-y-4">
          <h3 className="font-bold text-lg mb-4">Schedule Email Report</h3>
          
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

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormData({ ...formData, frequency: "weekly" })}
                className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                  formData.frequency === "weekly"
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setFormData({ ...formData, frequency: "monthly" })}
                className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                  formData.frequency === "monthly"
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Analysis Mode</label>
            <div className="flex gap-2 flex-wrap">
              {(["roast", "praise", "audit", "investor"] as const).map((mode: "roast" | "praise" | "audit" | "investor") => (
                <button
                  key={mode}
                  onClick={() => setFormData({ ...formData, mode })}
                  className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                    formData.mode === mode
                      ? "border-purple-500 bg-purple-500/20 text-purple-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleAdd} variant="primary" size="sm" className="w-full">
            Schedule Report
          </Button>
        </div>

        {/* Existing Reports */}
        <div>
          <h3 className="font-bold text-lg mb-4">Scheduled Reports</h3>
          {emailReports.length === 0 ? (
            <p className="text-zinc-400 text-sm">No email reports scheduled yet.</p>
          ) : (
            <div className="space-y-2">
              {emailReports.map((report) => (
                <motion.div
                  key={report.id}
                  className="glass rounded-lg p-4 flex items-start justify-between group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{report.repoName || report.repoUrl}</span>
                      <Toggle
                        checked={report.enabled}
                        onChange={(enabled) => {
                          // Would need updateEmailReport function
                          showToast("Toggle requires backend integration");
                        }}
                      />
                    </div>
                    <div className="text-sm text-zinc-400 space-y-1">
                      <div>📧 {report.email}</div>
                      <div>
                        📅 {report.frequency === "weekly" ? "Weekly" : "Monthly"} •{" "}
                        {report.mode.charAt(0).toUpperCase() + report.mode.slice(1)} mode
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-lg p-4 bg-yellow-900/20 border border-yellow-700/50">
          <p className="text-sm text-yellow-300">
            ⚠️ <strong>Note:</strong> Email reports require backend email service integration.
            Currently, reports are saved locally but not sent automatically.
          </p>
        </div>
      </div>
    </Modal>
  );
}
