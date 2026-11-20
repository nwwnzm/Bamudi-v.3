import React from 'react';

export const BAMUDI_LOGO_ASSET_PATH = '/assets/aistudio/Bamudi_logo_adb389ae.jfif';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
  layout?: 'horizontal' | 'stacked';
  onClick?: () => void;
}

export const BrandLogo: React.FC<Props> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  theme = 'light',
  layout = 'horizontal',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const isDark = theme === 'dark';
  const isStacked = layout === 'stacked';

  return (
    <div
      onClick={onClick}
      className={`flex ${
        isStacked ? 'flex-col items-center text-center gap-1.5' : 'items-center gap-2.5'
      } select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Official BaMuDi Emblem (Golden 5-Point Star, Ray, Twin Golden Pages & Deep Navy Book Base) */}
      <div
        className={`${iconSizes[size]} rounded-2xl ${
          isDark
            ? 'bg-white border border-white/20 shadow-sm'
            : 'bg-white border border-sky-200/80 shadow-xs'
        } p-1 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* 1. Top 5-Pointed Rounded Star (Warm Golden Yellow #FBB627) */}
          <polygon
            points="50,11 55.5,26.8 72,27.8 59.2,38.2 63.6,54 50,44.8 36.4,54 40.8,38.2 28,27.8 44.5,26.8"
            fill="#FBB627"
            stroke="#FBB627"
            strokeWidth="3.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* 2. Center Downward Diamond Ray (#FBB627) */}
          <polygon
            points="50,50.5 53.8,53.2 50,68.8 46.2,53.2"
            fill="#FBB627"
            stroke="#FBB627"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* 3. Open Book Golden Pages: Upper Arch & Center Spine (#FBB627) */}
          <path
            d="M 18.5 60
               C 31 58 44 63.2 50 77.5
               C 56 63.2 69 58 81.5 60
               L 89 70.8
               C 75.2 68.2 59.5 71.8 52.6 85.5
               L 47.4 85.5
               C 40.5 71.8 24.8 68.2 11 70.8
               Z"
            fill="#FBB627"
            stroke="#FBB627"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* 4. Open Book Golden Pages: Lower Left Layer (#FBB627) */}
          <path
            d="M 9 76.2
               C 22.2 73 36.5 75.8 44.2 83.2
               L 43 84.4
               C 34 80.5 20.8 80.2 7.5 82.2
               Z"
            fill="#FBB627"
            stroke="#FBB627"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* 5. Open Book Golden Pages: Lower Right Layer (#FBB627) */}
          <path
            d="M 91 76.2
               C 77.8 73 63.5 75.8 55.8 83.2
               L 57 84.4
               C 66 80.5 79.2 80.2 92.5 82.2
               Z"
            fill="#FBB627"
            stroke="#FBB627"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* 6. Deep Royal Navy Book Cover Base (#003B7A) */}
          <path
            d="M 5.5 84.8
               H 42.2
               C 43.8 84.8 44.6 85.6 45.4 86.8
               C 46.2 88 47.2 88.5 50 88.5
               C 52.8 88.5 53.8 88 54.6 86.8
               C 55.4 85.6 56.2 84.8 57.8 84.8
               H 94.5
               C 96.2 84.8 97.4 86 97.4 87.5
               C 97.4 89 96.2 90.2 94.5 90.2
               H 59.5
               C 57.8 90.2 56.8 91 55.6 92.4
               C 54.4 93.8 52.8 94.5 50 94.5
               C 47.2 94.5 45.6 93.8 44.4 92.4
               C 43.2 91 42.2 90.2 40.5 90.2
               H 5.5
               C 3.8 90.2 2.6 89 2.6 87.5
               C 2.6 86 3.8 84.8 5.5 84.8
               Z"
            fill="#003B7A"
          />
        </svg>
      </div>

      {/* Brand Wordmark (Baloo 2 Bold) & Supporting Tagline (Nunito) */}
      <div className="leading-tight">
        <div className={`flex items-center ${isStacked ? 'justify-center' : ''} tracking-tight`}>
          <span
            className={`${textSizes[size]} font-extrabold font-display ${
              isDark ? 'text-[#fdfdfe]' : 'text-[#003B7A]'
            }`}
          >
            Ba<span className="text-[#0099ff]">Mu</span>Di
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[10px] font-sans font-bold tracking-wider uppercase block ${
              isDark ? 'text-sky-300' : 'text-[#007acc]'
            }`}
          >
            Bantu Mula Digital
          </span>
        )}
      </div>
    </div>
  );
};
