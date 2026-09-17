"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Background() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden pointer-events-none">
      {/* Cyberpunk Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" 
      />

      {/* Dynamic Moving Nebula Blobs */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[15%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-cyan-500/10 blur-[150px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] right-[5%] w-[65vw] h-[65vw] rounded-full bg-violet-600/10 blur-[160px]"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[30%] w-[45vw] h-[45vw] rounded-full bg-rose-500/5 blur-[130px]"
      />

      {/* Floating Tactical Data Particles */}
      {mounted &&
        [...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.5, 0] }}
            transition={{
              duration: 8 + (i % 7) * 2,
              repeat: Infinity,
              delay: (i % 5) * 1.5,
              ease: "linear",
            }}
            className="absolute w-[2px] h-14 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent shadow-[0_0_8px_#22d3ee]"
            style={{ left: `${(i * 6.2 + 3) % 96}%` }}
          />
        ))}

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#020617]/90 pointer-events-none" />
    </div>
  );
}
