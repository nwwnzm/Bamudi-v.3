import { useState, useCallback, useEffect, useRef } from 'react';
import { SavedItemsState } from '../types';

export const SAVED_ITEMS_STORAGE_KEY = 'bamudi_saved_items_v1';

function createEmptySavedItems(): SavedItemsState {
  return {
    version: 1,
    savedResourceIds: [],
    pinnedToolIds: [],
    updatedAt: 0,
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function sanitizeSavedIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const unique: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item !== 'string') continue;
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    unique.push(trimmed);
  }

  return unique;
}

export function toggleSavedItemId(ids: string[], rawId: string): string[] {
  if (typeof rawId !== 'string') return ids;
  const trimmed = rawId.trim();
  if (!trimmed) return ids;

  const clean = sanitizeSavedIdList(ids);
  if (clean.includes(trimmed)) {
    return clean.filter((id) => id !== trimmed);
  }
  return [...clean, trimmed];
}

export function loadSavedItems(): SavedItemsState {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return createEmptySavedItems();
    }
    const raw = window.localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
    if (!raw) {
      return createEmptySavedItems();
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed)) {
      return createEmptySavedItems();
    }

    return {
      version: 1,
      savedResourceIds: sanitizeSavedIdList(parsed.savedResourceIds),
      pinnedToolIds: sanitizeSavedIdList(parsed.pinnedToolIds),
      updatedAt:
        typeof parsed.updatedAt === 'number' && Number.isFinite(parsed.updatedAt) && parsed.updatedAt >= 0
          ? parsed.updatedAt
          : 0,
    };
  } catch {
    return createEmptySavedItems();
  }
}

export function saveSavedItems(state: SavedItemsState): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const payload: SavedItemsState = {
      version: 1,
      savedResourceIds: sanitizeSavedIdList(state.savedResourceIds),
      pinnedToolIds: sanitizeSavedIdList(state.pinnedToolIds),
      updatedAt:
        typeof state.updatedAt === 'number' && Number.isFinite(state.updatedAt) && state.updatedAt >= 0
          ? state.updatedAt
          : Date.now(),
    };
    window.localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function useSavedItems() {
  const [savedItems, setSavedItems] = useState<SavedItemsState>(() => loadSavedItems());
  const [storageError, setStorageError] = useState<string | null>(null);
  const lastWriteOkRef = useRef<boolean>(true);

  const commitUpdate = useCallback(
    (updater: (prev: SavedItemsState) => SavedItemsState): boolean => {
      let writeOk = true;
      setSavedItems((prev) => {
        const next = updater(prev);
        if (next === prev) return prev;
        writeOk = saveSavedItems(next);
        lastWriteOkRef.current = writeOk;
        return next;
      });
      return writeOk;
    },
    []
  );

  useEffect(() => {
    if (!lastWriteOkRef.current) {
      setStorageError('Unable to save your saved resources and tools to browser storage.');
    } else {
      setStorageError(null);
    }
  }, [savedItems]);

  const toggleSaveResource = useCallback(
    (resourceId: string) => {
      const trimmed = typeof resourceId === 'string' ? resourceId.trim() : '';
      if (!trimmed) return;
      commitUpdate((prev) => ({
        ...prev,
        version: 1,
        savedResourceIds: toggleSavedItemId(prev.savedResourceIds, trimmed),
        updatedAt: Date.now(),
      }));
    },
    [commitUpdate]
  );

  const togglePinTool = useCallback(
    (toolId: string) => {
      const trimmed = typeof toolId === 'string' ? toolId.trim() : '';
      if (!trimmed) return;
      commitUpdate((prev) => ({
        ...prev,
        version: 1,
        pinnedToolIds: toggleSavedItemId(prev.pinnedToolIds, trimmed),
        updatedAt: Date.now(),
      }));
    },
    [commitUpdate]
  );

  const isResourceSaved = useCallback(
    (resourceId: string): boolean => {
      const trimmed = typeof resourceId === 'string' ? resourceId.trim() : '';
      if (!trimmed) return false;
      return savedItems.savedResourceIds.includes(trimmed);
    },
    [savedItems.savedResourceIds]
  );

  const isToolPinned = useCallback(
    (toolId: string): boolean => {
      const trimmed = typeof toolId === 'string' ? toolId.trim() : '';
      if (!trimmed) return false;
      return savedItems.pinnedToolIds.includes(trimmed);
    },
    [savedItems.pinnedToolIds]
  );

  const clearStorageError = useCallback(() => {
    lastWriteOkRef.current = true;
    setStorageError(null);
  }, []);

  return {
    savedResourceIds: savedItems.savedResourceIds,
    pinnedToolIds: savedItems.pinnedToolIds,
    toggleSaveResource,
    togglePinTool,
    isResourceSaved,
    isToolPinned,
    storageError,
    clearStorageError,
  };
}
