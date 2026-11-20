import {
  Language,
  RecentActivityItem,
  Tutorial,
  TutorialPosition,
  TutorialTabKey,
  UserProgress,
} from '../types';
import { ComputedTutorialProgress, computeTutorialProgress } from './tutorialProgress';

export const TUTORIAL_TAB_LABELS: Record<TutorialTabKey, { bm: string; en: string }> = {
  understand: { bm: 'Fahami', en: 'Understand' },
  watch: { bm: 'Tonton', en: 'Watch' },
  steps: { bm: 'Langkah', en: 'Steps' },
  tryIt: { bm: 'Cuba Sendiri', en: 'Try It' },
  quiz: { bm: 'Kuiz', en: 'Quiz' },
};

export interface OverallLearningSummary {
  totalTutorials: number;
  completedTutorials: Tutorial[];
  completedCount: number;
  inProgressTutorials: Tutorial[];
  inProgressCount: number;
  notStartedCount: number;
  savedTutorials: Tutorial[];
  savedCount: number;
  overallCompletionPercentage: number;
  totalMinutesSpent: number;
  attemptedQuizCount: number;
  averageQuizScore: number | null;
}

/**
 * Single shared calculation for My Learning and Home Dashboard Learning Overview.
 * Uses only persisted tutorial completion, milestone, bookmark, and quiz records.
 */
export function computeOverallLearningSummary(
  tutorials: Tutorial[],
  progress: UserProgress
): OverallLearningSummary {
  const totalTutorials = tutorials.length;
  const completedTutorials = tutorials.filter((tut) =>
    progress.completedTutorialIds.includes(tut.id)
  );
  const completedCount = completedTutorials.length;

  const inProgressTutorials = tutorials.filter((tut) => {
    const computed = computeTutorialProgress(tut, progress);
    return computed.status === 'in-progress';
  });
  const inProgressCount = inProgressTutorials.length;
  const notStartedCount = Math.max(0, totalTutorials - completedCount - inProgressCount);

  const savedTutorials = tutorials.filter((tut) =>
    progress.savedTutorialIds.includes(tut.id)
  );
  const savedCount = savedTutorials.length;

  const overallCompletionPercentage =
    totalTutorials > 0 ? Math.round((completedCount / totalTutorials) * 100) : 0;

  const totalMinutesSpent = completedTutorials.reduce(
    (acc, curr) => acc + curr.estimatedMinutes,
    0
  );

  const validTutorialIds = new Set(tutorials.map((t) => t.id));
  const quizEntries = Object.entries(progress.quizScores || {})
    .filter(([tutId]) => validTutorialIds.has(tutId))
    .map(([, entry]) => entry);

  const attemptedQuizCount = quizEntries.length;
  let averageQuizScore: number | null = null;
  if (attemptedQuizCount > 0) {
    const totalPct = quizEntries.reduce(
      (acc, q) => acc + (q.score / (q.total || 1)) * 100,
      0
    );
    averageQuizScore = Math.round(totalPct / attemptedQuizCount);
  }

  return {
    totalTutorials,
    completedTutorials,
    completedCount,
    inProgressTutorials,
    inProgressCount,
    notStartedCount,
    savedTutorials,
    savedCount,
    overallCompletionPercentage,
    totalMinutesSpent,
    attemptedQuizCount,
    averageQuizScore,
  };
}

export function formatDisplayGreeting(
  language: Language,
  teacherDisplayName?: string
): string {
  const raw = teacherDisplayName?.trim();
  if (!raw) {
    return language === 'bm' ? 'Selamat kembali, Cikgu!' : 'Welcome back, Teacher!';
  }

  if (language === 'bm') {
    const hasTitle = /^cikgu\b/i.test(raw);
    return hasTitle ? `Selamat kembali, ${raw}!` : `Selamat kembali, Cikgu ${raw}!`;
  }

  const hasTitle = /^teacher\b/i.test(raw);
  return hasTitle ? `Welcome back, ${raw}!` : `Welcome back, Teacher ${raw}!`;
}

export function formatRelativeTimestamp(timestamp: number, language: Language): string {
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return '';
  }

  const diffMs = Math.max(0, Date.now() - timestamp);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return language === 'bm' ? 'Baru sahaja' : 'Just now';
  }
  if (diffMins < 60) {
    return language === 'bm' ? `${diffMins} minit lalu` : `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return language === 'bm' ? `${diffHours} jam lalu` : `${diffHours}h ago`;
  }
  if (diffDays === 1) {
    return language === 'bm' ? 'Semalam' : 'Yesterday';
  }
  if (diffDays < 7) {
    return language === 'bm' ? `${diffDays} hari lalu` : `${diffDays}d ago`;
  }

  return new Intl.DateTimeFormat(language === 'bm' ? 'ms-MY' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp));
}

export function formatTutorialPositionLabel(
  tutorial: Tutorial,
  position: TutorialPosition | undefined,
  language: Language
): string | null {
  if (!position) return null;
  if (position.tab === 'steps') {
    const stepNum = Math.min(
      Math.max(1, position.stepIndex + 1),
      Math.max(1, tutorial.steps.length)
    );
    return `${TUTORIAL_TAB_LABELS.steps[language]} ${stepNum}/${Math.max(1, tutorial.steps.length)}`;
  }
  return TUTORIAL_TAB_LABELS[position.tab]?.[language] ?? null;
}

export type ContinueDestination =
  | {
      kind: 'tutorial';
      tutorial: Tutorial;
      source: 'recent-unfinished' | 'last-opened-unfinished' | 'recommended';
      tutProgress: ComputedTutorialProgress;
      savedPosition?: TutorialPosition;
      lastAccessedAt?: number;
      latestNonTutorialActivity?: RecentActivityItem;
    }
  | {
      kind: 'activity';
      activity: RecentActivityItem;
      targetTab: string;
      isTool: boolean;
      recommendedTutorial: Tutorial | null;
    };

export function resolveContinueDestination(params: {
  tutorials: Tutorial[];
  progress: UserProgress;
  recentActivities: RecentActivityItem[];
}): ContinueDestination | null {
  const { tutorials, progress, recentActivities } = params;
  if (tutorials.length === 0) return null;

  const completedSet = new Set(progress.completedTutorialIds);
  const latestActivity = recentActivities[0];
  const latestNonTutorialActivity =
    latestActivity && latestActivity.type !== 'tutorial' ? latestActivity : undefined;

  // 1. Prioritise the most recent unfinished tutorial from recent activity
  for (const activity of recentActivities) {
    if (activity.type !== 'tutorial') continue;
    const tut = tutorials.find((t) => t.id === activity.id);
    if (!tut || completedSet.has(tut.id)) continue;

    return {
      kind: 'tutorial',
      tutorial: tut,
      source: 'recent-unfinished',
      tutProgress: computeTutorialProgress(tut, progress),
      savedPosition: progress.tutorialPositions?.[tut.id],
      lastAccessedAt:
        progress.tutorialPositions?.[tut.id]?.updatedAt ?? activity.timestamp,
      latestNonTutorialActivity,
    };
  }

  // 2. Fallback to unfinished lastOpenedTutorialId if not in recentActivities
  if (progress.lastOpenedTutorialId) {
    const lastTut = tutorials.find((t) => t.id === progress.lastOpenedTutorialId);
    if (lastTut && !completedSet.has(lastTut.id)) {
      return {
        kind: 'tutorial',
        tutorial: lastTut,
        source: 'last-opened-unfinished',
        tutProgress: computeTutorialProgress(lastTut, progress),
        savedPosition: progress.tutorialPositions?.[lastTut.id],
        lastAccessedAt: progress.tutorialPositions?.[lastTut.id]?.updatedAt,
        latestNonTutorialActivity,
      };
    }
  }

  // Recommended next tutorial helper (matches competency level -> bookmarked -> any unfinished -> first review)
  const recommendedTutorial =
    tutorials.find((t) => t.level === progress.competencyLevel && !completedSet.has(t.id)) ??
    tutorials.find((t) => progress.savedTutorialIds.includes(t.id) && !completedSet.has(t.id)) ??
    tutorials.find((t) => !completedSet.has(t.id)) ??
    tutorials[0];

  // 3. If latest activity is a digital tool or workspace module (and no unfinished recent tutorial exists)
  if (latestActivity && latestActivity.type !== 'tutorial') {
    const isTool = latestActivity.type === 'tool';
    return {
      kind: 'activity',
      activity: latestActivity,
      targetTab: isTool ? 'tools' : latestActivity.id,
      isTool,
      recommendedTutorial,
    };
  }

  // 4. Fallback to recommended tutorial
  return {
    kind: 'tutorial',
    tutorial: recommendedTutorial,
    source: 'recommended',
    tutProgress: computeTutorialProgress(recommendedTutorial, progress),
    savedPosition: progress.tutorialPositions?.[recommendedTutorial.id],
    lastAccessedAt: progress.tutorialPositions?.[recommendedTutorial.id]?.updatedAt,
  };
}
