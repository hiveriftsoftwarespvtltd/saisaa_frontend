import React from 'react';
import { Link } from 'react-router-dom';

export const PageHeroBanner = ({
  breadcrumb = 'Shop',
  titleLine1 = 'Shop',
  titleLine2 = 'Unstitched Suits',
  description = 'Explore our latest collection of premium unstitched suit sets crafted for timeless style and modern womanhood.',
  modelImage = '/images/blue-kurti.jpg',
  modelAlt = 'Saisaa Collection',
  features,
}) => {
  // Default 4 trust features matching the exact reference screenshot
  const defaultFeatures = [
    {
      title: 'Premium Fabrics',
      icon: (
        <svg className="w-6 h-6 stroke-[#C5A059] fill-none stroke-[1.5]" viewBox="0 0 24 24">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c0 3 .5 5-1 10.5A7 7 0 0 1 11 20z" />
          <path d="M2 22c1.25-.97 3.9-3.3 6-7" />
          <path d="M9 14l3-1M12 11l3-1" />
        </svg>
      ),
    },
    {
      title: 'Elegant Designs',
      icon: (
        <svg className="w-6 h-6 stroke-[#C5A059] fill-none stroke-[1.5]" viewBox="0 0 24 24">
          <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
          <path d="M2 9h20M12 21L8 9l4-6 4 6-4 12z" />
        </svg>
      ),
    },
    {
      title: 'Free Shipping Across India',
      icon: (
        <svg className="w-6 h-6 stroke-[#C5A059] fill-none stroke-[1.5]" viewBox="0 0 24 24">
          <rect x="1" y="4" width="14" height="12" rx="1" />
          <path d="M15 8h4l3 4v4h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="17.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: 'Trusted Quality',
      icon: (
        <svg className="w-6 h-6 stroke-[#C5A059] fill-none stroke-[1.5]" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
  ];

  const items = features || defaultFeatures;

  return (
    <section className="relative w-full bg-[#FAF6F0] border-b border-[#EADCC8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px] sm:min-h-[420px] items-stretch">
          
          {/* Left Column: Breadcrumb, Title, Description, 4 Pillars */}
          <div className="lg:col-span-7 py-10 sm:py-14 flex flex-col justify-center space-y-4 sm:space-y-5 z-10 pr-0 lg:pr-8">
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-stone-500 font-light">
              <Link to="/" className="hover:text-stone-900 transition-colors">
                Home
              </Link>
              <span className="text-stone-400">&gt;</span>
              <span className="text-stone-800 font-medium">
                {breadcrumb}
              </span>
            </nav>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-normal text-[#1B2922] leading-[1.12] tracking-tight">
              {titleLine1} <br />
              <span className="font-normal text-[#1B2922]">{titleLine2}</span>
            </h1>

            {/* Description */}
            <p className="text-stone-600 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
              {description}
            </p>

            {/* 4 Feature Badges */}
            <div className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-2xl border-t border-stone-200/70">
              {items.map((feat, index) => (
                <div key={index} className="flex flex-col items-start space-y-1.5">
                  <div className="shrink-0">{feat.icon}</div>
                  <span className="text-[11px] sm:text-xs font-semibold text-stone-900 leading-tight">
                    {feat.title}
                  </span>
                  {feat.subtitle && (
                    <span className="text-[10px] text-stone-500 font-light leading-tight">
                      {feat.subtitle}
                    </span>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Model seamlessly blended into warm cream backdrop */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-end overflow-hidden">
            <div className="relative w-full h-full min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] flex items-end justify-center lg:justify-end">
              <img
                src={modelImage}
                alt={modelAlt}
                className="w-full h-full max-h-[440px] object-cover object-top"
              />

              {/* Soft left gradient blending seamlessly into the cream background */}
              <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/40 to-transparent pointer-events-none hidden lg:block" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#FAF6F0]/60 to-transparent pointer-events-none lg:hidden" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
