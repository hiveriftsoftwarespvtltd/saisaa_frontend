import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  isPositive = true,
  comparisonText = '',
  accentColor = 'green', // 'green', 'gold', 'blue', 'amber', 'rose', 'purple'
  onClick,
}) => {
  const accentClasses = {
    green: 'bg-[#0A261C]/5 text-[#0A261C] border-[#0A261C]/15',
    gold: 'bg-[#D4AF37]/10 text-[#A37F15] border-[#D4AF37]/30',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs hover:shadow-md transition-all group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span
            className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block whitespace-nowrap truncate"
            title={title}
          >
            {title}
          </span>
          <h4 className="font-serif text-2xl font-bold text-stone-900 tracking-tight leading-tight mt-1 truncate">
            {value}
          </h4>
        </div>

        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-2xs ${
              accentClasses[accentColor] || accentClasses.green
            }`}
          >
            <Icon className="w-4 h-4 stroke-[2]" />
          </div>
        )}
      </div>

      {(change || comparisonText) && (
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center gap-1.5 text-[11px] min-w-0">
          {change && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                  : 'bg-rose-50 text-rose-700 border border-rose-200/70'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-2.5 h-2.5 stroke-[2.5]" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 stroke-[2.5]" />
              )}
              <span>{change}</span>
            </span>
          )}

          {comparisonText && (
            <span
              className="text-[10px] text-stone-400 font-medium truncate"
              title={comparisonText}
            >
              {comparisonText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
