"use client";
import { motion } from "framer-motion";
import { 
  Flame, 
  Target, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Sparkles,
  AlertOctagon,
  Calendar,
  Share2,
  Trash
} from "lucide-react";
import { Task } from "@/types";
import { cyberAudio } from "@/lib/audio";

interface TriageMatrixProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TriageMatrix({
  tasks,
  onToggleStatus,
  onEdit,
}: TriageMatrixProps) {
  // Classify tasks into 4 quadrants
  // Urgency heuristic: "Immediate", "hour", "mins", "today", "urgent", or deadline length
  const isUrgent = (task: Task) => {
    const d = (task.deadline || "").toLowerCase();
    return (
      d.includes("immediate") ||
      d.includes("min") ||
      d.includes("hour") ||
      d.includes("now") ||
      d.includes("today") ||
      task.priority === "Critical"
    );
  };

  const isHighRisk = (task: Task) => {
    return task.risk >= 60 || task.priority === "Critical" || task.priority === "High";
  };

  const q1Tasks = tasks.filter((t) => isUrgent(t) && isHighRisk(t));
  const q2Tasks = tasks.filter((t) => !isUrgent(t) && isHighRisk(t));
  const q3Tasks = tasks.filter((t) => isUrgent(t) && !isHighRisk(t));
  const q4Tasks = tasks.filter((t) => !isUrgent(t) && !isHighRisk(t));

  const quadrants = [
    {
      id: "q1",
      title: "DO IMMEDIATELY",
      subtitle: "Urgent & High Impact / Risk",
      icon: Flame,
      color: "rose",
      borderColor: "border-rose-500/30",
      bgColor: "bg-rose-950/20",
      accentColor: "text-rose-400",
      badgeColor: "bg-rose-500/20 text-rose-300",
      tasks: q1Tasks,
    },
    {
      id: "q2",
      title: "STRATEGIC SCHEDULE",
      subtitle: "High Impact / Long Horizon",
      icon: Target,
      color: "amber",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-950/20",
      accentColor: "text-amber-400",
      badgeColor: "bg-amber-500/20 text-amber-300",
      tasks: q2Tasks,
    },
    {
      id: "q3",
      title: "DELEGATE / AUTOMATE",
      subtitle: "Urgent but Low Technical Risk",
      icon: Cpu,
      color: "cyan",
      borderColor: "border-cyan-500/30",
      bgColor: "bg-cyan-950/20",
      accentColor: "text-cyan-400",
      badgeColor: "bg-cyan-500/20 text-cyan-300",
      tasks: q3Tasks,
    },
    {
      id: "q4",
      title: "DEFER / SCRAP",
      subtitle: "Low Urgency / Low Risk",
      icon: Clock,
      color: "emerald",
      borderColor: "border-emerald-500/30",
      bgColor: "bg-emerald-950/20",
      accentColor: "text-emerald-400",
      badgeColor: "bg-emerald-500/20 text-emerald-300",
      tasks: q4Tasks,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quadrants.map((q, idx) => {
          const Icon = q.icon;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className={`p-5 rounded-3xl border ${q.borderColor} ${q.bgColor} backdrop-blur-xl flex flex-col min-h-[280px] shadow-[0_8px_30px_rgba(0,0,0,0.3)]`}
            >
              {/* Quadrant Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${q.accentColor}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className={`text-xs font-mono font-bold tracking-wider uppercase ${q.accentColor}`}>
                      {q.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">{q.subtitle}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${q.badgeColor}`}>
                  {q.tasks.length}
                </span>
              </div>

              {/* Task list in quadrant */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
                {q.tasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-6 text-slate-600 text-xs font-mono">
                    No vectors in this quadrant
                  </div>
                ) : (
                  q.tasks.map((task) => {
                    const isDone = task.status === "completed";
                    return (
                      <div
                        key={task.id}
                        onClick={() => onEdit(task)}
                        className={`p-3 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                          isDone ? "opacity-40 line-through" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              cyberAudio.playStepComplete();
                              onToggleStatus(task.id);
                            }}
                            className="text-slate-500 hover:text-cyan-400 focus:outline-none flex-shrink-0"
                          >
                            {isDone ? (
                              <CheckCircle2 size={16} className="text-emerald-400" />
                            ) : (
                              <Circle size={16} />
                            )}
                          </button>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                              {task.title}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400">
                              {task.deadline || "Flexible"} • {task.estimatedMinutes}m
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 flex-shrink-0">
                          {task.risk}%
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
