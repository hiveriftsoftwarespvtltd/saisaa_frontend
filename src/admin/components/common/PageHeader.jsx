import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = null,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 mb-6">
      <div className="space-y-1">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
            <Link to="/admin/dashboard" className="hover:text-stone-700 transition-colors">
              Admin
            </Link>
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-stone-300" />
                {bc.path ? (
                  <Link to={bc.path} className="hover:text-stone-700 transition-colors">
                    {bc.label}
                  </Link>
                ) : (
                  <span className="text-stone-700 font-medium">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
