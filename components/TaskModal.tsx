"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Save, AlertCircle, Clock, Flame, Code, Target, Cpu, Palette, MessageSquare, User, Zap } from "lucide-react";
import { Task, Priority, TaskCategory } from "@/types";
import { cyberAudio } from "@/lib/audio";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, "id" | "createdAt" | "status"> & { id?: string }) => void;
  initialTask?: Task | null;
}

const CATEGORIES: TaskCategory[] = [
  "Technical",
  "Strategy",
  "Operations",
  "Design",
  "Communication",
  "Personal",
];

const PRIORITIES: Priority[] = ["Critical", "High", "Medium", "Low"];

const DEADLINE_PRESETS = [
  "In 30 mins",
  "In 2 hours",
  "Today 5pm",
  "Tonight 11:59pm",
  "Tomorrow morning",
  "This week",
];

const TIME_PRESETS = [10, 15, 25, 45, 60, 90, 120];

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialTask,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("Today 5pm");
  const [priority, setPriority] = useState<Priority>("High");
  const [risk, setRisk] = useState(70);
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [category, setCategory] = useState<TaskCategory>("Technical");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setDeadline(initialTask.deadline);
      setPriority(initialTask.priority);
      setRisk(initialTask.risk);
      setEstimatedMinutes(initialTask.estimatedMinutes);
      setCategory(initialTask.category);
    } else {
      setTitle("");
      setDescription("");
      setDeadline("Today 5pm");
      setPriority("High");
      setRisk(70);
      setEstimatedMinutes(30);
      setCategory("Technical");
    }
    setError("");
  }, [initialTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    cyberAudio.playActionClick();
    onSave({
      id: initialTask?.id,
      title: title.trim(),
      description: description.trim(),
      deadline: deadline.trim() || "Flexible",
      priority,
      risk,
      estimatedMinutes,
      category,
    });
    onClose();
  };

  const getRiskLabel = (val: number) => {
    if (val >= 85) return { label: "CRITICAL HAZARD", color: "text-rose-400" };
    if (val >= 65) return { label: "SEVERE FRICTION", color: "text-amber-400" };
    if (val >= 40) return { label: "MODERATE DRAG", color: "text-yellow-400" };
    return { label: "LOW FRICTION", color: "text-emerald-400" };
  };

  const riskInfo = getRiskLabel(risk);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.15)] text-slate-100 z-10 overflow-hidden"
          >
            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase">
                  Vector Management
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white mt-0.5">
                  {initialTask ? "Edit Mission Vector" : "Register Chaos Vector"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Vector Objective / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hotfix Payment Webhook Regression"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:bg-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Tactical Notes & Blockers (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Key details, error stack traces, dependencies, stakeholder contacts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:bg-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Priority & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${
                          priority === p
                            ? p === "Critical"
                              ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                              : p === "High"
                              ? "bg-amber-500/20 border-amber-500 text-amber-300"
                              : p === "Medium"
                              ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                              : "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                            : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Category Domain
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 text-white text-sm focus:outline-none transition-all"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deadline & Quick Presets */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">
                  Deadline Target
                </label>
                <input
                  type="text"
                  placeholder="e.g. Today 5pm, In 2 hours"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 text-white placeholder-slate-500 text-sm focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {DEADLINE_PRESETS.map((dp) => (
                    <button
                      key={dp}
                      type="button"
                      onClick={() => setDeadline(dp)}
                      className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-400 border border-white/5 transition-colors"
                    >
                      {dp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders: Risk Score & Duration */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                {/* Risk Score */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs font-mono">
                    <span className="text-slate-400 uppercase font-bold">Risk Probability</span>
                    <span className={`font-bold ${riskInfo.color}`}>
                      {risk}% — {riskInfo.label}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={risk}
                    onChange={(e) => setRisk(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Estimated Time */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                    <span className="text-slate-400 uppercase font-bold">Estimated Effort</span>
                    <span className="text-cyan-400 font-bold">{estimatedMinutes} Minutes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TIME_PRESETS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setEstimatedMinutes(m)}
                        className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all ${
                          estimatedMinutes === m
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                            : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit / Cancel Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
                >
                  {initialTask ? <Save size={16} /> : <Plus size={16} />}
                  <span>{initialTask ? "Update Vector" : "Deploy Vector"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
