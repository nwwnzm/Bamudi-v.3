export type Language = 'bm' | 'en';

export type CompetencyLevel = 'beginner' | 'intermediate' | 'advanced';

export type LearningMode = 'guided' | 'self';

export type TutorialCategory = 
  | 'getting-started'
  | 'teaching-tools'
  | 'ai-teachers'
  | 'interactive';

export interface LocalizedString {
  bm: string;
  en: string;
}

export interface TutorialStep {
  stepNumber: number;
  title: LocalizedString;
  guidedText: LocalizedString;
  selfText: LocalizedString;
  tip?: LocalizedString;
  actionHint?: LocalizedString;
}

export interface VideoChapter {
  time: string;
  label: LocalizedString;
}

export interface QuizQuestion {
  question: LocalizedString;
  options: LocalizedString[];
  correctAnswer: number;
  explanation: LocalizedString;
}

export type SandboxType =
  | 'folder-manager'
  | 'shortcut-lab'
  | 'upload-checker'
  | 'browser-tabs'
  | 'layout-studio'
  | 'quiz-config'
  | 'classroom-permissions'
  | 'ai-scenario-lab'
  | 'prompt-anatomy'
  | 'rph-scaffold'
  | 'gamified-quiz'
  | 'game-switcher'
  | 'word-cloud'
  | 'collab-board';

export interface Tutorial {
  id: string;
  slug: string;
  category: TutorialCategory;
  level: CompetencyLevel;
  estimatedMinutes: number;
  iconName: string;
  toolBadge: string;
  title: LocalizedString;
  description: LocalizedString;
  understand: {
    concept: LocalizedString;
    whyItMatters: LocalizedString;
    keyTakeaways: LocalizedString[];
  };
  watch: {
    videoTitle: LocalizedString;
    duration: string;
    chapters: VideoChapter[];
    keyHighlights: LocalizedString[];
  };
  steps: TutorialStep[];
  tryIt: {
    sandboxType: SandboxType;
    taskTitle: LocalizedString;
    taskGoal: LocalizedString;
    guidelines: LocalizedString[];
  };
  quiz: QuizQuestion[];
}

export type TeachingResourceCategory = 'worksheet' | 'assessment' | 'presentation';

export interface TeachingResource {
  id: string;
  category: TeachingResourceCategory;
  title: LocalizedString;
  description: LocalizedString;
  format: 'DOCX' | 'PPTX' | 'PDF' | 'SHEET';
  gradeLevel: LocalizedString;
  subject: LocalizedString;
  downloadCount: number;
  tags: string[];
  sampleStructure: LocalizedString[];
}

export type MasteryLevel = 'TP1' | 'TP2' | 'TP3' | 'TP4' | 'TP5' | 'TP6';

export type StudentEffort = 'RENDAH' | 'SEDERHANA' | 'TINGGI' | 'SANGAT TINGGI';

export type AssessmentMethod = 'pemerhatian' | 'lisan' | 'bertulis' | 'gabungan';

export type ReportingPeriod = 'pertengahan' | 'akhir';

export type UasaGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | '-';

export interface PBDStudentRecord {
  id: string;
  studentName: string;
  studentId: string;
  gender: 'L' | 'P';
  masteryLevel: MasteryLevel;
  assessmentTopic: string;
  subjectStatement?: string;
  effort: StudentEffort;
  assessmentMethod: AssessmentMethod;
  uasaScore?: number;
  uasaGrade?: UasaGrade;
  remarks: string;
  dateRecorded: string;
}

export interface PBDClassRecord {
  id: string;
  className: string;
  subject: string;
  yearGrade: string;
  teacherName: string;
  schoolName: string;
  schoolCode: string;
  academicYear: string;
  reportingPeriod: ReportingPeriod;
  assessmentUnit: string;
  includeUasa: boolean;
  classTeacherName?: string;
  classTeacherRemarks: string;
  students: PBDStudentRecord[];
  lastUpdated: number;
}

export interface GeneratedRPH {
  id: string;
  subject: string;
  level: string;
  className: string;
  date: string;
  day: string;
  time: string;
  topic: string;
  subtopic?: string;
  contentStandard: string;
  learningStandard: string;
  learningObjectives: string[];
  successCriteria: string[];
  setInduction: string;
  mainActivities: string[];
  closure: string;
  teachingAids: string[];
  emk: string[];
  reflection: string;
  createdAt: number;
}

export interface DigitalTool {
  id: string;
  name: string;
  category: 'presentation' | 'quiz' | 'lms' | 'design' | 'math-science' | 'engagement';
  difficulty: CompetencyLevel;
  pricing: 'free' | 'freemium' | 'free-for-teachers';
  officialUrl: string;
  description: LocalizedString;
  bestFor: LocalizedString;
  teacherTip: LocalizedString;
}

export interface GlossaryItem {
  id: string;
  termBM: string;
  termEN: string;
  definition: LocalizedString;
  exampleInSchool: LocalizedString;
  category: 'general' | 'hardware' | 'cloud' | 'ai' | 'pedagogy';
}

export type TutorialTabKey = 'understand' | 'watch' | 'steps' | 'tryIt' | 'quiz';

export interface TutorialPosition {
  tab: TutorialTabKey;
  stepIndex: number;
  updatedAt: number;
}

export interface TutorialMilestoneProgress {
  visitedTabs: TutorialTabKey[];
  completedSteps: number[];
  quizCompleted?: boolean;
  updatedAt: number;
}

export interface UserProgress {
  competencyLevel: CompetencyLevel;
  learningMode: LearningMode;
  completedTutorialIds: string[];
  savedTutorialIds: string[];
  quizScores: Record<string, { score: number; total: number; timestamp: number }>;
  notes: Record<string, string>;
  lastOpenedTutorialId?: string | null;
  tutorialPositions?: Record<string, TutorialPosition>;
  tutorialProgress?: Record<string, TutorialMilestoneProgress>;
}

export interface WorkspacePreferences {
  version: 1;
  language: Language;
  teacherDisplayName?: string;
  updatedAt: number;
}

export type RecentActivityType = 'tutorial' | 'module' | 'tool';

export interface RecentActivityItem {
  type: RecentActivityType;
  id: string;
  label?: LocalizedString | string;
  timestamp: number;
}

export interface SavedItemsState {
  version: 1;
  savedResourceIds: string[];
  pinnedToolIds: string[];
  updatedAt: number;
}
