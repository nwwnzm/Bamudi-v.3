import React, { useState } from 'react';
import { UserProgress, Tutorial, Language, RecentActivityItem } from '../../types';
import { translations } from '../../data/translations';
import { BamuMascot } from '../brand/BamuMascot';
import { EmptyState } from '../common/EmptyState';
import { RecentActivitySection } from '../common/RecentActivitySection';
import { computeOverallLearningSummary } from '../../utils/learningSummary';
import {
  CheckCircle2,
  Bookmark,
  Award,
  Clock,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

interface Props {
  progress: UserProgress;
  tutorials: Tutorial[];
  language: Language;
  onSelectTutorial: (tutorial: Tutorial) => void;
  onResetProgress: () => void;
  onNavigateToLibrary: () => void;
  recentActivities?: RecentActivityItem[];
  onSelectTab?: (tabId: string) => void;
}

export const MyLearningView: React.FC<Props> = ({
  progress,
  tutorials,
  language,
  onSelectTutorial,
  onResetProgress,
  onNavigateToLibrary,
  recentActivities = [],
  onSelectTab,
}) => {
  const t = translations[language].myLearning;
  const savedItemsT = translations[language].savedItems;
  const common = translations[language].common;
  const categories = translations[language].categories;

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    completedTutorials,
    savedTutorials,
    totalMinutesSpent,
    attemptedQuizCount,
    averageQuizScore,
  } = computeOverallLearningSummary(tutorials, progress);

  // Categories progress
  const categoryKeys: (keyof typeof categories)[] = [
    'getting-started',
    'teaching-tools',
    'ai-teachers',
    'interactive',
  ];

  const categoryStats = categoryKeys.map((catKey) => {
    const inCat = tutorials.filter((t) => t.category === catKey);
    const completedInCat = inCat.filter((t) =>
      progress.completedTutorialIds.includes(t.id)
    );
    const percentage = inCat.length > 0 ? Math.round((completedInCat.length / inCat.length) * 100) : 0;
    return {
      key: catKey,
      label: categories[catKey],
      completed: completedInCat.length,
      total: inCat.length,
      percentage,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header with Bamu Companion Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <BamuMascot
            mood={completedTutorials.length > 0 ? 'celebrating' : 'waving'}
            size="md"
            className="shrink-0 mt-1"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-1">
              {t.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
              {completedTutorials.length > 0
                ? language === 'bm'
                  ? `Syabas Cikgu! Anda telah menyelesaikan ${completedTutorials.length} modul. Teruskan momentum pembelajaran digital anda.`
                  : `Well done! You have completed ${completedTutorials.length} modules. Keep advancing your digital teaching journey.`
                : language === 'bm'
                ? 'Selamat datang ke papan kemajuan peribadi anda. Mulakan modul pertama untuk melihat statistik pembelajaran.'
                : 'Welcome to your personal learning dashboard. Start your first module to track your milestones.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors cursor-pointer border border-rose-200 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetData}</span>
        </button>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
              {t.resetData}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
              {t.resetConfirm}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-full cursor-pointer"
              >
                {common.close}
              </button>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-full transition-colors cursor-pointer shadow-xs"
              >
                {language === 'bm' ? 'Sahkan Padam' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Completed */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#0099ff]" />
            <span className="font-semibold">{t.stats.completed}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            {completedTutorials.length}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">
              / {tutorials.length}
            </span>
          </div>
        </div>

        {/* Saved */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Bookmark className="w-4 h-4 text-[#0099ff]" />
            <span className="font-semibold">{t.stats.saved}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            {savedTutorials.length}
          </div>
        </div>

        {/* Average Quiz */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Award className="w-4 h-4 text-[#0099ff]" />
            <span className="font-semibold">{t.stats.averageQuiz}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            {attemptedQuizCount > 0 && averageQuizScore !== null ? `${averageQuizScore}%` : 'N/A'}
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Clock className="w-4 h-4 text-sky-600" />
            <span className="font-semibold">{t.stats.estimatedMinutes}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
            {totalMinutesSpent}{' '}
            <span className="text-xs text-slate-400 font-sans font-normal">
              {common.minute}
            </span>
          </div>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs mb-10">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 font-display">
          {t.myProgressByCat}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categoryStats.map((cat) => (
            <div key={cat.key} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-800">{cat.label}</span>
                <span className="font-mono tabular-nums text-slate-500 font-bold">
                  {cat.completed} / {cat.total} ({cat.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#0099ff] via-[#00ccff] to-[#cc310e] h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity with Real Learning Progress */}
      <div className="mb-10">
        <RecentActivitySection
          activities={recentActivities}
          tutorials={tutorials}
          progress={progress}
          language={language}
          onSelectTutorial={onSelectTutorial}
          onSelectTab={onSelectTab}
          maxItems={8}
          headingId="mylearning-recent-activity-heading"
        />
      </div>

      {/* Two Column Grid: Saved Tutorials & Completed Tutorials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Tutorials */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#0099ff]" aria-hidden="true" />
                {t.savedListTitle}
              </h2>

              {onSelectTab && (
                <button
                  type="button"
                  onClick={() => onSelectTab('saved-items')}
                  aria-label={savedItemsT.shortcuts.viewAllSavedAria}
                  className="min-h-[44px] px-3.5 py-2 rounded-full text-xs font-bold text-[#0055aa] hover:text-[#003d82] bg-sky-50 hover:bg-sky-100 border border-sky-200/80 inline-flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2 shrink-0"
                >
                  <span>{savedItemsT.actions.viewAllSaved}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </button>
              )}
            </div>

            {savedTutorials.length === 0 ? (
              <EmptyState
                variant="compact"
                mascotMood="encouraging"
                mascotSize="md"
                headingLevel="h3"
                title={
                  language === 'bm'
                    ? 'Belum ada tutorial disimpan'
                    : 'No bookmarked tutorials yet'
                }
                description={
                  language === 'bm'
                    ? 'Klik ikon penanda buku pada mana-mana tutorial untuk menyimpan rujukan pantas persediaan mengajar anda.'
                    : 'Click the bookmark icon on any tutorial for quick access during your lesson preparation.'
                }
                primaryAction={{
                  label: language === 'bm' ? 'Terokai Perpustakaan' : 'Browse Library',
                  onClick: onNavigateToLibrary,
                  variant: 'neutral',
                }}
              />
            ) : (
              <div className="space-y-3">
                {savedTutorials.map((tut) => (
                  <div
                    key={tut.id}
                    onClick={() => onSelectTutorial(tut)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-[#0099ff] transition-all cursor-pointer flex items-center justify-between group hover:bg-sky-50/40"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-sky-950 truncate font-display">
                        {tut.title[language]}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                        {tut.toolBadge} · {tut.estimatedMinutes} {common.minute}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0099ff] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Completed Tutorials */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 font-display flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0099ff]" />
              {t.completedListTitle}
            </h2>

            {completedTutorials.length === 0 ? (
              <EmptyState
                variant="compact"
                mascotMood="encouraging"
                mascotSize="md"
                headingLevel="h3"
                title={
                  language === 'bm'
                    ? 'Belum ada modul selesai'
                    : 'No modules completed yet'
                }
                description={
                  language === 'bm'
                    ? 'Mulakan langkah pertama transformasi bilik darjah anda dengan memilih mana-mana panduan dan mencuba kuiz ringkas.'
                    : 'Take your first step in digital teaching by exploring any guide and testing your skills with a short quiz.'
                }
                primaryAction={{
                  label: language === 'bm' ? 'Mula Belajar Sekarang' : 'Start Learning Now',
                  onClick: onNavigateToLibrary,
                  variant: 'primary',
                }}
              />
            ) : (
              <div className="space-y-3">
                {completedTutorials.map((tut) => {
                  const score = progress.quizScores[tut.id];
                  return (
                    <div
                      key={tut.id}
                      onClick={() => onSelectTutorial(tut)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-[#0099ff] transition-all cursor-pointer flex items-center justify-between group hover:bg-sky-50/40"
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-sky-950 truncate font-display">
                          {tut.title[language]}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{tut.toolBadge}</span>
                          {score && (
                            <>
                              <span>·</span>
                              <span className="text-[#0099ff] font-mono font-bold">
                                {language === 'bm' ? 'Skor:' : 'Score:'} {score.score}/{score.total}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#0099ff] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {common.viewTutorial} →
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
