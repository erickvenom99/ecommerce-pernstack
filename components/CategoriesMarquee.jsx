import React from "react";
import { categories } from "@/assets/assets";

const CategoriesMarquee = () => {
  // Duplicate categories to create a smooth, seamless infinite loop
  const marqueeItems = [...categories, ...categories, ...categories, ...categories];

  return (
    <section className="w-full my-8 sm:my-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800/80 p-4 sm:p-5 shadow-lg group">
        
        {/* Subtle Ambient Glowing Background */}
        <div className="absolute -top-10 left-1/3 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/3 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Edge Soft Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none bg-gradient-to-r from-slate-950 to-transparent" />

        {/* Marquee Track */}
        <div className="flex min-w-full w-max animate-[marqueeScroll_18s_linear_infinite] sm:animate-[marqueeScroll_35s_linear_infinite] group-hover:[animation-play-state:paused] gap-3 sm:gap-4 items-center">
          {marqueeItems.map((category, index) => (
            <button
              key={`${category}-${index}`}
              className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 flex items-center gap-2 group/chip"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover/chip:bg-slate-950 transition-colors" />
              <span>{category}</span>
            </button>
          ))}
        </div>

        {/* Right Edge Soft Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none bg-gradient-to-l from-slate-950 to-transparent" />

      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default CategoriesMarquee;