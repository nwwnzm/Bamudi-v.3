import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  ClipboardCheck,
  ArrowRight,
  Calendar,
  Users,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import { Language } from '../../types';
import {
  loadSavedRphSummary,
  loadSavedPbdSummary,
  RphWorkspaceSummary,
  PbdWorkspaceSummary,
} from '../../utils/workspaceRecords';
import { formatRelativeTimestamp } from '../../utils/learningSummary';

interface Props {
  language: Language;
  onSelectTab: (tabId: string) => void;
}

export const MyTeachingWorkspaceSection: React.FC<Props> = ({ language, onSelectTab }) => {
  const [rphSummary, setRphSummary] = useState<RphWorkspaceSummary>(() => loadSavedRphSummary());
  const [pbdSummary, setPbdSummary] = useState<PbdWorkspaceSummary>(() => loadSavedPbdSummary());

  // Refresh workspace summaries on mount or tab focus so changes from RPH/PBD tabs stay current
  useEffect(() => {
    const refresh = () => {
      setRphSummary(loadSavedRphSummary());
      setPbdSummary(loadSavedPbdSummary());
    };
    refresh();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const formatDateString = (timestamp?: number) => {
    if (!timestamp || !Number.isFinite(timestamp)) return '';
    return new Intl.DateTimeFormat(language === 'bm' ? 'ms-MY' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(timestamp));
  };

  return (
    <section
      aria-labelledby="my-teaching-workspace-heading"
      className="bg-white rounded-3xl border border-[#ccebff] p-5 sm:p-6 shadow-[0_8px_28px_-6px_rgba(0,153,255,0.08)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-xl bg-[#e5f9ef] border border-[#9ce2be] flex items-center justify-center text-[#0b6e41] shadow-2xs shrink-0"
            aria-hidden="true"
          >
            <FolderOpen className="w-4 h-4" />
          </span>
          <div>
            <h2
              id="my-teaching-workspace-heading"
              className="font-display text-lg sm:text-xl font-extrabold text-[#0a2540]"
            >
              {language === 'bm' ? 'Ruang Kerja Pengajaran Saya' : 'My Teaching Workspace'}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'bm'
                ? 'Ringkasan RPH tersimpan dan rekod kelas PBD daripada kerja sebenar anda.'
                : 'Summary of your saved RPH lesson plans and PBD class records.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RPH Summary Card */}
        <article className="rounded-2xl border border-slate-200/90 bg-[#fdfdfe] p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-9 h-9 rounded-xl bg-[#fff4cc] border border-[#ffe07d] text-[#b45309] flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0a2540] truncate">
                    {language === 'bm' ? 'Rancangan Pengajaran (RPH)' : 'Lesson Plans (RPH)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {rphSummary.count > 0
                      ? language === 'bm'
                        ? `${rphSummary.count} rekod RPH disimpan`
                        : `${rphSummary.count} saved RPH ${rphSummary.count === 1 ? 'record' : 'records'}`
                      : language === 'bm'
                      ? 'Arkib RPH tempatan'
                      : 'Local RPH archive'}
                  </p>
                </div>
              </div>

              {rphSummary.count > 0 && (
                <span className="font-mono text-sm font-extrabold text-[#0055b3] tabular-nums shrink-0">
                  {rphSummary.count}
                </span>
              )}
            </div>

            {rphSummary.loadError ? (
              <div
                role="alert"
                className="p-3 rounded-xl bg-[#fdf2f0] border border-[#cc310e]/30 text-xs text-[#99240b] flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-[#cc310e] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {language === 'bm'
                    ? 'Data arkib RPH tidak dapat dibaca daripada storan pelayar.'
                    : 'Saved RPH archive data could not be read from browser storage.'}
                </span>
              </div>
            ) : rphSummary.latest ? (
              <div className="rounded-xl bg-[#f7fbff] border border-sky-100 p-3.5 space-y-1.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0055b3]">
                  {language === 'bm' ? 'RPH Terkini Disimpan' : 'Most Recently Saved'}
                </p>
                <p className="font-display text-sm font-bold text-[#0a2540] line-clamp-1">
                  {rphSummary.latest.topic}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">{rphSummary.latest.subject}</span>
                  {rphSummary.latest.className && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{rphSummary.latest.className}</span>
                    </>
                  )}
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600">
                    <Calendar className="w-3 h-3 text-[#0077dd]" aria-hidden="true" />
                    <span>{rphSummary.latest.date}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-600 leading-relaxed">
                {language === 'bm'
                  ? 'Belum ada rekod RPH disimpan lagi. Bina RPH baharu dan klik Simpan ke Arkib untuk melihat ringkasannya di sini.'
                  : 'No RPH records saved yet. Build a lesson plan and save it to your archive to see it here.'}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('rph-generator')}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#f0f8ff] hover:bg-[#0066dd] text-[#0055b3] hover:text-white border border-[#b3e0ff] text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
          >
            <span>
              {rphSummary.count > 0
                ? language === 'bm'
                  ? 'Buka Arkib & Penjana RPH'
                  : 'Open RPH Archive & Generator'
                : language === 'bm'
                ? 'Bina RPH Pertama'
                : 'Create First RPH'}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </article>

        {/* PBD Summary Card */}
        <article className="rounded-2xl border border-slate-200/90 bg-[#fdfdfe] p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-9 h-9 rounded-xl bg-[#e0f2fe] border border-[#99d6ff] text-[#0055b3] flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <ClipboardCheck className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-sm sm:text-base font-extrabold text-[#0a2540] truncate">
                    {language === 'bm' ? 'Rekod Pentaksiran (PBD)' : 'Classroom Assessment (PBD)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {pbdSummary.status === 'saved'
                      ? language === 'bm'
                        ? '1 rekod kelas aktif'
                        : '1 active class record'
                      : language === 'bm'
                      ? 'Ruang rekod transit tunggal'
                      : 'Single-class transit workspace'}
                  </p>
                </div>
              </div>

              {pbdSummary.status === 'saved' && (
                <span className="font-mono text-sm font-extrabold text-[#0b6e41] tabular-nums shrink-0">
                  1
                </span>
              )}
            </div>

            {pbdSummary.status === 'error' ? (
              <div
                role="alert"
                className="p-3 rounded-xl bg-[#fdf2f0] border border-[#cc310e]/30 text-xs text-[#99240b] flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-[#cc310e] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {language === 'bm'
                    ? 'Rekod PBD tidak dapat dibaca daripada storan pelayar.'
                    : 'PBD class record could not be read from browser storage.'}
                </span>
              </div>
            ) : pbdSummary.status === 'saved' && pbdSummary.record ? (
              <div className="rounded-xl bg-[#f4fcf8] border border-[#b2e8cb] p-3.5 space-y-1.5">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0b6e41]">
                  {language === 'bm' ? 'Rekod Kelas Terkini' : 'Active Class Record'}
                </p>
                <p className="font-display text-sm font-bold text-[#0a2540] line-clamp-1">
                  {pbdSummary.record.className} · {pbdSummary.record.subject}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-[#0b6e41]" aria-hidden="true" />
                    <span>
                      {pbdSummary.studentCount} {language === 'bm' ? 'murid' : 'pupils'}
                    </span>
                  </span>
                  {pbdSummary.studentCount > 0 && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-mono font-bold text-[#0b6e41] tabular-nums">
                        TP3+: {pbdSummary.tp3PlusCount}/{pbdSummary.studentCount} ({pbdSummary.tp3PlusPercentage}%)
                      </span>
                    </>
                  )}
                  {pbdSummary.record.lastUpdated > 0 && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-500">
                        {formatRelativeTimestamp(pbdSummary.record.lastUpdated, language) ||
                          formatDateString(pbdSummary.record.lastUpdated)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ) : pbdSummary.status === 'sample-only' ? (
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-600 leading-relaxed">
                {language === 'bm'
                  ? 'Sistem PBD masih menggunakan data contoh asas. Buka Sistem PBD untuk mengemas kini nama kelas dan rekod murid anda sendiri.'
                  : 'PBD currently holds only the built-in starter sample. Open PBD System to customise your own class name and pupil records.'}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-600 leading-relaxed">
                {language === 'bm'
                  ? 'Belum ada rekod kelas PBD disimpan lagi. Buka Sistem PBD untuk menyediakan borang transit kelas anda.'
                  : 'No PBD class record saved yet. Open the PBD System to set up your classroom transit sheet.'}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('pbd-system')}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#f2fcf7] hover:bg-[#0b6e41] text-[#0b6e41] hover:text-white border border-[#9ce2be] text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12945a]"
          >
            <span>
              {pbdSummary.status === 'saved'
                ? language === 'bm'
                  ? 'Buka Sistem PBD'
                  : 'Open PBD System'
                : language === 'bm'
                ? 'Sediakan Rekod Kelas PBD'
                : 'Start PBD Class Record'}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </article>
      </div>
    </section>
  );
};
