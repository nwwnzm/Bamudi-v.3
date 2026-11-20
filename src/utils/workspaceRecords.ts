import { GeneratedRPH, PBDClassRecord } from '../types';
import { INITIAL_SAMPLE_PBD_CLASS } from '../data/pbdSampleData';

export const RPH_STORAGE_KEY = 'bamudi_saved_rph_v1';
export const PBD_STORAGE_KEY = 'bamudi_pbd_class_v2_kpm';

export interface RphWorkspaceSummary {
  count: number;
  latest: GeneratedRPH | null;
  loadError: boolean;
}

export interface PbdWorkspaceSummary {
  status: 'empty' | 'sample-only' | 'saved' | 'error';
  record: PBDClassRecord | null;
  studentCount: number;
  tp3PlusCount: number;
  tp3PlusPercentage: number;
}

function isValidRphRecord(entry: unknown): entry is GeneratedRPH {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return false;
  const obj = entry as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.topic === 'string' &&
    typeof obj.subject === 'string' &&
    typeof obj.date === 'string'
  );
}

/**
 * Reads saved RPH archive safely from bamudi_saved_rph_v1 without altering storage structure.
 */
export function loadSavedRphSummary(): RphWorkspaceSummary {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { count: 0, latest: null, loadError: false };
    }
    const raw = window.localStorage.getItem(RPH_STORAGE_KEY);
    if (!raw) {
      return { count: 0, latest: null, loadError: false };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { count: 0, latest: null, loadError: true };
    }

    const validRecords = parsed.filter(isValidRphRecord);
    if (validRecords.length === 0) {
      return { count: 0, latest: null, loadError: false };
    }

    const sorted = [...validRecords].sort((a, b) => {
      const aTime = typeof a.createdAt === 'number' ? a.createdAt : 0;
      const bTime = typeof b.createdAt === 'number' ? b.createdAt : 0;
      return bTime - aTime;
    });

    return {
      count: validRecords.length,
      latest: sorted[0],
      loadError: false,
    };
  } catch {
    return { count: 0, latest: null, loadError: true };
  }
}

function isUnmodifiedSamplePbd(record: PBDClassRecord): boolean {
  if (
    record.id !== INITIAL_SAMPLE_PBD_CLASS.id ||
    record.className !== INITIAL_SAMPLE_PBD_CLASS.className ||
    record.subject !== INITIAL_SAMPLE_PBD_CLASS.subject ||
    record.teacherName !== INITIAL_SAMPLE_PBD_CLASS.teacherName ||
    record.schoolCode !== INITIAL_SAMPLE_PBD_CLASS.schoolCode ||
    record.assessmentUnit !== INITIAL_SAMPLE_PBD_CLASS.assessmentUnit ||
    record.students.length !== INITIAL_SAMPLE_PBD_CLASS.students.length
  ) {
    return false;
  }

  return record.students.every((student, idx) => {
    const sampleStudent = INITIAL_SAMPLE_PBD_CLASS.students[idx];
    return (
      sampleStudent &&
      student.id === sampleStudent.id &&
      student.studentName === sampleStudent.studentName &&
      student.masteryLevel === sampleStudent.masteryLevel &&
      student.effort === sampleStudent.effort &&
      student.uasaScore === sampleStudent.uasaScore
    );
  });
}

/**
 * Reads saved PBD single-class record safely from bamudi_pbd_class_v2_kpm.
 * Distinguishes empty storage and unmodified built-in sample data from teacher-customised records.
 */
export function loadSavedPbdSummary(): PbdWorkspaceSummary {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { status: 'empty', record: null, studentCount: 0, tp3PlusCount: 0, tp3PlusPercentage: 0 };
    }
    const raw = window.localStorage.getItem(PBD_STORAGE_KEY);
    if (!raw) {
      return { status: 'empty', record: null, studentCount: 0, tp3PlusCount: 0, tp3PlusPercentage: 0 };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { status: 'error', record: null, studentCount: 0, tp3PlusCount: 0, tp3PlusPercentage: 0 };
    }

    const record = parsed as PBDClassRecord;
    if (typeof record.className !== 'string' || !Array.isArray(record.students)) {
      return { status: 'error', record: null, studentCount: 0, tp3PlusCount: 0, tp3PlusPercentage: 0 };
    }

    const studentCount = record.students.length;
    const tp3PlusCount = record.students.filter((s) =>
      ['TP3', 'TP4', 'TP5', 'TP6'].includes(s.masteryLevel)
    ).length;
    const tp3PlusPercentage =
      studentCount > 0 ? Math.round((tp3PlusCount / studentCount) * 100) : 0;

    if (isUnmodifiedSamplePbd(record)) {
      return {
        status: 'sample-only',
        record,
        studentCount,
        tp3PlusCount,
        tp3PlusPercentage,
      };
    }

    return {
      status: 'saved',
      record,
      studentCount,
      tp3PlusCount,
      tp3PlusPercentage,
    };
  } catch {
    return { status: 'error', record: null, studentCount: 0, tp3PlusCount: 0, tp3PlusPercentage: 0 };
  }
}
