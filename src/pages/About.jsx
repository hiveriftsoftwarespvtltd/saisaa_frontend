import React from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  ArrowRight,
  Gem,
  Heart,
  Star,
  Check,
  Feather,
  Layers,
  Scissors,
} from 'lucide-react';

export const About = () => {
  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen text-[#1E2922] overflow-hidden">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION: "ABOUT SAISAA - More Than Fashion"       */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-[#FAF6F0] border-b border-[#D4AF37]/20 py-10 md:py-16">
        {/* Left Botanical Branch Vine Art */}
        <div className="absolute top-0 left-0 h-full pointer-events-none select-none opacity-35 z-0">
          <svg viewBox="0 0 240 380" className="h-full w-auto text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M10 380 C30 300, 20 200, 50 140 C70 90, 110 50, 170 20" strokeLinecap="round" />
            <path d="M35 300 C55 285, 75 300, 80 320 C60 325, 45 315, 35 300 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M45 220 C65 200, 90 215, 90 235 C70 240, 55 230, 45 220 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M55 150 C75 130, 100 140, 105 160 C85 165, 70 155, 55 150 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M90 90 C110 70, 135 80, 135 100 C115 105, 100 95, 90 90 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M130 45 C150 25, 175 35, 175 55 C155 60, 140 50, 130 45 Z" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Subtitle, Description & CTA */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#A37F15] font-bold block">
                ABOUT SAISAA
              </span>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-bold leading-[1.08] tracking-tight">
                More Than <br className="hidden sm:inline" />
                Fashion
              </h1>

              <p className="font-serif text-lg sm:text-xl text-[#09231A] font-semibold italic">
                Unstitched Suits for Every Story
              </p>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                At Saisaa, we believe fashion is more than just what you wear, it's a reflection of who you are. Our unstitched suits are designed for modern women who value elegance, comfort and individuality.
              </p>

              <div className="pt-2">
                <a
                  href="#our-story"
                  className="inline-flex items-center gap-2 bg-[#E5C786] hover:bg-[#D4AF37] text-[#09231A] px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
                >
                  <span>Our Story</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column: Model Seated with Script Overlay */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md lg:max-w-none h-80 sm:h-96 lg:h-[480px] rounded-3xl overflow-hidden shadow-sm">
                <img
                  src="/images/01_hero_banner.jpg"
                  alt="Saisaa - Timeless Fabrics Modern Women"
                  className="w-full h-full object-cover object-top"
                />
                {/* Smooth Gradient Blending into Cream Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/80 via-transparent to-transparent lg:block hidden pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF6F0] via-[#FAF6F0]/50 to-transparent pointer-events-none" />
              </div>

              {/* Floating "Timeless Fabrics Modern Women" Cursive Quote */}
              <div className="absolute right-4 sm:right-8 top-12 sm:top-16 text-right select-none pointer-events-none drop-shadow-sm">
                <p className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#5C4A32] leading-tight">
                  Timeless <br />
                  Fabrics <br />
                  Modern <br />
                  Women
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SECTION 2: "OUR STORY - A Journey Rooted in Elegance"   */}
      {/* ========================================================= */}
      <section id="our-story" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Artisan Embroidery + Overlapping Polaroid Swatches */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            {/* Base Artisan Image */}
            <div className="relative w-full max-w-sm h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-stone-200">
              <img
                src="/images/maroon-story.jpg"
                alt="Artisan Craftsmanship Embroidery"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping Floating Polaroid Card with Fabric Stacks */}
            <div className="absolute -bottom-6 -right-2 sm:-right-4 w-40 sm:w-48 bg-white p-2.5 rounded-xl shadow-xl border border-[#D4AF37]/40 rotate-6 transform transition-transform hover:rotate-0">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100">
                <img
                  src="/images/01_shop_hero_banner.jpg"
                  alt="Folded Silk Fabrics"
                  className="w-full h-full object-cover object-bottom"
                />
              </div>
              <p className="text-[10px] font-serif text-stone-600 italic text-center mt-1.5">
                Pure Weaves
              </p>
            </div>
          </div>

          {/* Center Column: Story Narrative & 3 Feature Icons */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6 text-center lg:text-left pt-6 lg:pt-0">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#A37F15] font-bold block">
              OUR STORY
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-bold leading-tight">
              A Journey Rooted in Elegance
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              Saisaa was born from a simple idea — to bring together the beauty of Indian craftsmanship and the needs of today's modern woman. We curate premium-quality fabrics and beautifully designed unstitched suit sets that let you express your unique style, your way.
            </p>

            {/* 3 Icons in a Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
              <div className="flex flex-col items-center text-center space-y-1.5 p-2 rounded-xl bg-white/70 border border-stone-200/60 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                  <Feather className="w-4 h-4 text-[#A37F15]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-stone-800 leading-tight">
                  Thoughtfully Curated Fabrics
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-1.5 p-2 rounded-xl bg-white/70 border border-stone-200/60 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                  <Gem className="w-4 h-4 text-[#A37F15]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-stone-800 leading-tight">
                  Elegant & Timeless Designs
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-1.5 p-2 rounded-xl bg-white/70 border border-stone-200/60 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                  <Heart className="w-4 h-4 text-[#A37F15]" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-stone-800 leading-tight">
                  Made for Modern Women
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Model in Pink Suit */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-sm h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-stone-200">
              <img
                src="/images/06_product_5.jpg"
                alt="Saisaa Modern Silhouette"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SECTION 3: THREE FEATURE PILLARS IN A ROW              */}
      {/* ========================================================= */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-100">
            
            {/* Pillar 1: Premium Fabric Selection */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-4 first:pt-0 first:px-0">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center text-[#A37F15] shrink-0">
                <Layers className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-tight">
                  Premium Fabric Selection
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  We carefully choose high-quality fabrics for lasting comfort and beauty.
                </p>
              </div>
            </div>

            {/* Pillar 2: Elegant Designs */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center text-[#A37F15] shrink-0">
                <Scissors className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-tight">
                  Elegant Designs
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Contemporary patterns with a touch of tradition.
                </p>
              </div>
            </div>

            {/* Pillar 3: Versatile for Every Occasion */}
            <div className="flex items-start gap-4 pt-4 md:pt-0 md:px-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center text-[#A37F15] shrink-0">
                <Crown className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-tight">
                  Versatile for Every Occasion
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  From everyday elegance to festive celebrations.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SECTION 4: "OUR PHILOSOPHY - Style That Feels Like You" */}
      {/* ========================================================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Blue Printed Suit Model */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-sm h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-stone-200">
              <img
                src="/images/03_product_2.jpg"
                alt="Saisaa Philosophy Draped Elegance"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Center Column: Philosophy Narrative & Button */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6 text-center lg:text-left">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#A37F15] font-bold block">
              OUR PHILOSOPHY
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-bold leading-tight">
              Style That <br className="hidden lg:inline" />
              Feels Like You
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              We create unstitched suits that give you the freedom to style, stitch and wear your way. Whether it's a casual day, a festive celebration or a special occasion, Saisaa is here to make you feel confident, beautiful and effortlessly elegant.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#E5C786] hover:bg-[#D4AF37] text-[#09231A] px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Fabric Swatches + 4 Feature Bullets */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-row gap-5 items-center">
            {/* Stack of 3 Fabric Swatches */}
            <div className="flex flex-row sm:flex-col gap-2.5 shrink-0 justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-xs">
                <img
                  src="/images/03_product_2.jpg"
                  alt="Floral Blue Indigo Fabric Swatch"
                  className="w-full h-full object-cover object-bottom"
                />
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-xs">
                <img
                  src="/images/06_product_5.jpg"
                  alt="Blush Rose Chikankari Fabric Swatch"
                  className="w-full h-full object-cover object-bottom"
                />
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-xs">
                <img
                  src="/images/02_product_1.jpg"
                  alt="Mustard Gold Embroidered Fabric Swatch"
                  className="w-full h-full object-cover object-bottom"
                />
              </div>
            </div>

            {/* 4 Feature Bullet Points matching screenshot */}
            <div className="space-y-4 w-full">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#A37F15] shrink-0 mt-0.5">
                  <Feather className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight">Authentic Designs</h4>
                  <p className="text-[11px] text-stone-500 font-light">Inspired by Indian heritage.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#A37F15] shrink-0 mt-0.5">
                  <Gem className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight">Premium Fabrics</h4>
                  <p className="text-[11px] text-stone-500 font-light">Soft, breathable & comfortable.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#A37F15] shrink-0 mt-0.5">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight">Crafted with Care</h4>
                  <p className="text-[11px] text-stone-500 font-light">Attention to every detail.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#A37F15] shrink-0 mt-0.5">
                  <Star className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 leading-tight">Made for You</h4>
                  <p className="text-[11px] text-stone-500 font-light">Because every woman is unique.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SECTION 5: "OUR CRAFTSMANSHIP - Celebrating Heritage"  */}
      {/* ========================================================= */}
      <section className="bg-[#0A291E] text-white overflow-hidden border-y border-[#D4AF37]/30 my-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] sm:min-h-[420px] items-center">
            
            {/* Left: Artisan Hands Embroidery Photo */}
            <div className="lg:col-span-6 h-64 sm:h-80 lg:h-full py-6 lg:py-0 overflow-hidden flex items-center justify-center">
              <div className="relative w-full h-full max-h-[360px] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-xl">
                <img
                  src="/images/maroon-story.jpg"
                  alt="Artisanal Handloom Embroidery"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Craftsmanship Narrative */}
            <div className="lg:col-span-6 py-10 lg:py-16 lg:pl-12 space-y-4 text-center lg:text-left relative">
              {/* Botanical watermark */}
              <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none opacity-15 overflow-hidden hidden lg:block">
                <svg viewBox="0 0 100 200" fill="none" stroke="#D4AF37" strokeWidth="1.2" className="w-full h-full">
                  <path d="M10,0 C30,40 20,80 40,120 C60,160 30,200 40,240" />
                  <circle cx="40" cy="120" r="3" fill="#D4AF37" />
                </svg>
              </div>

              <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#E5C786] font-bold block">
                OUR CRAFTSMANSHIP
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight">
                Celebrating <br className="hidden sm:inline" />
                Indian Craftsmanship
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                We work with skilled artisans and trusted fabric partners to bring you designs that celebrate India's rich textile heritage, blended with modern aesthetics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SECTION 6: "Why Choose Saisaa"                         */}
      {/* ========================================================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 text-[#D4AF37]">
            <span className="w-12 sm:w-16 h-px bg-[#D4AF37]/50" />
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
              Why Choose Saisaa
            </h2>
            <span className="w-12 sm:w-16 h-px bg-[#D4AF37]/50" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Pillar 1: Quality You Can Trust */}
          <div className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#A37F15] shadow-xs">
              <Gem className="w-5 h-5 text-[#A37F15]" />
            </div>
            <h3 className="font-serif text-xs sm:text-sm font-bold text-stone-900 leading-tight">
              Quality You Can Trust
            </h3>
            <p className="text-[11px] text-stone-500 leading-relaxed font-light">
              Premium fabrics and finest craftsmanship.
            </p>
          </div>

          {/* Pillar 2: Elegant & Timeless */}
          <div className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#A37F15] shadow-xs">
              <Feather className="w-5 h-5 text-[#A37F15]" />
            </div>
            <h3 className="font-serif text-xs sm:text-sm font-bold text-stone-900 leading-tight">
              Elegant & Timeless
            </h3>
            <p className="text-[11px] text-stone-500 leading-relaxed font-light">
              Designed for every occasion.
            </p>
          </div>

          {/* Pillar 3: Customer First */}
          <div className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#A37F15] shadow-xs">
              <Heart className="w-5 h-5 text-[#A37F15]" />
            </div>
            <h3 className="font-serif text-xs sm:text-sm font-bold text-stone-900 leading-tight">
              Customer First
            </h3>
            <p className="text-[11px] text-stone-500 leading-relaxed font-light">
              Your satisfaction matters to us.
            </p>
          </div>

          {/* Pillar 4: More Than Fashion */}
          <div className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/50 flex items-center justify-center text-[#A37F15] shadow-xs">
              <Scissors className="w-5 h-5 text-[#A37F15]" />
            </div>
            <h3 className="font-serif text-xs sm:text-sm font-bold text-stone-900 leading-tight">
              More Than Fashion
            </h3>
            <p className="text-[11px] text-stone-500 leading-relaxed font-light">
              A brand that celebrates your unique style.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
