import React from 'react';
import { Language, CompetencyLevel } from '../../types';
import { translations } from '../../data/translations';
import { TUTORIALS } from '../../data/tutorials';
import { BrandLogo } from '../brand/BrandLogo';
import {
  Home,
  BookOpen,
  FolderOpen,
  Wrench,
  BookA,
  GraduationCap,
  Globe,
  X,
  ChevronRight,
  ClipboardCheck,
  Sparkles,
  Wand2,
  Bookmark,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  completedCount: number;
  savedItemsCount?: number;
  totalTutorials?: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  competencyLevel: CompetencyLevel;
  onSelectCompetencyLevel: (lvl: CompetencyLevel) => void;
  onOpenLandingPage?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  completedCount,
  savedItemsCount = 0,
  totalTutorials = TUTORIALS.length,
  isMobileOpen,
  onCloseMobile,
  competencyLevel,
  onSelectCompetencyLevel,
  onOpenLandingPage,
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'library', label: t.nav.library, icon: BookOpen },
    { id: 'prompt-builder', label: t.nav.promptBuilder, icon: Wand2 },
    { id: 'rph-generator', label: t.nav.rphGenerator, icon: Sparkles },
    { id: 'pbd-system', label: t.nav.pbdSystem, icon: ClipboardCheck },
    { id: 'resources', label: t.nav.resources, icon: FolderOpen },
    { id: 'tools', label: t.nav.tools, icon: Wrench },
    { id: 'glossary', label: t.nav.glossary, icon: BookA },
    {
      id: 'my-learning',
      label: t.nav.myLearning,
      icon: GraduationCap,
      badge: completedCount > 0 ? completedCount : undefined,
    },
    {
      id: 'saved-items',
      label: t.nav.savedItems,
      icon: Bookmark,
      badge: savedItemsCount > 0 ? savedItemsCount : undefined,
    },
  ];

  const progressPct =
    totalTutorials > 0
      ? Math.min(100, Math.round((completedCount / totalTutorials) * 100))
      : 0;

  const content = (
    <div className="flex flex-col h-full bg-[#fdfdfe] lg:rounded-3xl border-r lg:border border-sky-100/90 shadow-sm select-none overflow-hidden relative">
      {/* 1. Stacked Brand Header matching Firefly Dashboard Reference */}
      <div className="pt-5 pb-3.5 px-4 border-b border-sky-100/70 flex items-center justify-center relative shrink-0">
        <button
          type="button"
          onClick={() => {
            if (onOpenLandingPage) {
              onOpenLandingPage();
            } else {
              onSelectTab('home');
            }
            onCloseMobile();
          }}
          className="cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] rounded-2xl px-2 py-1"
          aria-label="BaMuDi Home"
        >
          <BrandLogo size="md" layout="stacked" showSubtitle={false} />
        </button>

        {/* Mobile close button (44px touch target) */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden absolute right-3 top-3 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-sky-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* 2. Scrollable Middle Area: 8 Navigation Destinations + Brand Motif */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 no-scrollbar flex flex-col justify-between">
        <nav aria-label={language === 'bm' ? 'Navigasi Utama' : 'Main Navigation'} className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <div key={item.id} className="relative flex items-center">
                {/* Left Vertical Accent Indicator on Active Item */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-3 w-1.5 h-7 rounded-r-full bg-[#0077dd] shadow-2xs"
                  />
                )}

                <button
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                    isActive
                      ? 'bg-[#d6ecff] text-[#004d99] shadow-2xs'
                      : 'text-slate-600 hover:text-[#0066cc] hover:bg-sky-50/90'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? 'bg-[#0066cc] text-white shadow-2xs'
                          : 'text-[#3b5978] group-hover:text-[#0066cc]'
                      }`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded-full bg-[#cc310e] text-white shrink-0 ml-1 tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* 3. "Learn · Create · Inspire" Brand Motif & Progress Shortcut */}
        <div className="pt-3 mt-2">
          <div className="relative rounded-2xl bg-gradient-to-br from-[#f2f9ff] via-[#fdfdfe] to-[#fff8e6] border border-sky-100 p-3.5 overflow-hidden">
            {/* Decorative Science Line-Art Motifs (Atom & Beaker from Reference) */}
            <svg
              viewBox="0 0 120 90"
              fill="none"
              aria-hidden="true"
              className="absolute right-0 bottom-0 w-24 h-20 text-[#0099ff]/15 pointer-events-none"
            >
              {/* Atom Orbits */}
              <ellipse cx="42" cy="58" rx="22" ry="8" transform="rotate(-30 42 58)" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="42" cy="58" rx="22" ry="8" transform="rotate(30 42 58)" stroke="currentColor" strokeWidth="2" />
              <ellipse cx="42" cy="58" rx="22" ry="8" transform="rotate(90 42 58)" stroke="currentColor" strokeWidth="2" />
              <circle cx="42" cy="58" r="3" fill="currentColor" />
              {/* Conical Flask */}
              <path
                d="M 92 22 H 104 M 95 22 V 32 L 85 52 C 84 54 85.5 57 88 57 H 108 C 110.5 57 112 54 111 52 L 101 32 V 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Warm Firefly Gold Sparkle Stars */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="w-4 h-4 text-[#ffb300] absolute top-2.5 right-3 pointer-events-none"
            >
              <path d="M12 2L14 9L21 11L14 13L12 20L10 13L3 11L10 9L12 2Z" fill="currentColor" />
            </svg>

            <div className="relative z-10 flex items-center gap-3">
              {/* Tilted Warm Cream/Gold Emblem */}
              <div className="px-3 py-2 rounded-2xl bg-[#fff3c4] border border-[#ffd54f] shadow-2xs -rotate-3 shrink-0">
                <p className="text-[11px] font-extrabold font-display leading-tight text-[#0a2540] italic">
                  {language === 'bm' ? (
                    <>
                      Belajar
                      <br />
                      Cipta
                      <br />
                      Inspirasi
                    </>
                  ) : (
                    <>
                      Learn
                      <br />
                      Create
                      <br />
                      Inspire
                    </>
                  )}
                </p>
              </div>

              {/* Real Teacher Progress & Shortcut */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span className="truncate">
                    {language === 'bm' ? 'Kemajuan' : 'Progress'}
                  </span>
                  <span className="font-mono text-[#0066cc] tabular-nums">
                    {completedCount}/{totalTutorials}
                  </span>
                </div>
                <div className="w-full bg-sky-100 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#0099ff] to-[#cc310e]"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('my-learning');
                    onCloseMobile();
                  }}
                  className="text-[11px] font-bold text-[#0066cc] hover:text-[#004d99] inline-flex items-center gap-0.5 cursor-pointer group focus-visible:outline-none focus-visible:underline"
                >
                  <span>{language === 'bm' ? 'Rekod Saya' : 'My Progress'}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Controls: Language & Competency Level (44px Touch Targets) */}
      <div className="p-3 border-t border-sky-100/80 bg-[#fdfdfe] space-y-2 shrink-0">
        {/* Language Switcher */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Globe className="w-3.5 h-3.5 text-[#0099ff]" aria-hidden="true" />
            <span>{t.common.language}</span>
          </div>

          <div
            className="flex items-center bg-sky-50 p-0.5 rounded-full border border-sky-200/80"
            role="group"
            aria-label={t.common.language}
          >
            <button
              type="button"
              onClick={() => onToggleLanguage('bm')}
              aria-pressed={language === 'bm'}
              className={`min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                language === 'bm'
                  ? 'bg-[#0099ff] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#007acc]'
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
                  : 'text-slate-600 hover:text-[#007acc]'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Competency Level Selector */}
        <div className="pt-1.5 border-t border-sky-100/70 flex items-center justify-between gap-2 text-xs">
          <label
            htmlFor="sidebar-competency-select"
            className="text-slate-600 text-[11px] font-semibold truncate"
          >
            {language === 'bm' ? 'Tahap:' : 'Level:'}
          </label>
          <select
            id="sidebar-competency-select"
            value={competencyLevel}
            onChange={(e) => onSelectCompetencyLevel(e.target.value as CompetencyLevel)}
            className="min-h-[44px] text-xs font-bold text-[#0055aa] bg-sky-50/70 hover:bg-sky-100/70 border border-sky-200 rounded-xl px-2.5 py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
          >
            <option value="beginner">{t.levels.beginner}</option>
            <option value="intermediate">{t.levels.intermediate}</option>
            <option value="advanced">{t.levels.advanced}</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Floating Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-68 shrink-0 sticky top-0 h-screen p-3.5 pr-0 z-30">
        {content}
      </aside>

      {/* Mobile Off-Canvas Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Mobile Off-Canvas Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
