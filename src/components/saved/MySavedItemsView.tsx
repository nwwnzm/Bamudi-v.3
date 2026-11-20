import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  DigitalTool,
  Language,
  TeachingResource,
  Tutorial,
} from '../../types';
import { translations } from '../../data/translations';
import {
  exportTeachingResource,
  SupportedExportFormat,
  triggerFileDownload,
} from '../../utils/resourceExporter';
import { BamuMascot } from '../brand/BamuMascot';
import { EmptyState } from '../common/EmptyState';
import { ToastNotification } from '../common/ToastNotification';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Loader2,
  Pin,
  Trash2,
  Wrench,
} from 'lucide-react';

export type SavedItemsFilterCategory = 'all' | 'tutorials' | 'resources' | 'tools';

export interface MySavedItemsViewProps {
  language: Language;
  tutorials: Tutorial[];
  resources: TeachingResource[];
  tools: DigitalTool[];
  savedTutorialIds: string[];
  savedResourceIds: string[];
  pinnedToolIds: string[];
  completedTutorialIds?: string[];
  onSelectTutorial: (tutorial: Tutorial) => void;
  onToggleBookmarkTutorial: (tutorialId: string) => void;
  onToggleSaveResource: (resourceId: string) => void;
  onTogglePinTool: (toolId: string) => void;
  onToolVisit?: (tool: DigitalTool) => void;
  onNavigateToTab: (tabId: string) => void;
}

function resolveValidItemsByIds<T extends { id: string }>(
  ids: string[],
  catalogue: T[]
): T[] {
  const byId = new Map<string, T>();
  for (const item of catalogue) {
    byId.set(item.id, item);
  }

  const resolved: T[] = [];
  const seen = new Set<string>();
  for (const rawId of ids) {
    if (typeof rawId !== 'string') continue;
    const id = rawId.trim();
    if (!id || seen.has(id)) continue;
    const found = byId.get(id);
    if (found) {
      seen.add(id);
      resolved.push(found);
    }
  }
  return resolved;
}

function resolveDefaultExportFormat(resource: TeachingResource): SupportedExportFormat {
  if (resource.format === 'DOCX') return 'docx';
  if (resource.format === 'PPTX') return 'pptx';
  return 'pdf';
}

export const MySavedItemsView: React.FC<MySavedItemsViewProps> = ({
  language,
  tutorials,
  resources,
  tools,
  savedTutorialIds,
  savedResourceIds,
  pinnedToolIds,
  completedTutorialIds = [],
  onSelectTutorial,
  onToggleBookmarkTutorial,
  onToggleSaveResource,
  onTogglePinTool,
  onToolVisit,
  onNavigateToTab,
}) => {
  const allT = translations[language];
  const t = allT.savedItems;
  const resT = allT.resources;
  const toolT = allT.tools;

  const [activeFilter, setActiveFilter] = useState<SavedItemsFilterCategory>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastState, setToastState] = useState<{
    message: string;
    detail?: string;
    icon?: 'check' | 'bookmark' | 'error';
    variant?: 'success' | 'error';
  } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (nextToast: {
    message: string;
    detail?: string;
    icon?: 'check' | 'bookmark' | 'error';
    variant?: 'success' | 'error';
  }) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastState(nextToast);
    toastTimerRef.current = window.setTimeout(() => {
      setToastState(null);
      toastTimerRef.current = null;
    }, 4000);
  };

  // Resolve valid items strictly from existing catalogues (excludes stale/deleted IDs)
  const savedTutorials = useMemo(
    () => resolveValidItemsByIds(savedTutorialIds, tutorials),
    [savedTutorialIds, tutorials]
  );

  const savedResources = useMemo(
    () => resolveValidItemsByIds(savedResourceIds, resources),
    [savedResourceIds, resources]
  );

  const pinnedTools = useMemo(
    () => resolveValidItemsByIds(pinnedToolIds, tools),
    [pinnedToolIds, tools]
  );

  const completedSet = useMemo(
    () => new Set(completedTutorialIds),
    [completedTutorialIds]
  );

  const totalSavedCount =
    savedTutorials.length + savedResources.length + pinnedTools.length;

  const totalCountLabel =
    totalSavedCount === 0
      ? t.totalSavedEmpty
      : totalSavedCount === 1
      ? t.totalSavedSingular
      : t.totalSavedPlural.replace('{count}', String(totalSavedCount));

  const filterOptions: {
    id: SavedItemsFilterCategory;
    label: string;
    count: number;
    icon: React.ElementType;
  }[] = [
    { id: 'all', label: t.filters.all, count: totalSavedCount, icon: Bookmark },
    { id: 'tutorials', label: t.filters.tutorials, count: savedTutorials.length, icon: BookOpen },
    { id: 'resources', label: t.filters.resources, count: savedResources.length, icon: FolderOpen },
    { id: 'tools', label: t.filters.tools, count: pinnedTools.length, icon: Wrench },
  ];

  const getResourceCategoryLabel = (category: TeachingResource['category']): string => {
    if (category === 'worksheet') return resT.worksheet;
    if (category === 'assessment') return resT.assessment;
    return resT.presentation;
  };

  const handleDownloadResource = async (resource: TeachingResource) => {
    try {
      setDownloadingId(resource.id);
      const targetFormat = resolveDefaultExportFormat(resource);
      const result = await exportTeachingResource(resource.id, language, targetFormat);
      triggerFileDownload(result.blob, result.filename);
      showToast({
        message: t.toasts.downloadSuccess,
        detail: `${result.filename} (${(result.blob.size / 1024).toFixed(1)} KB)`,
        icon: 'check',
        variant: 'success',
      });
    } catch (err) {
      console.error('Saved resource download error:', err);
      showToast({
        message: t.toasts.downloadError,
        detail: t.toasts.downloadErrorDetail,
        icon: 'error',
        variant: 'error',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRemoveTutorial = (tutorial: Tutorial) => {
    onToggleBookmarkTutorial(tutorial.id);
    showToast({
      message: t.toasts.bookmarkRemoved,
      detail: tutorial.title[language],
      icon: 'check',
      variant: 'success',
    });
  };

  const handleRemoveResource = (resource: TeachingResource) => {
    onToggleSaveResource(resource.id);
    showToast({
      message: t.toasts.resourceRemoved,
      detail: resource.title[language],
      icon: 'check',
      variant: 'success',
    });
  };

  const handleUnpinTool = (tool: DigitalTool) => {
    onTogglePinTool(tool.id);
    showToast({
      message: t.toasts.toolUnpinned,
      detail: tool.name,
      icon: 'check',
      variant: 'success',
    });
  };

  const showTutorialsSection =
    (activeFilter === 'all' && savedTutorials.length > 0) ||
    (activeFilter === 'tutorials' && savedTutorials.length > 0);
  const showResourcesSection =
    (activeFilter === 'all' && savedResources.length > 0) ||
    (activeFilter === 'resources' && savedResources.length > 0);
  const showToolsSection =
    (activeFilter === 'all' && pinnedTools.length > 0) ||
    (activeFilter === 'tools' && pinnedTools.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {toastState && (
        <ToastNotification
          message={toastState.message}
          detail={toastState.detail}
          icon={toastState.icon}
          variant={toastState.variant || 'success'}
          onDismiss={() => setToastState(null)}
        />
      )}

      {/* A. Page Header */}
      <section
        aria-labelledby="my-saved-items-heading"
        className="bg-gradient-to-r from-sky-50/80 via-[#fdfdfe] to-[#fdf2f0] border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-bold text-[#007acc] uppercase tracking-wider mb-1">
            {t.eyebrow}
          </p>
          <h1
            id="my-saved-items-heading"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-2"
          >
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-4">
            {t.subtitle}
          </p>

          {/* Total saved summary (unboxed metadata with tabular numbers) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
              <Bookmark className="w-4 h-4 text-[#cc310e]" aria-hidden="true" />
              <span className="font-mono tabular-nums">{totalCountLabel}</span>
            </span>
            {totalSavedCount > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">
                    {savedTutorials.length}
                  </span>{' '}
                  {t.filters.tutorials}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">
                    {savedResources.length}
                  </span>{' '}
                  {t.filters.resources}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">
                    {pinnedTools.length}
                  </span>{' '}
                  {t.filters.tools}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 hidden md:block">
          <BamuMascot
            mood={totalSavedCount > 0 ? 'happy' : 'encouraging'}
            size="lg"
          />
        </div>
      </section>

      {/* B. Category Filters (44px touch targets with live valid item counts) */}
      <div
        role="tablist"
        aria-label={t.aria.filterGroup}
        className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sky-100 no-scrollbar"
      >
        {filterOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveFilter(opt.id)}
              className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 ${
                isSelected
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'bg-sky-50 text-sky-900 hover:bg-sky-100 hover:text-sky-950'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{opt.label}</span>
              <span
                className={`font-mono text-[11px] font-extrabold tabular-nums px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-[#0055aa] border border-sky-200/80'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* C. Global Empty State (no saved items at all when All is selected) */}
      {totalSavedCount === 0 && activeFilter === 'all' && (
        <section
          aria-live="polite"
          className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs text-center flex flex-col items-center justify-center"
        >
          <div className="mb-4 shrink-0">
            <BamuMascot mood="encouraging" size="xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display mb-2">
            {t.emptyAll.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed font-normal">
            {t.emptyAll.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              type="button"
              onClick={() => onNavigateToTab('library')}
              className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2"
            >
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.actions.exploreTutorials}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToTab('resources')}
              className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-[#007acc] hover:text-[#0055aa] bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2"
            >
              <FolderOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.actions.browseResources}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToTab('tools')}
              className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2"
            >
              <Wrench className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.actions.discoverTools}</span>
            </button>
          </div>
        </section>
      )}

      {/* D. Category-Specific Empty States */}
      {activeFilter === 'tutorials' && savedTutorials.length === 0 && (
        <EmptyState
          variant="card"
          mascotMood="encouraging"
          mascotSize="xl"
          title={t.emptyCategory.tutorialsTitle}
          description={t.emptyCategory.tutorialsDesc}
          primaryAction={{
            label: t.actions.exploreTutorials,
            icon: BookOpen,
            onClick: () => onNavigateToTab('library'),
          }}
          secondaryAction={
            totalSavedCount > 0
              ? {
                  label: t.actions.viewAllSaved,
                  onClick: () => setActiveFilter('all'),
                  variant: 'secondary',
                }
              : undefined
          }
        />
      )}

      {activeFilter === 'resources' && savedResources.length === 0 && (
        <EmptyState
          variant="card"
          mascotMood="encouraging"
          mascotSize="xl"
          title={t.emptyCategory.resourcesTitle}
          description={t.emptyCategory.resourcesDesc}
          primaryAction={{
            label: t.actions.browseResources,
            icon: FolderOpen,
            onClick: () => onNavigateToTab('resources'),
          }}
          secondaryAction={
            totalSavedCount > 0
              ? {
                  label: t.actions.viewAllSaved,
                  onClick: () => setActiveFilter('all'),
                  variant: 'secondary',
                }
              : undefined
          }
        />
      )}

      {activeFilter === 'tools' && pinnedTools.length === 0 && (
        <EmptyState
          variant="card"
          mascotMood="encouraging"
          mascotSize="xl"
          title={t.emptyCategory.toolsTitle}
          description={t.emptyCategory.toolsDesc}
          primaryAction={{
            label: t.actions.discoverTools,
            icon: Wrench,
            onClick: () => onNavigateToTab('tools'),
          }}
          secondaryAction={
            totalSavedCount > 0
              ? {
                  label: t.actions.viewAllSaved,
                  onClick: () => setActiveFilter('all'),
                  variant: 'secondary',
                }
              : undefined
          }
        />
      )}

      {/* E. Saved Tutorials Section */}
      {showTutorialsSection && (
        <section aria-labelledby="saved-tutorials-section-heading" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-[#007acc] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <BookOpen className="w-4 h-4" />
              </span>
              <h2
                id="saved-tutorials-section-heading"
                className="text-base sm:text-lg font-bold text-slate-900 font-display truncate"
              >
                {t.sections.tutorials}
              </h2>
              <span className="font-mono text-xs font-bold text-slate-500 tabular-nums">
                ({savedTutorials.length})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedTutorials.map((tut) => {
              const isCompleted = completedSet.has(tut.id);
              return (
                <article
                  key={tut.id}
                  className="bg-white border border-sky-200/80 hover:border-[#0099ff] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Type & Metadata Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0066cc]">
                        <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{t.typeLabels.tutorial}</span>
                      </span>

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0b6e41]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{allT.tutorialExperience.completed}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 font-display leading-snug mb-2 break-words">
                      {tut.title[language]}
                    </h3>

                    {/* Metadata line (unboxed, dot-separated) */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-3">
                      <span className="font-semibold text-slate-700">
                        {allT.categories[tut.category]}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{allT.levels[tut.level]}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
                        <span>
                          {tut.estimatedMinutes} {allT.common.minute}
                        </span>
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-5 font-normal">
                      {tut.description[language]}
                    </p>
                  </div>

                  {/* Card Actions (44px min touch targets) */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveTutorial(tut)}
                      aria-label={`${t.aria.removeBookmark}: ${tut.title[language]}`}
                      className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full text-xs font-bold text-[#99240b] bg-[#fdf2f0] hover:bg-[#fde4df] border border-[#cc310e]/30 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{t.actions.removeBookmark}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectTutorial(tut)}
                      className="min-h-[44px] px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 ml-auto"
                    >
                      <span>{t.actions.openTutorial}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* F. Saved Teaching Resources Section */}
      {showResourcesSection && (
        <section aria-labelledby="saved-resources-section-heading" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0b6e41] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <FolderOpen className="w-4 h-4" />
              </span>
              <h2
                id="saved-resources-section-heading"
                className="text-base sm:text-lg font-bold text-slate-900 font-display truncate"
              >
                {t.sections.resources}
              </h2>
              <span className="font-mono text-xs font-bold text-slate-500 tabular-nums">
                ({savedResources.length})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedResources.map((res) => {
              const isDownloading = downloadingId === res.id;
              return (
                <article
                  key={res.id}
                  className="bg-white border border-emerald-200/80 hover:border-emerald-400 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Type & Format Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0b6e41]">
                        <FolderOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{t.typeLabels.resource}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wider ${
                          res.format === 'DOCX'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : res.format === 'PPTX'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        <FileText className="w-3 h-3" aria-hidden="true" />
                        {res.format}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 font-display leading-snug mb-2 break-words">
                      {res.title[language]}
                    </h3>

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-3">
                      <span className="font-semibold text-slate-700">
                        {getResourceCategoryLabel(res.category)}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{res.gradeLevel[language]}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-5 font-normal">
                      {res.description[language]}
                    </p>
                  </div>

                  {/* Card Actions (44px min touch targets) */}
                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToTab('resources')}
                        aria-label={`${t.aria.openResources}: ${res.title[language]}`}
                        className="min-h-[44px] px-3.5 py-2 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2"
                      >
                        <span>{t.actions.openResources}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadResource(res)}
                        disabled={isDownloading}
                        aria-label={`${t.aria.downloadResource}: ${res.title[language]} (${res.format})`}
                        className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold text-white inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 ml-auto ${
                          isDownloading
                            ? 'bg-slate-400 cursor-not-allowed'
                            : res.format === 'PPTX'
                            ? 'bg-orange-600 hover:bg-orange-700 cursor-pointer'
                            : 'bg-[#0099ff] hover:bg-[#0088ee] cursor-pointer'
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                            <span>{t.actions.downloadingResource}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>
                              {t.actions.downloadResource} ({res.format})
                            </span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveResource(res)}
                      aria-label={`${t.aria.removeResource}: ${res.title[language]}`}
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-full text-xs font-bold text-[#99240b] bg-[#fdf2f0] hover:bg-[#fde4df] border border-[#cc310e]/30 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{t.actions.removeResource}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* G. Pinned Digital Tools Section */}
      {showToolsSection && (
        <section aria-labelledby="pinned-tools-section-heading" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-8 h-8 rounded-xl bg-[#fdf2f0] border border-[#cc310e]/25 text-[#cc310e] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Wrench className="w-4 h-4" />
              </span>
              <h2
                id="pinned-tools-section-heading"
                className="text-base sm:text-lg font-bold text-slate-900 font-display truncate"
              >
                {t.sections.tools}
              </h2>
              <span className="font-mono text-xs font-bold text-slate-500 tabular-nums">
                ({pinnedTools.length})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pinnedTools.map((tool) => {
              const hostname = tool.officialUrl.replace(/^https?:\/\//, '').split('/')[0];
              return (
                <article
                  key={tool.id}
                  className="bg-white border border-[#cc310e]/25 hover:border-[#0099ff] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Type & Hostname Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#99240b]">
                        <Pin className="w-3.5 h-3.5 fill-[#cc310e] text-[#cc310e] shrink-0" aria-hidden="true" />
                        <span>{t.typeLabels.tool}</span>
                      </span>

                      <span className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                        {hostname}
                      </span>
                    </div>

                    {/* Tool Name */}
                    <h3 className="text-base font-bold text-slate-900 font-display leading-snug mb-2 break-words">
                      {tool.name}
                    </h3>

                    {/* Category & Difficulty Metadata */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mb-3">
                      <span className="font-semibold text-slate-700">
                        {toolT.categories[tool.category as keyof typeof toolT.categories] || tool.category}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{allT.levels[tool.difficulty]}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-5 font-normal">
                      {tool.description[language]}
                    </p>
                  </div>

                  {/* Card Actions (44px min touch targets, button strictly sibling to anchor) */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleUnpinTool(tool)}
                      aria-label={`${t.aria.unpinTool}: ${tool.name}`}
                      className="min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full text-xs font-bold text-[#99240b] bg-[#fdf2f0] hover:bg-[#fde4df] border border-[#cc310e]/30 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2"
                    >
                      <Pin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{t.actions.unpinTool}</span>
                    </button>

                    <a
                      href={tool.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onToolVisit?.(tool)}
                      aria-label={`${t.actions.launchTool}: ${tool.name} (${
                        language === 'bm' ? 'buka dalam tab baharu' : 'opens in new tab'
                      })`}
                      className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-[#007acc] hover:text-[#0055aa] bg-sky-50 hover:bg-sky-100/90 rounded-full transition-colors cursor-pointer border border-sky-200/80 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 shrink-0 ml-auto"
                    >
                      <span>{t.actions.launchTool}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
