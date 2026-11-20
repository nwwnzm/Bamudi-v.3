import React, { useState } from 'react';
import {
  Folder,
  FolderPlus,
  FileText,
  Trash2,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../data/translations';

interface Props {
  language: Language;
}

interface SandboxItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  size?: string;
}

const INITIAL_ITEMS: SandboxItem[] = [
  { id: 'f-root-1', name: '01_RPH_Sains_2026', type: 'folder', parentId: null },
  { id: 'f-root-2', name: '02_Lembaran_Kerja', type: 'folder', parentId: null },
  { id: 'file-1', name: 'RPH_Minggu_01_Pengenalan.docx', type: 'file', parentId: null, size: '24 KB' },
  { id: 'file-2', name: 'Kertas_Ujian_Bulanan_1.docx', type: 'file', parentId: null, size: '48 KB' },
  { id: 'file-3', name: 'Rajah_Sel_Tumbuhan.pdf', type: 'file', parentId: null, size: '1.2 MB' },
];

export const FolderManagerSandbox: React.FC<Props> = ({ language }) => {
  const t = translations[language].sandbox.folderManager;
  const [items, setItems] = useState<SandboxItem[]>(INITIAL_ITEMS);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Track interactive practice milestones
  const [didCreateFolder, setDidCreateFolder] = useState(false);
  const [didMoveFile, setDidMoveFile] = useState(false);
  const [didOpenFolder, setDidOpenFolder] = useState(false);

  const currentFolder = items.find((item) => item.id === currentFolderId) ?? null;
  const displayedItems = items.filter((item) => item.parentId === currentFolderId);
  const allFolders = items.filter((item) => item.type === 'folder' && item.id !== currentFolderId);

  const completedGoalsCount = [didCreateFolder, didMoveFile, didOpenFolder].filter(Boolean).length;

  const showTempFeedback = (msg: string) => {
    setError(null);
    setFeedback(msg);
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) {
      setFeedback(null);
      setError(
        language === 'bm'
          ? 'Sila masukkan nama folder terlebih dahulu (contoh: 03_Kuiz_Mingguan).'
          : 'Please enter a folder name first (for example: 03_Weekly_Quizzes).'
      );
      return;
    }

    const duplicateExists = items.some(
      (item) =>
        item.type === 'folder' &&
        item.parentId === currentFolderId &&
        item.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (duplicateExists) {
      setFeedback(null);
      setError(
        language === 'bm'
          ? `Folder "${trimmed}" sudah wujud dalam lokasi ini. Gunakan nama lain.`
          : `A folder named "${trimmed}" already exists here. Try a different name.`
      );
      return;
    }

    const newFolder: SandboxItem = {
      id: `folder-${Date.now()}`,
      name: trimmed,
      type: 'folder',
      parentId: currentFolderId,
    };

    setItems((prev) => [...prev, newFolder]);
    setNewFolderName('');
    setDidCreateFolder(true);
    showTempFeedback(t.successMsg);
  };

  const handleDeleteItem = (item: SandboxItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((entry) => entry.id !== item.id && entry.parentId !== item.id));
    if (currentFolderId === item.id) {
      setCurrentFolderId(null);
    }
    showTempFeedback(
      language === 'bm'
        ? `"${item.name}" dipadam daripada simulasi ini.`
        : `"${item.name}" was removed from this practice space.`
    );
  };

  const handleMoveFile = (fileId: string, destinationValue: string) => {
    if (!destinationValue) return;
    const targetParentId = destinationValue === '__root__' ? null : destinationValue;
    const targetFolderName =
      targetParentId === null
        ? t.myDrive
        : items.find((item) => item.id === targetParentId)?.name || '';

    setItems((prev) =>
      prev.map((item) => (item.id === fileId ? { ...item, parentId: targetParentId } : item))
    );
    setDidMoveFile(true);
    showTempFeedback(
      language === 'bm'
        ? `Fail berjaya dipindahkan ke "${targetFolderName}".`
        : `File moved into "${targetFolderName}" successfully.`
    );
  };

  const handleOpenFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
    setDidOpenFolder(true);
    setError(null);
  };

  const handleReset = () => {
    setItems(INITIAL_ITEMS);
    setNewFolderName('');
    setCurrentFolderId(null);
    setFeedback(null);
    setError(null);
    setDidCreateFolder(false);
    setDidMoveFile(false);
    setDidOpenFolder(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <Folder className="w-5 h-5 text-[#0099ff] shrink-0" aria-hidden="true" />
            <span>{t.title}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">{t.instructions}</p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.reset}</span>
        </button>
      </div>

      {/* Practice Goals Tracker */}
      <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-[#0055aa]">
            {language === 'bm' ? 'Senarai Latihan Praktikal' : 'Practice Checklist'}
          </span>
          <span className="font-mono text-xs font-bold text-[#0055aa] tabular-nums">
            {completedGoalsCount}/3
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {[
            {
              done: didCreateFolder,
              label: language === 'bm' ? '1. Bina 1 folder baharu' : '1. Create 1 new folder',
            },
            {
              done: didMoveFile,
              label: language === 'bm' ? '2. Pindah 1 fail ke folder' : '2. Move 1 file into a folder',
            },
            {
              done: didOpenFolder,
              label: language === 'bm' ? '3. Buka mana-mana folder' : '3. Open a folder to inspect',
            },
          ].map((goal, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                goal.done
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                  : 'bg-white border-sky-100 text-slate-600'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${goal.done ? 'text-emerald-600' : 'text-slate-300'}`}
                aria-hidden="true"
              />
              <span>{goal.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3 bg-[#fdf2f0] border border-[#cc310e]/30 rounded-xl flex items-start gap-2 text-xs font-medium text-[#99240b]"
        >
          <AlertCircle className="w-4 h-4 text-[#cc310e] shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {feedback && (
        <div
          role="status"
          className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-medium text-emerald-900 animate-fadeIn"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200/70">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => {
              setCurrentFolderId(null);
              setError(null);
            }}
            className={`min-h-[44px] px-2.5 rounded-lg inline-flex items-center gap-1.5 hover:bg-white hover:text-[#0066cc] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
              currentFolderId === null ? 'text-[#0066cc] font-bold bg-white shadow-2xs' : ''
            }`}
          >
            {t.myDrive}
          </button>
          {currentFolder && (
            <>
              <span className="text-slate-400" aria-hidden="true">/</span>
              <span className="text-[#0066cc] font-bold truncate max-w-[180px] sm:max-w-xs">
                {currentFolder.name}
              </span>
            </>
          )}
        </div>

        {currentFolder && (
          <button
            type="button"
            onClick={() => setCurrentFolderId(currentFolder.parentId)}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0066cc] bg-white border border-sky-200 hover:bg-sky-50 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{language === 'bm' ? 'Kembali' : 'Up One Level'}</span>
          </button>
        )}
      </div>

      {/* Create Folder Form */}
      <form onSubmit={handleCreateFolder} className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="sandbox-new-folder-name" className="sr-only">
          {t.folderNamePlaceholder}
        </label>
        <input
          id="sandbox-new-folder-name"
          type="text"
          value={newFolderName}
          onChange={(e) => {
            setNewFolderName(e.target.value);
            if (error) setError(null);
          }}
          placeholder={t.folderNamePlaceholder}
          className="flex-1 min-h-[44px] px-3.5 py-2 text-xs sm:text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff]"
        />
        <button
          type="submit"
          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
        >
          <FolderPlus className="w-4 h-4" aria-hidden="true" />
          <span>{t.createFolder}</span>
        </button>
      </form>

      {/* Directory Content List */}
      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
        {displayedItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {t.emptyFolder}
          </div>
        ) : (
          displayedItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 transition-colors ${
                item.type === 'folder' ? 'hover:bg-sky-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.type === 'folder' ? (
                  <Folder className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
                ) : (
                  <FileText className="w-5 h-5 text-sky-500 shrink-0" aria-hidden="true" />
                )}
                <div className="min-w-0">
                  {item.type === 'folder' ? (
                    <button
                      type="button"
                      onClick={() => handleOpenFolder(item.id)}
                      className="text-left min-h-[44px] flex flex-col justify-center cursor-pointer group focus-visible:outline-none focus-visible:underline"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0066cc] truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {`${items.filter((i) => i.parentId === item.id).length} ${t.itemsCount} · ${
                          language === 'bm' ? 'Klik untuk buka' : 'Click to open'
                        }`}
                      </span>
                    </button>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500">{item.size || '32 KB'}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {item.type === 'file' && (
                  <select
                    aria-label={
                      language === 'bm'
                        ? `Pindahkan ${item.name} ke folder`
                        : `Move ${item.name} to folder`
                    }
                    onChange={(e) => {
                      if (e.target.value) {
                        handleMoveFile(item.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="min-h-[44px] text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff]"
                  >
                    <option value="" disabled>
                      {language === 'bm' ? 'Pindah ke...' : 'Move to...'}
                    </option>
                    {currentFolderId !== null && (
                      <option value="__root__">
                        {language === 'bm' ? `↑ ${t.myDrive}` : `↑ ${t.myDrive}`}
                      </option>
                    )}
                    {allFolders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(item, e)}
                  aria-label={
                    language === 'bm' ? `Padam ${item.name}` : `Delete ${item.name}`
                  }
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Honest Local Simulation Note */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
        <span className="inline-flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#0099ff] shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            {language === 'bm'
              ? 'Simulasi latihan tempatan sahaja: Fail dan folder ini hanya wujud dalam sesi latihan ini dan tidak mengubah fail sebenar pada komputer atau Google Drive anda.'
              : 'Local practice simulation only: Files and folders here exist only in this sandbox session and do not modify your computer disk or Google Drive.'}
          </span>
        </span>
        <span className="font-mono text-slate-500 tabular-nums shrink-0">
          {displayedItems.length} {t.itemsCount}
        </span>
      </div>
    </div>
  );
};
