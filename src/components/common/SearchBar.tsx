import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onClear?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  variant?: 'hero' | 'default' | 'compact';
  submitButtonText?: string;
  showSubmitButton?: boolean;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Cari...',
  ariaLabel = 'Carian',
  variant = 'default',
  submitButtonText,
  showSubmitButton = false,
  className = '',
  inputClassName = '',
  autoFocus = false,
}) => {
  const handleClear = () => {
    onChange('');
    if (onClear) {
      onClear();
    }
  };

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';

  // Height and padding tokens compliant with 44px minimum interactive height (antislop R-03)
  const containerClasses = isHero
    ? 'min-h-[52px] p-1.5 bg-white rounded-full border-2 border-sky-200 shadow-lg shadow-sky-950/5 hover:border-[#0099ff] focus-within:border-[#0099ff] focus-within:ring-3 focus-within:ring-[#0099ff]/20'
    : isCompact
    ? 'min-h-[44px] p-1 bg-[#fdfdfe] rounded-full border border-slate-200 hover:border-sky-300 focus-within:border-[#0099ff] focus-within:ring-2 focus-within:ring-[#0099ff]/20 shadow-2xs'
    : 'min-h-[46px] p-1.5 bg-white rounded-full border border-slate-200/90 hover:border-sky-300 focus-within:border-[#0099ff] focus-within:ring-2 focus-within:ring-[#0099ff]/20 shadow-xs';

  const iconClasses = isHero
    ? 'w-5 h-5 text-[#0099ff] ml-3.5 mr-2 shrink-0 pointer-events-none'
    : isCompact
    ? 'w-4 h-4 text-[#0099ff] ml-3 mr-2 shrink-0 pointer-events-none'
    : 'w-4 h-4 text-[#0099ff] ml-3.5 mr-2.5 shrink-0 pointer-events-none';

  const inputSizeClasses = isHero
    ? 'py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium'
    : isCompact
    ? 'py-1.5 text-xs text-slate-900 placeholder:text-slate-400 font-medium'
    : 'py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium';

  const content = (
    <div className={`relative flex items-center transition-all ${containerClasses} ${className}`}>
      <Search className={iconClasses} aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className={`w-full bg-transparent border-0 focus:outline-none ${inputSizeClasses} ${inputClassName}`}
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1.5 mr-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus:outline-none"
          aria-label="Padam carian"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {showSubmitButton && (
        <button
          type="submit"
          className="px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#0099ff] to-[#0088ee] hover:from-[#0088ee] hover:to-[#0077dd] rounded-full transition-all cursor-pointer shadow-md shadow-[#0099ff]/25 whitespace-nowrap shrink-0 hover:scale-102 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus:outline-none"
        >
          {submitButtonText || 'Cari'}
        </button>
      )}
    </div>
  );

  if (onSubmit) {
    return (
      <form onSubmit={onSubmit} role="search" className="w-full">
        {content}
      </form>
    );
  }

  return <div role="search" className="w-full">{content}</div>;
};
