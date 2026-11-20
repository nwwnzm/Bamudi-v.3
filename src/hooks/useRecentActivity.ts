import { useState, useCallback } from 'react';
import { LocalizedString, RecentActivityItem, RecentActivityType } from '../types';

export const RECENT_ACTIVITY_STORAGE_KEY = 'bamudi_recent_activity_v1';
export const MAX_RECENT_ACTIVITIES = 12;

function isValidActivityType(value: unknown): value is RecentActivityType {
  return value === 'tutorial' || value === 'module' || value === 'tool';
}

function isValidLocalizedLabel(value: unknown): value is LocalizedString {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.bm === 'string' && typeof obj.en === 'string';
}

export function loadRecentActivities(): RecentActivityItem[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }
    const raw = window.localStorage.getItem(RECENT_ACTIVITY_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const validItems: RecentActivityItem[] = [];
    const seenKeys = new Set<string>();

    for (const entry of parsed) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
      const item = entry as Record<string, unknown>;
      if (!isValidActivityType(item.type) || typeof item.id !== 'string' || !item.id.trim()) {
        continue;
      }
      const key = `${item.type}:${item.id}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      const label =
        typeof item.label === 'string' || isValidLocalizedLabel(item.label)
          ? item.label
          : undefined;

      validItems.push({
        type: item.type,
        id: item.id,
        label,
        timestamp:
          typeof item.timestamp === 'number' && Number.isFinite(item.timestamp)
            ? item.timestamp
            : Date.now(),
      });

      if (validItems.length >= MAX_RECENT_ACTIVITIES) break;
    }

    return validItems;
  } catch {
    return [];
  }
}

export function mergeRecentActivityList(
  current: RecentActivityItem[],
  type: RecentActivityType,
  id: string,
  label?: LocalizedString | string,
  timestamp: number = Date.now()
): RecentActivityItem[] {
  const trimmedId = id.trim();
  if (!trimmedId) return current;

  const existing = current.find((item) => item.type === type && item.id === trimmedId);
  const filtered = current.filter((item) => !(item.type === type && item.id === trimmedId));

  const nextItem: RecentActivityItem = {
    type,
    id: trimmedId,
    label: label ?? existing?.label,
    timestamp,
  };

  return [nextItem, ...filtered].slice(0, MAX_RECENT_ACTIVITIES);
}

export function saveRecentActivities(items: RecentActivityItem[]): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(RECENT_ACTIVITY_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

export function useRecentActivity() {
  const [recentActivities, setRecentActivities] = useState<RecentActivityItem[]>(() =>
    loadRecentActivities()
  );
  const [storageError, setStorageError] = useState<string | null>(null);

  const recordActivity = useCallback(
    (type: RecentActivityType, id: string, label?: LocalizedString | string) => {
      if (!id || !id.trim()) return;
      setRecentActivities((prev) => {
        const next = mergeRecentActivityList(prev, type, id, label);
        const ok = saveRecentActivities(next);
        if (!ok) {
          setStorageError('Unable to save recent activity to browser storage.');
        } else {
          setStorageError(null);
        }
        return next;
      });
    },
    []
  );

  const clearRecentActivities = useCallback(() => {
    setRecentActivities([]);
    const ok = saveRecentActivities([]);
    if (!ok) {
      setStorageError('Unable to clear recent activity in browser storage.');
    } else {
      setStorageError(null);
    }
  }, []);

  const clearStorageError = useCallback(() => {
    setStorageError(null);
  }, []);

  return {
    recentActivities,
    recordActivity,
    clearRecentActivities,
    storageError,
    clearStorageError,
  };
}
