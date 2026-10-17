import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Crown } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border-2 border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#09231A] shadow-inner">
        <Crown className="w-8 h-8 text-[#D4AF37]" />
      </div>

      <span className="text-xs uppercase tracking-[0.25em] text-[#18523D] font-bold">
        Error 404 &bull; Path Not Found
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
        This Royal Hallway Does Not Exist
      </h1>

      <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
        The creation or page you are seeking might have been moved or archived into our private vaults.
      </p>

      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#09231A] hover:bg-[#103B2C] text-[#F7E7BE] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#D4AF37]/50 shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return To Grand Foyer</span>
        </Link>
      </div>
    </div>
  );
};
