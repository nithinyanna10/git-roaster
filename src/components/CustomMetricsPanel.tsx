"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, CustomMetric } from "@/store/useAppStore";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Toggle } from "./Toggle";
import { showToast } from "./Toasts";

export function CustomMetricsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { customMetrics, addCustomMetric, removeCustomMetric, updateCustomMetric } = useAppStore();
  const [editing, setEditing] = useState<CustomMetric | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    formula: "",
    description: "",
  });

  const handleSave = () => {
    if (!formData.name || !formData.formula) {
      showToast("Name and formula are required");
      return;
    }

    if (editing) {
      updateCustomMetric(editing.id, formData);
      showToast("Metric updated!");
    } else {
      addCustomMetric({
        id: Date.now().toString(),
        ...formData,
        enabled: true,
        createdAt: Date.now(),
      });
      showToast("Custom metric added!");
    }

    setFormData({ name: "", formula: "", description: "" });
    setEditing(null);
  };

  const handleEdit = (metric: CustomMetric) => {
    setEditing(metric);
    setFormData({
      name: metric.name,
      formula: metric.formula,
      description: metric.description,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this custom metric?")) {
      removeCustomMetric(id);
      showToast("Metric deleted");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Custom Metrics">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Add/Edit Form */}
        <div className="glass rounded-lg p-4 space-y-4">
          <h3 className="font-bold text-lg mb-4">
            {editing ? "Edit Metric" : "Create Custom Metric"}
          </h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Metric Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Code Quality Index"
              className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Formula</label>
            <input
              type="text"
              value={formData.formula}
              onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
              placeholder="e.g., (pulse + busFactor) / 2"
              className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Use metric keys: pulse, churn, busFactor, tests, releases, docs, etc.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What does this metric measure?"
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-zinc-950/50 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} variant="primary" size="sm">
              {editing ? "Update" : "Create"} Metric
            </Button>
            {editing && (
              <Button
                onClick={() => {
                  setEditing(null);
                  setFormData({ name: "", formula: "", description: "" });
                }}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Existing Metrics */}
        <div>
          <h3 className="font-bold text-lg mb-4">Your Custom Metrics</h3>
          {customMetrics.length === 0 ? (
            <p className="text-zinc-400 text-sm">No custom metrics yet. Create one above!</p>
          ) : (
            <div className="space-y-2">
              {customMetrics.map((metric) => (
                <motion.div
                  key={metric.id}
                  className="glass rounded-lg p-4 flex items-start justify-between group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{metric.name}</span>
                      <Toggle
                        checked={metric.enabled}
                        onChange={(enabled) => updateCustomMetric(metric.id, { enabled })}
                      />
                    </div>
                    <code className="text-xs text-purple-400 font-mono block mb-1">
                      {metric.formula}
                    </code>
                    {metric.description && (
                      <p className="text-sm text-zinc-400">{metric.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(metric)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(metric.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
