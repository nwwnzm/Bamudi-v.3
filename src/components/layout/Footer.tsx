import React from 'react';
import { Language } from '../../types';
import { translations } from '../../data/translations';
import { BrandLogo } from '../brand/BrandLogo';
import { Heart, Sparkles } from 'lucide-react';

interface Props {
  language: Language;
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<Props> = ({ language, onSelectTab }) => {
  const t = translations[language];

  return (
    <footer className="bg-[#0b1626] text-slate-300 mt-20 border-t border-sky-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <BrandLogo size="md" theme="dark" />
            <p className="text-xs text-slate-400 max-w-md leading-relaxed font-normal pt-1">
              {t.subTagline}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-sky-400 font-medium">
              <Sparkles className="w-4 h-4 text-[#cc310e]" />
              <span className="text-white font-bold">{t.slogan}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-3 font-display">
              {t.nav.library}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('library')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.categories['getting-started']}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('library')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.categories['teaching-tools']}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('library')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.categories['ai-teachers']}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('library')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.categories['interactive']}
                </button>
              </li>
            </ul>
          </div>

          {/* Additional Sections */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-3 font-display">
              {language === 'bm' ? 'Pautan Pantas' : 'Quick Access'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('prompt-builder')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.nav.promptBuilder}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('rph-generator')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.nav.rphGenerator}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('pbd-system')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.nav.pbdSystem}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('resources')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.nav.resources}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('tools')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.nav.tools}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('glossary')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.nav.glossary}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('my-learning')}
                  className="hover:text-[#0099ff] transition-colors cursor-pointer text-slate-400"
                >
                  {t.nav.myLearning}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('saved-items')}
                  aria-label={t.savedItems.shortcuts.footerAria}
                  className="min-h-[44px] inline-flex items-center hover:text-[#38bdf8] transition-colors cursor-pointer text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] rounded-md px-1 -mx-1"
                >
                  {t.nav.savedItems}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BaMuDi: Bantu Mula Digital. {language === 'bm' ? 'Hak cipta terpelihara untuk komuniti pendidik.' : 'Dedicated to the teaching community.'}</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{language === 'bm' ? 'Direka khas dengan kasih untuk guru-guru sekolah' : 'Crafted with care for school educators'}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
