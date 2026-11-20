import React from 'react';
import { Language } from '../../types';
import { translations } from '../../data/translations';
import { Globe, BookMarked } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  completedCount: number;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  completedCount,
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'library', label: t.nav.library },
    { id: 'resources', label: t.nav.resources },
    { id: 'tools', label: t.nav.tools },
    { id: 'glossary', label: t.nav.glossary },
    { id: 'my-learning', label: t.nav.myLearning },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fdfdfe]/95 backdrop-blur-md border-b border-sky-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Approachable Brand Logo */}
        <BrandLogo onClick={() => onSelectTab('home')} />

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-all whitespace-nowrap py-1.5 px-4 rounded-full cursor-pointer text-xs sm:text-sm ${
                  isActive
                    ? 'bg-[#0099ff] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-sky-900 hover:bg-white/80'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Language Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-sky-50 p-1 rounded-full border border-sky-200">
            <Globe className="w-3.5 h-3.5 text-[#0099ff] ml-1.5 mr-1 shrink-0" />
            <button
              onClick={() => onToggleLanguage('bm')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                language === 'bm'
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'text-sky-800 hover:text-sky-950'
              }`}
            >
              BM
            </button>
            <button
              onClick={() => onToggleLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'text-sky-800 hover:text-sky-950'
              }`}
            >
              EN
            </button>
          </div>

          {/* Quick Learning Progress Button */}
          <button
            onClick={() => onSelectTab('my-learning')}
            className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              currentTab === 'my-learning'
                ? 'bg-[#003366] text-white'
                : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-[#0099ff]" />
            <span>{t.nav.myLearning}</span>
            {completedCount > 0 && (
              <span className="font-mono text-[11px] font-black bg-[#cc310e] text-white px-2 py-0.2 rounded-full">
                {completedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroll */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2.5 overflow-x-auto border-t border-slate-100 bg-white/95 no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
