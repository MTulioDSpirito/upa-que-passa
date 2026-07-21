"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Heart, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NewsArticle } from "@/lib/types";
import CardCover from "@/components/ui/CardCover";

interface TrendingStripProps {
  newsList: NewsArticle[];
}

export default function TrendingStrip({ newsList }: TrendingStripProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Group news in chunks of 3
  const slides: NewsArticle[][] = [];
  for (let i = 0; i < newsList.length; i += 3) {
    const chunk = newsList.slice(i, i + 3);
    if (chunk.length === 3) {
      slides.push(chunk);
    }
  }

  const slideCount = slides.length;

  useEffect(() => {
    if (slideCount === 0 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slideCount, isPaused]);

  if (slideCount === 0) return null;

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Variants for slide animation
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const currentArticles = slides[currentSlide];
  const [largeArticle, smallArticle1, smallArticle2] = currentArticles;

  return (
    <section 
      className="max-w-7xl mx-auto px-4 pt-6 pb-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container with Overflow Hidden for Slide Transitions */}
      <div className="relative overflow-hidden min-h-[580px] md:min-h-[480px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
          >
            {/* LARGE CARD (Left Column - Spans 2 cols on Desktop) */}
            <div className="md:col-span-2 relative group rounded-2xl overflow-hidden bg-[#0f0f18] border border-white/5 shadow-2xl h-[360px] md:h-[480px] flex flex-col justify-end">
              {/* Background Image with Hover Zoom */}
              <div className="absolute inset-0 z-0">
                <CardCover
                  src={largeArticle.cover}
                  alt={largeArticle.title}
                  priority
                  className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                {/* Steam-style ambient dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-[#0d0e15]/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e15]/80 via-transparent to-transparent z-10 hidden md:block" />
              </div>

              {/* Card Content */}
              <div className="relative z-20 p-6 md:p-8 flex flex-col gap-3 max-w-2xl">
                {/* Category Badge & Metadata */}
                <div className="flex items-center gap-3">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg tracking-wide uppercase">
                    {largeArticle.category}
                  </span>
                  <span className="text-white/60 text-xs flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                    <Eye className="w-3.5 h-3.5" />
                    {largeArticle.views.toLocaleString("pt-BR")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md group-hover:text-blue-400 transition-colors">
                  {largeArticle.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
                  {largeArticle.excerpt}
                </p>

                {/* Interactive Footer */}
                <div className="flex items-center gap-3 mt-2">
                  <Link
                    href={`/noticias/${largeArticle.slug}`}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#38bdf8] to-[#0284c7] hover:from-[#0ea5e9] hover:to-[#0369a1] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-sky-500/20 active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    Ler Notícia
                  </Link>

                  <button 
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-red-500 border border-white/10 backdrop-blur-md transition-all active:scale-90"
                    title="Favoritar notícia"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* SMALL CARDS (Right Column - Stack of 2) */}
            <div className="flex flex-col gap-4 justify-between h-auto md:h-[480px]">
              {[smallArticle1, smallArticle2].map((article, idx) => (
                <Link
                  key={article.id}
                  href={`/noticias/${article.slug}`}
                  className="group relative flex-1 rounded-2xl overflow-hidden bg-[#0f0f18] border border-white/5 shadow-xl h-[180px] md:h-auto flex flex-col justify-end"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <CardCover
                      src={article.cover}
                      alt={article.title}
                      className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-[#0d0e15]/50 to-transparent z-10" />
                  </div>

                  {/* Card Content */}
                  <div className="relative z-20 p-5 flex flex-col gap-2">
                    {/* Category Badge */}
                    <div>
                      <span className="bg-[#1e293b] text-white/90 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider border border-white/10">
                        {article.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm md:text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Center Controls (Prev, Dots, Next) */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full bg-[#181826] hover:bg-[#252538] text-white/70 hover:text-white border border-white/5 transition-all shadow-md active:scale-90"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Bullet Indicator Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? "w-8 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                  : "w-2.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-2 rounded-full bg-[#181826] hover:bg-[#252538] text-white/70 hover:text-white border border-white/5 transition-all shadow-md active:scale-90"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
