"use client";
import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden">
      {/* Moving Nebula Blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] rounded-full bg-cyan-500/10 blur-[140px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] right-[10%] w-[70%] h-[70%] rounded-full bg-violet-600/10 blur-[140px]"
      />

      {/* Floating Data Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.4, 0] }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
          className="absolute w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent"
          style={{ left: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
}