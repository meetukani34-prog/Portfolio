import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
  const { progress } = useProgress();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // When progress hits 100, transition to Welcome phase
    if (progress >= 100 && step === 0) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, step]);

  // Fallback: If loading takes longer than 3 seconds, force transition
  useEffect(() => {
    if (step === 0) {
      const maxTimer = setTimeout(() => {
        setStep(1);
      }, 3000);
      return () => clearTimeout(maxTimer);
    }
  }, [step]);

  useEffect(() => {
    // When in Welcome phase, wait a bit then disappear entirely
    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 3500); // Give the cinematic animation time to play out
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <AnimatePresence>
      {step < 2 && (
        <motion.div
          key="preloader-bg"
          exit={{
            y: "-100vh",
            borderBottomLeftRadius: "100%",
            borderBottomRightRadius: "100%"
          }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090325] overflow-hidden"
        >
          {/* STEP 0: LOADER (Pill and Marquee) */}
          <AnimatePresence>
            {step === 0 && (
              <motion.div
                key="loader-content"
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Top Left Name */}
                <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
                  <span className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    Meet Ukani
                  </span>
                </div>

                {/* Top Right Animation */}
                <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center justify-center gap-1.5 h-8 z-20">
                  <motion.div animate={{ height: ["8px", "24px", "8px"] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="w-[4px] bg-white rounded-sm" />
                  <motion.div animate={{ height: ["24px", "12px", "24px"] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="w-[4px] bg-white rounded-sm" />
                  <motion.div animate={{ height: ["12px", "32px", "12px"] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="w-[4px] bg-white rounded-sm" />
                  <motion.div animate={{ height: ["16px", "8px", "16px"] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="w-[4px] bg-white rounded-sm" />
                </div>
                {/* Background Watermark Text */}
                <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
                  <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
                    className="flex whitespace-nowrap"
                  >
                    <h1 className="text-[8vw] font-black text-white opacity-10 mx-8">
                      AI ENGINEER | FULL STACK DEVELOPER
                    </h1>
                    <h1 className="text-[8vw] font-black text-white opacity-10 mx-8">
                      AI ENGINEER | FULL STACK DEVELOPER
                    </h1>
                  </motion.div>
                </div>

                {/* Pill Container */}
                <div className="flex items-center justify-center gap-6 rounded-full bg-black px-10 py-4 shadow-[0_0_30px_rgba(145,94,255,0.6)] border border-[#915eff]">
                  <span className="text-[18px] font-semibold tracking-widest text-white uppercase">
                    Loading
                  </span>
                  <span className="text-[16px] font-medium text-secondary">
                    {progress.toFixed(0)}%
                  </span>
                  {/* Animated Loading Bars */}
                  <div className="flex h-5 items-center justify-center gap-1">
                    <motion.div animate={{ height: ["4px", "18px", "4px"] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} className="w-1 bg-[#915eff] rounded-full" />
                    <motion.div animate={{ height: ["4px", "18px", "4px"] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="w-1 bg-[#915eff] rounded-full" />
                    <motion.div animate={{ height: ["4px", "18px", "4px"] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="w-1 bg-[#915eff] rounded-full" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 1: PRO WELCOME SCREEN */}
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                key="welcome-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                {/* Glowing Orb in Background */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.15 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute w-[50vw] h-[50vw] bg-[#915eff] rounded-full blur-[120px] pointer-events-none"
                />

                <div className="relative flex flex-col items-center z-10">
                  {/* Top Expanding Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="h-[2px] bg-gradient-to-r from-transparent via-[#915eff] to-transparent mb-4"
                  />

                  {/* Text Mask Reveal (Awwwards Style) */}
                  <div className="overflow-hidden py-2">
                    <motion.h2
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.7, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
                      className="text-4xl md:text-7xl font-black tracking-[0.1em] uppercase text-center animated-gradient-text pb-2"
                    >
                      UKANI Meet Manishbhai
                    </motion.h2>
                  </div>

                  {/* Subtitle Fading Up */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-xs md:text-xl font-light text-secondary tracking-[0.5em] mt-4 uppercase text-center"
                  >
                    Welcome to the universe
                  </motion.p>

                  {/* Bottom Expanding Line */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent mt-6 opacity-30"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
