'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Sparkles, Flame, ShieldCheck } from 'lucide-react'
import { assets } from '@/assets/assets'
import Image from 'next/image'

const HeroRunwayCinematic = () => {
  const [activeModel, setActiveModel] = useState(0)

  const runwayLooks = [
    {
      id: '01',
      title: 'Lagos Couture & Afro-Glamour',
      category: 'Female Luxury',
      image: assets.glodenfloralflad4,
      price: '₦85,000',
      badge: 'RUNWAY'
    },
    {
      id: '02',
      title: 'Contemporary Agbada Native',
      category: 'Male Excellence',
      image: assets.ethnicprintedmen,
      price: '₦120,000',
      badge: 'TOP SELLER'
    },
    {
      id: '03',
      title: 'Raw Silk & Urban Culture',
      category: 'Unisex Wear',
      image: assets.vinctageprintedddress4,
      price: '₦45,000',
      badge: 'NEW DROP'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveModel((prev) => (prev + 1) % runwayLooks.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [runwayLooks.length])

  return (
    <section className="w-full my-8 sm:my-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden border border-amber-300/40 bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 p-4 sm:p-6 lg:p-8 shadow-2xl">
        
        {/* Ambient Subtle Lighting */}
        <div className="absolute top-0 right-1/4 w-72 sm:w-80 h-72 sm:h-80 bg-white/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 sm:w-80 h-72 sm:h-80 bg-emerald-950/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-950/20 pb-4 gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-400 border border-slate-800 text-xs font-semibold">
              <Sparkles size={13} className="text-emerald-400" /> AFRO-RUNWAY '26
            </div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              The Art of <span className="text-white ">African</span> Style
            </h1>
          </div>

          <Link 
            href="/shop" 
            className="w-full sm:w-auto text-center px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm transition-all shadow-xl flex items-center justify-center gap-1.5 shrink-0 hover:scale-105 active:scale-95"
          >
            <span>EXPLORE LOOKS</span>
            <ArrowUpRight size={16} className="text-amber-400" />
          </Link>
        </div>

        {/* Cinematic Runway Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mt-6 items-stretch">
          
          {/* Main Stage Runway Spotlight */}
          <div className="lg:col-span-7 relative min-h-[420px] sm:min-h-[520px] lg:min-h-[580px] rounded-2xl overflow-hidden border border-slate-900/30 shadow-xl group bg-slate-950">
            {runwayLooks.map((look, index) => {
              const isActive = index === activeModel
              return (
                <div
                  key={look.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Image Display */}
                  <Image
                    src={look.image}
                    alt={look.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority={index === 0}
                    className="object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-1000"
                  />

                  {/* Gradient Vignette strictly at the bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 sm:h-1/3 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />

                  {/* Bottom Bar */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 bg-emerald-500 text-black text-[10px] font-extrabold rounded tracking-wider uppercase">
                          {look.badge}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-300 tracking-wide uppercase">
                          {look.category}
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight leading-snug">
                        {look.title}
                      </h2>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
                        <p className="text-base sm:text-lg lg:text-xl font-extrabold text-amber-400 leading-none">{look.price}</p>
                      </div>

                      <Link 
                        href="/shop" 
                        className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 font-bold text-xs hover:bg-white transition-colors flex items-center gap-1 shadow-md"
                      >
                        <span>BUY</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Carousel Navigation Dots */}
            <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-slate-950/60 p-2 rounded-full backdrop-blur-md border border-slate-800">
              {runwayLooks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveModel(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeModel ? 'w-6 bg-amber-400' : 'w-2 bg-slate-600'
                  }`}
                  aria-label={`Go to runway look ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Runway Look Selectors */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <p className="text-xs font-extrabold text-slate-950 uppercase tracking-widest flex items-center gap-1.5">
              <Flame size={15} className="text-emerald-950" /> SELECT SHOWCASE
            </p>

            <div className="space-y-3">
              {runwayLooks.map((look, index) => {
                const isSelected = index === activeModel
                return (
                  <div
                    key={look.id}
                    onClick={() => setActiveModel(index)}
                    className={`cursor-pointer p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3 sm:gap-4 ${
                      isSelected
                        ? 'bg-slate-950 border-slate-900 shadow-xl text-white translate-x-0 sm:translate-x-1'
                        : 'bg-slate-950/80 border-amber-300/30 hover:bg-slate-950 text-slate-200'
                    }`}
                  >
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                      <Image src={look.image} alt={look.title} fill sizes="(max-width: 640px) 56px, 64px" className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{look.category}</p>
                      <h4 className="text-xs sm:text-sm font-bold truncate mt-0.5">{look.title}</h4>
                      <p className="text-xs font-extrabold text-amber-400 mt-1">{look.price}</p>
                    </div>

                    <div className={`p-1.5 sm:p-2 rounded-full ${isSelected ? 'bg-amber-400 text-slate-950' : 'text-slate-500'}`}>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Authenticity Guarantee Footer */}
            <div className="bg-slate-950/90 border border-slate-900 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between text-xs text-slate-200 shadow-md">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                <span className="text-xs font-medium">Verified Premium Fabrics</span>
              </div>
              <span className="font-bold text-amber-400">100% Authentic</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default HeroRunwayCinematic