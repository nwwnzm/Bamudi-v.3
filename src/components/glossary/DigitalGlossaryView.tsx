import React, { useState, useMemo } from 'react';
import { GlossaryItem, Language } from '../../types';
import { translations } from '../../data/translations';
import { SearchBar } from '../common/SearchBar';
import { EmptyState } from '../common/EmptyState';
import { BamuMascot } from '../brand/BamuMascot';
import { BookA, School } from 'lucide-react';

interface Props {
  items: GlossaryItem[];
  language: Language;
}

export const DigitalGlossaryView: React.FC<Props> = ({ items, language }) => {
  const t = translations[language].glossary;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');

  const alphabet = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const primaryTerm = language === 'bm' ? item.termBM : item.termEN;
        if (selectedLetter !== 'ALL') {
          if (!primaryTerm.toUpperCase().startsWith(selectedLetter)) {
            return false;
          }
        }

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const bmMatch = item.termBM.toLowerCase().includes(q);
        const enMatch = item.termEN.toLowerCase().includes(q);
        const defMatch = item.definition[language].toLowerCase().includes(q);
        const exMatch = item.exampleInSchool[language].toLowerCase().includes(q);
        return bmMatch || enMatch || defMatch || exMatch;
      })
      .sort((a, b) => {
        const termA = language === 'bm' ? a.termBM : a.termEN;
        const termB = language === 'bm' ? b.termBM : b.termEN;
        return termA.localeCompare(termB);
      });
  }, [items, selectedLetter, searchQuery, language]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header section with Bamu companion */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-sky-50/80 via-[#fdfdfe] to-[#fdf2f0] border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#007acc] uppercase tracking-wider block mb-1">
            {language === 'bm' ? 'Rujukan Pantas A-Z' : 'A-Z Quick Reference'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
            {t.subtitle}
          </p>
        </div>

        <div className="shrink-0 hidden sm:block">
          <BamuMascot
            mood="encouraging"
            size="lg"
            speech={
              language === 'bm'
                ? 'Fahami istilah digital dengan penerangan mudah dan situasi sebenar di sekolah!'
                : 'Understand digital terms with plain-language explanations and real school examples!'
            }
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.searchPlaceholder}
          ariaLabel={t.searchPlaceholder}
          variant="default"
        />
      </div>

      {/* Alphabetical Scroller (44px min touch target compliant with antislop R-03) */}
      <div
        className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-sky-100 no-scrollbar touch-pan-x"
        role="group"
        aria-label={language === 'bm' ? 'Penapis abjad istilah' : 'Alphabetical term filter'}
      >
        {alphabet.map((letter) => {
          const isSelected = selectedLetter === letter;
          return (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              aria-pressed={isSelected}
              className={`min-w-[44px] h-[44px] px-3 text-xs font-mono font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 select-none ${
                isSelected
                  ? 'bg-[#0099ff] text-white shadow-md shadow-sky-500/25 scale-102'
                  : 'bg-sky-50/80 text-sky-900 hover:bg-sky-100 border border-sky-100'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Glossary Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              variant="card"
              mascotMood="thinking"
              mascotSize="xl"
              title={
                language === 'bm'
                  ? 'Tiada istilah sepadan ditemui'
                  : 'No matching terms found'
              }
              description={
                language === 'bm'
                  ? 'Tiada istilah yang menepati kata carian atau penapis abjad anda. Cuba kata kunci lain atau tetapkan semula carian.'
                  : 'No terms match your search keywords or selected letter filter. Try another term or reset your search.'
              }
              primaryAction={{
                label: language === 'bm' ? 'Lihat Semua Istilah' : 'View All Terms',
                onClick: () => {
                  setSearchQuery('');
                  setSelectedLetter('ALL');
                },
              }}
            />
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/90 hover:border-[#0099ff] rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Term Lockup in both languages */}
                <div className="flex items-baseline justify-between gap-3 mb-2.5 pb-2 border-b border-slate-100">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                    {language === 'bm' ? item.termBM : item.termEN}
                  </h3>
                  <span className="text-xs text-[#0099ff] font-semibold italic">
                    {language === 'bm' ? item.termEN : item.termBM}
                  </span>
                </div>

                {/* Definition */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 font-normal">
                  {item.definition[language]}
                </p>
              </div>

              {/* Classroom Context Example */}
              <div className="p-3.5 bg-sky-50/60 border border-sky-200/60 rounded-2xl text-xs text-slate-900 flex items-start gap-2.5">
                <School className="w-4 h-4 text-[#0099ff] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5 text-sky-900">
                    {t.example}:
                  </span>
                  <span className="text-slate-700 leading-relaxed font-normal">
                    {item.exampleInSchool[language]}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
