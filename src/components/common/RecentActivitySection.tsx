import React from 'react';
import {
  Language,
  RecentActivityItem,
  Tutorial,
  UserProgress,
} from '../../types';
import { computeTutorialProgress } from '../../utils/tutorialProgress';
import {
  formatRelativeTimestamp,
  formatTutorialPositionLabel,
} from '../../utils/learningSummary';
import {
  History,
  BookOpen,
  Layers,
  Wrench,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface RecentActivitySectionProps {
  activities: RecentActivityItem[];
  tutorials: Tutorial[];
  progress: UserProgress;
  language: Language;
  onSelectTutorial: (tutorial: Tutorial) => void;
  onSelectTab?: (tabId: string) => void;
  maxItems?: number;
  headingId?: string;
}

function resolveActivityLabel(
  label: RecentActivityItem['label'],
  language: Language,
  fallback: string
): string {
  if (!label) return fallback;
  if (typeof label === 'string') return label;
  return label[language] || label.en || label.bm || fallback;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  activities,
  tutorials,
  progress,
  language,
  onSelectTutorial,
  onSelectTab,
  maxItems = 5,
  headingId = 'recent-activity-heading',
}) => {
  const visibleActivities = activities.slice(0, maxItems);

  return (
    <section
      aria-labelledby={headingId}
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
              id={headingId}
              className="font-display text-lg sm:text-xl font-extrabold text-[#0a2540]"
            >
              {language === 'bm' ? 'Aktiviti Terkini' : 'Recent Activity'}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'bm'
                ? 'Sambung semula tutorial, modul atau alatan yang baru anda buka.'
                : 'Quickly return to tutorials, modules and tools you visited recently.'}
            </p>
          </div>
        </div>
      </div>

      {visibleActivities.length === 0 ? (
        <div className="rounded-2xl border border-sky-100 bg-[#f7fbff] px-4 py-4 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
          <span>
            {language === 'bm'
              ? 'Tiada aktiviti terkini lagi. Buka mana-mana tutorial atau modul untuk mula menjejak sejarah kerja anda.'
              : 'No recent activity yet. Open any tutorial, tool or module to see it tracked here.'}
          </span>
          {onSelectTab && (
            <button
              type="button"
              onClick={() => onSelectTab('library')}
              className="min-h-[44px] px-4 py-2 rounded-full bg-[#0066dd] hover:bg-[#0055b3] text-white font-bold text-xs shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
            >
              {language === 'bm' ? 'Buka Perpustakaan' : 'Browse Library'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {visibleActivities.map((item) => {
            const timeLabel = formatRelativeTimestamp(item.timestamp, language);

            if (item.type === 'tutorial') {
              const tutorial = tutorials.find((t) => t.id === item.id);
              if (!tutorial) return null;

              const tutProg = computeTutorialProgress(tutorial, progress);
              const savedScore = progress.quizScores[tutorial.id];
              const savedPos = progress.tutorialPositions?.[tutorial.id];
              const isCompleted = tutProg.status === 'completed';

              const statusText = isCompleted
                ? language === 'bm'
                  ? 'Selesai'
                  : 'Completed'
                : tutProg.status === 'in-progress'
                ? language === 'bm'
                  ? 'Sedang Belajar'
                  : 'In Progress'
                : language === 'bm'
                ? 'Belum Mula'
                : 'Not Started';

              const positionText = !isCompleted
                ? formatTutorialPositionLabel(tutorial, savedPos, language)
                : null;

              return (
                <button
                  key={`${item.type}:${item.id}`}
                  type="button"
                  onClick={() => onSelectTutorial(tutorial)}
                  className="w-full min-h-[44px] text-left rounded-2xl border border-slate-200/90 hover:border-[#0099ff] bg-[#fdfdfe] hover:bg-[#f5faff] p-3.5 sm:p-4 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          isCompleted
                            ? 'bg-sky-100 border-sky-200 text-[#0066cc]'
                            : 'bg-[#e6f5ff] border-[#bae6fd] text-[#0077dd]'
                        }`}
                        aria-hidden="true"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <BookOpen className="w-4 h-4" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <span className="font-display text-sm font-extrabold text-[#0a2540] group-hover:text-[#0055b3] truncate">
                            {tutorial.title[language]}
                          </span>
                          <span
                            className={`text-xs font-extrabold tabular-nums shrink-0 ${
                              isCompleted ? 'text-[#0066cc]' : 'text-[#0077dd]'
                            }`}
                          >
                            {statusText} · {tutProg.percentage}%
                          </span>
                        </div>

                        {/* Unboxed progress metadata line */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600 mt-1">
                          <span className="font-semibold text-slate-700">
                            {tutProg.completedStepsCount}/{tutProg.totalStepsCount}{' '}
                            {language === 'bm' ? 'langkah' : 'steps'}
                          </span>

                          {savedScore && (
                            <>
                              <span aria-hidden="true" className="text-slate-300">
                                ·
                              </span>
                              <span className="font-mono font-bold text-[#0066cc]">
                                {language === 'bm' ? 'Kuiz:' : 'Quiz:'}{' '}
                                {savedScore.score}/{savedScore.total}
                              </span>
                            </>
                          )}

                          {positionText && (
                            <>
                              <span aria-hidden="true" className="text-slate-300">
                                ·
                              </span>
                              <span className="text-slate-500">
                                {language === 'bm' ? 'Terakhir:' : 'Last at:'} {positionText}
                              </span>
                            </>
                          )}

                          {timeLabel && (
                            <>
                              <span aria-hidden="true" className="text-slate-300">
                                ·
                              </span>
                              <span className="text-slate-500">{timeLabel}</span>
                            </>
                          )}
                        </div>

                        {/* Compact progress bar */}
                        <div
                          className="mt-2.5 w-full h-2 bg-sky-100 rounded-full overflow-hidden"
                          role="progressbar"
                          aria-valuenow={tutProg.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${tutorial.title[language]}: ${tutProg.percentage}%`}
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted
                                ? 'bg-[#0066dd]'
                                : 'bg-gradient-to-r from-[#0099ff] to-[#38bdf8]'
                            }`}
                            style={{ width: `${tutProg.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <ArrowRight
                      className="w-4 h-4 text-slate-400 group-hover:text-[#0066dd] group-hover:translate-x-0.5 transition-all shrink-0 mt-2"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              );
            }

            // Non-tutorial entries: module or tool (no misleading tutorial progress indicators)
            const isTool = item.type === 'tool';
            const Icon = isTool ? Wrench : Layers;
            const fallbackName = item.id;
            const title = resolveActivityLabel(item.label, language, fallbackName);
            const typeText = isTool
              ? language === 'bm'
                ? 'Alatan Digital · Pautan Sumber Luar'
                : 'Digital Tool · External Resource'
              : language === 'bm'
              ? 'Modul Ruang Kerja BaMuDi'
              : 'BaMuDi Workspace Module';

            return (
              <button
                key={`${item.type}:${item.id}`}
                type="button"
                onClick={() => onSelectTab?.(isTool ? 'tools' : item.id)}
                className="w-full min-h-[44px] text-left rounded-2xl border border-slate-200/90 hover:border-[#0099ff] bg-[#fdfdfe] hover:bg-[#f5faff] px-3.5 py-3 transition-all cursor-pointer group flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isTool
                        ? 'bg-[#fdf2f0] border-[#cc310e]/25 text-[#99240b]'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <span className="font-display text-sm font-bold text-[#0a2540] group-hover:text-[#0055b3] block truncate">
                      {title}
                    </span>
                    <span className="text-xs text-slate-500 block truncate">
                      {timeLabel ? `${typeText} · ${timeLabel}` : typeText}
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
      )}
    </section>
  );
};
