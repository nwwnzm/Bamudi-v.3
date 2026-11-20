import { Tutorial, TutorialTabKey, UserProgress } from '../types';

export interface ComputedTutorialProgress {
  percentage: number;
  completedUnits: number;
  totalUnits: number;
  completedStepsCount: number;
  totalStepsCount: number;
  status: 'completed' | 'in-progress' | 'not-started';
}

const NON_STEP_TABS: TutorialTabKey[] = ['understand', 'watch', 'tryIt'];

/**
 * Computes real tutorial learning progress from saved UserProgress data:
 * - Completed tutorials always report 100% ('completed').
 * - In-progress tutorials calculate progress from unique covered tabs
 *   (understand, watch, tryIt), unique covered steps, and quiz completion,
 *   never simply from the last visited step index.
 */
export function computeTutorialProgress(
  tutorial: Tutorial,
  progress: UserProgress
): ComputedTutorialProgress {
  const totalStepsCount = tutorial.steps.length;
  // Total learning milestones: understand + watch + tryIt (3) + steps (N) + quiz (1)
  const totalUnits = NON_STEP_TABS.length + totalStepsCount + 1;

  const isCompleted = progress.completedTutorialIds.includes(tutorial.id);
  if (isCompleted) {
    return {
      percentage: 100,
      completedUnits: totalUnits,
      totalUnits,
      completedStepsCount: totalStepsCount,
      totalStepsCount,
      status: 'completed',
    };
  }

  const milestone = progress.tutorialProgress?.[tutorial.id];
  const savedPos = progress.tutorialPositions?.[tutorial.id];
  const hasQuizScore = Boolean(progress.quizScores?.[tutorial.id]);

  const visitedTabSet = new Set<TutorialTabKey>(milestone?.visitedTabs || []);
  // Legacy fallback if position exists from before milestone tracking:
  // only mark 'understand' (entry) and non-step tab if directly saved there, never fabricate step completion.
  if (!milestone && savedPos) {
    visitedTabSet.add('understand');
    if (NON_STEP_TABS.includes(savedPos.tab)) {
      visitedTabSet.add(savedPos.tab);
    }
  }

  let completedTabsCount = 0;
  for (const tab of NON_STEP_TABS) {
    if (visitedTabSet.has(tab)) {
      completedTabsCount += 1;
    }
  }

  const validStepIndices = new Set<number>();
  if (milestone?.completedSteps) {
    for (const idx of milestone.completedSteps) {
      if (Number.isInteger(idx) && idx >= 0 && idx < totalStepsCount) {
        validStepIndices.add(idx);
      }
    }
  }
  const completedStepsCount = validStepIndices.size;
  const quizUnit = hasQuizScore || milestone?.quizCompleted ? 1 : 0;

  const completedUnits = completedTabsCount + completedStepsCount + quizUnit;
  const hasAnyActivity =
    completedUnits > 0 || Boolean(savedPos) || visitedTabSet.has('steps') || visitedTabSet.has('quiz');

  if (!hasAnyActivity) {
    return {
      percentage: 0,
      completedUnits: 0,
      totalUnits,
      completedStepsCount: 0,
      totalStepsCount,
      status: 'not-started',
    };
  }

  const rawPercentage = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
  // An incomplete tutorial must remain below 100% until completed
  const percentage = Math.min(95, Math.max(10, rawPercentage));

  return {
    percentage,
    completedUnits,
    totalUnits,
    completedStepsCount,
    totalStepsCount,
    status: 'in-progress',
  };
}
