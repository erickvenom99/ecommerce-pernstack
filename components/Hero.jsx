'use client'

import { assets } from '@/assets/assets'
import { ArrowRight, ChevronRight, Sparkles, ShieldCheck, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦'

    return (
        <div className='mx-4 sm:mx-6 my-6'>
            <div className='flex max-xl:flex-col gap-6 max-w-7xl mx-auto'>
                
                {/* Main Hero Banner (Left Column) */}
                <div className='relative flex-1 flex flex-col justify-between bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 rounded-3xl overflow-hidden shadow-xl xl:min-h-[480px] group border border-amber-300/40'>
                    
                    {/* Subtle Background Lighting Accent */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />

                    <div className='p-6 sm:p-12 z-10 max-w-xl'>
                        {/* Status Badge */}
                        <div className='inline-flex items-center gap-2 bg-slate-950/90 text-white pr-4 p-1.5 rounded-full text-xs font-semibold tracking-wide shadow-md backdrop-blur-md mb-6'>
                            <span className='bg-emerald-500 px-3 py-1 rounded-full text-black font-bold text-[10px] tracking-wider uppercase flex items-center gap-1'>
                                <Truck size={12} /> FREE EXPRESS
                            </span> 
                            <span>Nationwide Delivery On Orders Over ₦50,000</span>
                            <ChevronRight className='group-hover:translate-x-1 transition-transform text-amber-400' size={16} />
                        </div>

                        {/* Refined Brand Headline */}
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs  sm:max-w-md'>
                            Luxury Fits. <br />
                            Authentic Style.
                
                        </h2>

                        <p className='mt-4 text-slate-900/80 text-sm sm:text-base font-medium max-w-md leading-relaxed'>
                            Elevate your daily wardrobe with 100%  <br />human hair extensions, 
                             designer fits,<br />and premium urban wear crafted for Nigerian royalty.
                        </p>

                        {/* Pricing Callout & Action CTA */}
                        <div className='flex flex-wrap items-center gap-6 mt-8'>
                            <div>
                                <p className='text-xs font-bold text-slate-800 tracking-wider uppercase'>Starting From</p>
                                <p className='text-3xl font-black text-slate-950 tracking-tight'>{currency}4,000</p>
                            </div>

                            <Link 
                                href="/shop" 
                                className='bg-slate-950 hover:bg-slate-900 text-white text-sm font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-amber-950/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group/btn'
                            >
                                <span>SHOP THE COLLECTION</span>
                                <ArrowRight size={18} className='text-amber-400 group-hover/btn:translate-x-1 transition-transform' />
                            </Link>
                        </div>
                    </div>

                    {/* Model Image Overlay */}
                    <div className='relative sm:absolute bottom-0 right-0 lg:right-2 w-full sm:w-[380px] lg:w-[420px] h-[320px] sm:h-[440px] pointer-events-none flex items-end justify-end'>
                        <Image 
                            className='object-contain object-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-700' 
                            src={assets.model3} 
                            alt="Ally Buy Model" 
                            fill
                            sizes="(max-width: 768px) 100vw, 420px"
                            priority
                        />
                    </div>
                </div>

                {/* Right Column Bento Cards */}
                <div className='flex flex-col md:flex-row xl:flex-col gap-6 w-full xl:max-w-md text-slate-100'>
                    
                    {/* Human Hair Showcase Card */}
                    <div className='flex-1 flex items-center justify-between w-full bg-slate-950 rounded-3xl p-6 sm:p-8 relative overflow-hidden group border border-slate-800 hover:border-emerald-500/50 transition-colors shadow-lg'>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-transparent pointer-events-none" />
                        
                        <div className='z-10 max-w-[200px]'>
                            <span className='text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/40'>
                                100% Virgin Hair
                            </span>
                            <h3 className='text-xl sm:text-2xl font-bold text-white mt-3 leading-snug'>
                                Double Drawn Luxury Bundles
                            </h3>
                            <Link href="/shop?category=hair" className='flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 mt-4 group/link'>
                                <span>EXPLORE HAIR</span>
                                <ArrowRight className='group-hover/link:translate-x-1 transition-transform' size={16} />
                            </Link>
                        </div>

                        <div className='relative w-32 h-32 sm:w-36 sm:h-36 shrink-0'>
                            <Image 
                                className='object-contain group-hover:scale-110 transition-transform duration-500' 
                                src={assets.unique_hair} 
                                alt="Human Hair" 
                                fill
                                sizes="144px"
                            />
                        </div>
                    </div>

                    {/* Flash Sale / Sneakers Showcase Card */}
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-emerald-900 to-slate-950 rounded-3xl p-6 sm:p-8 relative overflow-hidden group border border-emerald-800/60 hover:border-amber-500/50 transition-colors shadow-lg'>
                        <div className='z-10 max-w-[200px]'>
                            <span className='text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/40 flex items-center gap-1 w-fit'>
                                <Sparkles size={12} /> Weekend Offer
                            </span>
                            <h3 className='text-2xl font-black text-white mt-3'>
                                Save 20% Off <br />
                                <span className='text-amber-400 text-lg font-medium'>Streetwear Kicks</span>
                            </h3>
                            <Link href="/shop?category=shoes" className='flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-white mt-4 group/link'>
                                <span>CLAIM DISCOUNT</span>
                                <ArrowRight className='group-hover/link:translate-x-1 transition-transform' size={16} />
                            </Link>
                        </div>

                        <div className='relative w-32 h-32 sm:w-36 sm:h-36 shrink-0'>
                            <Image 
                                className='object-contain -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 drop-shadow-lg' 
                                src={assets.red_snickers} 
                                alt="Sneakers" 
                                fill
                                sizes="144px"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Marquee Section */}
            <div className="mt-8">
                <CategoriesMarquee />
            </div>
        </div>
    )
}

export default Hero