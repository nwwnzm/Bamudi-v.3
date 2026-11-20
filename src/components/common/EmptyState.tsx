import React from 'react';
import { BamuMascot, BamuMood, BamuSize } from '../brand/BamuMascot';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  ariaLabel?: string;
  variant?: 'primary' | 'secondary' | 'neutral';
}

export interface EmptyStateProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  showMascot?: boolean;
  mascotMood?: BamuMood;
  mascotSize?: BamuSize;
  mascotSpeech?: string;
  icon?: React.ElementType;
  iconClassName?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  variant?: 'card' | 'compact' | 'inline' | 'transparent';
  headingLevel?: 'h2' | 'h3' | 'h4';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  showMascot = true,
  mascotMood = 'thinking',
  mascotSize,
  mascotSpeech,
  icon: ContextIcon,
  iconClassName = 'w-10 h-10 text-slate-300',
  primaryAction,
  secondaryAction,
  className = '',
  variant = 'card',
  headingLevel = 'h2',
}) => {
  // Container styling variants adhering to BaMuDi geometry & tokens
  const containerStyle = {
    card: 'bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xs',
    compact: 'bg-[#fdfdfe] border border-sky-100 rounded-2xl p-6 shadow-2xs',
    inline: 'bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5',
    transparent: 'bg-transparent p-4 sm:p-6',
  }[variant];

  // Default mascot sizing based on container variant
  const resolvedMascotSize: BamuSize =
    mascotSize || (variant === 'compact' || variant === 'inline' ? 'md' : 'xl');

  // Heading element based on hierarchy requirement
  const HeadingTag = headingLevel;
  const titleClasses =
    variant === 'card'
      ? 'text-base sm:text-lg font-bold text-slate-900 font-display mb-1.5'
      : 'text-sm sm:text-base font-bold text-slate-900 font-display mb-1';

  const renderAction = (action: EmptyStateAction, defaultVariant: 'primary' | 'secondary') => {
    const actionVariant = action.variant || defaultVariant;
    const Icon = action.icon;

    const baseClasses =
      'min-h-[44px] px-5 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer inline-flex items-center justify-center gap-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variantClasses = {
      primary:
        'text-white bg-[#0099ff] hover:bg-[#0088ee] shadow-xs focus-visible:ring-[#0099ff]',
      secondary:
        'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/70 shadow-2xs focus-visible:ring-slate-400',
      neutral:
        'text-[#007acc] hover:text-[#0055aa] bg-sky-50 hover:bg-sky-100 border border-sky-200/80 focus-visible:ring-[#0099ff]',
    }[actionVariant];

    return (
      <button
        key={action.label}
        type="button"
        onClick={action.onClick}
        aria-label={action.ariaLabel || action.label}
        className={`${baseClasses} ${variantClasses}`}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
        <span>{action.label}</span>
      </button>
    );
  };

  return (
    <div
      className={`text-center flex flex-col items-center justify-center animate-fadeIn ${containerStyle} ${className}`}
      role="region"
      aria-live="polite"
    >
      {/* Visual Anchor: Bamu Mascot or Contextual Icon */}
      {showMascot ? (
        <div className="mb-4 shrink-0 flex items-center justify-center">
          <BamuMascot
            mood={mascotMood}
            size={resolvedMascotSize}
            speech={mascotSpeech}
            speechPosition="right"
          />
        </div>
      ) : ContextIcon ? (
        <div className="mb-3.5 w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
          <ContextIcon className={iconClassName} aria-hidden="true" />
        </div>
      ) : null}

      {/* Heading */}
      <HeadingTag className={titleClasses}>{title}</HeadingTag>

      {/* Description */}
      {description && (
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5 leading-relaxed font-normal">
          {description}
        </p>
      )}

      {/* Actions (44px Minimum Touch Target) */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryAction && renderAction(primaryAction, 'primary')}
          {secondaryAction && renderAction(secondaryAction, 'secondary')}
        </div>
      )}
    </div>
  );
};
