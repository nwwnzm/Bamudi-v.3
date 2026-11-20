import React, { useState, useMemo, useEffect } from 'react';
import { Tutorial, Language, TutorialCategory, CompetencyLevel } from '../../types';
import { translations } from '../../data/translations';
import { TutorialCard } from './TutorialCard';
import { BamuMascot } from '../brand/BamuMascot';
import { SearchBar } from '../common/SearchBar';
import { EmptyState } from '../common/EmptyState';
import { Filter, Sprout, Compass as CompassIcon, Zap } from 'lucide-react';

interface Props {
  tutorials: Tutorial[];
  language: Language;
  onSelectTutorial: (tutorial: Tutorial) => void;
  completedIds: string[];
  savedIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  initialCategory?: TutorialCategory | 'all';
  initialQuery?: string;
}

export const DigitalLibraryView: React.FC<Props> = ({
  tutorials,
  language,
  onSelectTutorial,
  completedIds,
  savedIds,
  onToggleSave,
  initialCategory = 'all',
  initialQuery = '',
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<TutorialCategory | 'all'>(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<CompetencyLevel | 'all'>('all');

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const categories: { id: TutorialCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.categories.all },
    { id: 'getting-started', label: t.categories['getting-started'] },
    { id: 'teaching-tools', label: t.categories['teaching-tools'] },
    { id: 'ai-teachers', label: t.categories['ai-teachers'] },
    { id: 'interactive', label: t.categories.interactive },
  ];

  const levels: { id: CompetencyLevel | 'all'; label: string; icon?: React.ElementType }[] = [
    { id: 'all', label: t.levels.all },
    { id: 'beginner', label: t.levels.beginner, icon: Sprout },
    { id: 'intermediate', label: t.levels.intermediate, icon: CompassIcon },
    { id: 'advanced', label: t.levels.advanced, icon: Zap },
  ];

  const filteredTutorials = useMemo(() => {
    return tutorials.filter((tut) => {
      const matchesCategory =
        selectedCategory === 'all' || tut.category === selectedCategory;
      const matchesLevel =
        selectedLevel === 'all' || tut.level === selectedLevel;

      if (!matchesCategory || !matchesLevel) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = tut.title[language].toLowerCase().includes(q);
      const descMatch = tut.description[language].toLowerCase().includes(q);
      const badgeMatch = tut.toolBadge.toLowerCase().includes(q);
      return titleMatch || descMatch || badgeMatch;
    });
  }, [tutorials, selectedCategory, selectedLevel, searchQuery, language]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn bg-[#fdfdfe]">
      {/* Header section with Bamu welcome */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-sky-50/80 via-[#fdfdfe] to-[#fdf2f0] border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#007acc] uppercase tracking-wider block mb-1">
            {language === 'bm' ? 'Perpustakaan Panduan Digital' : 'Digital Guide Library'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-2">
            {t.nav.library}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
            {selectedCategory === 'all'
              ? language === 'bm'
                ? `Koleksi ${tutorials.length} panduan digital langkah demi langkah yang mesra, jelas, dan dirangka mengikut keperluan harian bilik darjah anda.`
                : `Collection of ${tutorials.length} step-by-step digital tutorials designed for classroom teaching and teacher efficiency.`
              : t.categoryDescriptions[selectedCategory]}
          </p>
        </div>

        <div className="shrink-0 hidden sm:block">
          <BamuMascot
            mood="happy"
            size="lg"
            speech={
              language === 'bm'
                ? 'Pilih modul dan pelajari mengikut kelajuan anda sendiri!'
                : 'Pick any module and learn at your comfortable pace!'
            }
          />
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={
              language === 'bm'
                ? 'Cari tutorial (cth: Canva, Google Drive, AI RPH, Quizziz)...'
                : 'Search tutorials (e.g., Canva, Google Drive, AI Lesson Plan, Quizziz)...'
            }
            ariaLabel={language === 'bm' ? 'Cari tutorial' : 'Search tutorials'}
            variant="default"
          />
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-[#0099ff] hidden sm:block" />
          <span className="text-xs font-bold text-slate-600 hidden sm:inline">
            {language === 'bm' ? 'Tahap:' : 'Level:'}
          </span>
          <div className="flex bg-sky-50/70 p-1 rounded-full border border-sky-200/70">
            {levels.map((lvl) => {
              const Icon = lvl.icon;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                    selectedLevel === lvl.id
                      ? 'bg-[#0099ff] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0099ff]'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  <span>{lvl.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Tabs (Segmented Button Controls) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-sky-100 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#0099ff] to-[#0088ee] text-white shadow-xs'
                  : 'bg-sky-50/80 text-[#0055aa] hover:bg-sky-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Results Count & Current Active Filters info */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
        <span>
          {language === 'bm' ? 'Menunjukkan' : 'Showing'}{' '}
          <strong className="text-slate-800 font-mono tabular-nums">{filteredTutorials.length}</strong>{' '}
          {language === 'bm' ? 'tutorial' : 'tutorials'}
        </span>
        {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
            }}
            className="text-[#007acc] hover:underline cursor-pointer font-bold"
          >
            {language === 'bm' ? 'Tetapkan Semula Semua Penapis' : 'Reset All Filters'}
          </button>
        )}
      </div>

      {/* Tutorials Grid or Friendly Empty State */}
      {filteredTutorials.length === 0 ? (
        <EmptyState
          variant="card"
          mascotMood="thinking"
          mascotSize="xl"
          title={
            language === 'bm'
              ? 'Bamu tidak menjumpai tutorial yang sepadan'
              : 'No matching tutorials found'
          }
          description={
            language === 'bm'
              ? 'Cuba ubah kata kunci carian anda atau pilih kategori "Semua" untuk melihat kembali senarai panduan pengajaran digital.'
              : 'Try different search keywords or select "All" to browse the full catalog of digital teaching tutorials.'
          }
          primaryAction={{
            label: language === 'bm' ? 'Lihat Semua Tutorial' : 'View All Tutorials',
            onClick: () => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tut) => (
            <TutorialCard
              key={tut.id}
              tutorial={tut}
              language={language}
              onSelect={onSelectTutorial}
              isCompleted={completedIds.includes(tut.id)}
              isSaved={savedIds.includes(tut.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
