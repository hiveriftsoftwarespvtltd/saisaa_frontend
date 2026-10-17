import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const ProductCarousel = ({ products = [], onQuickView }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const firstCard = el.firstElementChild;
    const cardWidth = firstCard ? firstCard.clientWidth + 16 : clientWidth / 2;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(index, products.length - 1)));
  }, [products.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, products]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild;
    const cardWidth = firstCard ? firstCard.clientWidth + 16 : 280;
    // On mobile scroll by 1 card; on larger screens by 2 cards
    const multiplier = window.innerWidth < 640 ? 1 : 2;
    const scrollAmount = direction === 'left' ? -cardWidth * multiplier : cardWidth * multiplier;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-stone-400 text-xs italic">
        No products available in this showcase.
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {/* Top Controls on Desktop / Tablet (Beside header) */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-16 right-0 z-10">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            canScrollLeft
              ? 'bg-white border-[#D4AF37]/50 text-[#09231A] hover:bg-[#09231A] hover:text-[#F7E7BE] shadow-xs cursor-pointer'
              : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed opacity-40'
          }`}
          aria-label="Scroll left"
          title="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            canScrollRight
              ? 'bg-white border-[#D4AF37]/50 text-[#09231A] hover:bg-[#09231A] hover:text-[#F7E7BE] shadow-xs cursor-pointer'
              : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed opacity-40'
          }`}
          aria-label="Scroll right"
          title="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Left Arrow (Visible on Mobile, Tablet & Desktop) */}
      <button
        type="button"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/95 text-[#09231A] border border-[#D4AF37]/60 shadow-lg flex items-center justify-center z-20 backdrop-blur transition-all duration-200 ${
          canScrollLeft
            ? 'hover:scale-110 active:scale-90 hover:bg-[#09231A] hover:text-[#F7E7BE] cursor-pointer opacity-95'
            : 'opacity-20 cursor-not-allowed pointer-events-none'
        }`}
        aria-label="Scroll carousel left"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Floating Right Arrow (Visible on Mobile, Tablet & Desktop) */}
      <button
        type="button"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/95 text-[#09231A] border border-[#D4AF37]/60 shadow-lg flex items-center justify-center z-20 backdrop-blur transition-all duration-200 ${
          canScrollRight
            ? 'hover:scale-110 active:scale-90 hover:bg-[#09231A] hover:text-[#F7E7BE] cursor-pointer opacity-95'
            : 'opacity-20 cursor-not-allowed pointer-events-none'
        }`}
        aria-label="Scroll carousel right"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-3.5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 sm:py-4 px-2 sm:px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[72vw] sm:w-[44vw] md:w-[31vw] lg:w-[calc(25%-18px)] shrink-0 snap-start"
          >
            <ProductCard product={product} onQuickView={onQuickView} />
          </div>
        ))}
      </div>

      {/* Mobile Dedicated Bottom Navigation Bar */}
      <div className="flex sm:hidden items-center justify-between px-3 pt-2">
        <button
          type="button"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
            canScrollLeft
              ? 'bg-white border-[#D4AF37]/60 text-[#09231A] shadow-xs active:bg-[#09231A] active:text-[#F7E7BE]'
              : 'bg-stone-100 border-stone-200 text-stone-300 opacity-40 cursor-not-allowed'
          }`}
          aria-label="Previous items"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {/* Dots indicator */}
        <div className="flex items-center gap-1.5">
          {products.slice(0, Math.min(products.length, 6)).map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-5 bg-[#09231A]' : 'w-1.5 bg-stone-300'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
            canScrollRight
              ? 'bg-white border-[#D4AF37]/60 text-[#09231A] shadow-xs active:bg-[#09231A] active:text-[#F7E7BE]'
              : 'bg-stone-100 border-stone-200 text-stone-300 opacity-40 cursor-not-allowed'
          }`}
          aria-label="Next items"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
