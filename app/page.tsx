"use client";
import { useState } from "react";
import Background from "@/components/Background";
import TaskCard from "@/components/TaskCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Terminal, Loader2, Activity, ShieldAlert } from "lucide-react";

export default function Home() {
  const [tasks] = useState([
    { title: "Finalize Pitch Deck", deadline: "Today, 5pm", priority: "High", risk: 85 },
    { title: "Fix UI Deployment", deadline: "In 2 hours", priority: "Urgent", risk: 95 },
    { title: "Team Sync", deadline: "Tomorrow", priority: "Low", risk: 30 },
  ]);

  const [loading, setLoading] = useState(false);
  const [rescuePlan, setRescuePlan] = useState<any>(null);

  const handleRescue = async () => {
    setLoading(true);
    // Simulate a delay for the "Scanning" animation to look cool
    setTimeout(async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: JSON.stringify({ tasks }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setRescuePlan(data);
      } catch (error) {
        console.error("AI Error:", error);
      } finally {
        setLoading(false);
      }
    }, 2500); 
  };

  return (
    <main className="min-h-screen text-slate-100 p-6 md:p-12 relative overflow-hidden">
      <Background />
      
      {/* Scanning Laser Line Animation */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="fixed left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-[60] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-500 uppercase">System Active</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">
              RESCUE<span className="text-cyan-500">FLOW</span>
            </h1>
            <p className="text-slate-500 font-medium italic mt-1">From chaos to action.</p>
          </div>
          
          <button 
            onClick={handleRescue}
            disabled={loading}
            className="relative group px-8 py-4 rounded-2xl bg-cyan-500 text-slate-950 font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <motion.div 
              animate={loading ? { x: ["-100%", "100%"] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
            <div className="flex items-center gap-2 relative z-10">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldAlert size={20} />}
              <span className="uppercase tracking-widest text-sm">
                {loading ? "Scanning Chaos..." : "Initiate Rescue"}
              </span>
            </div>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Task Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
              <Activity size={16} className="text-cyan-500" /> Critical Vectors
            </h2>
            <div className={`space-y-4 transition-all duration-700 ${loading ? 'blur-sm scale-[0.98] opacity-50' : ''}`}>
              {tasks.map((task, i) => (
                <TaskCard key={i} task={task} index={i} />
              ))}
            </div>
          </div>

          {/* Right Intel Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="p-8 rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Terminal size={16} className="text-slate-700" />
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Execution Efficiency</h3>
              <div className="text-7xl font-black text-white tracking-tighter">
                {rescuePlan ? rescuePlan.productivityScore : "82"}<span className="text-cyan-500 text-3xl">%</span>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "82%" }}
                    className="h-full bg-cyan-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* THE RESCUE HUD: Dramatic full-screen transition */}
      <AnimatePresence>
        {rescuePlan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/95 backdrop-blur-2xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(6,182,212,0.1)] relative"
            >
              {/* Decorative HUD corners */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl" />

              <h2 className="text-3xl font-black text-white mb-2 text-center tracking-tighter">RESCUE PLAN GENERATED</h2>
              <p className="text-cyan-500/60 text-center text-xs font-bold tracking-[0.3em] mb-10 uppercase">Strategic Priority Override</p>
              
              <div className="space-y-4 mb-10">
                {rescuePlan.rescueActions?.map((action: string, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all flex items-center gap-4"
                  >
                    <span className="text-cyan-500 font-mono text-lg">0{i+1}</span>
                    <p className="text-slate-200 font-medium">{action}</p>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setRescuePlan(null)}
                className="w-full py-5 bg-cyan-500 text-slate-950 font-black rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest shadow-[0_10px_30px_rgba(6,182,212,0.3)]"
              >
                Execute Mission
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}