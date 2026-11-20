import { useState, useCallback } from 'react';
import { Language, WorkspacePreferences } from '../types';

export const WORKSPACE_PREFERENCES_STORAGE_KEY = 'bamudi_preferences_v1';

const DEFAULT_PREFERENCES: WorkspacePreferences = {
  version: 1,
  language: 'en',
  updatedAt: 0,
};

function isValidLanguage(value: unknown): value is Language {
  return value === 'bm' || value === 'en';
}

export function loadWorkspacePreferences(): WorkspacePreferences {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_PREFERENCES };
    }
    const raw = window.localStorage.getItem(WORKSPACE_PREFERENCES_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_PREFERENCES };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ...DEFAULT_PREFERENCES };
    }
    const record = parsed as Record<string, unknown>;
    return {
      version: 1,
      language: isValidLanguage(record.language) ? record.language : DEFAULT_PREFERENCES.language,
      teacherDisplayName:
        typeof record.teacherDisplayName === 'string' && record.teacherDisplayName.trim().length > 0
          ? record.teacherDisplayName.trim()
          : undefined,
      updatedAt:
        typeof record.updatedAt === 'number' && Number.isFinite(record.updatedAt)
          ? record.updatedAt
          : 0,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function saveWorkspacePreferences(prefs: WorkspacePreferences): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(WORKSPACE_PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

export function useWorkspacePreferences() {
  const [preferences, setPreferences] = useState<WorkspacePreferences>(() =>
    loadWorkspacePreferences()
  );
  const [storageError, setStorageError] = useState<string | null>(null);

  const persist = useCallback((next: WorkspacePreferences): boolean => {
    const ok = saveWorkspacePreferences(next);
    if (!ok) {
      setStorageError(
        next.language === 'bm'
          ? 'Tetapan tidak dapat disimpan ke storan pelayar.'
          : 'Unable to save preferences to browser storage.'
      );
    } else {
      setStorageError(null);
    }
    return ok;
  }, []);

  const setLanguage = useCallback(
    (language: Language) => {
      setPreferences((prev) => {
        const next: WorkspacePreferences = {
          ...prev,
          version: 1,
          language,
          updatedAt: Date.now(),
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setTeacherDisplayName = useCallback(
    (teacherDisplayName?: string) => {
      const cleaned = teacherDisplayName?.trim();
      setPreferences((prev) => {
        const next: WorkspacePreferences = {
          ...prev,
          version: 1,
          teacherDisplayName: cleaned && cleaned.length > 0 ? cleaned : undefined,
          updatedAt: Date.now(),
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearStorageError = useCallback(() => {
    setStorageError(null);
  }, []);

  return {
    preferences,
    language: preferences.language,
    setLanguage,
    setTeacherDisplayName,
    storageError,
    clearStorageError,
  };
}
