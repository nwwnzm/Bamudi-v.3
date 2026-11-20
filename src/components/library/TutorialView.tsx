import React, { useState, useEffect, useRef } from 'react';
import {
  Tutorial,
  Language,
  LearningMode,
  CompetencyLevel,
  TutorialPosition,
  TutorialTabKey,
} from '../../types';
import { translations } from '../../data/translations';
import { BamuMascot } from '../brand/BamuMascot';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  BookOpen,
  Video,
  ListOrdered,
  FlaskConical,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Volume2,
  Check,
  StickyNote,
  ChevronDown,
  ChevronUp,
  Save,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { FolderManagerSandbox } from '../sandbox/FolderManagerSandbox';
import { TutorialPracticeSandbox } from '../sandbox/TutorialPracticeSandbox';

interface Props {
  tutorial: Tutorial;
  language: Language;
  onBack: () => void;
  isCompleted: boolean;
  isSaved: boolean;
  onToggleComplete: (id: string) => void;
  onMarkComplete?: (id: string) => void;
  onToggleSave: (id: string) => void;
  learningMode: LearningMode;
  onSelectLearningMode: (mode: LearningMode) => void;
  competencyLevel: CompetencyLevel;
  onSelectCompetencyLevel: (lvl: CompetencyLevel) => void;
  onRecordQuizScore: (tutorialId: string, score: number, total: number) => void;
  savedQuizScore?: { score: number; total: number };
  savedPosition?: TutorialPosition;
  onPositionChange?: (tutorialId: string, tab: TutorialTabKey, stepIndex: number) => void;
  note?: string;
  onSaveNote?: (tutorialId: string, note: string) => boolean | void;
  storageError?: string | null;
  onOpenPromptBuilder?: () => void;
}

type TabKey = TutorialTabKey;
type NoteSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const VALID_TAB_KEYS: TabKey[] = ['understand', 'watch', 'steps', 'tryIt', 'quiz'];

function resolveInitialTab(tab?: TabKey): TabKey {
  return tab && VALID_TAB_KEYS.includes(tab) ? tab : 'understand';
}

function clampStepIndex(index: number | undefined, stepsCount: number): number {
  if (stepsCount <= 0 || typeof index !== 'number' || !Number.isFinite(index)) {
    return 0;
  }
  return Math.max(0, Math.min(stepsCount - 1, Math.floor(index)));
}

export const TutorialView: React.FC<Props> = ({
  tutorial,
  language,
  onBack,
  isCompleted,
  isSaved,
  onToggleComplete,
  onMarkComplete,
  onToggleSave,
  learningMode,
  onSelectLearningMode,
  competencyLevel,
  onSelectCompetencyLevel,
  onRecordQuizScore,
  savedQuizScore,
  savedPosition,
  onPositionChange,
  note = '',
  onSaveNote,
  storageError,
  onOpenPromptBuilder,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<TabKey>(() =>
    resolveInitialTab(savedPosition?.tab)
  );

  // Video Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('02:15');
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [isCaptionsOn, setIsCaptionsOn] = useState(true);

  // Steps state
  const [activeStepIndex, setActiveStepIndex] = useState<number>(() =>
    clampStepIndex(savedPosition?.stepIndex, tutorial.steps.length)
  );

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Personal notes state
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);
  const [noteStatus, setNoteStatus] = useState<NoteSaveStatus>(() =>
    note.trim().length > 0 ? 'saved' : 'idle'
  );
  const lastSavedNoteRef = useRef<string>(note);
  const saveTimerRef = useRef<number | null>(null);

  // Sync position and note when switching to another tutorial
  useEffect(() => {
    const nextTab = resolveInitialTab(savedPosition?.tab);
    const nextStep = clampStepIndex(savedPosition?.stepIndex, tutorial.steps.length);
    setActiveTab(nextTab);
    setActiveStepIndex(nextStep);
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizFinished(false);
    setIsPlaying(false);
    setNoteDraft(note);
    lastSavedNoteRef.current = note;
    setNoteStatus(note.trim().length > 0 ? 'saved' : 'idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorial.id]);

  // Keep noteDraft in sync if note prop changes externally (e.g. progress reset)
  useEffect(() => {
    if (note !== lastSavedNoteRef.current) {
      setNoteDraft(note);
      lastSavedNoteRef.current = note;
      setNoteStatus(note.trim().length > 0 ? 'saved' : 'idle');
    }
  }, [note]);

  // Reflect storage errors on note status
  useEffect(() => {
    if (storageError && noteStatus === 'saving') {
      setNoteStatus('error');
    }
  }, [storageError, noteStatus]);

  const commitNoteSave = (textToSave: string) => {
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    if (!onSaveNote) return;
    if (textToSave === lastSavedNoteRef.current) {
      setNoteStatus(textToSave.trim().length > 0 ? 'saved' : 'idle');
      return;
    }
    const result = onSaveNote(tutorial.id, textToSave);
    if (result === false) {
      setNoteStatus('error');
    } else {
      lastSavedNoteRef.current = textToSave;
      setNoteStatus(textToSave.trim().length > 0 ? 'saved' : 'idle');
    }
  };

  useEffect(() => {
    if (!onSaveNote) return;
    if (noteDraft === lastSavedNoteRef.current) return;

    setNoteStatus('saving');
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = window.setTimeout(() => {
      commitNoteSave(noteDraft);
    }, 450);

    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteDraft, tutorial.id]);

  const changeTab = (nextTab: TabKey) => {
    setActiveTab(nextTab);
    onPositionChange?.(tutorial.id, nextTab, activeStepIndex);
  };

  const changeStep = (nextIndex: number) => {
    const clamped = clampStepIndex(nextIndex, tutorial.steps.length);
    setActiveStepIndex(clamped);
    onPositionChange?.(tutorial.id, activeTab, clamped);
  };

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'understand', label: t.tutorialTabs.understand, icon: BookOpen },
    { key: 'watch', label: t.tutorialTabs.watch, icon: Video },
    { key: 'steps', label: t.tutorialTabs.steps, icon: ListOrdered },
    { key: 'tryIt', label: t.tutorialTabs.tryIt, icon: FlaskConical },
    { key: 'quiz', label: t.tutorialTabs.quiz, icon: HelpCircle },
  ];

  // Quiz calculations
  const totalQuestions = tutorial.quiz.length;
  const currentQ = tutorial.quiz[currentQuizIndex];
  const hasAnsweredCurrent = selectedAnswers[currentQuizIndex] !== undefined;

  const calculateScore = () => {
    let correct = 0;
    tutorial.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQuizIndex]: optionIndex }));
  };

  const handleSubmitCurrent = () => {
    setIsSubmitted(true);
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex + 1 < totalQuestions) {
      setCurrentQuizIndex((prev) => prev + 1);
      setIsSubmitted(false);
    } else {
      const finalScore = calculateScore();
      setQuizFinished(true);
      onRecordQuizScore(tutorial.id, finalScore, totalQuestions);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuizIndex(0);
    setIsSubmitted(false);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-sky-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t.tutorialExperience.backToLibrary}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Mode Switcher Toggle */}
          <div className="flex items-center bg-sky-50 p-1 rounded-full border border-sky-200">
            <button
              onClick={() => onSelectLearningMode('guided')}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                learningMode === 'guided'
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.modes.guided}
            </button>
            <button
              onClick={() => onSelectLearningMode('self')}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                learningMode === 'self'
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.modes.self}
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleSave(tutorial.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-[#fdf2f0] border-[#cc310e]/40 text-[#99240b]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#cc310e] text-[#cc310e]' : ''}`} />
            <span>{isSaved ? t.tutorialExperience.saved : t.tutorialExperience.saveTutorial}</span>
          </button>

          {/* Complete Button */}
          <button
            onClick={() => onToggleComplete(tutorial.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer shadow-xs ${
              isCompleted
                ? 'bg-[#0099ff] text-white hover:bg-[#0088ee]'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? t.tutorialExperience.completed : t.tutorialExperience.markAsComplete}</span>
          </button>
        </div>
      </div>

      {/* Tutorial Header */}
      <div className="mb-6 bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Unboxed Metadata with typographic separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="font-bold text-sky-700">{t.categories[tutorial.category]}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-semibold text-slate-700">{tutorial.toolBadge}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1 font-mono tabular-nums text-slate-600">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            {tutorial.estimatedMinutes} {t.common.minutes}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="inline-flex items-center gap-1">
            <span className="text-slate-500">{language === 'bm' ? 'Tahap:' : 'Level:'}</span>
            <select
              value={competencyLevel}
              onChange={(e) => onSelectCompetencyLevel(e.target.value as CompetencyLevel)}
              className="font-bold text-sky-900 bg-white border border-sky-200 rounded px-2 py-0.5 text-xs cursor-pointer"
            >
              <option value="beginner">{t.levels.beginner}</option>
              <option value="intermediate">{t.levels.intermediate}</option>
              <option value="advanced">{t.levels.advanced}</option>
            </select>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display leading-tight mb-3">
          {tutorial.title[language]}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl font-normal">
          {tutorial.description[language]}
        </p>
      </div>

      {/* Mode Banner Indicator with Bamu Mascot */}
      <div className="mb-6 p-4 bg-gradient-to-r from-sky-50 via-[#fdfdfe] to-[#fdf2f0] border border-sky-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-900">
        <div className="flex items-center gap-3">
          <BamuMascot mood="happy" size="sm" />
          <div>
            <span className="font-extrabold text-sky-950 block font-display">
              {t.modes[learningMode]}
            </span>
            <span className="text-slate-600">
              {learningMode === 'guided' ? t.modes.guidedDesc : t.modes.selfDesc}
            </span>
          </div>
        </div>
        <button
          onClick={() => onSelectLearningMode(learningMode === 'guided' ? 'self' : 'guided')}
          className="text-[#0099ff] font-bold underline hover:text-sky-800 shrink-0 cursor-pointer self-end sm:self-auto"
        >
          {t.modes.switchMode}
        </button>
      </div>

      {/* Collapsible Personal Notes ("Nota Saya / My Notes") */}
      <section
        aria-label={language === 'bm' ? 'Nota peribadi tutorial' : 'Personal tutorial notes'}
        className="mb-6 bg-white border border-sky-200 rounded-2xl shadow-2xs overflow-hidden"
      >
        <button
          type="button"
          onClick={() => setIsNotesOpen((prev) => !prev)}
          aria-expanded={isNotesOpen}
          aria-controls="tutorial-personal-notes-panel"
          className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-sky-50/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0099ff]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0077dd] shrink-0">
              <StickyNote className="w-4 h-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="text-sm font-bold text-slate-900 font-display block leading-tight">
                {language === 'bm' ? 'Nota Saya' : 'My Notes'}
              </span>
              <span className="text-xs text-slate-500 block truncate">
                {noteDraft.trim().length > 0
                  ? language === 'bm'
                    ? 'Ada nota peribadi untuk tutorial ini'
                    : 'Personal note saved for this tutorial'
                  : language === 'bm'
                  ? 'Catat idea atau peringatan ringkas untuk kelas anda'
                  : 'Jot down quick ideas or reminders for your class'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {noteStatus === 'saved' && noteDraft.trim().length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#0077dd]">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{language === 'bm' ? 'Tersimpan' : 'Saved'}</span>
              </span>
            )}
            {noteStatus === 'saving' && (
              <span className="hidden sm:inline text-xs font-semibold text-slate-500">
                {language === 'bm' ? 'Menyimpan...' : 'Saving...'}
              </span>
            )}
            {noteStatus === 'error' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#99240b]">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{language === 'bm' ? 'Gagal simpan' : 'Save failed'}</span>
              </span>
            )}
            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              {isNotesOpen ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </span>
          </div>
        </button>

        {isNotesOpen && (
          <div
            id="tutorial-personal-notes-panel"
            className="px-4 pb-4 pt-2 border-t border-sky-100 bg-[#fdfdfe] space-y-3"
          >
            <label
              htmlFor="tutorial-personal-notes-textarea"
              className="block text-xs font-semibold text-slate-700"
            >
              {language === 'bm'
                ? 'Nota peribadi anda (disimpan secara automatik pada peranti ini):'
                : 'Your personal notes (automatically saved on this device):'}
            </label>

            <textarea
              id="tutorial-personal-notes-textarea"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onBlur={() => commitNoteSave(noteDraft)}
              rows={4}
              placeholder={
                language === 'bm'
                  ? 'Contoh: Sesuai digunakan untuk PdP Sains Tahun 5 minggu hadapan...'
                  : 'Example: Great activity idea to try in next week Year 5 Science lesson...'
              }
              className="w-full rounded-xl border border-sky-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0099ff] focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 resize-y"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-medium min-h-[20px] flex items-center gap-1.5">
                {noteStatus === 'error' ? (
                  <span className="inline-flex items-center gap-1.5 text-[#99240b] font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      {language === 'bm'
                        ? 'Nota tidak dapat disimpan ke storan pelayar.'
                        : 'Unable to save note to browser storage.'}
                    </span>
                  </span>
                ) : noteStatus === 'saving' ? (
                  <span className="text-slate-500">
                    {language === 'bm' ? 'Sedang menyimpan nota...' : 'Saving note...'}
                  </span>
                ) : noteDraft.trim().length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-[#0077dd] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      {language === 'bm'
                        ? 'Nota disimpan pada pelayar ini'
                        : 'Note saved on this browser'}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-500">
                    {language === 'bm'
                      ? 'Tiada nota lagi. Taip di atas untuk mula mencatat.'
                      : 'No notes yet. Type above to start writing.'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {noteDraft.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setNoteDraft('');
                      commitNoteSave('');
                    }}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#99240b] bg-[#fdf2f0] hover:bg-[#fbe5e0] border border-[#cc310e]/25 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{language === 'bm' ? 'Padam' : 'Clear'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => commitNoteSave(noteDraft)}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-colors cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:ring-offset-2"
                >
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{language === 'bm' ? 'Simpan Nota' : 'Save Note'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5-Step Tab Navigation Bar (Curvy, rounded-full) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-full mb-8 overflow-x-auto no-scrollbar border border-slate-200/80">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => changeTab(tab.key)}
              className={`flex-1 min-w-[120px] min-h-[44px] inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#0099ff] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. UNDERSTAND TAB */}
      {activeTab === 'understand' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2 font-display">
              <BookOpen className="w-5 h-5 text-[#0099ff]" />
              {t.tutorialExperience.understandTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6 font-normal">
              {tutorial.understand.concept[language]}
            </p>

            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-2 font-display">
                {t.tutorialExperience.whyMatters}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-[#fdfdfe] p-4 rounded-2xl border border-sky-200">
                {tutorial.understand.whyItMatters[language]}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 font-display">
                {t.tutorialExperience.keyTakeaways}
              </h4>
              <ul className="space-y-2.5">
                {tutorial.understand.keyTakeaways.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-[#0066cc] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{item[language]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => changeTab('watch')}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-all cursor-pointer shadow-xs"
            >
              {language === 'bm' ? 'Seterusnya: Tonton Video' : 'Next: Watch Video'} →
            </button>
          </div>
        </div>
      )}

      {/* 2. WATCH TAB */}
      {activeTab === 'watch' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            {/* Interactive Video Player Canvas Mockup */}
            <div className="relative bg-slate-950 aspect-video w-full flex flex-col justify-between p-4 sm:p-6 text-white select-none">
              {/* Top Title Overlay */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold truncate pr-4">
                  {tutorial.watch.videoTitle[language]}
                </span>
                <span className="font-mono text-[#0099ff] bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-700 text-[11px]">
                  HD 1080p
                </span>
              </div>

              {/* Center Play Button & Demonstration Graphic */}
              <div className="flex flex-col items-center justify-center my-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-[#0099ff] hover:bg-[#0088ee] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer mb-3"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-white" />
                  ) : (
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  )}
                </button>
                <p className="text-xs text-slate-300 font-medium">
                  {isPlaying
                    ? language === 'bm'
                      ? 'Sedang Dimainkan...'
                      : 'Now Playing...'
                    : language === 'bm'
                    ? 'Klik untuk Memulakan Tontonan'
                    : 'Click to Play Video'}
                </p>
                {isCaptionsOn && (
                  <p className="text-[11px] text-sky-200 bg-black/70 px-3 py-1 rounded-full mt-2 border border-sky-400/20 max-w-md text-center">
                    CC: {tutorial.understand.concept[language].substring(0, 75)}...
                  </p>
                )}
              </div>

              {/* Bottom Player Controls */}
              <div className="space-y-2 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 backdrop-blur-xs">
                {/* Timeline Bar */}
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden cursor-pointer relative">
                  <div className="bg-[#0099ff] h-full w-2/5 rounded-full" />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-white transition-colors cursor-pointer"
                      aria-label="Toggle playback"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span className="font-mono tabular-nums text-[11px]">
                      {currentTime} / {tutorial.watch.duration}
                    </span>
                    <Volume2 className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsCaptionsOn(!isCaptionsOn)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        isCaptionsOn
                          ? 'border-[#0099ff] text-sky-300 bg-sky-950/60'
                          : 'border-slate-700 text-slate-500'
                      }`}
                    >
                      CC
                    </button>

                    <button
                      onClick={() => {
                        const speeds = ['1.0x', '1.25x', '1.5x'];
                        const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                        setPlaybackSpeed(next);
                      }}
                      className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      {playbackSpeed}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Chapters & Timestamps */}
            <div className="p-6 border-t border-slate-100 bg-[#fdfdfe]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 font-display">
                {t.tutorialExperience.videoChapters}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tutorial.watch.chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentTime(ch.time);
                      setIsPlaying(true);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-sky-50 border border-slate-200 transition-colors text-left cursor-pointer group shadow-2xs"
                  >
                    <span className="text-xs font-medium text-slate-800 group-hover:text-sky-950 truncate pr-2">
                      {ch.label[language]}
                    </span>
                    <span className="font-mono tabular-nums text-xs font-bold text-[#0099ff] shrink-0">
                      {ch.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => changeTab('understand')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← {language === 'bm' ? 'Sebelum: Fahami' : 'Previous: Understand'}
            </button>
            <button
              onClick={() => changeTab('steps')}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-all cursor-pointer shadow-xs"
            >
              {language === 'bm' ? 'Seterusnya: Ikuti Langkah' : 'Next: Follow Steps'} →
            </button>
          </div>
        </div>
      )}

      {/* 3. FOLLOW THE STEPS TAB */}
      {activeTab === 'steps' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Step Navigator Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-display">
                <ListOrdered className="w-5 h-5 text-[#0099ff]" />
                {t.tutorialExperience.stepsTitle}
              </h3>
              <div className="text-xs font-medium text-slate-500">
                {t.tutorialExperience.stepOf}{' '}
                <span className="font-mono font-bold text-[#0099ff]">{activeStepIndex + 1}</span> / {tutorial.steps.length}
              </div>
            </div>

            {/* Step Pills Bar */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
              {tutorial.steps.map((st, idx) => (
                <button
                  key={st.stepNumber}
                  onClick={() => changeStep(idx)}
                  className={`flex-1 min-w-[85px] min-h-[44px] py-2 px-3 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap text-center ${
                    activeStepIndex === idx
                      ? 'bg-[#0099ff] text-white shadow-xs'
                      : 'bg-sky-50 text-sky-900 hover:bg-sky-100'
                  }`}
                >
                  {t.tutorialExperience.stepOf} {st.stepNumber}
                </button>
              ))}
            </div>

            {/* Active Step Content */}
            {tutorial.steps[activeStepIndex] && (
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-2xl bg-[#0099ff] text-white font-display font-extrabold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {tutorial.steps[activeStepIndex].stepNumber}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 mb-2 font-display">
                      {tutorial.steps[activeStepIndex].title[language]}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {learningMode === 'guided'
                        ? tutorial.steps[activeStepIndex].guidedText[language]
                        : tutorial.steps[activeStepIndex].selfText[language]}
                    </p>
                  </div>
                </div>

                {/* Bamu's Helpful Teacher Tip */}
                {tutorial.steps[activeStepIndex].tip && (
                  <div className="p-4 bg-[#fdf2f0] border border-[#cc310e]/30 rounded-2xl flex items-start gap-3 text-xs text-slate-900 mt-4">
                    <BamuMascot mood="encouraging" size="xs" className="mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#cc310e] block mb-0.5">
                        {language === 'bm' ? 'Tip Dari Bamu:' : 'Tip From Bamu:'}
                      </span>
                      <span className="leading-relaxed font-medium">
                        {tutorial.steps[activeStepIndex].tip![language]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation inside steps */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => changeStep(activeStepIndex - 1)}
                className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                  activeStepIndex === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                ← {language === 'bm' ? 'Langkah Sebelumnya' : 'Previous Step'}
              </button>

              {activeStepIndex < tutorial.steps.length - 1 ? (
                <button
                  onClick={() => changeStep(activeStepIndex + 1)}
                  className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-colors cursor-pointer shadow-xs"
                >
                  {language === 'bm' ? 'Langkah Seterusnya' : 'Next Step'} →
                </button>
              ) : (
                <button
                  onClick={() => changeTab('tryIt')}
                  className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-colors cursor-pointer shadow-xs"
                >
                  {language === 'bm' ? 'Teruskan ke Cuba Sendiri' : 'Continue to Try It Yourself'} →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TRY IT YOURSELF TAB */}
      {activeTab === 'tryIt' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 flex items-center gap-2 font-display">
                  <FlaskConical className="w-5 h-5 text-[#0099ff]" />
                  {t.tutorialExperience.tryItTitle}
                </h3>
                <p className="text-xs text-slate-500 font-normal">{t.tutorialExperience.tryItSubtitle}</p>
              </div>

              {/* Bamu reassurance in sandbox */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[11px] font-bold text-[#0055aa]">
                <BamuMascot mood="happy" size="xs" />
                <span>{language === 'bm' ? 'Ruang Latihan Selamat' : 'Safe Sandbox Area'}</span>
              </div>
            </div>

            <div className="bg-[#fdfdfe] p-5 rounded-2xl border border-sky-200 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-1 font-display">
                {tutorial.tryIt.taskTitle[language]}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                {tutorial.tryIt.taskGoal[language]}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                {tutorial.tryIt.guidelines.map((g, idx) => (
                  <span key={idx} className="bg-white px-3 py-1 rounded-full border border-sky-200 text-slate-800 font-medium">
                    ✓ {g[language]}
                  </span>
                ))}
              </div>
            </div>

            {/* Mount Specific Interactive Sandbox Simulator */}
            {tutorial.tryIt.sandboxType === 'folder-manager' ? (
              <FolderManagerSandbox language={language} />
            ) : (
              <TutorialPracticeSandbox
                tutorial={tutorial}
                language={language}
                onOpenPromptBuilder={onOpenPromptBuilder}
              />
            )}
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={() => changeTab('steps')}
              className="min-h-[44px] px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] rounded-xl"
            >
              ← {language === 'bm' ? 'Sebelum: Ikuti Langkah' : 'Previous: Follow Steps'}
            </button>
            <button
              type="button"
              onClick={() => changeTab('quiz')}
              className="min-h-[44px] px-6 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-all cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
            >
              {language === 'bm' ? 'Seterusnya: Uji Kefahaman' : 'Next: Check Understanding'} →
            </button>
          </div>
        </div>
      )}

      {/* 5. CHECK YOUR UNDERSTANDING TAB */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 flex items-center gap-2 font-display">
              <HelpCircle className="w-5 h-5 text-[#0099ff]" />
              {t.tutorialExperience.quizTitle}
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-normal">{t.tutorialExperience.quizSubtitle}</p>

            {quizFinished ? (
              /* Quiz Finished Summary with Celebratory Bamu Mascot */
              <div className="p-8 text-center max-w-lg mx-auto space-y-5 animate-fadeIn">
                <BamuMascot mood="celebrating" size="xl" className="mx-auto" />

                <div>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                    {language === 'bm' ? 'Tahniah Cikgu!' : 'Congratulations!'}
                  </h4>
                  <p className="text-xs text-[#0077dd] font-bold mt-1">
                    {language === 'bm' ? 'Bamu bangga dengan kesungguhan pembelajaran anda.' : 'Bamu is proud of your dedication to learning.'}
                  </p>
                </div>

                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 inline-block">
                  <span className="text-[11px] font-bold text-[#0066cc] uppercase tracking-wider block mb-1">
                    {t.tutorialExperience.quizResult}
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-[#003366] tabular-nums">
                    {calculateScore()} / {totalQuestions}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {calculateScore() === totalQuestions
                    ? t.tutorialExperience.excellentScore
                    : calculateScore() >= totalQuestions / 2
                    ? t.tutorialExperience.goodScore
                    : t.tutorialExperience.keepPracticing}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRetakeQuiz}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    {t.tutorialExperience.retakeQuiz}
                  </button>

                  <button
                    onClick={() => {
                      if (onMarkComplete) {
                        onMarkComplete(tutorial.id);
                      } else if (!isCompleted) {
                        onToggleComplete(tutorial.id);
                      }
                      onBack();
                    }}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-full transition-all cursor-pointer shadow-sm shadow-sky-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    {t.tutorialExperience.completed} &amp; {t.tutorialExperience.backToLibrary}
                  </button>
                </div>
              </div>
            ) : (
              /* Active Question View */
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
                  <span className="font-bold text-[#0099ff]">
                    {t.tutorialExperience.question} {currentQuizIndex + 1} {language === 'bm' ? 'daripada' : 'of'} {totalQuestions}
                  </span>
                  {savedQuizScore && (
                    <span className="text-[11px] font-semibold text-slate-600">
                      {language === 'bm' ? 'Skor Tersimpan:' : 'Saved Score:'} {savedQuizScore.score}/{savedQuizScore.total}
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-4 leading-snug font-display">
                  {currentQ.question[language]}
                </h4>

                {/* Multiple Choice Options */}
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuizIndex] === optIdx;
                    const isCorrect = currentQ.correctAnswer === optIdx;

                    let optionStyle = 'bg-white border-slate-200 hover:border-[#0099ff] hover:bg-sky-50/40 text-slate-800';
                    if (isSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-sky-50 border-sky-400 text-sky-950 font-semibold ring-1 ring-sky-400';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                      } else {
                        optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-sky-50 border-[#0099ff] text-sky-950 font-semibold ring-1 ring-[#0099ff]';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectAnswer(optIdx)}
                        className={`w-full p-4 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full border text-[11px] font-bold flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#0099ff] text-white border-[#0099ff]'
                                : 'border-slate-300 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt[language]}</span>
                        </div>

                        {isSubmitted && isCorrect && (
                          <Check className="w-4 h-4 text-[#0099ff] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback upon submission */}
                {isSubmitted && (
                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl mb-6 text-xs text-slate-700 leading-relaxed animate-fadeIn">
                    <span className="font-bold text-sky-900 block mb-1">
                      {t.tutorialExperience.explanation}:
                    </span>
                    {currentQ.explanation[language]}
                  </div>
                )}

                {/* Question Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-400">
                    {!isSubmitted && (language === 'bm' ? 'Pilih satu jawapan untuk mengesahkan' : 'Select an answer to submit')}
                  </div>

                  {!isSubmitted ? (
                    <button
                      disabled={!hasAnsweredCurrent}
                      onClick={handleSubmitCurrent}
                      className={`px-6 py-2.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                        hasAnsweredCurrent
                          ? 'bg-[#0099ff] text-white hover:bg-[#0088ee] shadow-xs'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {t.tutorialExperience.submitAnswer}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuiz}
                      className="px-6 py-2.5 text-xs font-bold bg-[#0099ff] hover:bg-[#0088ee] text-white rounded-full transition-colors cursor-pointer shadow-xs"
                    >
                      {currentQuizIndex + 1 < totalQuestions
                        ? t.tutorialExperience.nextQuestion
                        : t.tutorialExperience.finishQuiz}{' '}
                      →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
