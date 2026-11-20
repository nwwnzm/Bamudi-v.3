import React, { useState, useMemo } from 'react';
import {
  Language,
  Tutorial,
  TutorialCategory,
  CompetencyLevel,
  RecentActivityItem,
  UserProgress,
} from '../../types';
import { translations } from '../../data/translations';
import { BamuMascot } from '../brand/BamuMascot';
import { TutorialCard } from '../library/TutorialCard';
import { SearchBar } from '../common/SearchBar';
import { EmptyState } from '../common/EmptyState';
import { RecentActivitySection } from '../common/RecentActivitySection';
import { MyTeachingWorkspaceSection } from './MyTeachingWorkspaceSection';
import {
  computeOverallLearningSummary,
  formatDisplayGreeting,
  formatRelativeTimestamp,
  formatTutorialPositionLabel,
  resolveContinueDestination,
} from '../../utils/learningSummary';
import {
  ArrowRight,
  Zap,
  GraduationCap,
  FileSpreadsheet,
  ClipboardCheck,
  BookA,
  Compass,
  Clock,
  Bookmark,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  Monitor,
  Wrench,
  Bot,
  Gamepad2,
  Wand2,
  Pencil,
  Check,
  X,
  FolderOpen,
  History,
} from 'lucide-react';

interface HomeViewProps {
  language: Language;
  onNavigateToLibrary: (category?: TutorialCategory | 'all', query?: string) => void;
  onSelectTutorial: (tutorial: Tutorial) => void;
  tutorials: Tutorial[];
  completedIds: string[];
  savedIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectPathway: (level: CompetencyLevel) => void;
  onSelectTab?: (tabId: string) => void;
  competencyLevel?: CompetencyLevel;
  onSelectCompetencyLevel?: (level: CompetencyLevel) => void;
  lastOpenedTutorialId?: string | null;
  recentActivities?: RecentActivityItem[];
  userProgress?: UserProgress;
  teacherDisplayName?: string;
  onUpdateTeacherDisplayName?: (name?: string) => void;
  savedItemsCount?: number;
}

type TutorialFeedTab = 'featured' | 'saved' | TutorialCategory;

function resolveActivityTitle(
  item: RecentActivityItem,
  language: Language
): string {
  if (!item.label) return item.id;
  if (typeof item.label === 'string') return item.label;
  return item.label[language] || item.label.en || item.label.bm || item.id;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  onNavigateToLibrary,
  onSelectTutorial,
  tutorials,
  completedIds,
  savedIds,
  onToggleSave,
  onSelectPathway,
  onSelectTab,
  competencyLevel = 'beginner',
  onSelectCompetencyLevel,
  lastOpenedTutorialId = null,
  recentActivities = [],
  userProgress,
  teacherDisplayName,
  onUpdateTeacherDisplayName,
  savedItemsCount = 0,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeedTab, setActiveFeedTab] = useState<TutorialFeedTab>('featured');

  // Lightweight inline display-name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(teacherDisplayName || '');

  const navigateTab = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    } else if (tabId === 'library') {
      onNavigateToLibrary('all');
    }
  };

  // Fallback UserProgress object constructed strictly from passed props when userProgress is omitted
  const effectiveProgress: UserProgress = useMemo(
    () =>
      userProgress ?? {
        competencyLevel,
        learningMode: 'guided',
        completedTutorialIds: completedIds,
        savedTutorialIds: savedIds,
        quizScores: {},
        notes: {},
        lastOpenedTutorialId,
        tutorialPositions: {},
        tutorialProgress: {},
      },
    [userProgress, competencyLevel, completedIds, savedIds, lastOpenedTutorialId]
  );

  // Shared single-source-of-truth learning summary matching My Learning
  const learningSummary = useMemo(
    () => computeOverallLearningSummary(tutorials, effectiveProgress),
    [tutorials, effectiveProgress]
  );

  const {
    totalTutorials,
    completedCount,
    inProgressCount,
    savedCount,
    overallCompletionPercentage,
    totalMinutesSpent,
    attemptedQuizCount,
    averageQuizScore,
  } = learningSummary;

  const validCompletedSet = useMemo(
    () => new Set(learningSummary.completedTutorials.map((t) => t.id)),
    [learningSummary.completedTutorials]
  );

  // Destination for Continue Where I Left Off
  const continueDest = useMemo(
    () =>
      resolveContinueDestination({
        tutorials,
        progress: effectiveProgress,
        recentActivities,
      }),
    [tutorials, effectiveProgress, recentActivities]
  );

  // Filter tutorials for lower Browse Modules section
  const displayedTutorials = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let pool = tutorials;
    if (activeFeedTab === 'featured') {
      const matchingLevel = tutorials.filter(
        (t) => t.level === competencyLevel && !validCompletedSet.has(t.id)
      );
      const others = tutorials.filter(
        (t) => !(t.level === competencyLevel && !validCompletedSet.has(t.id))
      );
      pool = [...matchingLevel, ...others];
    } else if (activeFeedTab === 'saved') {
      pool = tutorials.filter((t) => savedIds.includes(t.id));
    } else {
      pool = tutorials.filter((t) => t.category === activeFeedTab);
    }

    if (query) {
      pool = pool.filter(
        (t) =>
          t.title.bm.toLowerCase().includes(query) ||
          t.title.en.toLowerCase().includes(query) ||
          t.description.bm.toLowerCase().includes(query) ||
          t.description.en.toLowerCase().includes(query) ||
          t.toolBadge.toLowerCase().includes(query)
      );
    }

    return pool.slice(0, 4);
  }, [tutorials, activeFeedTab, savedIds, validCompletedSet, competencyLevel, searchQuery]);

  const handleInlineSearchSubmit = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      onNavigateToLibrary('all', trimmed);
    } else {
      onNavigateToLibrary('all');
    }
  };

  const handleOpenNameEditor = () => {
    setNameDraft(teacherDisplayName || '');
    setIsEditingName(true);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateTeacherDisplayName) {
      onUpdateTeacherDisplayName(nameDraft.trim() || undefined);
    }
    setIsEditingName(false);
  };

  const handleClearName = () => {
    setNameDraft('');
    if (onUpdateTeacherDisplayName) {
      onUpdateTeacherDisplayName(undefined);
    }
    setIsEditingName(false);
  };

  const getLevelLabel = (level: CompetencyLevel) => {
    if (level === 'beginner') return language === 'bm' ? 'Asas' : 'Beginner';
    if (level === 'intermediate') return language === 'bm' ? 'Pertengahan' : 'Intermediate';
    return language === 'bm' ? 'Lanjutan' : 'Advanced';
  };

  const greetingHeading = formatDisplayGreeting(language, teacherDisplayName);

  const quickAccessDestinations = [
    {
      id: 'library',
      title: language === 'bm' ? 'Perpustakaan Digital' : 'Digital Library',
      desc:
        language === 'bm'
          ? `${totalTutorials} tutorial langkah demi langkah`
          : `${totalTutorials} step-by-step guides`,
      icon: BookOpen,
      tone: 'bg-[#e6f5ff] border-[#99d6ff] text-[#0055b3]',
      onClick: () => onNavigateToLibrary('all'),
    },
    {
      id: 'prompt-builder',
      title: language === 'bm' ? 'Pembina Gesaan AI' : 'AI Prompt Builder',
      desc:
        language === 'bm'
          ? 'Formula 4 bahagian gesaan PdP'
          : '4-part classroom prompt studio',
      icon: Wand2,
      tone: 'bg-[#fff3d6] border-[#ffd275] text-[#b45309]',
      onClick: () => navigateTab('prompt-builder'),
    },
    {
      id: 'rph-generator',
      title: language === 'bm' ? 'Penjana RPH' : 'RPH Generator',
      desc:
        language === 'bm'
          ? 'Rancang RPH & eksport Word/PDF'
          : 'Build & export daily lesson plans',
      icon: FileSpreadsheet,
      tone: 'bg-[#e5f9ef] border-[#9ce2be] text-[#0b6e41]',
      onClick: () => navigateTab('rph-generator'),
    },
    {
      id: 'pbd-system',
      title: language === 'bm' ? 'Sistem Rekod PBD' : 'PBD System',
      desc:
        language === 'bm'
          ? 'Rekod TP1 hingga TP6 murid'
          : 'Track TP1 to TP6 class mastery',
      icon: ClipboardCheck,
      tone: 'bg-[#e0f2fe] border-[#99d6ff] text-[#0055b3]',
      onClick: () => navigateTab('pbd-system'),
    },
    {
      id: 'resources',
      title: language === 'bm' ? 'Sumber Pengajaran' : 'Teaching Resources',
      desc:
        language === 'bm'
          ? 'Rubrik, lembaran kerja & slaid'
          : 'Rubrics, worksheets & slides',
      icon: FolderOpen,
      tone: 'bg-[#fff0eb] border-[#ffbfa8] text-[#b3280a]',
      onClick: () => navigateTab('resources'),
    },
    {
      id: 'tools',
      title: language === 'bm' ? 'Alatan Digital' : 'Digital Tools',
      desc:
        language === 'bm'
          ? 'Direktori aplikasi PdP guru'
          : 'Curated classroom tool directory',
      icon: Wrench,
      tone: 'bg-[#ede9fe] border-[#c4b5fd] text-[#5b21b6]',
      onClick: () => navigateTab('tools'),
    },
    {
      id: 'glossary',
      title: language === 'bm' ? 'Glosari Digital' : 'Digital Glossary',
      desc:
        language === 'bm'
          ? 'Rujukan istilah teknologi A hingga Z'
          : 'A to Z educational tech terms',
      icon: BookA,
      tone: 'bg-slate-100 border-slate-200 text-slate-700',
      onClick: () => navigateTab('glossary'),
    },
    {
      id: 'saved-items',
      title: t.nav.savedItems,
      desc: t.savedItems.shortcuts.homeDesc,
      icon: Bookmark,
      tone: 'bg-[#fdf2f0] border-[#cc310e]/30 text-[#99240b]',
      count: savedItemsCount > 0 ? savedItemsCount : undefined,
      ariaLabel:
        savedItemsCount > 0
          ? `${t.savedItems.shortcuts.homeAria} (${
              savedItemsCount === 1
                ? t.savedItems.totalSavedSingular
                : t.savedItems.totalSavedPlural.replace('{count}', String(savedItemsCount))
            })`
          : t.savedItems.shortcuts.homeAria,
      onClick: () => navigateTab('saved-items'),
    },
  ];

  const pathways: {
    id: CompetencyLevel;
    title: { bm: string; en: string };
    desc: { bm: string; en: string };
    icon: React.FC<{ className?: string }>;
    accentBg: string;
    accentText: string;
    activeRing: string;
    moduleCount: number;
  }[] = [
    {
      id: 'beginner',
      title: { bm: 'Asas (Beginner)', en: 'Beginner (Asas)' },
      desc: {
        bm: 'Kemahiran peranti asas, keselamatan akaun dan langkah pertama PdP digital.',
        en: 'Core device skills, account safety and first steps for digital lessons.',
      },
      icon: BookOpen,
      accentBg: 'bg-[#e6f5ff] border-[#99d6ff]',
      accentText: 'text-[#0055b3]',
      activeRing: 'border-[#0077dd] bg-[#f0f8ff] ring-2 ring-[#0099ff]/20',
      moduleCount: tutorials.filter((t) => t.level === 'beginner').length,
    },
    {
      id: 'intermediate',
      title: { bm: 'Pertengahan (Intermediate)', en: 'Intermediate (Pertengahan)' },
      desc: {
        bm: 'Kuiz interaktif, pengurusan Google Classroom dan reka bentuk bahan visual.',
        en: 'Interactive quizzes, Google Classroom workflows and visual lesson design.',
      },
      icon: Layers,
      accentBg: 'bg-[#e5f9ef] border-[#9ce2be]',
      accentText: 'text-[#0b6e41]',
      activeRing: 'border-[#12945a] bg-[#f2fcf7] ring-2 ring-[#12945a]/20',
      moduleCount: tutorials.filter((t) => t.level === 'intermediate').length,
    },
    {
      id: 'advanced',
      title: { bm: 'Lanjutan (Advanced)', en: 'Advanced (Lanjutan)' },
      desc: {
        bm: 'Bantuan AI untuk RPH, analitik bilik darjah dan pembelajaran terbeza.',
        en: 'AI-assisted lesson planning, classroom analytics and differentiated learning.',
      },
      icon: Award,
      accentBg: 'bg-[#fff0eb] border-[#ffbfa8]',
      accentText: 'text-[#b3280a]',
      activeRing: 'border-[#cc310e] bg-[#fff8f6] ring-2 ring-[#cc310e]/20',
      moduleCount: tutorials.filter((t) => t.level === 'advanced').length,
    },
  ];

  const feedTabs: {
    id: TutorialFeedTab;
    label: { bm: string; en: string };
    icon: React.FC<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'featured', label: { bm: 'Pilihan Utama', en: 'Featured' }, icon: Sparkles },
    { id: 'saved', label: { bm: 'Disimpan', en: 'Bookmarked' }, icon: Bookmark, count: savedCount },
    { id: 'getting-started', label: { bm: 'Permulaan Asas', en: 'Getting Started' }, icon: Monitor },
    { id: 'teaching-tools', label: { bm: 'Alatan PdP', en: 'Teaching Tools' }, icon: Wrench },
    { id: 'ai-teachers', label: { bm: 'AI untuk Guru', en: 'AI for Teachers' }, icon: Bot },
    { id: 'interactive', label: { bm: 'Aktiviti Interaktif', en: 'Interactive' }, icon: Gamepad2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* =====================================================================
          1. PERSONAL WELCOME: MY TEACHING SPACE
      ===================================================================== */}
      <section
        aria-labelledby="dashboard-welcome-heading"
        className="relative rounded-3xl overflow-hidden border border-[#99d6ff] bg-gradient-to-r from-[#cce9ff] via-[#8fd0ff] to-[#46a9ff] shadow-[0_14px_34px_-10px_rgba(0,119,221,0.18)]"
      >
        <svg
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          viewBox="0 0 1200 320"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d6eeff" />
              <stop offset="52%" stopColor="#89cbff" />
              <stop offset="100%" stopColor="#3b9eff" />
            </linearGradient>
            <radialGradient id="fireflyWarmAura" cx="76%" cy="46%" r="36%">
              <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.65" />
              <stop offset="55%" stopColor="#ffd54f" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffd54f" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="greenHillLeft" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8ae085" />
              <stop offset="100%" stopColor="#43a858" />
            </linearGradient>
            <linearGradient id="goldHillMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffe566" />
              <stop offset="100%" stopColor="#f5b82e" />
            </linearGradient>
          </defs>
          <rect width="1200" height="320" fill="url(#heroSkyGrad)" />
          <path
            d="M 420 260 Q 470 200 540 220 Q 600 175 680 215 Q 740 195 790 250 L 790 320 L 420 320 Z"
            fill="#ffffff"
            opacity="0.45"
          />
          <path
            d="M 960 240 Q 1020 190 1090 215 Q 1150 185 1200 230 L 1200 320 L 960 320 Z"
            fill="#ffffff"
            opacity="0.38"
          />
          <rect width="1200" height="320" fill="url(#fireflyWarmAura)" />
          <path
            d="M -20 320 Q 90 250 230 285 Q 350 315 460 320 Z"
            fill="url(#greenHillLeft)"
            opacity="0.88"
          />
          <path
            d="M 480 320 Q 615 235 760 285 Q 860 315 940 320 Z"
            fill="url(#goldHillMid)"
            opacity="0.92"
          />
          <path
            d="M 880 320 Q 1035 245 1220 275 L 1220 320 Z"
            fill="url(#greenHillLeft)"
            opacity="0.9"
          />
        </svg>

        <div className="relative z-10 px-4 py-4 sm:px-8 sm:py-7 lg:px-10 lg:py-7 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="max-w-2xl text-center md:text-left w-full">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#004494] mb-1">
              {language === 'bm' ? 'Ruang Mengajar Saya · BaMuDi' : 'My Teaching Space · BaMuDi'}
            </p>

            <h1
              id="dashboard-welcome-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a2540] tracking-tight leading-[1.15]"
            >
              {greetingHeading}
            </h1>

            <div className="flex justify-center md:justify-start mt-1.5 mb-2.5" aria-hidden="true">
              <svg className="w-40 sm:w-56 h-2.5 sm:h-3" viewBox="0 0 240 14" fill="none">
                <path
                  d="M 4 10 Q 118 2 236 9"
                  stroke="#ffc107"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="text-[#0c2e4e] text-xs sm:text-sm font-semibold leading-relaxed mb-3.5 max-w-xl mx-auto md:mx-0">
              {language === 'bm'
                ? 'Ruang kerja digital peribadi anda untuk menyambung latihan, mengurus RPH serta PBD, dan mengakses alatan kelas.'
                : 'Your personal digital workspace to resume guides, manage RPH lesson plans and PBD records, and access classroom tools.'}
            </p>

            {/* Lightweight optional inline display-name editor */}
            {onUpdateTeacherDisplayName && isEditingName ? (
              <form
                onSubmit={handleSaveName}
                className="mb-3.5 p-2.5 rounded-2xl bg-white/95 border border-[#99d6ff] shadow-xs flex flex-wrap items-center justify-center md:justify-start gap-2 max-w-lg mx-auto md:mx-0"
              >
                <label htmlFor="teacher-display-name-input" className="sr-only">
                  {language === 'bm' ? 'Nama paparan guru (pilihan)' : 'Teacher display name (optional)'}
                </label>
                <input
                  id="teacher-display-name-input"
                  type="text"
                  maxLength={40}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder={
                    language === 'bm' ? 'Nama anda (cth: Aina)' : 'Your name (e.g., Aina)'
                  }
                  className="flex-1 min-w-[150px] min-h-[44px] px-3 py-2 text-xs sm:text-sm text-[#0a2540] bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099ff]"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0055cc] hover:bg-[#0044a6] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540]"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{language === 'bm' ? 'Simpan' : 'Save'}</span>
                </button>
                {teacherDisplayName && (
                  <button
                    type="button"
                    onClick={handleClearName}
                    className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540]"
                  >
                    {language === 'bm' ? 'Padam' : 'Clear'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  aria-label={language === 'bm' ? 'Batal sunting nama' : 'Cancel name edit'}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540]"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigateToLibrary('all')}
                  className="min-h-[44px] px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#ffc107] hover:bg-[#ffb300] text-[#0a2540] font-extrabold text-xs sm:text-sm shadow-[0_6px_16px_rgba(245,158,11,0.3)] border border-[#e09e00]/40 inline-flex items-center gap-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2540]"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span>{language === 'bm' ? 'Terokai Tutorial' : 'Browse Tutorials'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => navigateTab('rph-generator')}
                  className="min-h-[44px] px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/90 hover:bg-white text-[#0a2540] font-extrabold text-xs sm:text-sm border border-[#0055b3]/25 shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0055b3]"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#0066dd]" aria-hidden="true" />
                  <span>{language === 'bm' ? 'Penjana RPH' : 'RPH Generator'}</span>
                </button>

                {onUpdateTeacherDisplayName && (
                  <button
                    type="button"
                    onClick={handleOpenNameEditor}
                    className="min-h-[44px] px-3.5 py-2 rounded-full bg-white/80 hover:bg-white text-[#0a2540] font-bold text-xs border border-[#0055b3]/20 inline-flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2540]"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#0055b3]" aria-hidden="true" />
                    <span>
                      {teacherDisplayName
                        ? language === 'bm'
                          ? 'Tukar Nama'
                          : 'Edit Name'
                        : language === 'bm'
                        ? 'Tetapkan Nama'
                        : 'Set Name'}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Bamu Mascot Companion */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div
              className="absolute w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[#ffe066]/60 via-[#fff9db]/45 to-transparent blur-xl pointer-events-none"
              aria-hidden="true"
            />
            <div className="sm:hidden">
              <BamuMascot
                mood={completedCount === totalTutorials && totalTutorials > 0 ? 'celebrating' : 'happy'}
                size="xl"
                className="relative z-10 drop-shadow-[0_10px_16px_rgba(10,37,64,0.18)]"
              />
            </div>
            <div className="hidden sm:block">
              <BamuMascot
                mood={completedCount === totalTutorials && totalTutorials > 0 ? 'celebrating' : 'happy'}
                size="2xl"
                className="relative z-10 drop-shadow-[0_12px_20px_rgba(10,37,64,0.18)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CONTINUE WHERE I LEFT OFF
      ===================================================================== */}
      {continueDest && (
        <section
          aria-labelledby="continue-where-left-heading"
          className="bg-white rounded-3xl border border-[#ccebff] p-5 sm:p-6 shadow-[0_8px_28px_-6px_rgba(0,153,255,0.08)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2.5">
              <span
                className="w-8 h-8 rounded-xl bg-[#e6f5ff] border border-[#99d6ff] flex items-center justify-center text-[#0055b3] shadow-2xs shrink-0"
                aria-hidden="true"
              >
                <History className="w-4 h-4" />
              </span>
              <div>
                <h2
                  id="continue-where-left-heading"
                  className="font-display text-lg sm:text-xl font-extrabold text-[#0a2540]"
                >
                  {language === 'bm' ? 'Sambung di Tempat Anda Berhenti' : 'Continue Where You Left Off'}
                </h2>
              </div>
            </div>
          </div>

          {continueDest.kind === 'tutorial' ? (
            (() => {
              const { tutorial, source, tutProgress, savedPosition, lastAccessedAt, latestNonTutorialActivity } =
                continueDest;
              const positionText = formatTutorialPositionLabel(tutorial, savedPosition, language);
              const timeText = lastAccessedAt ? formatRelativeTimestamp(lastAccessedAt, language) : '';
              const contextLabel =
                source === 'recommended'
                  ? completedCount === 0
                    ? language === 'bm'
                      ? 'Cadangan Permulaan'
                      : 'Recommended First Guide'
                    : completedCount === totalTutorials
                    ? language === 'bm'
                      ? 'Semua Modul Selesai · Ulang Kaji'
                      : 'All Modules Completed · Review'
                    : language === 'bm'
                    ? 'Tutorial Seterusnya Dicadangkan'
                    : 'Recommended Next Tutorial'
                  : language === 'bm'
                  ? 'Tutorial Belum Selesai Terkini'
                  : 'Most Recent Unfinished Tutorial';

              return (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-[#d6ecff] bg-gradient-to-r from-[#f7fbff] via-[#ffffff] to-[#f2f9ff] p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-bold text-[#0055b3]">
                        <span className="uppercase tracking-wider">{contextLabel}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>{getLevelLabel(tutorial.level)}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>
                            {tutorial.estimatedMinutes} {language === 'bm' ? 'minit' : 'mins'}
                          </span>
                        </span>
                      </div>

                      <h3 className="font-display text-base sm:text-lg font-extrabold text-[#0a2540] leading-snug">
                        {tutorial.title[language]}
                      </h3>

                      {/* Last visited context clearly separated from actual learning progress */}
                      {(positionText || timeText) && (
                        <p className="text-xs text-slate-600">
                          {positionText
                            ? `${
                                language === 'bm' ? 'Kedudukan terakhir dibuka:' : 'Last visited at:'
                              } ${positionText}`
                            : language === 'bm'
                            ? 'Terakhir dibuka'
                            : 'Last accessed'}
                          {timeText ? ` · ${timeText}` : ''}
                        </p>
                      )}

                      {/* Actual Saved Learning Progress Bar */}
                      <div className="pt-1">
                        <div className="flex items-center justify-between gap-2 text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            {language === 'bm' ? 'Kemajuan Pembelajaran Sebenar' : 'Actual Learning Progress'}
                            {` (${tutProgress.completedStepsCount}/${tutProgress.totalStepsCount} ${
                              language === 'bm' ? 'langkah' : 'steps'
                            })`}
                          </span>
                          <span className="font-mono font-extrabold text-[#0055b3] tabular-nums">
                            {tutProgress.percentage}%
                          </span>
                        </div>
                        <div
                          className="w-full h-2.5 bg-[#e6f3ff] rounded-full overflow-hidden border border-[#cce7ff]"
                          role="progressbar"
                          aria-valuenow={tutProgress.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${tutorial.title[language]}: ${tutProgress.percentage}%`}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-[#0066dd] to-[#0099ff] rounded-full transition-all duration-300"
                            style={{ width: `${tutProgress.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex md:flex-col justify-end">
                      <button
                        type="button"
                        onClick={() => onSelectTutorial(tutorial)}
                        className="w-full md:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-[#0055cc] hover:bg-[#0044a6] text-white font-extrabold text-sm shadow-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0055cc]"
                      >
                        <span>
                          {source === 'recommended' && tutProgress.percentage === 0
                            ? language === 'bm'
                              ? 'Mula Belajar'
                              : 'Start'
                            : language === 'bm'
                            ? 'Sambung'
                            : 'Continue'}
                        </span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Secondary shortcut if latest activity was a tool or module */}
                  {latestNonTutorialActivity && (
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                      <span className="text-slate-700">
                        <span className="font-bold">
                          {language === 'bm' ? 'Lawatan terbaharu anda:' : 'Your most recent visit:'}
                        </span>{' '}
                        {resolveActivityTitle(latestNonTutorialActivity, language)}
                        {` · ${
                          latestNonTutorialActivity.type === 'tool'
                            ? language === 'bm'
                              ? 'Alatan Digital'
                              : 'Digital Tool'
                            : language === 'bm'
                            ? 'Modul'
                            : 'Module'
                        }`}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          navigateTab(
                            latestNonTutorialActivity.type === 'tool'
                              ? 'tools'
                              : latestNonTutorialActivity.id
                          )
                        }
                        className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-300 text-[#0055b3] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{language === 'bm' ? 'Buka Semula' : 'Return'}</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl border border-[#d6ecff] bg-gradient-to-r from-[#f7fbff] via-[#ffffff] to-[#f2f9ff] p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#0055b3]">
                    {continueDest.isTool
                      ? language === 'bm'
                        ? 'Alatan Digital Terkini'
                        : 'Recent Digital Tool'
                      : language === 'bm'
                      ? 'Modul Ruang Kerja Terkini'
                      : 'Recent Workspace Module'}
                  </p>
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-[#0a2540]">
                    {resolveActivityTitle(continueDest.activity, language)}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {language === 'bm' ? 'Terakhir diakses:' : 'Last accessed:'}{' '}
                    {formatRelativeTimestamp(continueDest.activity.timestamp, language)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTab(continueDest.targetTab)}
                  className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#0055cc] hover:bg-[#0044a6] text-white font-extrabold text-sm shadow-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0055cc]"
                >
                  <span>{language === 'bm' ? 'Sambung' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </button>
              </div>

              {continueDest.recommendedTutorial && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="text-slate-700">
                    <span className="font-bold">
                      {language === 'bm' ? 'Tutorial dicadangkan:' : 'Recommended tutorial:'}
                    </span>{' '}
                    {continueDest.recommendedTutorial.title[language]}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectTutorial(continueDest.recommendedTutorial!)}
                    className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-300 text-[#0055b3] font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{language === 'bm' ? 'Buka Tutorial' : 'Open Tutorial'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          3. MY LEARNING OVERVIEW (Uses same summary logic as My Learning)
      ===================================================================== */}
      <section
        aria-labelledby="my-learning-overview-heading"
        className="bg-white rounded-3xl border border-[#ccebff] p-5 sm:p-6 shadow-[0_8px_28px_-6px_rgba(0,153,255,0.08)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-xl bg-[#e6f5ff] border border-[#99d6ff] flex items-center justify-center text-[#0055b3] shadow-2xs shrink-0"
              aria-hidden="true"
            >
              <GraduationCap className="w-4 h-4" />
            </span>
            <div>
              <h2
                id="my-learning-overview-heading"
                className="font-display text-lg sm:text-xl font-extrabold text-[#0a2540]"
              >
                {language === 'bm' ? 'Ringkasan Pembelajaran Saya' : 'My Learning Overview'}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {language === 'bm'
                  ? 'Kemajuan tutorial anda diselaraskan terus dengan halaman Pembelajaran Saya.'
                  : 'Your tutorial progress synced directly with My Learning.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTab('my-learning')}
            className="min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#0055b3] hover:text-[#003d82] hover:bg-[#f0f8ff] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{language === 'bm' ? 'Buka Pembelajaran Saya' : 'Open My Learning'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Overall Progress Bar */}
        <div className="mb-4 p-4 rounded-2xl bg-[#f7fbff] border border-sky-100">
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="font-bold text-[#0a2540]">
              {language === 'bm'
                ? 'Peratus Penyelesaian Tutorial Keseluruhan'
                : 'Overall Tutorial Completion'}
            </span>
            <span className="font-mono font-extrabold text-[#0055b3] tabular-nums">
              {completedCount}/{totalTutorials} ({overallCompletionPercentage}%)
            </span>
          </div>
          <div
            className="w-full h-2.5 bg-[#e6f3ff] rounded-full overflow-hidden border border-[#cce7ff]"
            role="progressbar"
            aria-valuenow={overallCompletionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={
              language === 'bm'
                ? 'Peratus penyelesaian tutorial keseluruhan'
                : 'Overall tutorial completion percentage'
            }
          >
            <div
              className="h-full bg-gradient-to-r from-[#0066dd] to-[#0099ff] rounded-full transition-all duration-500"
              style={{ width: `${overallCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* Meaningful metrics without empty/misleading zeroes for new users */}
        {completedCount === 0 && inProgressCount === 0 && savedCount === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
            <span>
              {language === 'bm'
                ? 'Anda belum memulakan mana-mana tutorial lagi. Pilih satu panduan dalam Perpustakaan Digital untuk mula menjejak kemajuan.'
                : 'You have not started a tutorial yet. Pick your first guide in the Digital Library to begin tracking your progress.'}
            </span>
            <button
              type="button"
              onClick={() => onNavigateToLibrary('all')}
              className="min-h-[44px] px-4 py-2 rounded-full bg-[#0066dd] hover:bg-[#0055b3] text-white font-bold text-xs cursor-pointer"
            >
              {language === 'bm' ? 'Mulakan Tutorial Pertama' : 'Start First Tutorial'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-200/90 bg-[#fdfdfe] p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#0066dd]" aria-hidden="true" />
                <span className="font-semibold">
                  {language === 'bm' ? 'Tutorial Selesai' : 'Completed'}
                </span>
              </div>
              <p className="font-mono text-xl sm:text-2xl font-extrabold text-[#0a2540] tabular-nums">
                {completedCount}
                <span className="text-xs font-sans font-normal text-slate-500 ml-1">
                  / {totalTutorials}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-[#fdfdfe] p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                <Clock className="w-4 h-4 text-[#0099ff]" aria-hidden="true" />
                <span className="font-semibold">
                  {language === 'bm' ? 'Sedang Belajar' : 'In Progress'}
                </span>
              </div>
              <p className="font-mono text-xl sm:text-2xl font-extrabold text-[#0a2540] tabular-nums">
                {inProgressCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-[#fdfdfe] p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                <Bookmark className="w-4 h-4 text-[#d97706]" aria-hidden="true" />
                <span className="font-semibold">
                  {language === 'bm' ? 'Disimpan' : 'Bookmarked'}
                </span>
              </div>
              <p className="font-mono text-xl sm:text-2xl font-extrabold text-[#0a2540] tabular-nums">
                {savedCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-[#fdfdfe] p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                <Award className="w-4 h-4 text-[#0b6e41]" aria-hidden="true" />
                <span className="font-semibold">
                  {attemptedQuizCount > 0
                    ? language === 'bm'
                      ? 'Purata Kuiz'
                      : 'Avg Quiz Score'
                    : language === 'bm'
                    ? 'Masa Belajar'
                    : 'Study Time'}
                </span>
              </div>
              <p className="font-mono text-xl sm:text-2xl font-extrabold text-[#0a2540] tabular-nums">
                {attemptedQuizCount > 0 && averageQuizScore !== null
                  ? `${averageQuizScore}%`
                  : `${totalMinutesSpent} ${language === 'bm' ? 'm' : 'm'}`}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          4. MY TEACHING WORKSPACE (RPH & PBD)
      ===================================================================== */}
      <MyTeachingWorkspaceSection language={language} onSelectTab={navigateTab} />

      {/* =====================================================================
          5. RECENT ACTIVITY (Single Consolidated Feed)
      ===================================================================== */}
      <RecentActivitySection
        activities={recentActivities}
        tutorials={tutorials}
        progress={effectiveProgress}
        language={language}
        onSelectTutorial={onSelectTutorial}
        onSelectTab={navigateTab}
        maxItems={4}
        headingId="home-recent-activity-heading"
      />

      {/* =====================================================================
          6. QUICK ACCESS TO OTHER BAMUDI MODULES
      ===================================================================== */}
      <section
        aria-labelledby="quick-access-heading"
        className="bg-white rounded-3xl border border-[#ccebff] p-5 sm:p-6 shadow-[0_8px_28px_-6px_rgba(0,153,255,0.08)]"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-xl bg-[#fff3d6] border border-[#ffd275] flex items-center justify-center text-[#d97706] shadow-2xs shrink-0"
              aria-hidden="true"
            >
              <Zap className="w-4 h-4 fill-[#f59e0b] text-[#d97706]" />
            </span>
            <h2
              id="quick-access-heading"
              className="font-display text-lg sm:text-xl font-extrabold text-[#0a2540]"
            >
              {language === 'bm' ? 'Akses Pantas Modul BaMuDi' : 'Quick Access to BaMuDi Modules'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {quickAccessDestinations.map((dest) => {
            const Icon = dest.icon;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={dest.onClick}
                aria-label={'ariaLabel' in dest ? dest.ariaLabel : undefined}
                className="min-h-[44px] text-left p-3.5 rounded-2xl border border-slate-200/90 hover:border-[#0099ff] bg-[#fdfdfe] hover:bg-[#f5faff] transition-all cursor-pointer group flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${dest.tone}`}
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-display text-sm font-extrabold text-[#0a2540] group-hover:text-[#0055b3] truncate">
                        {dest.title}
                      </span>
                      {'count' in dest && dest.count !== undefined && (
                        <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded-full bg-[#cc310e] text-white shrink-0 tabular-nums">
                          {dest.count}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-600 block leading-snug line-clamp-2">
                      {dest.desc}
                    </span>
                  </div>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-slate-400 group-hover:text-[#0066dd] group-hover:translate-x-0.5 transition-all shrink-0"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          LOWER DISCOVERY WORKSPACE: Module Explorer & Competency Pathways
      ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <section
            aria-labelledby="curated-tutorials-heading"
            className="bg-white rounded-3xl border border-[#ccebff] p-5 sm:p-6 shadow-[0_8px_28px_-6px_rgba(0,153,255,0.08)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2
                  id="curated-tutorials-heading"
                  className="font-display text-lg sm:text-xl font-extrabold text-[#0a2540]"
                >
                  {language === 'bm'
                    ? 'Terokai Modul & Kategori'
                    : 'Explore Modules & Categories'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {language === 'bm'
                    ? 'Pilih tutorial mengikut fokus pengajaran atau semak senarai simpanan anda.'
                    : 'Browse tutorials by teaching focus or review your bookmarked guides.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  onNavigateToLibrary(
                    activeFeedTab === 'featured' || activeFeedTab === 'saved'
                      ? 'all'
                      : activeFeedTab
                  )
                }
                className="min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#0055b3] hover:text-[#003d82] hover:bg-[#f0f8ff] inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                <span>{language === 'bm' ? 'Buka Perpustakaan Penuh' : 'Open Full Library'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div
              className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar"
              role="tablist"
              aria-label={language === 'bm' ? 'Penapis modul tutorial' : 'Tutorial module filters'}
            >
              {feedTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeFeedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFeedTab(tab.id)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 whitespace-nowrap border transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#0066dd] text-white border-[#0055b3] shadow-xs'
                        : 'bg-[#f5faff] text-slate-700 border-[#d6ecff] hover:bg-[#e6f5ff] hover:text-[#0055b3]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{tab.label[language]}</span>
                    {typeof tab.count === 'number' && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[11px] font-extrabold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#e0f0ff] text-[#0055b3]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mb-5">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInlineSearchSubmit();
                }}
                placeholder={
                  language === 'bm'
                    ? 'Tapis tutorial di sini atau tekan Enter untuk carian penuh...'
                    : 'Filter tutorials here or press Enter for full library search...'
                }
                ariaLabel={
                  language === 'bm' ? 'Tapis tutorial di papan pemuka' : 'Filter tutorials on dashboard'
                }
                variant="compact"
              />
            </div>

            {displayedTutorials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedTutorials.map((tut) => (
                  <TutorialCard
                    key={tut.id}
                    tutorial={tut}
                    language={language}
                    onSelect={onSelectTutorial}
                    isCompleted={validCompletedSet.has(tut.id)}
                    isSaved={savedIds.includes(tut.id)}
                    onToggleSave={onToggleSave}
                  />
                ))}
              </div>
            ) : activeFeedTab === 'saved' && savedCount === 0 ? (
              <EmptyState
                title={language === 'bm' ? 'Tiada Tutorial Disimpan Lagi' : 'No Bookmarked Tutorials Yet'}
                description={
                  language === 'bm'
                    ? 'Tekan ikon penanda buku pada mana-mana kad tutorial untuk menyimpannya di sini sebagai rujukan pantas.'
                    : 'Click the bookmark icon on any tutorial card to save it here for quick classroom reference.'
                }
                mascotMood="encouraging"
                mascotSize="md"
                variant="compact"
                primaryAction={{
                  label: language === 'bm' ? 'Lihat Pilihan Utama' : 'View Featured Tutorials',
                  onClick: () => setActiveFeedTab('featured'),
                }}
              />
            ) : (
              <EmptyState
                title={language === 'bm' ? 'Tiada Modul Sepadan Ditemui' : 'No Matching Modules Found'}
                description={
                  language === 'bm'
                    ? `Tiada tutorial sepadan dengan "${searchQuery}". Cuba kata kunci lain atau buka Perpustakaan Digital penuh.`
                    : `No tutorials matched "${searchQuery}". Try another keyword or open the full Digital Library.`
                }
                mascotMood="thinking"
                mascotSize="md"
                variant="compact"
                primaryAction={{
                  label: language === 'bm' ? 'Reset Tapis' : 'Reset Filter',
                  onClick: () => {
                    setSearchQuery('');
                    setActiveFeedTab('featured');
                  },
                }}
              />
            )}
          </section>
        </div>

        <div className="lg:col-span-4">
          <section
            aria-labelledby="competency-pathways-heading"
            className="bg-white rounded-3xl border border-[#ccebff] p-5 sm:p-6 shadow-[0_8px_28px_-6px_rgba(0,153,255,0.08)]"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="w-8 h-8 rounded-xl bg-[#e6f5ff] border border-[#99d6ff] flex items-center justify-center text-[#0055b3] shadow-2xs"
                aria-hidden="true"
              >
                <Compass className="w-4 h-4" />
              </span>
              <h2
                id="competency-pathways-heading"
                className="font-display text-lg font-extrabold text-[#0a2540]"
              >
                {language === 'bm' ? 'Laluan Kompetensi' : 'Competency Pathways'}
              </h2>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
              {language === 'bm'
                ? 'Pilih tahap semasa anda untuk menyesuaikan cadangan modul.'
                : 'Select your current level to tailor recommended guides.'}
            </p>

            <div className="space-y-3">
              {pathways.map((p) => {
                const Icon = p.icon;
                const isSelected = competencyLevel === p.id;
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border p-3.5 transition-all ${
                      isSelected
                        ? p.activeRing
                        : 'border-slate-200/90 bg-slate-50/50 hover:border-[#99d6ff] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${p.accentBg} ${p.accentText}`}
                        aria-hidden="true"
                      >
                        <Icon className="w-4 h-4 mb-0.5" />
                        <span className="text-[10px] font-extrabold uppercase tracking-tight">
                          {p.moduleCount} Mod
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-sm font-extrabold text-[#0a2540]">
                            {p.title[language]}
                          </h3>
                          {isSelected && (
                            <span className="text-[11px] font-extrabold text-[#0066dd]">
                              {language === 'bm' ? 'Aktif' : 'Active'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5 mb-2.5">
                          {p.desc[language]}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          {onSelectCompetencyLevel && !isSelected && (
                            <button
                              type="button"
                              onClick={() => onSelectCompetencyLevel(p.id)}
                              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-white hover:bg-[#e6f5ff] text-[#0055b3] border border-[#99d6ff] text-xs font-extrabold transition-colors cursor-pointer"
                            >
                              {language === 'bm' ? 'Tetapkan Tahap' : 'Set Level'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onSelectPathway(p.id)}
                            className="min-h-[44px] px-3 py-1.5 rounded-xl bg-[#0a2540] hover:bg-[#0055b3] text-white text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>{language === 'bm' ? 'Terokai' : 'Explore'}</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
