import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DigitalTool, Language } from '../../types';
import { translations } from '../../data/translations';
import {
  ExternalLink,
  Lightbulb,
  Palette,
  GraduationCap,
  Gamepad2,
  Dices,
  LayoutGrid,
  BarChart3,
  FlaskConical,
  Shapes,
  Sparkles,
  Pin,
} from 'lucide-react';
import { SearchBar } from '../common/SearchBar';
import { BamuMascot } from '../brand/BamuMascot';
import { EmptyState } from '../common/EmptyState';
import { ToastNotification } from '../common/ToastNotification';

interface Props {
  tools: DigitalTool[];
  language: Language;
  onToolVisit?: (tool: DigitalTool) => void;
  pinnedToolIds?: string[];
  isToolPinned?: (toolId: string) => boolean;
  onTogglePinTool?: (toolId: string) => void;
}

// Contextual visual identifier mapping for curated digital educational tools
const TOOL_VISUAL_MAP: Record<
  string,
  { icon: React.ElementType; bg: string; text: string; border: string }
> = {
  'canva-edu': {
    icon: Palette,
    bg: 'bg-sky-50',
    text: 'text-[#0099ff]',
    border: 'border-sky-100',
  },
  'google-classroom': {
    icon: GraduationCap,
    bg: 'bg-sky-50',
    text: 'text-[#007acc]',
    border: 'border-sky-100',
  },
  'quizizz': {
    icon: Gamepad2,
    bg: 'bg-[#fdf2f0]',
    text: 'text-[#cc310e]',
    border: 'border-[#cc310e]/20',
  },
  'wordwall': {
    icon: Dices,
    bg: 'bg-sky-50',
    text: 'text-[#0099ff]',
    border: 'border-sky-100',
  },
  'padlet': {
    icon: LayoutGrid,
    bg: 'bg-sky-50',
    text: 'text-[#007acc]',
    border: 'border-sky-100',
  },
  'mentimeter': {
    icon: BarChart3,
    bg: 'bg-[#fdf2f0]',
    text: 'text-[#cc310e]',
    border: 'border-[#cc310e]/20',
  },
  'phet-interactive-simulations': {
    icon: FlaskConical,
    bg: 'bg-sky-50',
    text: 'text-[#0099ff]',
    border: 'border-sky-100',
  },
  'geogebra': {
    icon: Shapes,
    bg: 'bg-sky-50',
    text: 'text-[#007acc]',
    border: 'border-sky-100',
  },
};

export const DigitalToolsView: React.FC<Props> = ({
  tools,
  language,
  onToolVisit,
  pinnedToolIds = [],
  isToolPinned,
  onTogglePinTool,
}) => {
  const t = translations[language].tools;
  const levels = translations[language].levels;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastState, setToastState] = useState<{
    message: string;
    detail?: string;
    icon?: 'check' | 'bookmark';
  } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const validPinnedCount = useMemo(() => {
    const validIds = new Set(tools.map((tool) => tool.id));
    if (isToolPinned) {
      return tools.filter((tool) => isToolPinned(tool.id)).length;
    }
    return pinnedToolIds.filter((id) => validIds.has(id)).length;
  }, [tools, pinnedToolIds, isToolPinned]);

  const categories = [
    { id: 'all', label: t.allCategories },
    ...(onTogglePinTool
      ? [
          {
            id: 'pinned',
            label: validPinnedCount > 0 ? `${t.pinnedFilter} (${validPinnedCount})` : t.pinnedFilter,
          },
        ]
      : []),
    { id: 'presentation', label: t.categories.presentation },
    { id: 'quiz', label: t.categories.quiz },
    { id: 'lms', label: t.categories.lms },
    { id: 'design', label: t.categories.design },
    { id: 'math-science', label: t.categories['math-science'] },
    { id: 'engagement', label: t.categories.engagement },
  ];

  const checkPinned = (toolId: string): boolean => {
    if (isToolPinned) return isToolPinned(toolId);
    return pinnedToolIds.includes(toolId);
  };

  const handleTogglePin = (tool: DigitalTool, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onTogglePinTool) return;

    const currentlyPinned = checkPinned(tool.id);
    onTogglePinTool(tool.id);

    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastState({
      message: currentlyPinned ? t.unpinToast : t.pinToast,
      detail: tool.name,
      icon: currentlyPinned ? 'check' : 'bookmark',
    });
    toastTimerRef.current = window.setTimeout(() => {
      setToastState(null);
      toastTimerRef.current = null;
    }, 3500);
  };

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'pinned'
          ? checkPinned(tool.id)
          : tool.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const nameMatch = tool.name.toLowerCase().includes(q);
      const descMatch = tool.description[language].toLowerCase().includes(q);
      const bestMatch = tool.bestFor[language].toLowerCase().includes(q);
      return nameMatch || descMatch || bestMatch;
    });
  }, [tools, selectedCategory, searchQuery, language, pinnedToolIds, isToolPinned]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {toastState && (
        <ToastNotification
          message={toastState.message}
          detail={toastState.detail}
          icon={toastState.icon}
          variant="success"
          onDismiss={() => setToastState(null)}
        />
      )}
      {/* Header with Bamu Welcome */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-sky-50/80 via-[#fdfdfe] to-[#fdf2f0] border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#007acc] uppercase tracking-wider block mb-1">
            {language === 'bm' ? 'Direktori Teknologi Pendidikan' : 'EdTech Tools Catalog'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
            {t.subtitle}
          </p>
        </div>

        <div className="shrink-0 hidden md:block">
          <BamuMascot
            mood="happy"
            size="lg"
            speech={
              language === 'bm'
                ? 'Terokai aplikasi pengajaran yang disyorkan untuk memudahkan tugasan harian anda!'
                : 'Discover recommended classroom apps to streamline your daily lessons!'
            }
          />
        </div>
      </div>

      {/* Shared SearchBar Toolbar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.searchPlaceholder}
          ariaLabel={t.searchPlaceholder}
          variant="default"
        />
      </div>

      {/* Category Pills with 44px Minimum Touch Targets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-sky-100 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[44px] px-4 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 ${
                isSelected
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'bg-sky-50 text-sky-900 hover:bg-sky-100 hover:text-sky-950'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tools Grid or Friendly Bamu Empty State */}
      {filteredTools.length === 0 ? (
        <EmptyState
          variant="card"
          mascotMood={selectedCategory === 'pinned' && !searchQuery.trim() ? 'encouraging' : 'thinking'}
          mascotSize="xl"
          title={
            selectedCategory === 'pinned' && !searchQuery.trim()
              ? t.noPinnedTitle
              : language === 'bm'
              ? 'Bamu tidak menjumpai alatan digital yang sepadan'
              : 'Bamu could not find matching digital tools'
          }
          description={
            selectedCategory === 'pinned' && !searchQuery.trim()
              ? t.noPinnedDesc
              : language === 'bm'
              ? 'Cuba ubah kata kunci carian anda atau pilih kategori "Semua Bidang" untuk melihat kembali senarai alatan digital yang disyorkan.'
              : 'Try different search keywords or select "All Categories" to browse our curated digital teaching tools.'
          }
          primaryAction={{
            label: language === 'bm' ? 'Lihat Semua Alatan' : 'View All Tools',
            onClick: () => {
              setSearchQuery('');
              setSelectedCategory('all');
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const visual = TOOL_VISUAL_MAP[tool.id] || {
              icon: Sparkles,
              bg: 'bg-sky-50',
              text: 'text-[#0099ff]',
              border: 'border-sky-100',
            };
            const IconComponent = visual.icon;
            const pinned = checkPinned(tool.id);

            return (
              <div
                key={tool.id}
                className={`bg-white border hover:border-[#0099ff] rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between ${
                  pinned ? 'border-[#cc310e]/35' : 'border-slate-200/90'
                }`}
              >
                <div>
                  {/* Card Header: Contextual Icon, Title, Category & Pricing */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-2xl flex items-center justify-center border shadow-2xs shrink-0 ${visual.bg} ${visual.border} ${visual.text}`}
                      >
                        <IconComponent className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-base font-bold text-slate-900 font-display truncate">
                          {tool.name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="font-semibold text-sky-800">
                            {t.categories[tool.category as keyof typeof t.categories] || tool.category}
                          </span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="font-medium text-slate-600">{levels[tool.difficulty]}</span>
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 text-[#007acc] text-[11px] font-bold bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                      {tool.pricing === 'free-for-teachers'
                        ? language === 'bm'
                          ? 'Percuma untuk Guru'
                          : 'Free for Teachers'
                        : tool.pricing === 'free'
                        ? language === 'bm'
                          ? '100% Percuma'
                          : '100% Free'
                        : 'Freemium'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                    {tool.description[language]}
                  </p>

                  {/* Best For Container */}
                  <div className="text-xs text-slate-700 mb-3.5 bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100 leading-relaxed">
                    <span className="font-bold text-sky-950 block mb-1">
                      {t.bestFor}:
                    </span>
                    <span className="font-normal text-slate-600">{tool.bestFor[language]}</span>
                  </div>

                  {/* Teacher Tip Container (Approved Amber Red Palette) */}
                  <div className="p-3.5 bg-[#fdf2f0] border border-[#cc310e]/20 rounded-2xl flex items-start gap-2.5 text-xs text-[#99240b] mb-4 shadow-2xs">
                    <Lightbulb className="w-4 h-4 text-[#cc310e] shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="leading-relaxed">
                      <span className="font-bold text-[#801e09]">{t.teacherTip}: </span>
                      <span className="font-medium text-[#99240b]">{tool.teacherTip[language]}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Domain + 44px Pin Toggle & External Action Link */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    {tool.officialUrl.replace('https://', '').split('/')[0]}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {onTogglePinTool && (
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(tool, e)}
                        aria-pressed={pinned}
                        aria-label={`${pinned ? t.unpinAriaLabel : t.pinAriaLabel}: ${tool.name}`}
                        className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 shrink-0 ${
                          pinned
                            ? 'bg-[#fdf2f0] text-[#99240b] border-[#cc310e]/35 hover:bg-[#fde4df]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-[#007acc] hover:border-sky-200'
                        }`}
                      >
                        <Pin
                          className={`w-3.5 h-3.5 shrink-0 ${
                            pinned ? 'fill-[#cc310e] text-[#cc310e]' : ''
                          }`}
                          aria-hidden="true"
                        />
                        <span>{pinned ? t.pinnedBtn : t.pinBtn}</span>
                      </button>
                    )}

                    <a
                      href={tool.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onToolVisit?.(tool)}
                      aria-label={`${t.visitOfficial} ${tool.name} (${language === 'bm' ? 'buka dalam tab baharu' : 'opens in new tab'})`}
                      className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#007acc] hover:text-[#0055aa] bg-sky-50 hover:bg-sky-100/90 rounded-full transition-colors cursor-pointer border border-sky-200/80 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 shrink-0 ml-auto"
                    >
                      <span>{t.visitOfficial}</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
