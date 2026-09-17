"use client";
import { motion } from "framer-motion";
import { 
  Clock, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  Activity, 
  AlertTriangle, 
  Flame, 
  Code, 
  Target, 
  Cpu, 
  Palette, 
  MessageSquare, 
  User 
} from "lucide-react";
import { Task, TaskCategory, Priority } from "@/types";
import { cyberAudio } from "@/lib/audio";

interface TaskCardProps {
  task: Task;
  index: number;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const categoryIcons: Record<TaskCategory, typeof Code> = {
  Technical: Code,
  Strategy: Target,
  Operations: Cpu,
  Design: Palette,
  Communication: MessageSquare,
  Personal: User,
};

const priorityStyles: Record<Priority, { bg: string; text: string; border: string; glow: string }> = {
  Critical: {
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    border: "border-rose-500/30",
    glow: "shadow-[0_0_12px_rgba(244,63,94,0.3)]",
  },
  High: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_10px_rgba(245,158,11,0.2)]",
  },
  Medium: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_10px_rgba(6,182,212,0.2)]",
  },
  Low: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_10px_rgba(16,185,129,0.15)]",
  },
};

export default function TaskCard({
  task,
  index,
  onToggleStatus,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";
  const isInProgress = task.status === "in_progress";
  const CatIcon = categoryIcons[task.category] || Activity;
  const pStyle = priorityStyles[task.priority] || priorityStyles.Medium;

  // Determine risk bar color
  const riskColor =
    task.risk >= 80
      ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]"
      : task.risk >= 50
      ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
      : "bg-cyan-500 shadow-[0_0_10px_#06b6d4]";

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cyberAudio.playStepComplete();
    onToggleStatus(task.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cyberAudio.playActionClick();
    onEdit(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cyberAudio.playActionClick();
    onDelete(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -2 }}
      className={`group relative p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
        isCompleted
          ? "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-85"
          : isInProgress
          ? "bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          : "bg-white/[0.04] border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority Badge */}
          <span
            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${pStyle.bg} ${pStyle.text} ${pStyle.border} ${pStyle.glow} flex items-center gap-1`}
          >
            {task.priority === "Critical" && <Flame size={11} className="animate-pulse text-rose-400" />}
            {task.priority}
          </span>

          {/* Category Tag */}
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CatIcon size={11} className="text-cyan-400" />
            {task.category}
          </span>

          {/* In-Progress Pulse Indicator */}
          {isInProgress && (
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Active Vector
            </span>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleEditClick}
            title="Edit Task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            <Edit3 size={14} />
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            title="Delete Task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Title & Status Checkbox */}
      <div className="flex items-start gap-3.5 mb-3">
        <button
          type="button"
          onClick={handleStatusClick}
          className="mt-0.5 text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none flex-shrink-0"
          title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
        >
          {isCompleted ? (
            <CheckCircle2 size={20} className="text-emerald-400" />
          ) : isInProgress ? (
            <div className="h-5 w-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          ) : (
            <Circle size={20} className="hover:scale-110 transition-transform" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-base leading-snug break-words transition-all ${
              isCompleted ? "line-through text-slate-500" : "text-slate-100 group-hover:text-white"
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Info: Deadline, Estimated Time, Risk Meter */}
      <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock size={13} className="text-cyan-400" />
            <span>{task.deadline || "Flexible"}</span>
          </span>

          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <Activity size={12} className="text-slate-500" />
            <span>{task.estimatedMinutes}m</span>
          </span>
        </div>

        {/* Risk Percentage Bar */}
        <div className="flex items-center gap-2 min-w-[130px]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            Risk: <span className="font-bold text-slate-200">{task.risk}%</span>
          </span>
          <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${task.risk}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full ${riskColor}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
