"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import { challenge } from "@/app/types/types";
import { levelStyles, categoryStyles } from "../../colors/data";



const SLIDE_DURATION = 6000; 

const FeaturedChallenge = () => {
  const [challenges, setChallenges] = useState<challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/homepage/FeaturedChallenge");
        if (!res.ok) throw new Error(`request failed with ${res.status}`);
        const data = await res.json();
        setChallenges(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("error: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {

    if (challenges.length === 0 || isPaused) return;

    const interval = setInterval(() => {

      // Go to the next slide number, and if you were on the last slide, loop back to the first one.
      setCurrentIndex((prev) => (prev + 1) % challenges.length); 
    }, SLIDE_DURATION);

    return () => clearInterval(interval); //

  }, [challenges.length, isPaused]);

  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + challenges.length) % challenges.length);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % challenges.length);

  const active = challenges[currentIndex];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 lg:py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2 className="text-3xl dark:text-white lg:text-4xl font-extrabold text-slate-900 mb-6 md:mb-8 tracking-tight">
          Featured Challenge
        </h2>

        <div
          className="group relative rounded-[32px] overflow-hidden shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] h-[460px] xs:h-[500px] sm:h-[560px] lg:h-[620px] bg-slate-900"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={active?.imgs[0] ?? "/placeholder.jpg"}
                alt={active?.title ?? "Challenge image"}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

          {/* Progress segments */}
          <div className="absolute top-6 left-6 right-6 z-30 flex gap-1.5">
            {challenges.map((_, index) => (
              <div
                key={index}
                className="relative h-[3px] flex-1 rounded-full bg-white/25 overflow-hidden"
              >
                {index < currentIndex && (
                  <div className="absolute inset-0 bg-white" />
                )}
                {index === currentIndex && (
                  <div
                    key={`${currentIndex}-${isPaused}`}
                    className="absolute inset-0 bg-white origin-left"
                    style={{
                      animation: `featuredFill ${SLIDE_DURATION}ms linear forwards`,
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Points badge */}
          {active?.rewardPoints !== undefined && (
            <div className="absolute top-12 right-6 z-30 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-bold text-white">
                {active.rewardPoints} pts
              </span>
            </div>
          )}

          {/* Nav arrows */}
          <button
            onClick={goToPrev}
            aria-label="Previous challenge"
            className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 rounded-full transition-all z-30 opacity-0 group-hover:opacity-100 md:left-7"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={goToNext}
            aria-label="Next challenge"
            className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 rounded-full transition-all z-30 opacity-0 group-hover:opacity-100 md:right-7"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Content — everything lives on the image */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-6 xs:p-7 sm:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  {active?.category && (
                    <span
                      className={`px-3 py-1 rounded-full border backdrop-blur-md text-[11px] font-semibold uppercase tracking-wide ${
                        categoryStyles[active.category as keyof typeof categoryStyles] ??
                        "bg-white/10 text-white border-white/20"
                      }`}
                    >
                      {active.category}
                    </span>
                  )}
                  {active?.level && (
                    <span
                      className={`px-3 py-1 rounded-full border backdrop-blur-md text-[11px] font-semibold uppercase tracking-wide ${
                        levelStyles[active.level as keyof typeof levelStyles] ??
                        "bg-white/10 text-white border-white/20"
                      }`}
                    >
                      {active.level}
                    </span>
                  )}
                  {active?.days && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white">
                      <Calendar className="w-3.5 h-3.5" />
                      {active.days}-day challenge
                    </span>
                  )}
                </div>

                <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-[1.02] tracking-tight max-w-3xl">
                  {active?.title}
                </h2>

                <p className="text-sm xs:text-base sm:text-lg text-white/70 mb-7 max-w-xl leading-relaxed line-clamp-2">
                  {active?.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes featuredFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedChallenge;
