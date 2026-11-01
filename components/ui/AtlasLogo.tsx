import React from 'react';

export interface AtlasLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showSubtitle?: boolean;
  textClassName?: string;
}

export function AtlasLogo({
  className = '',
  size = 'md',
  showText = true,
  showSubtitle = true,
  textClassName = '',
}: AtlasLogoProps) {
  const iconDimensions = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Luxury Architectural Solid Black Icon Mark */}
      <div
        className={`${iconDimensions[size]} rounded-xl bg-black flex items-center justify-center text-white font-black tracking-tighter shadow-md transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-600 relative shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized Modern Atlas Compass / Geometric 'A' Peak */}
          <path d="M12 2L3 21H7.5L12 11.5L16.5 21H21L12 2ZM12 6.8L14.8 13.5H9.2L12 6.8Z" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${textSizes[size]} font-black uppercase tracking-tight text-black flex items-center gap-1.5 leading-none ${textClassName}`}
          >
            ATLAS <span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />
          </span>
          {showSubtitle && (
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/50 mt-1">
              TRIP INTELLIGENCE
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default AtlasLogo;
