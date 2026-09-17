"use client";

import { useState, useEffect, useMemo } from "react";
import Background from "@/components/Background";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import TelemetryPanel from "@/components/TelemetryPanel";
import TriageMatrix from "@/components/TriageMatrix";
import FocusMissionModal from "@/components/FocusMissionModal";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Loader2, 
  Activity, 
  Plus, 
  Volume2, 
  VolumeX, 
  LayoutList, 
  Grid, 
  Search, 
  Filter, 
  Flame, 
  Sparkles,
  RefreshCw,
  Layers
} from "lucide-react";
import { Task, RescuePlan, Priority, TaskCategory, TaskStatus, SystemStats } from "@/types";
import { PRESET_SCENARIOS } from "@/lib/presets";
import { cyberAudio } from "@/lib/audio";

const INITIAL_TASKS: Task[] = [
  {
    id: "init-1",
    title: "Fix UI Deployment Crash on Vercel",
    description: "Hydration mismatch breaking the live production dashboard before investor demo.",
    deadline: "In 2 hours",
    priority: "Critical",
    risk: 95,
    estimatedMinutes: 30,
    category: "Technical",
    status: "in_progress",
    createdAt: Date.now() - 3600000,
  },
  {
    id: "init-2",
    title: "Finalize Pitch Deck Financial Moat",
    description: "Update MRR projections and unit economics to match the latest customer retention metrics.",
    deadline: "Today, 5pm",
    priority: "High",
    risk: 85,
    estimatedMinutes: 45,
    category: "Strategy",
    status: "pending",
    createdAt: Date.now() - 7200000,
  },
  {
    id: "init-3",
    title: "Rehearse Demo Script with Engineering Lead",
    description: "Practice the 5-minute core narrative and objection handling flow.",
    deadline: "Tomorrow 10am",
    priority: "Medium",
    risk: 45,
    estimatedMinutes: 20,
    category: "Communication",
    status: "pending",
    createdAt: Date.now() - 10800000,
  },
  {
    id: "init-4",
    title: "Configure Stripe Sandbox Webhooks",
    description: "Verify payment success triggers and automated customer invoice delivery.",
    deadline: "Today 6pm",
    priority: "High",
    risk: 70,
    estimatedMinutes: 25,
    category: "Technical",
    status: "pending",
    createdAt: Date.now() - 14400000,
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [rescuePlan, setRescuePlan] = useState<RescuePlan | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "matrix">("list");
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFocusMissionOpen, setIsFocusMissionOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load persisted tasks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rescueflow_tasks_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
          setIsInitialized(true);
          return;
        }
      }
    } catch {
      // Fallback
    }
    setTasks(INITIAL_TASKS);
    setIsInitialized(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("rescueflow_tasks_v1", JSON.stringify(tasks));
    }
  }, [tasks, isInitialized]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        return;
      }

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setEditingTask(null);
        setIsTaskModalOpen(true);
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setViewMode((prev) => (prev === "list" ? "matrix" : "list"));
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        toggleSound();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSound = () => {
    const nextState = !isSoundMuted;
    setIsSoundMuted(nextState);
    cyberAudio.setSoundEnabled(!nextState);
    if (!nextState) {
      cyberAudio.playActionClick();
    }
  };

  // Compute System Statistics
  const stats: SystemStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status !== "completed");
    const critical = pending.filter((t) => t.priority === "Critical" || t.risk >= 80).length;
    const totalRisk = pending.reduce((acc, t) => acc + t.risk, 0);
    const avgRisk = pending.length > 0 ? Math.round(totalRisk / pending.length) : 0;
    const totalMins = pending.reduce((acc, t) => acc + (t.estimatedMinutes || 20), 0);

    // Dynamic Chaos Index calculation (0 - 100)
    let chaos = 0;
    if (pending.length > 0) {
      const riskWeight = (avgRisk / 100) * 50;
      const countWeight = Math.min(30, pending.length * 6);
      const criticalWeight = Math.min(20, critical * 10);
      chaos = Math.min(100, Math.round(riskWeight + countWeight + criticalWeight));
    }

    return {
      totalTasks: total,
      completedTasks: completed,
      criticalTasks: critical,
      avgRisk,
      chaosIndex: chaos,
      totalEstimatedMinutes: totalMins,
    };
  }, [tasks]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = (t.description || "").toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      // Category
      if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
      // Priority
      if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
      // Status
      if (statusFilter !== "All" && t.status !== statusFilter) return false;

      return true;
    });
  }, [tasks, searchQuery, categoryFilter, priorityFilter, statusFilter]);

  // Initiate AI Rescue Analysis
  const handleRescue = async () => {
    setLoading(true);
    cyberAudio.playLaserScan();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ tasks }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setRescuePlan(data);
      cyberAudio.playMissionStart();
      setIsFocusMissionOpen(true);
    } catch (error) {
      console.error("Rescue Analysis Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Task Operations
  const handleSaveTask = (
    taskData: Omit<Task, "id" | "createdAt" | "status"> & { id?: string }
  ) => {
    if (taskData.id) {
      // Update existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                title: taskData.title,
                description: taskData.description,
                deadline: taskData.deadline,
                priority: taskData.priority,
                risk: taskData.risk,
                estimatedMinutes: taskData.estimatedMinutes,
                category: taskData.category,
              }
            : t
        )
      );
    } else {
      // Create new
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: taskData.title,
        description: taskData.description,
        deadline: taskData.deadline,
        priority: taskData.priority,
        risk: taskData.risk,
        estimatedMinutes: taskData.estimatedMinutes,
        category: taskData.category,
        status: "pending",
        createdAt: Date.now(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleToggleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus: TaskStatus =
          t.status === "pending"
            ? "in_progress"
            : t.status === "in_progress"
            ? "completed"
            : "pending";
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleLoadPreset = (presetId: string) => {
    const scenario = PRESET_SCENARIOS.find((s) => s.id === presetId);
    if (!scenario) return;

    const populated: Task[] = scenario.tasks.map((t, idx) => ({
      ...t,
      id: `preset-${presetId}-${idx}-${Date.now()}`,
      createdAt: Date.now() - idx * 1000,
    }));

    setTasks(populated);
    setRescuePlan(null);
  };

  const handleClearAll = () => {
    setTasks([]);
    setRescuePlan(null);
  };

  return (
    <main className="min-h-screen text-slate-100 p-4 sm:p-8 md:p-12 relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      <Background />

      {/* Futuristic Scanning Laser Sweep Animation */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ top: "-5%" }}
            animate={{ top: "105%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="fixed left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_25px_#22d3ee] z-[150] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-white/10 pb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase">
                  System Active • Protocol Rescue
                </span>
              </div>

              {stats.criticalTasks > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-mono font-bold uppercase animate-pulse">
                  <Flame size={11} />
                  <span>{stats.criticalTasks} Critical Threats</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter">
              RESCUE<span className="text-cyan-400">FLOW</span>
            </h1>
            <p className="text-slate-400 font-medium italic mt-1 text-sm sm:text-base">
              Autonomous AI triage & tactical emergency focus engine.
            </p>
          </div>

          {/* Action Bar Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              title={isSoundMuted ? "Unmute Cyber SFX (Press S)" : "Mute Cyber SFX (Press S)"}
              className={`p-3.5 rounded-2xl border transition-all ${
                isSoundMuted
                  ? "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                  : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              }`}
            >
              {isSoundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* View Switcher (List vs Matrix) */}
            <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playActionClick();
                  setViewMode("list");
                }}
                className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-mono font-bold ${
                  viewMode === "list"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutList size={16} />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playActionClick();
                  setViewMode("matrix");
                }}
                className={`p-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-mono font-bold ${
                  viewMode === "matrix"
                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Grid size={16} />
                <span className="hidden sm:inline">Matrix</span>
              </button>
            </div>

            {/* Register Task Button */}
            <button
              type="button"
              onClick={() => {
                cyberAudio.playActionClick();
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs sm:text-sm font-mono flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={16} className="text-cyan-400" />
              <span>Register Vector</span>
            </button>

            {/* Primary Rescue Button */}
            <button
              type="button"
              onClick={handleRescue}
              disabled={loading || tasks.length === 0}
              className="relative group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_30px_rgba(6,182,212,0.4)] overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <motion.div
                animate={loading ? { x: ["-100%", "100%"] } : {}}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
              <div className="flex items-center gap-2 relative z-10">
                {loading ? (
                  <Loader2 className="animate-spin text-slate-950" size={18} />
                ) : (
                  <ShieldAlert size={18} className="text-slate-950" />
                )}
                <span>{loading ? "Scanning Chaos..." : "Initiate Rescue"}</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Search & Filter Toolbar */}
        <div className="mb-8 p-4 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search active vectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 text-white placeholder-slate-500 text-xs focus:outline-none transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="All" className="bg-slate-900">All Domains</option>
              <option value="Technical" className="bg-slate-900">Technical</option>
              <option value="Strategy" className="bg-slate-900">Strategy</option>
              <option value="Operations" className="bg-slate-900">Operations</option>
              <option value="Design" className="bg-slate-900">Design</option>
              <option value="Communication" className="bg-slate-900">Communication</option>
              <option value="Personal" className="bg-slate-900">Personal</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="All" className="bg-slate-900">All Priorities</option>
              <option value="Critical" className="bg-slate-900">Critical Only</option>
              <option value="High" className="bg-slate-900">High Only</option>
              <option value="Medium" className="bg-slate-900">Medium Only</option>
              <option value="Low" className="bg-slate-900">Low Only</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="All" className="bg-slate-900">All Status</option>
              <option value="pending" className="bg-slate-900">Pending</option>
              <option value="in_progress" className="bg-slate-900">In Progress</option>
              <option value="completed" className="bg-slate-900">Resolved</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Feed & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed Section (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2.5">
                <Activity size={16} className="text-cyan-400" />
                <span>Mission Vectors Queue</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px]">
                  {filteredTasks.length} Visible
                </span>
              </h2>

              {rescuePlan && (
                <button
                  type="button"
                  onClick={() => setIsFocusMissionOpen(true)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles size={14} /> Open Active Mission HUD
                </button>
              )}
            </div>

            {/* View Mode Switching: List or 2x2 Matrix */}
            {viewMode === "list" ? (
              <div
                className={`space-y-4 transition-all duration-500 ${
                  loading ? "blur-sm scale-[0.98] opacity-50 pointer-events-none" : ""
                }`}
              >
                {filteredTasks.length === 0 ? (
                  <div className="p-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center backdrop-blur-xl">
                    <Activity size={36} className="text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-300 mb-1">
                      No matching mission vectors
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                      Clear your search filters or deploy a new vector to initiate emergency triage.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        cyberAudio.playActionClick();
                        setEditingTask(null);
                        setIsTaskModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold hover:bg-cyan-500/20 transition-colors"
                    >
                      + Register First Vector
                    </button>
                  </div>
                ) : (
                  filteredTasks.map((task, idx) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={idx}
                      onToggleStatus={handleToggleStatus}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            ) : (
              <TriageMatrix
                tasks={filteredTasks}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEditTask}
              />
            )}
          </div>

          {/* Right Telemetry Column (1 col) */}
          <TelemetryPanel
            tasks={tasks}
            rescuePlan={rescuePlan}
            stats={stats}
            onLoadPreset={handleLoadPreset}
            onClearAll={handleClearAll}
          />
        </div>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      {/* Interactive Focus Mission Execution HUD */}
      <FocusMissionModal
        isOpen={isFocusMissionOpen}
        rescuePlan={rescuePlan}
        onClose={() => setIsFocusMissionOpen(false)}
      />
    </main>
  );
}
