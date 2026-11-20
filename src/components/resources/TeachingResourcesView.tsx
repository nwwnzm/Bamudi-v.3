import React, { useState, useMemo, useRef, useEffect } from 'react';
import { TeachingResource, Language } from '../../types';
import { translations } from '../../data/translations';
import { BamuMascot } from '../brand/BamuMascot';
import { ToastNotification } from '../common/ToastNotification';
import { SearchBar } from '../common/SearchBar';
import { EmptyState } from '../common/EmptyState';
import {
  exportTeachingResource,
  triggerFileDownload,
  PRESENTATION_RUBRIC_DATA,
  SCIENCE_INQUIRY_DATA,
  ITHINK_MAPS,
  STEM_PBL_DATA,
} from '../../utils/resourceExporter';
import {
  Download,
  Eye,
  FileText,
  X,
  ClipboardCheck,
  ArrowRight,
  BookOpen,
  Loader2,
  Check,
  Bookmark,
} from 'lucide-react';

interface Props {
  resources: TeachingResource[];
  language: Language;
  onNavigateToTab?: (tabId: string) => void;
  isResourceSaved?: (resourceId: string) => boolean;
  onToggleSaveResource?: (resourceId: string) => void;
}

export const TeachingResourcesView: React.FC<Props> = ({
  resources,
  language,
  onNavigateToTab,
  isResourceSaved,
  onToggleSaveResource,
}) => {
  const t = translations[language].resources;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewResource, setPreviewResource] = useState<TeachingResource | null>(null);
  const [toastState, setToastState] = useState<{
    message: string;
    detail?: string;
    icon?: 'check' | 'bookmark' | 'error';
    variant?: 'success' | 'error';
  } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!previewResource) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewResource(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewResource]);

  const categories = [
    { id: 'all', label: t.allCategories },
    { id: 'worksheet', label: t.worksheet },
    { id: 'assessment', label: t.assessment },
    { id: 'presentation', label: t.presentation },
  ];

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleMatch = res.title[language].toLowerCase().includes(q);
      const descMatch = res.description[language].toLowerCase().includes(q);
      const tagMatch = res.tags.some((tag) => tag.toLowerCase().includes(q));
      return titleMatch || descMatch || tagMatch;
    });
  }, [resources, selectedCategory, searchQuery, language]);

  // Real file download trigger for all 5 resources
  const handleDownload = async (
    resource: TeachingResource,
    formatOverride?: 'docx' | 'pdf' | 'pptx'
  ) => {
    try {
      setDownloadingId(`${resource.id}-${formatOverride || 'default'}`);

      // Determine default format based on resource metadata
      let targetFormat = formatOverride;
      if (!targetFormat) {
        if (resource.format === 'DOCX') targetFormat = 'docx';
        else if (resource.format === 'PPTX') targetFormat = 'pptx';
        else targetFormat = 'pdf';
      }

      const result = await exportTeachingResource(resource.id, language, targetFormat);

      triggerFileDownload(result.blob, result.filename);

      showToast({
        message: t.copiedToast,
        detail: `${result.filename} (${(result.blob.size / 1024).toFixed(1)} KB) · ${t.downloadSuccessMsg}`,
        icon: 'check',
        variant: 'success',
      });
    } catch (err) {
      console.error('Download error:', err);
      showToast({
        message: language === 'bm' ? 'Ralat semasa memuat turun fail' : 'Error downloading file',
        detail: language === 'bm' ? 'Sila cuba lagi dalam beberapa saat.' : 'Please try again in a few moments.',
        icon: 'error',
        variant: 'error',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleToggleSave = (resource: TeachingResource, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onToggleSaveResource) return;

    const currentlySaved = isResourceSaved?.(resource.id) ?? false;
    onToggleSaveResource(resource.id);

    showToast({
      message: currentlySaved ? t.removedToast : t.saveToast,
      detail: resource.title[language],
      icon: currentlySaved ? 'check' : 'bookmark',
      variant: 'success',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastState && (
        <ToastNotification
          message={toastState.message}
          detail={toastState.detail}
          icon={toastState.icon}
          variant={toastState.variant || 'success'}
          onDismiss={() => setToastState(null)}
        />
      )}

      {/* Header section with Bamu companion */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-sky-50/80 via-[#fdfdfe] to-[#fdf2f0] border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#007acc] uppercase tracking-wider block mb-1">
            {language === 'bm' ? 'Koleksi Bahan PdP' : 'Classroom Materials'}
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
            mood="happy"
            size="lg"
            speech={
              language === 'bm'
                ? 'Semua 5 bahan sedia dimuat turun dalam format Word (.docx), Slaid (.pptx) atau PDF!'
                : 'All 5 materials are ready to download in Word (.docx), Slides (.pptx) or PDF!'
            }
          />
        </div>
      </div>

      {/* Interactive Tools Highlight Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* RPH Generator Card */}
        <div className="bg-gradient-to-br from-white to-sky-50/60 border border-sky-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/20 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-[#0099ff]/10 text-[#007acc] rounded-xl">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-[#007acc] uppercase tracking-wider">
                {language === 'bm' ? 'Alat Perancangan PdP' : 'Lesson Planning Tool'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display mb-1">
              {t.rphBannerTitle}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4">
              {t.rphBannerDesc}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigateToTab?.('rph-generator')}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 min-h-[44px] text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>{t.rphBannerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PBD System Card */}
        <div className="bg-gradient-to-br from-white to-indigo-50/60 border border-indigo-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                <ClipboardCheck className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                {language === 'bm' ? 'Sistem Pentaksiran' : 'Assessment System'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display mb-1">
              {t.pbdBannerTitle}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4">
              {t.pbdBannerDesc}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigateToTab?.('pbd-system')}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 min-h-[44px] text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>{t.pbdBannerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t.searchPlaceholder}
            className="w-full"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 min-h-[44px] text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div>
        {filteredResources.length === 0 ? (
          <EmptyState
            title={language === 'bm' ? 'Tiada Bahan Dijumpai' : 'No Materials Found'}
            description={
              language === 'bm'
                ? `Tiada bahan yang sepadan dengan carian "${searchQuery}". Cuba ubah kata kunci atau pilih kategori lain.`
                : `No materials matched your search "${searchQuery}". Try adjusting your keywords or select another category.`
            }
            mascotMood="thinking"
            primaryAction={{
              label: language === 'bm' ? 'Set Semula Carian' : 'Reset Search',
              onClick: () => {
                setSearchQuery('');
                setSelectedCategory('all');
              },
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => {
              const isDownloading = downloadingId?.startsWith(res.id);
              const saved = isResourceSaved?.(res.id) ?? false;

              return (
                <div
                  key={res.id}
                  className={`bg-white border rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                    saved ? 'border-[#cc310e]/35' : 'border-slate-200/90'
                  }`}
                >
                  <div>
                    {/* Header: format badge, status & Save toggle */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider ${
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

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-2.5 h-2.5" aria-hidden="true" />
                          {language === 'bm' ? 'Sedia Muat Turun' : 'Ready to Download'}
                        </span>
                      </div>

                      {onToggleSaveResource && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleSave(res, e)}
                          aria-pressed={saved}
                          aria-label={`${saved ? t.unsaveAriaLabel : t.saveAriaLabel}: ${res.title[language]}`}
                          className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-full text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 ${
                            saved
                              ? 'bg-[#fdf2f0] text-[#99240b] border-[#cc310e]/35 hover:bg-[#fde4df]'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-[#007acc] hover:border-sky-200'
                          }`}
                        >
                          <Bookmark
                            className={`w-4 h-4 shrink-0 ${
                              saved ? 'fill-[#cc310e] text-[#cc310e]' : ''
                            }`}
                            aria-hidden="true"
                          />
                          <span>{saved ? t.savedBtn : t.saveBtn}</span>
                        </button>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 font-display mb-2 group-hover:text-[#007acc] transition-colors leading-snug">
                      {res.title[language]}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 font-normal">
                      {res.description[language]}
                    </p>

                    {/* Level & download metadata */}
                    <div className="text-[11px] text-slate-600 mb-4 bg-sky-50/40 p-2.5 rounded-2xl border border-sky-100 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <div>
                        <span className="font-bold text-sky-950">{t.levelBadge}: </span>
                        {res.gradeLevel[language]}
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-slate-500">
                        {res.downloadCount.toLocaleString()} {language === 'bm' ? 'muat turun' : 'downloads'}
                      </span>
                    </div>
                  </div>

                  {/* Actions (44px touch targets) */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewResource(res)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer active:scale-95"
                    >
                      <Eye className="w-4 h-4 text-slate-500" />
                      <span>{t.previewBtn}</span>
                    </button>

                    <button
                      onClick={() => handleDownload(res)}
                      disabled={isDownloading}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] text-xs font-bold text-white rounded-full transition-all cursor-pointer shadow-xs active:scale-95 ${
                        isDownloading
                          ? 'bg-slate-400 cursor-wait'
                          : res.format === 'PPTX'
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-[#0099ff] hover:bg-[#0088ee]'
                      }`}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{language === 'bm' ? 'Menjana...' : 'Exporting...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>{t.downloadBtn}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Preview Modal with Actual Resource Content & Multi-Format Download */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 animate-fadeIn flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-sky-50/60 to-white">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono font-bold text-[#0099ff] uppercase">
                    {previewResource.format} · {previewResource.subject[language]}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {previewResource.gradeLevel[language]}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {previewResource.title[language]}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onToggleSaveResource && (() => {
                  const previewSaved = isResourceSaved?.(previewResource.id) ?? false;
                  return (
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(previewResource, e)}
                      aria-pressed={previewSaved}
                      aria-label={`${previewSaved ? t.unsaveAriaLabel : t.saveAriaLabel}: ${previewResource.title[language]}`}
                      className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 ${
                        previewSaved
                          ? 'bg-[#fdf2f0] text-[#99240b] border-[#cc310e]/35 hover:bg-[#fde4df]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-[#007acc] hover:border-sky-200'
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 shrink-0 ${
                          previewSaved ? 'fill-[#cc310e] text-[#cc310e]' : ''
                        }`}
                        aria-hidden="true"
                      />
                      <span>{previewSaved ? t.savedBtn : t.saveBtn}</span>
                    </button>
                  );
                })()}
                <button
                  type="button"
                  onClick={() => setPreviewResource(null)}
                  aria-label={t.closeModal}
                  className="p-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-display">
                  {language === 'bm' ? 'Huraian Bahan PdP' : 'Resource Overview'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {previewResource.description[language]}
                </p>
              </div>

              {/* Resource 1: Student Group Presentation Rubric Preview */}
              {previewResource.id === 'rubrik-pembentangan-murid' && (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                      {language === 'bm'
                        ? 'Pratonton Matriks Kriteria Rubrik (Skala 1 - 4)'
                        : 'Rubric Criteria Matrix Preview (Scale 1 - 4)'}
                    </h4>
                    <span className="text-[11px] font-bold text-[#007acc] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                      5 {language === 'bm' ? 'Kriteria Penilaian' : 'Assessment Criteria'}
                    </span>
                  </div>

                  <div className="border border-sky-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#007acc] text-white">
                            <th className="p-2.5 font-bold w-1/4">
                              {language === 'bm' ? 'Kriteria & Wajaran' : 'Criteria & Weight'}
                            </th>
                            <th className="p-2.5 font-bold w-1/4">
                              {language === 'bm' ? 'Tahap 4 (Cemerlang)' : 'Level 4 (Excellent)'}
                            </th>
                            <th className="p-2.5 font-bold w-1/4">
                              {language === 'bm' ? 'Tahap 3 (Baik)' : 'Level 3 (Good)'}
                            </th>
                            <th className="p-2.5 font-bold w-1/4">
                              {language === 'bm' ? 'Tahap 2 & 1' : 'Level 2 & 1'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100 bg-white">
                          {PRESENTATION_RUBRIC_DATA.criteria.map((c) => (
                            <tr key={c.id} className="hover:bg-sky-50/40 transition-colors">
                              <td className="p-2.5 font-semibold text-slate-900 bg-sky-50/50 align-top">
                                {c.name[language]}
                                <span className="block text-[11px] text-[#007acc] font-normal mt-0.5">
                                  {language === 'bm' ? 'Wajaran' : 'Weight'}: {c.weight}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-700 align-top text-[11px]">
                                {c.levels.level4[language]}
                              </td>
                              <td className="p-2.5 text-slate-700 align-top text-[11px]">
                                {c.levels.level3[language]}
                              </td>
                              <td className="p-2.5 text-slate-600 align-top text-[11px]">
                                <p className="mb-1"><strong className="text-slate-800">T2:</strong> {c.levels.level2[language]}</p>
                                <p><strong className="text-slate-800">T1:</strong> {c.levels.level1[language]}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-2">
                    {language === 'bm'
                      ? 'Fail Word (.docx) boleh diedit sepenuhnya di Microsoft Word / Google Docs.'
                      : 'Word (.docx) file is fully editable in Microsoft Word or Google Docs.'}
                  </p>
                </div>
              )}

              {/* Resource 2: Science Inquiry Worksheet Preview */}
              {previewResource.id === 'worksheet-science-inquiry' && (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                      {language === 'bm'
                        ? 'Pratonton Struktur Lembaran Penyiasatan Sains'
                        : 'Science Inquiry Worksheet Structure Preview'}
                    </h4>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                      8 {language === 'bm' ? 'Bahagian Kaedah Saintifik' : 'Scientific Method Sections'}
                    </span>
                  </div>

                  <div className="border border-sky-200 rounded-2xl p-4 bg-sky-50/30 space-y-3 text-xs text-slate-800">
                    <div className="p-3 bg-white rounded-xl border border-sky-100">
                      <span className="font-bold text-sky-800 block mb-0.5">
                        {SCIENCE_INQUIRY_DATA.sections.problemStatement.title[language]}
                      </span>
                      <p className="text-slate-600 text-[11px]">
                        {SCIENCE_INQUIRY_DATA.sections.problemStatement.prompt[language]}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-sky-100">
                      <span className="font-bold text-sky-800 block mb-0.5">
                        {SCIENCE_INQUIRY_DATA.sections.variables.title[language]}
                      </span>
                      <div className="space-y-1 text-slate-600 text-[11px]">
                        <p>{SCIENCE_INQUIRY_DATA.sections.variables.manipulated[language]}</p>
                        <p>{SCIENCE_INQUIRY_DATA.sections.variables.responding[language]}</p>
                        <p>{SCIENCE_INQUIRY_DATA.sections.variables.constant[language]}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-sky-100">
                      <span className="font-bold text-sky-800 block mb-0.5">
                        {SCIENCE_INQUIRY_DATA.sections.observation.title[language]}
                      </span>
                      <div className="grid grid-cols-3 gap-2 mt-1.5 p-2 bg-slate-50 rounded-lg text-center text-[10px] font-semibold text-slate-700 border border-slate-200">
                        <div>{SCIENCE_INQUIRY_DATA.sections.observation.tableHeaders.col1[language]}</div>
                        <div>{SCIENCE_INQUIRY_DATA.sections.observation.tableHeaders.col2[language]}</div>
                        <div>{SCIENCE_INQUIRY_DATA.sections.observation.tableHeaders.col3[language]}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-2">
                    {language === 'bm'
                      ? 'Disediakan dalam format PDF sedia dicetak (A4) dan format Word (.docx) boleh ubah suai.'
                      : 'Available in print-ready PDF (A4) and fully editable Word (.docx).'}
                  </p>
                </div>
              )}

              {/* Resource 3: i-Think Thinking Maps Pack Preview */}
              {previewResource.id === 'worksheet-ithink-organizer' && (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                      {language === 'bm'
                        ? 'Kandungan Pek 8 Peta Pemikiran Visual i-Think'
                        : '8 i-Think Visual Thinking Maps Pack Overview'}
                    </h4>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                      8 {language === 'bm' ? 'Peta Vektor A4' : 'A4 Vector Maps'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ITHINK_MAPS.map((map) => (
                      <div key={map.id} className="p-3 bg-sky-50/40 border border-sky-100 rounded-2xl">
                        <span className="font-bold text-slate-900 text-xs block mb-1">
                          {map.name[language]}
                        </span>
                        <p className="text-[11px] text-[#007acc] font-semibold mb-1">
                          {map.thinkingProcess[language]}
                        </p>
                        <p className="text-[10px] text-slate-600 line-clamp-2">
                          {map.purpose[language]}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-2">
                    {language === 'bm'
                      ? 'Dokumen PDF 8 halaman lengkap dengan Bingkai Rujukan (Frame of Reference) dan ruang menulis yang luas.'
                      : '8-page PDF document complete with Frame of Reference borders and ample student writing space.'}
                  </p>
                </div>
              )}

              {/* Resource 4: Teaching Slides Preview */}
              {previewResource.id === 'presentation-minimal-deck' && (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                      {language === 'bm'
                        ? 'Struktur Slaid Pengajaran (16:9 Kontras Tinggi)'
                        : 'Teaching Slide Deck Blueprint (16:9 Widescreen)'}
                    </h4>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      6 {language === 'bm' ? 'Reka Letak Bersih' : 'Clean Layouts'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { num: 'Slaid 1', name: language === 'bm' ? 'Tajuk Pembelajaran & Pengenalan' : 'Topic Hook & Teacher Info', type: 'Title' },
                      { num: 'Slaid 2', name: language === 'bm' ? 'Objektif (OP) & Kriteria Kejayaan (KK)' : 'Learning Objectives & Success Criteria', type: 'Intentions' },
                      { num: 'Slaid 3', name: language === 'bm' ? 'Pembangunan Konsep (3 Kad Modular)' : 'Concept Breakdown (3 Modular Cards)', type: 'Content' },
                      { num: 'Slaid 4', name: language === 'bm' ? 'Aktiviti Fikir-Pasang-Kongsi (PAK-21)' : 'Think-Pair-Share Collaborative Activity', type: 'Activity' },
                      { num: 'Slaid 5', name: language === 'bm' ? 'Tiket Keluar Pentaksiran Bilik Darjah' : 'Formative Exit Ticket Assessment', type: 'Assessment' },
                      { num: 'Slaid 6', name: language === 'bm' ? 'Penutup & Dorongan Inkuiri Murid' : 'Summary, Reflection & Next Steps', type: 'Closing' },
                    ].map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                            {s.num}
                          </span>
                          <span className="font-semibold text-slate-800">{s.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{s.type}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-2">
                    {language === 'bm'
                      ? 'Fail PowerPoint (.pptx) asli yang boleh diedit di Microsoft PowerPoint, Google Slides atau Canva.'
                      : 'Native PowerPoint (.pptx) file directly editable in PowerPoint, Google Slides or Canva.'}
                  </p>
                </div>
              )}

              {/* Resource 5: STEM / PBL Assessment Rubric Preview */}
              {previewResource.id === 'rubrik-projek-kumpulan-stem' && (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                      {language === 'bm'
                        ? 'Matriks Penilaian 4 Fasa Projek STEM (TP1 - TP6)'
                        : '4-Phase STEM Project Rubric Matrix (TP1 - TP6)'}
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% {language === 'bm' ? 'Pemarkahan Wajaran' : 'Weighted Scoring'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {STEM_PBL_DATA.phases.map((phase) => (
                      <div key={phase.phase} className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-emerald-900">
                            {phase.phase}: {phase.name[language]}
                          </span>
                          <span className="font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            {phase.weight}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          {phase.criteria[0].name[language]} ({phase.criteria[0].tpLevel})
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-2">
                    {language === 'bm'
                      ? 'Disediakan dalam format Word (.docx) boleh ubah suai dan format PDF sedia dicetak.'
                      : 'Available in fully editable Word (.docx) and print-ready PDF.'}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer with 44px touch-target Dual Download Buttons */}
            <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setPreviewResource(null)}
                className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-full cursor-pointer transition-colors"
              >
                {t.closeModal}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Secondary Format Download (if applicable) */}
                {previewResource.format === 'DOCX' ? (
                  <button
                    onClick={() => handleDownload(previewResource, 'pdf')}
                    disabled={downloadingId !== null}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-full transition-colors cursor-pointer shadow-xs active:scale-95 disabled:bg-slate-200"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>{t.downloadPdfBtn}</span>
                  </button>
                ) : previewResource.format === 'PPTX' ? (
                  <button
                    onClick={() => handleDownload(previewResource, 'pdf')}
                    disabled={downloadingId !== null}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-full transition-colors cursor-pointer shadow-xs active:scale-95 disabled:bg-slate-200"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>{t.downloadPdfBtn}</span>
                  </button>
                ) : previewResource.id === 'worksheet-science-inquiry' ? (
                  <button
                    onClick={() => handleDownload(previewResource, 'docx')}
                    disabled={downloadingId !== null}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-full transition-colors cursor-pointer shadow-xs active:scale-95 disabled:bg-slate-200"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>{t.downloadDocBtn}</span>
                  </button>
                ) : null}

                {/* Primary Format Download */}
                <button
                  onClick={() => handleDownload(previewResource)}
                  disabled={downloadingId !== null}
                  className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] text-xs font-bold text-white rounded-full transition-all cursor-pointer shadow-xs active:scale-95 disabled:bg-slate-400 ${
                    previewResource.format === 'PPTX'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-[#0099ff] hover:bg-[#0088ee]'
                  }`}
                >
                  {downloadingId ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'bm' ? 'Menjana Fail...' : 'Exporting...'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>
                        {previewResource.format === 'DOCX'
                          ? t.downloadDocBtn
                          : previewResource.format === 'PPTX'
                          ? t.downloadPptxBtn
                          : t.downloadPdfBtn}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
