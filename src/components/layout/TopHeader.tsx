import React, { useState } from 'react';
import { Language, CompetencyLevel, TutorialCategory } from '../../types';
import { translations } from '../../data/translations';
import { BrandLogo } from '../brand/BrandLogo';
import { SearchBar } from '../common/SearchBar';
import { Menu, Globe, GraduationCap, SlidersHorizontal } from 'lucide-react';

interface Props {
  onOpenMobile: () => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  currentTab: string;
  completedCount: number;
  onSelectTab: (tab: string) => void;
  competencyLevel?: CompetencyLevel;
  onSelectCompetencyLevel?: (lvl: CompetencyLevel) => void;
  onNavigateToLibrary?: (category?: TutorialCategory | 'all', query?: string) => void;
  onOpenLandingPage?: () => void;
}

export const TopHeader: React.FC<Props> = ({
  onOpenMobile,
  language,
  onToggleLanguage,
  currentTab,
  completedCount,
  onSelectTab,
  competencyLevel = 'beginner',
  onSelectCompetencyLevel,
  onNavigateToLibrary,
  onOpenLandingPage,
}) => {
  const t = translations[language];
  const [headerSearch, setHeaderSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = headerSearch.trim();
    if (onNavigateToLibrary) {
      onNavigateToLibrary('all', trimmed);
    } else {
      onSelectTab('library');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#eef7ff]/90 backdrop-blur-md border-b border-sky-200/60 px-3 sm:px-5 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Top Row on Mobile / Left Zone on Desktop: Hamburger + Mobile Logo + Pill SearchBar */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Mobile Drawer Trigger (44px target) */}
          <button
            type="button"
            onClick={onOpenMobile}
            className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl bg-white border border-sky-200/80 text-slate-700 hover:text-[#0099ff] hover:bg-sky-50 transition-colors cursor-pointer shrink-0 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
            aria-label={language === 'bm' ? 'Buka menu navigasi' : 'Open navigation menu'}
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Mobile Brand Logo (only visible on <640px before search bar wraps, or compact inline) */}
          <div className="sm:hidden shrink-0">
            <BrandLogo
              size="sm"
              showSubtitle={false}
              onClick={() => (onOpenLandingPage ? onOpenLandingPage() : onSelectTab('home'))}
            />
          </div>

          {/* Global SearchBar on Tablet/Desktop (and full width row below on small mobile) */}
          <div className="hidden sm:block flex-1 max-w-md lg:max-w-lg min-w-0">
            <SearchBar
              value={headerSearch}
              onChange={setHeaderSearch}
              onSubmit={handleSearchSubmit}
              placeholder={
                language === 'bm'
                  ? 'Cari panduan, alatan atau topik pengajaran...'
                  : 'Search tutorials, tools or teaching topics...'
              }
              ariaLabel={
                language === 'bm'
                  ? 'Cari panduan dalam Perpustakaan Digital'
                  : 'Search tutorials in Digital Library'
              }
              variant="compact"
              className="bg-white/95 border-sky-200/90 shadow-xs"
            />
          </div>

          {/* Mobile Quick Controls Right-Aligned on Row 1 (<640px) */}
          <div className="flex sm:hidden items-center gap-1.5 ml-auto">
            <div
              className="flex items-center bg-white p-0.5 rounded-full border border-sky-200/90 shadow-2xs"
              role="group"
              aria-label={t.common.language}
            >
              <button
                type="button"
                onClick={() => onToggleLanguage('bm')}
                aria-pressed={language === 'bm'}
                className={`min-h-[44px] min-w-[44px] px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                  language === 'bm'
                    ? 'bg-[#0099ff] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#0099ff]'
                }`}
              >
                BM
              </button>
              <button
                type="button"
                onClick={() => onToggleLanguage('en')}
                aria-pressed={language === 'en'}
                className={`min-h-[44px] min-w-[44px] px-2.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                  language === 'en'
                    ? 'bg-[#0099ff] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-[#0099ff]'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Full-Width SearchBar Row (<640px) */}
        <div className="sm:hidden w-full">
          <SearchBar
            value={headerSearch}
            onChange={setHeaderSearch}
            onSubmit={handleSearchSubmit}
            placeholder={
              language === 'bm'
                ? 'Cari panduan, alatan atau topik...'
                : 'Search tutorials, tools or topics...'
            }
            ariaLabel={
              language === 'bm'
                ? 'Cari panduan dalam Perpustakaan Digital'
                : 'Search tutorials in Digital Library'
            }
            variant="compact"
            className="bg-white border-sky-200/90 shadow-2xs"
          />
        </div>

        {/* Right Zone on Tablet & Desktop: Competency Selector + Language Switcher + My Learning Shortcut */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Competency Level Selector */}
          {onSelectCompetencyLevel && (
            <div className="hidden md:flex items-center bg-white border border-sky-200/90 rounded-full pl-3 pr-2 min-h-[44px] shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0099ff] mr-1.5 shrink-0" aria-hidden="true" />
              <label htmlFor="header-competency-select" className="sr-only">
                {language === 'bm' ? 'Tahap Kemahiran' : 'Competency Level'}
              </label>
              <select
                id="header-competency-select"
                value={competencyLevel}
                onChange={(e) => onSelectCompetencyLevel(e.target.value as CompetencyLevel)}
                className="min-h-[44px] text-xs font-bold text-[#0a2540] bg-transparent pr-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] rounded-full"
              >
                <option value="beginner">{t.levels.beginner}</option>
                <option value="intermediate">{t.levels.intermediate}</option>
                <option value="advanced">{t.levels.advanced}</option>
              </select>
            </div>
          )}

          {/* Working BM / EN Language Switcher (44px touch targets) */}
          <div
            className="flex items-center bg-white p-0.5 rounded-full border border-sky-200/90 shadow-2xs"
            role="group"
            aria-label={t.common.language}
          >
            <Globe className="w-3.5 h-3.5 text-[#0099ff] ml-2.5 mr-1 shrink-0" aria-hidden="true" />
            <button
              type="button"
              onClick={() => onToggleLanguage('bm')}
              aria-pressed={language === 'bm'}
              className={`min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                language === 'bm'
                  ? 'bg-[#0099ff] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#0099ff]'
              }`}
            >
              BM
            </button>
            <button
              type="button"
              onClick={() => onToggleLanguage('en')}
              aria-pressed={language === 'en'}
              className={`min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                language === 'en'
                  ? 'bg-[#0099ff] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#0099ff]'
              }`}
            >
              EN
            </button>
          </div>

          {/* My Learning Shortcut Button (44px touch target) */}
          <button
            type="button"
            onClick={() => onSelectTab('my-learning')}
            className={`min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer shadow-2xs border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] whitespace-nowrap shrink-0 ${
              currentTab === 'my-learning'
                ? 'bg-[#0099ff] text-white border-[#0088ee] shadow-sm'
                : 'bg-white text-[#0a2540] border-sky-200/90 hover:bg-sky-50 hover:border-[#0099ff]/50'
            }`}
          >
            <GraduationCap
              className={`w-4 h-4 shrink-0 ${
                currentTab === 'my-learning' ? 'text-white' : 'text-[#0099ff]'
              }`}
              aria-hidden="true"
            />
            <span>{t.nav.myLearning}</span>
            {completedCount > 0 && (
              <span className="font-mono text-[11px] font-black bg-[#cc310e] text-white px-2 py-0.5 rounded-full tabular-nums">
                {completedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
