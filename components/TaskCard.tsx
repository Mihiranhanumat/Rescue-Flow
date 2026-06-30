"use client";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";

export default function TaskCard({ task, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl hover:border-cyan-500/30 transition-all"
    >
      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-slate-100">{task.title}</h3>
        <span className="text-[10px] px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 font-bold uppercase tracking-tighter">
          Priority: {task.priority}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
        <Clock size={12} /> {task.deadline}
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${task.risk}%` }} 
          className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
        />
      </div>
    </motion.div>
  );
}