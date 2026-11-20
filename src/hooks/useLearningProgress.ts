import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CompetencyLevel,
  LearningMode,
  TutorialMilestoneProgress,
  TutorialPosition,
  TutorialTabKey,
  UserProgress,
} from '../types';

export const LEARNING_PROGRESS_STORAGE_KEY = 'bamudi_learning_progress_v1';

const VALID_TABS: TutorialTabKey[] = ['understand', 'watch', 'steps', 'tryIt', 'quiz'];

const DEFAULT_PROGRESS: UserProgress = {
  competencyLevel: 'beginner',
  learningMode: 'guided',
  completedTutorialIds: [],
  savedTutorialIds: [],
  quizScores: {},
  notes: {},
  lastOpenedTutorialId: null,
  tutorialPositions: {},
  tutorialProgress: {},
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isValidCompetency(value: unknown): value is CompetencyLevel {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced';
}

function isValidLearningMode(value: unknown): value is LearningMode {
  return value === 'guided' || value === 'self';
}

function sanitizeStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return Array.from(
    new Set(
      value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    )
  );
}

function sanitizeNotes(value: unknown): Record<string, string> {
  if (!isPlainObject(value)) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(value)) {
    if (typeof k === 'string' && typeof v === 'string') {
      result[k] = v;
    }
  }
  return result;
}

function sanitizeQuizScores(
  value: unknown,
  fallback: UserProgress['quizScores']
): UserProgress['quizScores'] {
  if (!isPlainObject(value)) return fallback;
  const result: UserProgress['quizScores'] = {};
  for (const [k, v] of Object.entries(value)) {
    if (
      isPlainObject(v) &&
      typeof v.score === 'number' &&
      typeof v.total === 'number' &&
      typeof v.timestamp === 'number'
    ) {
      result[k] = { score: v.score, total: v.total, timestamp: v.timestamp };
    }
  }
  return result;
}

function sanitizeTutorialPositions(value: unknown): Record<string, TutorialPosition> {
  if (!isPlainObject(value)) return {};
  const result: Record<string, TutorialPosition> = {};
  for (const [k, v] of Object.entries(value)) {
    if (
      isPlainObject(v) &&
      typeof v.tab === 'string' &&
      VALID_TABS.includes(v.tab as TutorialTabKey) &&
      typeof v.stepIndex === 'number' &&
      Number.isFinite(v.stepIndex)
    ) {
      result[k] = {
        tab: v.tab as TutorialTabKey,
        stepIndex: Math.max(0, Math.floor(v.stepIndex)),
        updatedAt:
          typeof v.updatedAt === 'number' && Number.isFinite(v.updatedAt)
            ? v.updatedAt
            : Date.now(),
      };
    }
  }
  return result;
}

function sanitizeTutorialProgress(value: unknown): Record<string, TutorialMilestoneProgress> {
  if (!isPlainObject(value)) return {};
  const result: Record<string, TutorialMilestoneProgress> = {};
  for (const [k, v] of Object.entries(value)) {
    if (!isPlainObject(v)) continue;
    const visitedTabs = Array.isArray(v.visitedTabs)
      ? Array.from(
          new Set(
            v.visitedTabs.filter(
              (tab): tab is TutorialTabKey =>
                typeof tab === 'string' && VALID_TABS.includes(tab as TutorialTabKey)
            )
          )
        )
      : [];
    const completedSteps = Array.isArray(v.completedSteps)
      ? Array.from(
          new Set(
            v.completedSteps
              .filter((idx): idx is number => typeof idx === 'number' && Number.isFinite(idx))
              .map((idx) => Math.max(0, Math.floor(idx)))
          )
        )
      : [];

    result[k] = {
      visitedTabs,
      completedSteps,
      quizCompleted: typeof v.quizCompleted === 'boolean' ? v.quizCompleted : undefined,
      updatedAt:
        typeof v.updatedAt === 'number' && Number.isFinite(v.updatedAt)
          ? v.updatedAt
          : Date.now(),
    };
  }
  return result;
}

function mergeMilestoneEntry(
  existing: TutorialMilestoneProgress | undefined,
  tab?: TutorialTabKey,
  stepIndex?: number,
  quizCompleted?: boolean
): TutorialMilestoneProgress {
  const visitedTabs = new Set<TutorialTabKey>(existing?.visitedTabs || []);
  if (tab && VALID_TABS.includes(tab)) {
    visitedTabs.add(tab);
  }
  const completedSteps = new Set<number>(existing?.completedSteps || []);
  if (typeof stepIndex === 'number' && Number.isFinite(stepIndex) && stepIndex >= 0) {
    completedSteps.add(Math.floor(stepIndex));
  }
  return {
    visitedTabs: Array.from(visitedTabs),
    completedSteps: Array.from(completedSteps).sort((a, b) => a - b),
    quizCompleted: quizCompleted ?? existing?.quizCompleted,
    updatedAt: Date.now(),
  };
}

export function loadLearningProgress(): { progress: UserProgress; hadExistingKey: boolean } {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { progress: { ...DEFAULT_PROGRESS }, hadExistingKey: false };
    }
    const stored = window.localStorage.getItem(LEARNING_PROGRESS_STORAGE_KEY);
    if (!stored) {
      return { progress: { ...DEFAULT_PROGRESS }, hadExistingKey: false };
    }
    const parsed: unknown = JSON.parse(stored);
    if (!isPlainObject(parsed)) {
      return { progress: { ...DEFAULT_PROGRESS }, hadExistingKey: true };
    }

    return {
      hadExistingKey: true,
      progress: {
        competencyLevel: isValidCompetency(parsed.competencyLevel)
          ? parsed.competencyLevel
          : DEFAULT_PROGRESS.competencyLevel,
        learningMode: isValidLearningMode(parsed.learningMode)
          ? parsed.learningMode
          : DEFAULT_PROGRESS.learningMode,
        completedTutorialIds: sanitizeStringArray(
          parsed.completedTutorialIds,
          DEFAULT_PROGRESS.completedTutorialIds
        ),
        savedTutorialIds: sanitizeStringArray(
          parsed.savedTutorialIds,
          DEFAULT_PROGRESS.savedTutorialIds
        ),
        quizScores: sanitizeQuizScores(parsed.quizScores, DEFAULT_PROGRESS.quizScores),
        notes: sanitizeNotes(parsed.notes),
        lastOpenedTutorialId:
          typeof parsed.lastOpenedTutorialId === 'string' &&
          parsed.lastOpenedTutorialId.trim().length > 0
            ? parsed.lastOpenedTutorialId
            : null,
        tutorialPositions: sanitizeTutorialPositions(parsed.tutorialPositions),
        tutorialProgress: sanitizeTutorialProgress(parsed.tutorialProgress),
      },
    };
  } catch {
    return { progress: { ...DEFAULT_PROGRESS }, hadExistingKey: true };
  }
}

export function saveLearningProgress(next: UserProgress): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(LEARNING_PROGRESS_STORAGE_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function useLearningProgress() {
  const [initialLoad] = useState(() => loadLearningProgress());
  const [progress, setProgress] = useState<UserProgress>(initialLoad.progress);
  const [storageError, setStorageError] = useState<string | null>(null);
  const lastWriteOkRef = useRef<boolean>(true);

  const commitProgressUpdate = useCallback(
    (updater: (prev: UserProgress) => UserProgress): boolean => {
      let writeOk = true;
      setProgress((prev) => {
        const next = updater(prev);
        if (next === prev) return prev;
        writeOk = saveLearningProgress(next);
        lastWriteOkRef.current = writeOk;
        return next;
      });
      return writeOk;
    },
    []
  );

  useEffect(() => {
    if (!initialLoad.hadExistingKey) {
      const ok = saveLearningProgress(initialLoad.progress);
      lastWriteOkRef.current = ok;
    }
  }, [initialLoad]);

  useEffect(() => {
    if (!lastWriteOkRef.current) {
      setStorageError('Unable to save learning progress to browser storage.');
    } else {
      setStorageError(null);
    }
  }, [progress]);

  const setCompetencyLevel = useCallback(
    (level: CompetencyLevel) => {
      commitProgressUpdate((prev) =>
        prev.competencyLevel === level ? prev : { ...prev, competencyLevel: level }
      );
    },
    [commitProgressUpdate]
  );

  const setLearningMode = useCallback(
    (mode: LearningMode) => {
      commitProgressUpdate((prev) =>
        prev.learningMode === mode ? prev : { ...prev, learningMode: mode }
      );
    },
    [commitProgressUpdate]
  );

  const toggleBookmark = useCallback(
    (tutorialId: string) => {
      commitProgressUpdate((prev) => {
        const exists = prev.savedTutorialIds.includes(tutorialId);
        return {
          ...prev,
          savedTutorialIds: exists
            ? prev.savedTutorialIds.filter((id) => id !== tutorialId)
            : [...prev.savedTutorialIds, tutorialId],
        };
      });
    },
    [commitProgressUpdate]
  );

  const toggleComplete = useCallback(
    (tutorialId: string) => {
      commitProgressUpdate((prev) => {
        const exists = prev.completedTutorialIds.includes(tutorialId);
        return {
          ...prev,
          completedTutorialIds: exists
            ? prev.completedTutorialIds.filter((id) => id !== tutorialId)
            : [...prev.completedTutorialIds, tutorialId],
        };
      });
    },
    [commitProgressUpdate]
  );

  const markComplete = useCallback(
    (tutorialId: string) => {
      commitProgressUpdate((prev) => {
        if (prev.completedTutorialIds.includes(tutorialId)) return prev;
        return {
          ...prev,
          completedTutorialIds: [...prev.completedTutorialIds, tutorialId],
        };
      });
    },
    [commitProgressUpdate]
  );

  const recordQuizScore = useCallback(
    (tutorialId: string, score: number, total: number) => {
      commitProgressUpdate((prev) => {
        const existingMilestone = prev.tutorialProgress?.[tutorialId];
        return {
          ...prev,
          completedTutorialIds: prev.completedTutorialIds.includes(tutorialId)
            ? prev.completedTutorialIds
            : [...prev.completedTutorialIds, tutorialId],
          quizScores: {
            ...prev.quizScores,
            [tutorialId]: { score, total, timestamp: Date.now() },
          },
          tutorialProgress: {
            ...(prev.tutorialProgress || {}),
            [tutorialId]: mergeMilestoneEntry(existingMilestone, 'quiz', undefined, true),
          },
        };
      });
    },
    [commitProgressUpdate]
  );

  const setLastOpenedTutorial = useCallback(
    (tutorialId: string) => {
      if (!tutorialId) return;
      commitProgressUpdate((prev) => {
        const existingPos = prev.tutorialPositions?.[tutorialId];
        const initialTab = existingPos?.tab || 'understand';
        const initialStep = initialTab === 'steps' ? existingPos?.stepIndex : undefined;
        const existingMilestone = prev.tutorialProgress?.[tutorialId];
        const nextMilestone = mergeMilestoneEntry(existingMilestone, initialTab, initialStep);

        const milestoneChanged =
          !existingMilestone ||
          nextMilestone.visitedTabs.length !== existingMilestone.visitedTabs.length ||
          nextMilestone.completedSteps.length !== existingMilestone.completedSteps.length;

        if (prev.lastOpenedTutorialId === tutorialId && !milestoneChanged) {
          return prev;
        }

        return {
          ...prev,
          lastOpenedTutorialId: tutorialId,
          tutorialProgress: {
            ...(prev.tutorialProgress || {}),
            [tutorialId]: nextMilestone,
          },
        };
      });
    },
    [commitProgressUpdate]
  );

  const updateTutorialPosition = useCallback(
    (tutorialId: string, tab: TutorialTabKey, stepIndex: number) => {
      if (!tutorialId) return;
      const safeStepIndex = Math.max(0, Math.floor(stepIndex));
      commitProgressUpdate((prev) => {
        const existingPos = prev.tutorialPositions?.[tutorialId];
        const existingMilestone = prev.tutorialProgress?.[tutorialId];
        const stepToRecord = tab === 'steps' ? safeStepIndex : undefined;
        const nextMilestone = mergeMilestoneEntry(existingMilestone, tab, stepToRecord);

        const posUnchanged =
          existingPos &&
          existingPos.tab === tab &&
          existingPos.stepIndex === safeStepIndex &&
          prev.lastOpenedTutorialId === tutorialId;

        const milestoneUnchanged =
          existingMilestone &&
          nextMilestone.visitedTabs.length === existingMilestone.visitedTabs.length &&
          nextMilestone.completedSteps.length === existingMilestone.completedSteps.length;

        if (posUnchanged && milestoneUnchanged) {
          return prev;
        }

        return {
          ...prev,
          lastOpenedTutorialId: tutorialId,
          tutorialPositions: {
            ...(prev.tutorialPositions || {}),
            [tutorialId]: {
              tab,
              stepIndex: safeStepIndex,
              updatedAt: Date.now(),
            },
          },
          tutorialProgress: {
            ...(prev.tutorialProgress || {}),
            [tutorialId]: nextMilestone,
          },
        };
      });
    },
    [commitProgressUpdate]
  );

  const updateTutorialNote = useCallback(
    (tutorialId: string, noteText: string): boolean => {
      if (!tutorialId) return false;
      const ok = commitProgressUpdate((prev) => {
        const currentNotes = { ...(prev.notes || {}) };
        if (noteText.trim().length === 0) {
          delete currentNotes[tutorialId];
        } else {
          currentNotes[tutorialId] = noteText;
        }
        return {
          ...prev,
          notes: currentNotes,
        };
      });
      if (!ok) {
        setStorageError('Unable to save learning progress to browser storage.');
      }
      return ok;
    },
    [commitProgressUpdate]
  );

  const resetAllProgress = useCallback(() => {
    const fresh: UserProgress = {
      competencyLevel: 'beginner',
      learningMode: 'guided',
      completedTutorialIds: [],
      savedTutorialIds: [],
      quizScores: {},
      notes: {},
      lastOpenedTutorialId: null,
      tutorialPositions: {},
      tutorialProgress: {},
    };
    const ok = saveLearningProgress(fresh);
    lastWriteOkRef.current = ok;
    setProgress(fresh);
    if (!ok) {
      setStorageError('Unable to save learning progress to browser storage.');
    }
  }, []);

  const clearStorageError = useCallback(() => {
    setStorageError(null);
  }, []);

  return {
    progress,
    setCompetencyLevel,
    setLearningMode,
    toggleBookmark,
    toggleComplete,
    markComplete,
    recordQuizScore,
    setLastOpenedTutorial,
    updateTutorialPosition,
    updateTutorialNote,
    resetAllProgress,
    storageError,
    clearStorageError,
  };
}

