import React from "react";

/**
 * HeroThree
 * -------
 * Split-panel showcase hero: Men | Women.
 * - No DB fetch — images come from the shared assets map (@/assets/assets).
 * - Palette stays within the site system: black (#0A0A0A), amber (#D97706), green (#166534).
 * - Signature element: an animated stitched "seam" running down the center, with a
 *   slowly-rotating circular badge sitting on it.
 */

import { assets } from "@/assets/assets";
import Image from "next/image";

const panels = [
  {
    key: "men",
    label: "Men",
    eyebrow: "The Edit — Him",
    image: assets.africanmen3,
    href: "/shop",
    tint: "from-black/70 via-black/10 to-transparent",
    accent: "text-emerald-400",
    ring: "focus-visible:ring-emerald-400",
    dot: "bg-emerald-400",
  },
  {
    key: "women",
    label: "Women",
    eyebrow: "The Edit — Her",
    image: assets.ethnicprintedmesh,
    href: "/shop",
    tint: "from-black/70 via-black/10 to-transparent",
    accent: "text-amber-400",
    ring: "focus-visible:ring-amber-400",
    dot: "bg-amber-400",
  },
];

export default function HeroThree() {
  const [activeKey, setActiveKey] = React.useState(null);

  return (
    <section
      aria-label="Shop by category: Men and Women"
      className="relative w-full"
    >
      <div className="mx-6 py-6 md:py-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-black">
          {/* Panels */}
          <div className="flex min-h-[360px] w-full flex-col md:h-[60vh] md:min-h-[420px] md:max-h-[540px] md:flex-row">
            {panels.map((panel) => {
              const isActive = activeKey === panel.key;
              const isInactive = activeKey && activeKey !== panel.key;

              return (
                <a
                  key={panel.key}
                  href={panel.href}
                  onMouseEnter={() => setActiveKey(panel.key)}
                  onMouseLeave={() => setActiveKey(null)}
                  onFocus={() => setActiveKey(panel.key)}
                  onBlur={() => setActiveKey(null)}
                  className={[
                    "group relative flex flex-1 items-end overflow-hidden",
                    "outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    panel.ring,
                    "transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  ].join(" ")}
                  style={{
                    flexGrow: isActive ? 1.35 : isInactive ? 0.75 : 1,
                  }}
                >
                  {/* Background image */}
                  <Image
                    src={panel.image}
                    alt={`${panel.label}'s wear collection`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority
                    className={[
                      "object-cover object-top",
                      "transition-transform duration-[1400ms] ease-out motion-reduce:transition-none",
                      isActive ? "scale-105" : "scale-100",
                    ].join(" ")}
                  />

                  {/* Soft bottom vignette for text legibility only */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${panel.tint}`}
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <div className="relative z-10 w-full px-6 pb-10 sm:px-10 sm:pb-14 md:px-12 md:pb-16">
                    <span
                      className={`mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] ${panel.accent}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${panel.dot}`} />
                      {panel.eyebrow}
                    </span>

                    <h2 className="font-black uppercase leading-[0.85] text-white text-[clamp(2.75rem,8vw,6rem)] tracking-tight drop-shadow-md">
                      {panel.label}
                    </h2>

                    <span
                      className={[
                        "mt-5 inline-flex items-center gap-2 border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.18em] text-white",
                        "border-white/30 transition-colors duration-300",
                        "group-hover:border-current group-hover:" + panel.accent,
                      ].join(" ")}
                    >
                      Shop the collection
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.25}
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* --- Signature element: stitched seam + rotating badge --- */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 md:block"
            aria-hidden="true"
          >
            {/* Stitched thread line */}
            <svg
              className="h-full w-8 -translate-x-1/2"
              viewBox="0 0 32 800"
              preserveAspectRatio="none"
            >
              <line
                x1="16"
                y1="0"
                x2="16"
                y2="800"
                stroke="#F5F3EE"
                strokeOpacity="0.55"
                strokeWidth="2"
                strokeDasharray="10 12"
                strokeLinecap="round"
                className="motion-safe:animate-[seam-run_6s_linear_infinite]"
              />
            </svg>

            {/* Rotating circular badge sitting on the seam */}
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-full w-full rounded-full border border-white/15 bg-black shadow-[0_0_0_6px_rgba(0,0,0,1),0_0_30px_rgba(0,0,0,0.6)]">
                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full motion-safe:animate-[spin_14s_linear_infinite] motion-reduce:animate-none"
                >
                  <defs>
                    <path
                      id="badge-circle-path"
                      d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                    />
                  </defs>
                  <text fill="#F59E0B" fontSize="7.6" letterSpacing="0.15em" fontWeight="700">
                    <textPath href="#badge-circle-path" startOffset="0%">
                      NEW ARRIVALS • NEW ARRIVALS •
                    </textPath>
                  </text>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-white">
                  SS·26
                </span>
              </div>
            </div>
          </div>

          {/* Mobile divider label */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 md:hidden">
            SS·26
          </div>
        </div>
      </div>

      <style>{`
        @keyframes seam-run {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -44; }
        }
      `}</style>
    </section>
  );
}