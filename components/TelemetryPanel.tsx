"use client";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Activity, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  CheckCircle,
  Zap
} from "lucide-react";
import { Task, RescuePlan, SystemStats } from "@/types";
import { PRESET_SCENARIOS } from "@/lib/presets";
import { cyberAudio } from "@/lib/audio";

interface TelemetryPanelProps {
  tasks: Task[];
  rescuePlan: RescuePlan | null;
  stats: SystemStats;
  onLoadPreset: (presetId: string) => void;
  onClearAll: () => void;
}

export default function TelemetryPanel({
  tasks,
  rescuePlan,
  stats,
  onLoadPreset,
  onClearAll,
}: TelemetryPanelProps) {
  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const chaosColor =
    stats.chaosIndex >= 75
      ? "text-rose-400"
      : stats.chaosIndex >= 50
      ? "text-amber-400"
      : "text-cyan-400";

  const chaosBg =
    stats.chaosIndex >= 75
      ? "bg-rose-500"
      : stats.chaosIndex >= 50
      ? "bg-amber-500"
      : "bg-cyan-500";

  return (
    <div className="space-y-6">
      {/* Primary Efficiency & Telemetry Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-7 rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-bl-[4rem] pointer-events-none" />
        <div className="absolute top-6 right-6">
          <Terminal size={18} className="text-cyan-400/60" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase">
            System Telemetry
          </span>
        </div>

        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Execution Efficiency
        </h3>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            {rescuePlan ? rescuePlan.productivityScore : Math.max(10, 100 - Math.round(stats.chaosIndex * 0.7))}
          </span>
          <span className="text-cyan-400 text-3xl font-black">%</span>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          {rescuePlan
            ? rescuePlan.analysisSummary
            : stats.chaosIndex > 70
            ? "Severe cognitive drag detected. Critical vector triage advised."
            : "Vectors operating within sustainable bandwidth parameters."}
        </p>

        {/* Progress Bars for Chaos & Load */}
        <div className="space-y-4">
          {/* Chaos Index */}
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1.5">
              <span className="text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                <Flame size={12} className={chaosColor} /> Chaos Index
              </span>
              <span className={`font-bold ${chaosColor}`}>{stats.chaosIndex}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.chaosIndex}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full ${chaosBg} shadow-[0_0_10px_currentColor]`}
              />
            </div>
          </div>

          {/* Time to Resolution */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-center">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-center gap-1 mb-1">
                <Clock size={11} className="text-cyan-400" /> Resolution Est.
              </div>
              <div className="text-lg font-bold font-mono text-slate-100">
                {formatTime(stats.totalEstimatedMinutes)}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-center gap-1 mb-1">
                <ShieldCheck size={11} className="text-emerald-400" /> Resolved
              </div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {stats.completedTasks} / {stats.totalTasks}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Tactical Quick Wins (If Plan Exists) */}
      {rescuePlan && rescuePlan.quickWins && rescuePlan.quickWins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[2rem] border border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 to-slate-900/40 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-cyan-400" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              15-Min Quick Wins
            </span>
          </div>

          <div className="space-y-2.5">
            {rescuePlan.quickWins.map((win, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 flex items-start gap-2.5 hover:border-cyan-500/30 transition-colors"
              >
                <span className="text-cyan-400 font-mono font-bold text-[11px] mt-0.5">
                  #{idx + 1}
                </span>
                <span className="leading-snug">{win}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Presets & Chaos Scenarios Loader */}
      <div className="p-6 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-cyan-400" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              Chaos Sim Presets
            </span>
          </div>
          {tasks.length > 0 && (
            <button
              onClick={() => {
                cyberAudio.playActionClick();
                onClearAll();
              }}
              className="text-[10px] font-mono text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear Slate
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                cyberAudio.playActionClick();
                onLoadPreset(scenario.id);
              }}
              className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 transition-all group flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {scenario.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {scenario.tasks.length} vectors
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {scenario.description}
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
