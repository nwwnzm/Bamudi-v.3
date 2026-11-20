import React, { useMemo, useState } from 'react';
import { Tutorial, TutorialCategory, CompetencyLevel, LocalizedString } from './types';
import { TUTORIALS } from './data/tutorials';
import { TEACHING_RESOURCES } from './data/resources';
import { DIGITAL_TOOLS } from './data/tools';
import { GLOSSARY_ITEMS } from './data/glossary';
import { useLearningProgress } from './hooks/useLearningProgress';
import { useWorkspacePreferences } from './hooks/useWorkspacePreferences';
import { useRecentActivity } from './hooks/useRecentActivity';
import { useSavedItems } from './hooks/useSavedItems';

import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { DigitalLibraryView } from './components/library/DigitalLibraryView';
import { TutorialView } from './components/library/TutorialView';
import { TeachingResourcesView } from './components/resources/TeachingResourcesView';
import { RphGeneratorView } from './components/rph/RphGeneratorView';
import { PbdSystemView } from './components/pbd/PbdSystemView';
import { DigitalToolsView } from './components/tools/DigitalToolsView';
import { DigitalGlossaryView } from './components/glossary/DigitalGlossaryView';
import { MyLearningView } from './components/dashboard/MyLearningView';
import { MySavedItemsView } from './components/saved/MySavedItemsView';
import { PromptBuilderView } from './components/prompt/PromptBuilderView';
import { LandingPageView } from './components/landing/LandingPageView';
import { ToastNotification } from './components/common/ToastNotification';

const TRACKED_MODULE_LABELS: Record<string, LocalizedString> = {
  library: { bm: 'Perpustakaan Digital', en: 'Digital Library' },
  'prompt-builder': { bm: 'Pembina Gesaan AI', en: 'AI Prompt Builder' },
  'rph-generator': { bm: 'Penjana RPH', en: 'RPH Generator' },
  'pbd-system': { bm: 'Sistem PBD', en: 'PBD System' },
  resources: { bm: 'Bahan Pengajaran', en: 'Teaching Resources' },
  tools: { bm: 'Alatan Digital', en: 'Digital Tools' },
  glossary: { bm: 'Glosari Digital', en: 'Digital Glossary' },
  'my-learning': { bm: 'Pembelajaran Saya', en: 'My Learning' },
  'saved-items': { bm: 'Item Simpanan Saya', en: 'My Saved Items' },
};

export function countValidCatalogueIds(
  ids: readonly string[],
  catalogue: readonly { id: string }[]
): number {
  const validIds = new Set(catalogue.map((item) => item.id));
  const matched = new Set<string>();
  for (const rawId of ids) {
    if (typeof rawId !== 'string') continue;
    const id = rawId.trim();
    if (id && validIds.has(id)) {
      matched.add(id);
    }
  }
  return matched.size;
}

export function countValidSavedItems(params: {
  savedTutorialIds: readonly string[];
  savedResourceIds: readonly string[];
  pinnedToolIds: readonly string[];
  tutorials: readonly { id: string }[];
  resources: readonly { id: string }[];
  tools: readonly { id: string }[];
}): number {
  return (
    countValidCatalogueIds(params.savedTutorialIds, params.tutorials) +
    countValidCatalogueIds(params.savedResourceIds, params.resources) +
    countValidCatalogueIds(params.pinnedToolIds, params.tools)
  );
}

export default function App() {
  const {
    preferences,
    language,
    setLanguage,
    setTeacherDisplayName,
    storageError: preferencesStorageError,
    clearStorageError: clearPreferencesStorageError,
  } = useWorkspacePreferences();
  const {
    recentActivities,
    recordActivity,
    storageError: activityStorageError,
    clearStorageError: clearActivityStorageError,
  } = useRecentActivity();
  const {
    savedResourceIds,
    pinnedToolIds,
    toggleSaveResource,
    togglePinTool,
    isResourceSaved,
    isToolPinned,
    storageError: savedItemsStorageError,
    clearStorageError: clearSavedItemsStorageError,
  } = useSavedItems();

  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [libraryInitialCategory, setLibraryInitialCategory] = useState<TutorialCategory | 'all'>('all');
  const [libraryInitialQuery, setLibraryInitialQuery] = useState<string>('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const {
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
    storageError: progressStorageError,
    clearStorageError: clearProgressStorageError,
  } = useLearningProgress();

  const consistentCompletedCount = TUTORIALS.filter((t) =>
    progress.completedTutorialIds.includes(t.id)
  ).length;

  const validSavedItemsCount = useMemo(
    () =>
      countValidSavedItems({
        savedTutorialIds: progress.savedTutorialIds,
        savedResourceIds,
        pinnedToolIds,
        tutorials: TUTORIALS,
        resources: TEACHING_RESOURCES,
        tools: DIGITAL_TOOLS,
      }),
    [progress.savedTutorialIds, savedResourceIds, pinnedToolIds]
  );

  const recordModuleVisit = (tabId: string) => {
    const label = TRACKED_MODULE_LABELS[tabId];
    if (label) {
      recordActivity('module', tabId, label);
    }
  };

  const handleSelectTab = (tabId: string) => {
    setShowLandingPage(false);
    setCurrentTab(tabId);
    setSelectedTutorial(null);
    setIsMobileNavOpen(false);
    recordModuleVisit(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterDashboard = (targetTab: string = 'home') => {
    if (targetTab === 'library') {
      setLibraryInitialCategory('all');
      setLibraryInitialQuery('');
    }
    setShowLandingPage(false);
    setCurrentTab(targetTab);
    setSelectedTutorial(null);
    setIsMobileNavOpen(false);
    recordModuleVisit(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLandingPage = () => {
    setShowLandingPage(true);
    setSelectedTutorial(null);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToLibrary = (
    category: TutorialCategory | 'all' = 'all',
    query: string = ''
  ) => {
    setShowLandingPage(false);
    setLibraryInitialCategory(category);
    setLibraryInitialQuery(query);
    setCurrentTab('library');
    setSelectedTutorial(null);
    setIsMobileNavOpen(false);
    recordModuleVisit('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTutorial = (tutorial: Tutorial) => {
    setShowLandingPage(false);
    setSelectedTutorial(tutorial);
    setIsMobileNavOpen(false);
    setLastOpenedTutorial(tutorial.id);
    recordActivity('tutorial', tutorial.id, tutorial.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLibrary = () => {
    setSelectedTutorial(null);
    setCurrentTab('library');
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPathway = (level: CompetencyLevel) => {
    setCompetencyLevel(level);
    handleNavigateToLibrary('all');
  };

  const activeStorageError =
    progressStorageError ||
    preferencesStorageError ||
    activityStorageError ||
    savedItemsStorageError;

  const dismissStorageError = () => {
    clearProgressStorageError();
    clearPreferencesStorageError();
    clearActivityStorageError();
    clearSavedItemsStorageError();
  };

  if (showLandingPage) {
    return (
      <>
        <LandingPageView
          language={language}
          onToggleLanguage={setLanguage}
          onEnterDashboard={handleEnterDashboard}
        />
        <ToastNotification
          message={activeStorageError}
          variant="warning"
          icon="warning"
          onDismiss={dismissStorageError}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#e6f5ff] via-[#eef7ff] to-[#fdfdfe] text-slate-800 font-sans antialiased">
      {/* 1. Main Features Sidebar (Floating rounded panel on desktop, drawer on mobile) */}
      <Sidebar
        currentTab={selectedTutorial ? 'library' : currentTab}
        onSelectTab={handleSelectTab}
        language={language}
        onToggleLanguage={setLanguage}
        completedCount={consistentCompletedCount}
        savedItemsCount={validSavedItemsCount}
        totalTutorials={TUTORIALS.length}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        competencyLevel={progress.competencyLevel}
        onSelectCompetencyLevel={setCompetencyLevel}
        onOpenLandingPage={handleOpenLandingPage}
      />

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <TopHeader
          onOpenMobile={() => setIsMobileNavOpen(true)}
          language={language}
          onToggleLanguage={setLanguage}
          currentTab={selectedTutorial ? 'library' : currentTab}
          completedCount={consistentCompletedCount}
          onSelectTab={handleSelectTab}
          competencyLevel={progress.competencyLevel}
          onSelectCompetencyLevel={setCompetencyLevel}
          onNavigateToLibrary={handleNavigateToLibrary}
          onOpenLandingPage={handleOpenLandingPage}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1">
          {selectedTutorial ? (
            <TutorialView
              tutorial={selectedTutorial}
              language={language}
              onBack={handleBackToLibrary}
              isCompleted={progress.completedTutorialIds.includes(selectedTutorial.id)}
              isSaved={progress.savedTutorialIds.includes(selectedTutorial.id)}
              onToggleComplete={toggleComplete}
              onMarkComplete={markComplete}
              onToggleSave={toggleBookmark}
              learningMode={progress.learningMode}
              onSelectLearningMode={setLearningMode}
              competencyLevel={progress.competencyLevel}
              onSelectCompetencyLevel={setCompetencyLevel}
              onRecordQuizScore={recordQuizScore}
              savedQuizScore={progress.quizScores[selectedTutorial.id]}
              savedPosition={progress.tutorialPositions?.[selectedTutorial.id]}
              onPositionChange={updateTutorialPosition}
              note={progress.notes?.[selectedTutorial.id] || ''}
              onSaveNote={updateTutorialNote}
              storageError={progressStorageError}
              onOpenPromptBuilder={() => handleSelectTab('prompt-builder')}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeView
                  language={language}
                  onNavigateToLibrary={handleNavigateToLibrary}
                  onSelectTutorial={handleSelectTutorial}
                  tutorials={TUTORIALS}
                  completedIds={progress.completedTutorialIds}
                  savedIds={progress.savedTutorialIds}
                  onToggleSave={(id, e) => {
                    e.stopPropagation();
                    toggleBookmark(id);
                  }}
                  onSelectPathway={handleSelectPathway}
                  onSelectTab={handleSelectTab}
                  competencyLevel={progress.competencyLevel}
                  onSelectCompetencyLevel={setCompetencyLevel}
                  lastOpenedTutorialId={progress.lastOpenedTutorialId}
                  recentActivities={recentActivities}
                  userProgress={progress}
                  teacherDisplayName={preferences.teacherDisplayName}
                  onUpdateTeacherDisplayName={setTeacherDisplayName}
                  savedItemsCount={validSavedItemsCount}
                />
              )}

              {currentTab === 'library' && (
                <DigitalLibraryView
                  tutorials={TUTORIALS}
                  language={language}
                  onSelectTutorial={handleSelectTutorial}
                  completedIds={progress.completedTutorialIds}
                  savedIds={progress.savedTutorialIds}
                  onToggleSave={(id, e) => {
                    e.stopPropagation();
                    toggleBookmark(id);
                  }}
                  initialCategory={libraryInitialCategory}
                  initialQuery={libraryInitialQuery}
                />
              )}

              {currentTab === 'prompt-builder' && (
                <PromptBuilderView language={language} />
              )}

              {currentTab === 'rph-generator' && (
                <RphGeneratorView language={language} />
              )}

              {currentTab === 'pbd-system' && (
                <PbdSystemView language={language} />
              )}

              {currentTab === 'resources' && (
                <TeachingResourcesView
                  resources={TEACHING_RESOURCES}
                  language={language}
                  onNavigateToTab={handleSelectTab}
                  isResourceSaved={isResourceSaved}
                  onToggleSaveResource={toggleSaveResource}
                />
              )}

              {currentTab === 'tools' && (
                <DigitalToolsView
                  tools={DIGITAL_TOOLS}
                  language={language}
                  onToolVisit={(tool) => recordActivity('tool', tool.id, tool.name)}
                  pinnedToolIds={pinnedToolIds}
                  isToolPinned={isToolPinned}
                  onTogglePinTool={togglePinTool}
                />
              )}

              {currentTab === 'glossary' && (
                <DigitalGlossaryView
                  items={GLOSSARY_ITEMS}
                  language={language}
                />
              )}

              {currentTab === 'my-learning' && (
                <MyLearningView
                  progress={progress}
                  tutorials={TUTORIALS}
                  language={language}
                  onSelectTutorial={handleSelectTutorial}
                  onResetProgress={resetAllProgress}
                  onNavigateToLibrary={() => handleSelectTab('library')}
                  recentActivities={recentActivities}
                  onSelectTab={handleSelectTab}
                />
              )}

              {currentTab === 'saved-items' && (
                <MySavedItemsView
                  language={language}
                  tutorials={TUTORIALS}
                  resources={TEACHING_RESOURCES}
                  tools={DIGITAL_TOOLS}
                  savedTutorialIds={progress.savedTutorialIds}
                  savedResourceIds={savedResourceIds}
                  pinnedToolIds={pinnedToolIds}
                  completedTutorialIds={progress.completedTutorialIds}
                  onSelectTutorial={handleSelectTutorial}
                  onToggleBookmarkTutorial={toggleBookmark}
                  onToggleSaveResource={toggleSaveResource}
                  onTogglePinTool={togglePinTool}
                  onToolVisit={(tool) => recordActivity('tool', tool.id, tool.name)}
                  onNavigateToTab={handleSelectTab}
                />
              )}
            </>
          )}
        </main>

        {/* Global Footer */}
        <Footer language={language} onSelectTab={handleSelectTab} />
      </div>

      <ToastNotification
        message={activeStorageError}
        variant="warning"
        icon="warning"
        onDismiss={dismissStorageError}
      />
    </div>
  );
}
