'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroTwo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Local static slide data referencing local assets
  const slides = [
    {
      id: 1,
      gender: "Men's Collection",
      genderTag: "MALE FASHION",
      title: "Redefine Streetwear & Urban Elegance",
      subtitle: "Discover tailored fits, premium hoodies, and sleek classic wear built for every occasion.",
      ctaText: "Shop Men's Wear",
      ctaLink: "/products?category=men",
      image: "/assets/hero-male.jpg", // Replace with your local asset path
      badge: "NEW ARRIVALS",
      highlightColor: "from-amber-500/20 to-emerald-500/10",
      accentBadgeBg: "bg-amber-500 text-black",
      discount: "Up to 30% Off",
    },
    {
      id: 2,
      gender: "Women's Collection",
      genderTag: "FEMALE FASHION",
      title: "Chic, Bold & Effortlessly Stylish",
      subtitle: "Elevate your wardrobe with our newest gowns, tailored blazers, and luxury essentials.",
      ctaText: "Shop Women's Wear",
      ctaLink: "/products?category=women",
      image: "/assets/hero-female.jpg", // Replace with your local asset path
      badge: "TRENDING NOW",
      highlightColor: "from-emerald-500/20 to-amber-500/10",
      accentBadgeBg: "bg-emerald-600 text-white",
      discount: "Best Sellers 2026",
    },
    {
      id: 3,
      gender: "Unisex & Accessories",
      genderTag: "PREMIUM ESSENTIALS",
      title: "Statement Pieces For Everyone",
      subtitle: "Complete your outfit with handcrafted accessories, statement footwear, and unisex luxury wear.",
      ctaText: "Explore All Products",
      ctaLink: "/products",
      image: "/assets/hero-unisex.jpg", // Replace with your local asset path
      badge: "LIMITED EDITION",
      highlightColor: "from-amber-500/15 via-black to-emerald-500/15",
      accentBadgeBg: "bg-amber-400 text-black",
      discount: "Free Delivery Nationwide",
    },
  ];

  // Auto-play interval handling
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full bg-black text-white overflow-hidden my-6 rounded-3xl shadow-2xl border border-slate-800">
      {/* Slide Container */}
      <div className="relative min-h-[540px] md:min-h-[620px] flex items-center justify-center">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.highlightColor} opacity-70 mix-blend-overlay`}
              />

              {/* Grid Layout: Text & Visual */}
              <div className="max-w-7xl mx-auto h-full px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Content */}
                <div className="lg:col-span-7 space-y-6 text-left z-20">
                  
                  {/* Badges & Gender Tag */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${slide.accentBadgeBg}`}>
                      {slide.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-slate-800 text-emerald-400 border border-emerald-500/30">
                      {slide.genderTag}
                    </span>
                    <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                      • {slide.discount}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                    {slide.title.split(' ').map((word, i) => (
                      <span
                        key={i}
                        className={
                          word.toLowerCase() === 'streetwear' || word.toLowerCase() === 'chic,'
                            ? 'text-amber-400 inline-block mr-2'
                            : word.toLowerCase() === 'elegance' || word.toLowerCase() === 'stylish' || word.toLowerCase() === 'everyone'
                            ? 'text-emerald-500 inline-block mr-2'
                            : 'inline-block mr-2'
                        }
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-slate-300 text-base md:text-lg max-w-xl leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Call To Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3.5 rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <span>{slide.ctaText}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>

                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:border-emerald-500"
                    >
                      <span>View All Categories</span>
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-md">
                    <div>
                      <p className="text-xs font-medium text-slate-400">Delivery</p>
                      <p className="text-sm font-bold text-emerald-400">Nationwide</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">Quality</p>
                      <p className="text-sm font-bold text-amber-400">100% Verified</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">Checkout</p>
                      <p className="text-sm font-bold text-white">Paystack Secured</p>
                    </div>
                  </div>

                </div>

                {/* Right Column: Visual Frame */}
                <div className="lg:col-span-5 relative flex justify-center items-center h-full min-h-[300px] lg:min-h-[460px]">
                  
                  {/* Decorative Amber/Green Backing Box */}
                  <div className="absolute w-72 h-72 md:w-80 md:h-80 bg-gradient-to-tr from-emerald-600 to-amber-500 rounded-3xl blur-2xl opacity-25 animate-pulse" />

                  {/* Main Image Wrapper */}
                  <div className="relative z-10 w-full max-w-sm lg:max-w-md h-72 sm:h-96 lg:h-[420px] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-900 group">
                    {/* Local Asset Image */}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        // Fallback placeholder if asset is not yet added in /public/assets
                        e.currentTarget.src = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80";
                      }}
                    />

                    {/* Gradient Overlay for Image Depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Floating Gender Overlay Tag */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-slate-700/60 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-300">Featured Style</p>
                        <p className="text-sm font-bold text-amber-400">{slide.gender}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                        In Stock
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-6 left-6 md:left-12 z-30 flex items-center gap-3">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-2 px-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlide(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Auto Play Indicator */}
      <div className="absolute bottom-6 right-6 md:right-12 z-30 hidden sm:block">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
        >
          {isAutoPlaying ? '⏸ Pause Auto-Slide' : '▶ Play Auto-Slide'}
        </button>
      </div>
    </section>
  );
}