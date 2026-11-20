import React, { useState } from 'react';
import {
  Keyboard,
  UploadCloud,
  Globe,
  Palette,
  ClipboardCheck,
  ShieldCheck,
  Brain,
  Blocks,
  FileSpreadsheet,
  Trophy,
  Gamepad2,
  Cloud,
  StickyNote,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Bookmark,
  Pin,
  X,
  Plus,
  Trash2,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Language, Tutorial } from '../../types';

interface Props {
  tutorial: Tutorial;
  language: Language;
  onOpenPromptBuilder?: () => void;
}

const SimulationNotice: React.FC<{ language: Language; messageBm: string; messageEn: string }> = ({
  language,
  messageBm,
  messageEn,
}) => (
  <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
    <Info className="w-3.5 h-3.5 text-[#0099ff] shrink-0 mt-0.5" aria-hidden="true" />
    <span>{language === 'bm' ? messageBm : messageEn}</span>
  </div>
);

/* 1. SHORTCUT LAB (basic-computer-skills) */
const ShortcutLabSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const scenarios = [
    {
      id: 'copy',
      prompt: {
        bm: 'Anda ingin menyalin satu perenggan nota tanpa memadam teks asal.',
        en: 'You want to copy a paragraph of notes without deleting the original text.',
      },
      correct: 'Ctrl + C',
      options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + Z', 'Right-Click'],
      explanation: {
        bm: 'Ctrl + C menyalin teks atau fail ke papan klip tanpa mengubah bahan asal.',
        en: 'Ctrl + C copies selected text or files to the clipboard without altering the original.',
      },
    },
    {
      id: 'undo',
      prompt: {
        bm: 'Alamak! Anda terpadam jadual soalan RPH secara tidak sengaja.',
        en: 'Oops! You accidentally deleted a table from your lesson plan.',
      },
      correct: 'Ctrl + Z',
      options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + Z', 'Right-Click'],
      explanation: {
        bm: 'Ctrl + Z (Undo) mengembalikan tindakan terakhir anda serta-merta.',
        en: 'Ctrl + Z (Undo) immediately reverses your most recent action.',
      },
    },
    {
      id: 'paste',
      prompt: {
        bm: 'Anda sudah menyalin pautan kuiz dan mahu meletakkannya ke dalam dokumen.',
        en: 'You copied a quiz link and now want to place it inside your document.',
      },
      correct: 'Ctrl + V',
      options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + Z', 'Right-Click'],
      explanation: {
        bm: 'Ctrl + V (Paste) menampal kandungan yang telah disalin.',
        en: 'Ctrl + V (Paste) inserts the item you copied earlier.',
      },
    },
    {
      id: 'rightclick',
      prompt: {
        bm: 'Anda mahu menukar nama fail atau membuka menu pilihan pantas pada fail.',
        en: 'You want to rename a file or open quick options directly on a file.',
      },
      correct: 'Right-Click',
      options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + Z', 'Right-Click'],
      explanation: {
        bm: 'Klik kanan membuka menu konteks dengan pilihan Rename, Copy, dan Delete.',
        en: 'Right-clicking opens the context menu with Rename, Copy, and Delete options.',
      },
    },
  ];

  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lastKeyCombo, setLastKeyCombo] = useState<string>('');

  const current = scenarios[stepIdx];
  const isCorrect = selected === current.correct;

  const handleChoose = (opt: string) => {
    if (selected === null && opt === current.correct) {
      setScore((s) => s + 1);
    }
    setSelected(opt);
  };

  const handleKeyboardPractice = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      const k = e.key.toUpperCase();
      if (['C', 'V', 'Z'].includes(k)) {
        e.preventDefault();
        const combo = `Ctrl + ${k}`;
        setLastKeyCombo(combo);
        handleChoose(combo);
      }
    }
  };

  const handleReset = () => {
    setStepIdx(0);
    setSelected(null);
    setScore(0);
    setLastKeyCombo('');
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyboardPractice}
      className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <Keyboard className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Makmal Pintasan Papan Kekunci' : 'Keyboard Shortcut Practice Lab'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Klik pilihan di bawah atau tekan Ctrl+C, Ctrl+V, atau Ctrl+Z terus pada papan kekunci anda.'
              : 'Click an answer below or press Ctrl+C, Ctrl+V, or Ctrl+Z directly on your keyboard.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Mula Semula' : 'Reset'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-3">
        <span>
          {language === 'bm' ? `Senario ${stepIdx + 1} daripada ${scenarios.length}` : `Scenario ${stepIdx + 1} of ${scenarios.length}`}
        </span>
        <span className="font-mono text-[#0066cc] tabular-nums">
          {language === 'bm' ? `Markah: ${score}/${scenarios.length}` : `Score: ${score}/${scenarios.length}`}
        </span>
      </div>

      {lastKeyCombo && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-sky-50 border border-sky-200 text-xs text-[#0055aa] font-mono">
          {language === 'bm' ? `Kekunci dikesan: ${lastKeyCombo}` : `Key pressed: ${lastKeyCombo}`}
        </div>
      )}

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
        <p className="text-sm font-semibold text-slate-900">{current.prompt[language]}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {current.options.map((opt) => {
          const active = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleChoose(opt)}
              className={`min-h-[44px] px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
                active
                  ? opt === current.correct
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-[#cc310e] text-white border-[#cc310e]'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-[#0099ff] hover:bg-sky-50/50'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          role="status"
          className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 mb-4 ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-[#fdf2f0] border-[#cc310e]/30 text-[#99240b]'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#cc310e] shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <p className="font-bold mb-0.5">
              {isCorrect
                ? language === 'bm'
                  ? 'Tepat sekali!'
                  : 'Spot on!'
                : language === 'bm'
                ? `Kurang tepat. Jawapan terbaik ialah ${current.correct}.`
                : `Not quite. The best choice is ${current.correct}.`}
            </p>
            <p>{current.explanation[language]}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setStepIdx((i) => (i + 1) % scenarios.length);
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
        >
          <span>{language === 'bm' ? 'Senario Seterusnya' : 'Next Scenario'}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <SimulationNotice
        language={language}
        messageBm="Simulasi latihan papan kekunci tempatan sahaja: Tiada fail atau dokumen sebenar pada komputer anda akan diubah."
        messageEn="Local keyboard practice simulation only: No real files or documents on your computer are modified."
      />
    </div>
  );
};

/* 2. UPLOAD CHECKER (upload-download-files) */
const UploadCheckerSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const sampleFiles = [
    { id: 'pdf', name: 'Nota_Sains_Tahun4.pdf', ext: 'PDF', sizeMb: 1.8 },
    { id: 'docx', name: 'RPH_Minggu_3_Sejarah.docx', ext: 'DOCX', sizeMb: 0.4 },
    { id: 'heavy', name: 'Rakaman_Kelas_Penuh.mp4', ext: 'MP4', sizeMb: 38.0 },
    { id: 'unsafe', name: 'Pemasang_Program.exe', ext: 'EXE', sizeMb: 4.5 },
  ];

  const [selectedId, setSelectedId] = useState<string>('pdf');
  const [customName, setCustomName] = useState<string>('Nota_Sains_Tahun4.pdf');
  const [checkedResult, setCheckedResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const selectedFile = sampleFiles.find((f) => f.id === selectedId) ?? sampleFiles[0];

  const handleSelectFile = (f: (typeof sampleFiles)[number]) => {
    setSelectedId(f.id);
    setCustomName(f.name);
    setCheckedResult(null);
  };

  const handleValidate = () => {
    const trimmed = customName.trim();
    if (!trimmed) {
      setCheckedResult({
        ok: false,
        msg:
          language === 'bm'
            ? 'Ralat: Nama fail tidak boleh kosong sebelum dimuat naik.'
            : 'Error: File name cannot be empty before uploading.',
      });
      return;
    }

    if (selectedFile.ext === 'EXE') {
      setCheckedResult({
        ok: false,
        msg:
          language === 'bm'
            ? 'Ditolak: Fail .exe disekat atas faktor keselamatan sekolah. Gunakan format PDF atau DOCX.'
            : 'Blocked: .exe executable files are blocked for school security. Use PDF or DOCX instead.',
      });
      return;
    }

    if (selectedFile.sizeMb > 25) {
      setCheckedResult({
        ok: false,
        msg:
          language === 'bm'
            ? `Gagal: Saiz ${selectedFile.sizeMb} MB melebihi had 25 MB portal pengajaran. Mampatkan video atau kongsi pautan Google Drive.`
            : `Too large: ${selectedFile.sizeMb} MB exceeds the 25 MB portal limit. Compress the video or share a Drive link.`,
      });
      return;
    }

    if (/\s{2,}/.test(trimmed) || !trimmed.includes('.')) {
      setCheckedResult({
        ok: false,
        msg:
          language === 'bm'
            ? 'Amaran nama fail: Pastikan sambungan fail (contoh .pdf atau .docx) dikekalkan.'
            : 'File name warning: Keep the file extension (for example .pdf or .docx) intact.',
      });
      return;
    }

    setCheckedResult({
      ok: true,
      msg:
        language === 'bm'
          ? `Lulus semakan! "${trimmed}" (${selectedFile.sizeMb} MB) sedia dimuat naik ke portal sekolah.`
          : `Ready to upload! "${trimmed}" (${selectedFile.sizeMb} MB) passes format and 25 MB size checks.`,
    });
  };

  const handleReset = () => {
    handleSelectFile(sampleFiles[0]);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <UploadCloud className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Penyemak Kesediaan Muat Naik Fail' : 'Pre-Upload File Validator'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Pilih contoh fail di bawah, semak nama fail, dan uji sama ada fail lulus syarat muat naik (maksimum 25 MB).'
              : 'Pick a sample file below, check its file name, and test whether it passes portal upload rules (25 MB max).'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {sampleFiles.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => handleSelectFile(f)}
            className={`min-h-[44px] text-left p-3 rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] ${
              selectedId === f.id
                ? 'bg-sky-50 border-[#0099ff] text-[#0055aa]'
                : 'bg-white border-slate-200 hover:border-sky-300 text-slate-700'
            }`}
          >
            <p className="text-xs font-bold truncate">{f.name}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              {f.ext} · {f.sizeMb} MB
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="sandbox-upload-rename" className="sr-only">
          {language === 'bm' ? 'Nama fail untuk disemak' : 'File name to validate'}
        </label>
        <input
          id="sandbox-upload-rename"
          type="text"
          value={customName}
          onChange={(e) => {
            setCustomName(e.target.value);
            setCheckedResult(null);
          }}
          className="flex-1 min-h-[44px] px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff]"
        />
        <button
          type="button"
          onClick={handleValidate}
          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
        >
          <UploadCloud className="w-4 h-4" aria-hidden="true" />
          <span>{language === 'bm' ? 'Uji Muat Naik' : 'Test Upload'}</span>
        </button>
      </div>

      {checkedResult && (
        <div
          role={checkedResult.ok ? 'status' : 'alert'}
          className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            checkedResult.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-[#fdf2f0] border-[#cc310e]/30 text-[#99240b]'
          }`}
        >
          {checkedResult.ok ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#cc310e] shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <span>{checkedResult.msg}</span>
        </div>
      )}

      <SimulationNotice
        language={language}
        messageBm="Simulasi semakan tempatan sahaja: Tiada fail dihantar ke pelayan luar."
        messageEn="Local validation simulation only: No files are uploaded to an external server."
      />
    </div>
  );
};

/* 3. BROWSER TABS (internet-browser-navigation) */
interface MiniTab {
  id: string;
  title: string;
  url: string;
  pinned: boolean;
  bookmarked: boolean;
  essential: boolean;
}

const INITIAL_TABS: MiniTab[] = [
  { id: 't1', title: 'DELIMa KPM Portal', url: 'https://d2.delima.edu.my', pinned: false, bookmarked: false, essential: true },
  { id: 't2', title: 'RPH Sains Tahun 5', url: 'https://docs.google.com/rph-5', pinned: false, bookmarked: false, essential: true },
  { id: 't3', title: 'Promo Beli Belah', url: 'https://iklan-contoh.example', pinned: false, bookmarked: false, essential: false },
  { id: 't4', title: 'Video Muzik Rawak', url: 'https://video-hiburan.example', pinned: false, bookmarked: false, essential: false },
  { id: 't5', title: 'Berita Terkini 1', url: 'https://portal-berita.example', pinned: false, bookmarked: false, essential: false },
];

const BrowserTabsSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const [tabs, setTabs] = useState<MiniTab[]>(INITIAL_TABS);
  const [activeId, setActiveId] = useState<string>('t1');

  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0] ?? null;
  const distractionCount = tabs.filter((t) => !t.essential).length;
  const anyBookmarked = tabs.some((t) => t.essential && t.bookmarked);
  const anyPinned = tabs.some((t) => t.essential && t.pinned);

  const toggleBookmark = (id: string) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, bookmarked: !t.bookmarked } : t)));
  };

  const togglePin = (id: string) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));
  };

  const closeTab = (id: string) => {
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeId === id && remaining.length > 0) {
      setActiveId(remaining[0].id);
    }
  };

  const addTeachingTab = () => {
    const nextId = `t-${Date.now()}`;
    const newTab: MiniTab = {
      id: nextId,
      title: language === 'bm' ? 'Kuiz Sains Tahun 5' : 'Year 5 Science Quiz',
      url: 'https://quizizz.com/edu-example',
      pinned: false,
      bookmarked: false,
      essential: true,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveId(nextId);
  };

  const handleReset = () => {
    setTabs(INITIAL_TABS);
    setActiveId('t1');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <Globe className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Simulator Pengurusan Tab Pelayar' : 'Browser Tab Organization Simulator'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Tutup tab gangguan, sematkan (Pin) tab penting, dan tandakan penanda buku (Bookmark).'
              : 'Close distracting tabs, pin an essential teaching tab, and bookmark your key portal.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      {/* Browser Strip */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-200/70">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center rounded-lg border text-xs transition-colors ${
                activeId === tab.id
                  ? 'bg-white border-sky-300 text-slate-900 font-bold shadow-2xs'
                  : 'bg-slate-100 border-transparent text-slate-600 hover:bg-white/70'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveId(tab.id)}
                className="min-h-[44px] px-2.5 py-1.5 inline-flex items-center gap-1.5 cursor-pointer"
              >
                {tab.pinned && <Pin className="w-3 h-3 text-[#0099ff]" aria-hidden="true" />}
                <span className="max-w-[130px] truncate">{tab.title}</span>
              </button>
              <button
                type="button"
                onClick={() => closeTab(tab.id)}
                aria-label={language === 'bm' ? `Tutup tab ${tab.title}` : `Close tab ${tab.title}`}
                className="min-h-[44px] min-w-[36px] px-1.5 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addTeachingTab}
            aria-label={language === 'bm' ? 'Tambah tab pengajaran baharu' : 'Open new teaching tab'}
            className="min-h-[44px] min-w-[44px] px-2.5 inline-flex items-center justify-center rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-slate-300 cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Address Bar & Actions */}
        {activeTab ? (
          <div className="p-3 bg-white flex flex-wrap items-center justify-between gap-2 border-t border-slate-200">
            <div className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 truncate">
              {activeTab.url}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => togglePin(activeTab.id)}
                className={`min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold cursor-pointer ${
                  activeTab.pinned
                    ? 'bg-sky-50 border-[#0099ff] text-[#0055aa]'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Pin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{activeTab.pinned ? (language === 'bm' ? 'Disemat' : 'Pinned') : 'Pin'}</span>
              </button>
              <button
                type="button"
                onClick={() => toggleBookmark(activeTab.id)}
                className={`min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold cursor-pointer ${
                  activeTab.bookmarked
                    ? 'bg-amber-50 border-amber-400 text-amber-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{language === 'bm' ? 'Penanda Buku' : 'Bookmark'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 bg-white">
            {language === 'bm' ? 'Semua tab ditutup. Klik + untuk buka tab baharu.' : 'All tabs closed. Click + to open a new tab.'}
          </div>
        )}
      </div>

      {/* Live Health Feedback */}
      <div
        role="status"
        className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
          distractionCount === 0 && anyBookmarked && anyPinned
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-sky-50/70 border-sky-200 text-slate-700'
        }`}
      >
        <CheckCircle2
          className={`w-4 h-4 shrink-0 mt-0.5 ${
            distractionCount === 0 && anyBookmarked && anyPinned ? 'text-emerald-600' : 'text-[#0099ff]'
          }`}
          aria-hidden="true"
        />
        <div className="space-y-1">
          <p className="font-bold">
            {distractionCount === 0 && anyBookmarked && anyPinned
              ? language === 'bm'
                ? 'Pelayar anda kini kemas, fokus dan menjimatkan memori!'
                : 'Your browser is now clean, focused, and memory-friendly!'
              : language === 'bm'
              ? `Tab tidak berkaitan masih terbuka: ${distractionCount}. Cuba tutup tab iklan/hiburan, sematkan 1 tab kerja, dan simpan Bookmark.`
              : `Distracting tabs still open: ${distractionCount}. Try closing non-teaching tabs, pinning 1 work tab, and bookmarking it.`}
          </p>
        </div>
      </div>

      <SimulationNotice
        language={language}
        messageBm="Simulasi pelayar tempatan sahaja: Pautan di atas adalah contoh dan tidak membuka tapak web luar."
        messageEn="Local browser simulation only: Sample URLs do not open external websites."
      />
    </div>
  );
};

/* 4. LAYOUT STUDIO (powerpoint-effective-slides & canva-for-education) */
const LayoutStudioSandbox: React.FC<{ tutorialId: string; language: Language }> = ({
  tutorialId,
  language,
}) => {
  const isCanva = tutorialId === 'canva-for-education';
  const [denseText, setDenseText] = useState(true);
  const [lowContrast, setLowContrast] = useState(true);
  const [tooManyFonts, setTooManyFonts] = useState(true);
  const [hasVisualAid, setHasVisualAid] = useState(false);

  const issues: string[] = [];
  if (denseText) {
    issues.push(
      language === 'bm'
        ? 'Teks terlalu padat: Gunakan peraturan 6x6 (ringkas kepada 3 hingga 5 poin pendek).'
        : 'Too much text: Use concise bullet points (3 to 5 short bullets max).'
    );
  }
  if (lowContrast) {
    issues.push(
      language === 'bm'
        ? 'Kontras warna lemah: Teks kelabu lembut sukar dibaca dari belakang kelas.'
        : 'Low color contrast: Faint text is hard to read from the back of the classroom.'
    );
  }
  if (tooManyFonts) {
    issues.push(
      language === 'bm'
        ? 'Terlalu banyak jenis fon: Hadkan kepada maksimum 2 keluarga fon sahaja.'
        : 'Too many font styles: Limit your design to a maximum of 2 complementary fonts.'
    );
  }
  if (!hasVisualAid) {
    issues.push(
      language === 'bm'
        ? 'Tiada sokongan visual: Tambah rajah atau ikon ringkas untuk membantu kefahaman murid.'
        : 'Missing visual anchor: Pair key points with a clear icon or diagram.'
    );
  }

  const applyBestPractice = () => {
    setDenseText(false);
    setLowContrast(false);
    setTooManyFonts(false);
    setHasVisualAid(true);
  };

  const handleReset = () => {
    setDenseText(true);
    setLowContrast(true);
    setTooManyFonts(true);
    setHasVisualAid(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <Palette className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>
              {isCanva
                ? language === 'bm'
                  ? 'Studio Reka Letak Poster Canva'
                  : 'Canva Poster Layout Studio'
                : language === 'bm'
                ? 'Studio Semakan Reka Bentuk Slaid'
                : 'Slide Layout Best Practice Studio'}
            </span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Hidupkan atau matikan pilihan di bawah dan lihat perubahan pada pratonton bilik darjah secara langsung.'
              : 'Toggle the design settings below and inspect the live classroom readability preview.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applyBestPractice}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{language === 'bm' ? 'Guna Tetapan Terbaik' : 'Apply Best Practice'}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Toggle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <button
          type="button"
          onClick={() => setDenseText((v) => !v)}
          aria-pressed={!denseText}
          className={`min-h-[44px] text-left px-3.5 py-2.5 rounded-xl border font-semibold cursor-pointer ${
            !denseText ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {denseText
            ? language === 'bm'
              ? '✗ Paragraf panjang (Klik untuk ringkaskan)'
              : '✗ Dense paragraph (Click to simplify)'
            : language === 'bm'
            ? '✓ 3 poin ringkas & mudah dibaca'
            : '✓ 3 concise bullet points'}
        </button>

        <button
          type="button"
          onClick={() => setLowContrast((v) => !v)}
          aria-pressed={!lowContrast}
          className={`min-h-[44px] text-left px-3.5 py-2.5 rounded-xl border font-semibold cursor-pointer ${
            !lowContrast ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {lowContrast
            ? language === 'bm'
              ? '✗ Kontras malap (Klik untuk betulkan)'
              : '✗ Low contrast colors (Click to fix)'
            : language === 'bm'
            ? '✓ Kontras tinggi jelas dari jauh'
            : '✓ High-contrast readable palette'}
        </button>

        <button
          type="button"
          onClick={() => setTooManyFonts((v) => !v)}
          aria-pressed={!tooManyFonts}
          className={`min-h-[44px] text-left px-3.5 py-2.5 rounded-xl border font-semibold cursor-pointer ${
            !tooManyFonts ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {tooManyFonts
            ? language === 'bm'
              ? '✗ 4 gaya fon berbeza (Klik untuk hadkan)'
              : '✗ 4 mixed fonts (Click to standardize)'
            : language === 'bm'
            ? '✓ Maksimum 2 fon seragam'
            : '✓ Consistent 2-font pairing'}
        </button>

        <button
          type="button"
          onClick={() => setHasVisualAid((v) => !v)}
          aria-pressed={hasVisualAid}
          className={`min-h-[44px] text-left px-3.5 py-2.5 rounded-xl border font-semibold cursor-pointer ${
            hasVisualAid ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {hasVisualAid
            ? language === 'bm'
              ? '✓ Rajah visual disertakan'
              : '✓ Supporting visual included'
            : language === 'bm'
            ? '✗ Tiada gambar/ikon (Klik untuk tambah)'
            : '✗ Text-only layout (Click to add visual)'}
        </button>
      </div>

      {/* Live Preview Canvas */}
      <div
        className={`rounded-2xl border p-5 transition-all ${
          lowContrast ? 'bg-amber-100/70 border-amber-200 text-amber-400' : 'bg-[#0a2540] border-sky-900 text-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h5
              className={`text-base sm:text-lg font-bold ${
                tooManyFonts ? 'font-serif italic tracking-widest' : 'font-display'
              }`}
            >
              {isCanva
                ? language === 'bm'
                  ? 'Poster: Kitaran Air Semula Jadi'
                  : 'Poster: The Natural Water Cycle'
                : language === 'bm'
                ? 'Slaid 2: Proses Penyejatan Air'
                : 'Slide 2: Water Evaporation Process'}
            </h5>

            {denseText ? (
              <p className={`text-xs leading-normal ${tooManyFonts ? 'font-mono' : 'font-sans'}`}>
                {language === 'bm'
                  ? 'Penyejatan berlaku apabila cahaya matahari memanaskan air di sungai, tasik, dan lautan sehingga menjadi wap air yang naik ke atmosfera lalu membentuk awan melalui proses kondensasi sebelum turun sebagai hujan dan mengalir semula ke laut.'
                  : 'Evaporation occurs when sunlight warms water in rivers, lakes, and oceans so it transforms into water vapor rising into the atmosphere before condensing into clouds and falling back to Earth as rain.'}
              </p>
            ) : (
              <ul className="text-xs sm:text-sm space-y-1.5 list-disc pl-5">
                <li>{language === 'bm' ? 'Haba matahari memanaskan permukaan air.' : 'Solar heat warms surface water.'}</li>
                <li>{language === 'bm' ? 'Air bertukar menjadi wap dan naik ke udara.' : 'Liquid turns into rising water vapor.'}</li>
                <li>{language === 'bm' ? 'Wap sejuk membentuk titisan awan.' : 'Cooled vapor condenses into clouds.'}</li>
              </ul>
            )}
          </div>

          {hasVisualAid && (
            <div className="shrink-0 w-24 h-24 rounded-2xl bg-sky-500/20 border border-sky-300/40 flex flex-col items-center justify-center p-2 text-center">
              <Cloud className="w-8 h-8 text-sky-300 mb-1" aria-hidden="true" />
              <span className="text-[11px] font-semibold">
                {language === 'bm' ? 'Rajah Visual' : 'Visual Anchor'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Diagnostic Feedback */}
      {issues.length === 0 ? (
        <div role="status" className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>
            {language === 'bm'
              ? 'Cemerlang! Susun atur anda memenuhi semua prinsip kebolehbacaan bilik darjah.'
              : 'Excellent! Your layout meets all classroom readability and contrast guidelines.'}
          </span>
        </div>
      ) : (
        <div role="alert" className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
          <p className="font-bold">
            {language === 'bm'
              ? `${issues.length} perkara perlu diperbaiki:`
              : `${issues.length} layout issues to improve:`}
          </p>
          <ul className="list-disc pl-5 space-y-0.5">
            {issues.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <SimulationNotice
        language={language}
        messageBm="Pratonton tempatan sahaja: Gunakan prinsip yang sama apabila anda mereka bentuk di PowerPoint atau Canva."
        messageEn="Local preview only: Apply these same principles when designing in PowerPoint or Canva."
      />
    </div>
  );
};

/* 5. QUIZ CONFIG CHECKER (google-forms-assessment) */
const QuizConfigSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const [requireName, setRequireName] = useState(false);
  const [quizModeOn, setQuizModeOn] = useState(true);
  const [answerKeySet, setAnswerKeySet] = useState(false);
  const [limitOne, setLimitOne] = useState(true);
  const [testResult, setTestResult] = useState<{ ok: boolean; messages: string[] } | null>(null);

  const runCheck = () => {
    const problems: string[] = [];
    if (!requireName) {
      problems.push(
        language === 'bm'
          ? 'Soalan "Nama Penuh Murid" tidak diwajibkan. Anda tidak dapat mengenal pasti markah murid.'
          : '"Student Full Name" is not marked Required. You will receive anonymous responses.'
      );
    }
    if (!quizModeOn) {
      problems.push(
        language === 'bm'
          ? 'Tetapan "Make this a quiz" masih dimatikan. Google Forms tidak akan mengira markah secara automatik.'
          : '"Make this a quiz" is OFF. Auto-grading will not run.'
      );
    }
    if (!answerKeySet) {
      problems.push(
        language === 'bm'
          ? 'Skema jawapan (Answer Key) belum ditetapkan untuk soalan kuiz.'
          : 'Answer Key and point values have not been configured yet.'
      );
    }

    if (problems.length > 0) {
      setTestResult({ ok: false, messages: problems });
    } else {
      setTestResult({
        ok: true,
        messages: [
          language === 'bm'
            ? `Simulasi lulus! Nama murid wajib diisi, kuiz automatik aktif, skema jawapan lengkap${
                limitOne ? ', dan had 1 respons diaktifkan.' : '.'
              }`
            : `Simulation passed! Student name is required, Quiz Mode and Answer Key are ready${
                limitOne ? ', and 1-response limit is active.' : '.'
              }`,
        ],
      });
    }
  };

  const handleReset = () => {
    setRequireName(false);
    setQuizModeOn(true);
    setAnswerKeySet(false);
    setLimitOne(true);
    setTestResult(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <ClipboardCheck className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Penyemak Tetapan Kuiz Auto-Semak' : 'Auto-Grading Quiz Setup Checker'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Laraskan tetapan borang kuiz di bawah dan klik "Uji Penghantaran" untuk mengesan kesilapan biasa.'
              : 'Configure the quiz toggles below and click "Run Test Check" to catch common setup mistakes.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      <div className="space-y-2.5 text-xs">
        {[
          {
            checked: requireName,
            onToggle: () => {
              setRequireName((v) => !v);
              setTestResult(null);
            },
            label:
              language === 'bm'
                ? 'Wajibkan medan "Nama Penuh Murid & Kelas" (Required)'
                : 'Require "Student Full Name & Class" field',
          },
          {
            checked: quizModeOn,
            onToggle: () => {
              setQuizModeOn((v) => !v);
              setTestResult(null);
            },
            label:
              language === 'bm'
                ? 'Aktifkan "Make this a quiz" dalam Settings'
                : 'Turn ON "Make this a quiz" in Settings',
          },
          {
            checked: answerKeySet,
            onToggle: () => {
              setAnswerKeySet((v) => !v);
              setTestResult(null);
            },
            label:
              language === 'bm'
                ? 'Tetapkan Jawapan Betul & Markah (Answer Key)'
                : 'Assign Answer Key & Point Values',
          },
          {
            checked: limitOne,
            onToggle: () => {
              setLimitOne((v) => !v);
              setTestResult(null);
            },
            label:
              language === 'bm'
                ? 'Hadkan kepada 1 percubaan bagi setiap murid (DELIMa)'
                : 'Limit to 1 response per student account',
          },
        ].map((item, idx) => (
          <label
            key={idx}
            className="min-h-[44px] flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-sky-50/50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={item.onToggle}
              className="w-4 h-4 accent-[#0099ff] rounded cursor-pointer"
            />
            <span className="font-semibold text-slate-800">{item.label}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={runCheck}
        className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
        <span>{language === 'bm' ? 'Uji Konfigurasi Kuiz' : 'Run Quiz Setup Check'}</span>
      </button>

      {testResult && (
        <div
          role={testResult.ok ? 'status' : 'alert'}
          className={`p-3.5 rounded-xl border text-xs space-y-1 ${
            testResult.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-[#fdf2f0] border-[#cc310e]/30 text-[#99240b]'
          }`}
        >
          {testResult.messages.map((m, i) => (
            <p key={i} className="font-medium">
              • {m}
            </p>
          ))}
        </div>
      )}

      <SimulationNotice
        language={language}
        messageBm="Simulasi semakan tetapan sahaja: Tidak disambungkan ke akaun Google Forms sebenar."
        messageEn="Local setup simulation only: Not connected to a live Google Forms account."
      />
    </div>
  );
};

/* 6. CLASSROOM PERMISSIONS (google-classroom-essentials) */
const ClassroomPermissionsSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const tasks = [
    {
      id: 'notes',
      title: {
        bm: 'Tugasan 1: Anda memuat naik Nota Rujukan PDF untuk dibaca oleh semua murid.',
        en: 'Task 1: You attach a Reference Notes PDF for all pupils to read.',
      },
      best: 'view',
    },
    {
      id: 'worksheet',
      title: {
        bm: 'Tugasan 2: Anda mahu setiap murid mengisi lembaran kerja Google Docs secara individu.',
        en: 'Task 2: You want every student to complete an individual Google Docs worksheet.',
      },
      best: 'copy',
    },
    {
      id: 'brainstorm',
      title: {
        bm: 'Tugasan 3: Satu kelas menyumbang idea serentak di dalam satu papan slaid kumpulan.',
        en: 'Task 3: The whole class brainstorms together inside one shared slide deck.',
      },
      best: 'edit',
    },
  ];

  const [taskIdx, setTaskIdx] = useState(0);
  const [choice, setChoice] = useState<'view' | 'edit' | 'copy' | null>(null);

  const current = tasks[taskIdx];
  const isOptimal = choice === current.best;

  const getFeedback = (pick: 'view' | 'edit' | 'copy') => {
    if (current.id === 'notes') {
      if (pick === 'view') {
        return language === 'bm'
          ? 'Tepat! Murid boleh membaca tanpa mengubah dokumen asal guru.'
          : 'Correct! Pupils can read safely without altering your original notes.';
      }
      if (pick === 'edit') {
        return language === 'bm'
          ? 'Berisiko! Murid boleh terpadam nota rujukan utama guru.'
          : 'Risky! Pupils could accidentally overwrite your master reference notes.';
      }
      return language === 'bm'
        ? 'Boleh berfungsi, tetapi membazir salinan pendua untuk nota bacaan sahaja.'
        : 'Works, but creates unnecessary duplicate copies for read-only notes.';
    }
    if (current.id === 'worksheet') {
      if (pick === 'copy') {
        return language === 'bm'
          ? 'Tepat sekali! Setiap murid menerima salinan tersendiri dengan nama mereka automatik.'
          : 'Spot on! Each student receives a personal copy labeled with their name.';
      }
      if (pick === 'edit') {
        return language === 'bm'
          ? 'Bahaya! Semua 30 murid akan menaip dan menimpa fail yang sama.'
          : 'Danger! All 30 pupils would overwrite the exact same worksheet file.';
      }
      return language === 'bm'
        ? 'Murid hanya boleh membaca dan tidak dapat menaip jawapan.'
        : 'Pupils would only be able to read and could not type their answers.';
    }
    if (pick === 'edit') {
      return language === 'bm'
        ? 'Tepat! "Students can edit" sesuai untuk sumbang saran kolaboratif satu kelas.'
        : 'Correct! "Students can edit" is made for live whole-class collaboration.';
    }
    return language === 'bm'
      ? 'Pilihan ini menyekat murid daripada bekerjasama dalam satu dokumen yang sama.'
      : 'This option prevents pupils from collaborating inside the same shared file.';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <ShieldCheck className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Aliran Tetapan Kebenaran Fail Tugasan' : 'Assignment Permission Flow Simulator'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Pilih kebenaran fail yang betul bagi setiap situasi tugasan Google Classroom.'
              : 'Pick the safest Google Classroom attachment permission for each teaching scenario.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTaskIdx(0);
            setChoice(null);
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tasks.map((task, i) => (
          <button
            key={task.id}
            type="button"
            onClick={() => {
              setTaskIdx(i);
              setChoice(null);
            }}
            className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
              taskIdx === i
                ? 'bg-[#0099ff] text-white border-[#0099ff]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
            }`}
          >
            {language === 'bm' ? `Tugasan ${i + 1}` : `Task ${i + 1}`}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900">
        {current.title[language]}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[
          { key: 'view' as const, label: language === 'bm' ? 'Murid boleh lihat' : 'Students can view' },
          { key: 'edit' as const, label: language === 'bm' ? 'Murid boleh edit' : 'Students can edit' },
          { key: 'copy' as const, label: language === 'bm' ? 'Buat salinan setiap murid' : 'Make a copy for each student' },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setChoice(opt.key)}
            className={`min-h-[44px] px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
              choice === opt.key
                ? opt.key === current.best
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#cc310e] text-white border-[#cc310e]'
                : 'bg-white text-slate-800 border-slate-300 hover:border-[#0099ff]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {choice && (
        <div
          role={isOptimal ? 'status' : 'alert'}
          className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            isOptimal
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-[#fdf2f0] border-[#cc310e]/30 text-[#99240b]'
          }`}
        >
          {isOptimal ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#cc310e] shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <span className="font-medium">{getFeedback(choice)}</span>
        </div>
      )}

      <SimulationNotice
        language={language}
        messageBm="Simulasi latihan tempatan sahaja: Tiada tugasan dihantar ke Google Classroom sebenar."
        messageEn="Local training simulation only: No assignments are posted to Google Classroom."
      />
    </div>
  );
};

/* 7. AI SCENARIO LAB (intro-generative-ai, responsible-ai-education, fact-checking-ai-content) */
const AiScenarioLabSandbox: React.FC<{ tutorialId: string; language: Language }> = ({
  tutorialId,
  language,
}) => {
  const scenarioSets: Record<
    string,
    {
      title: { bm: string; en: string };
      subtitle: { bm: string; en: string };
      items: {
        statement: { bm: string; en: string };
        answer: 'safe' | 'caution';
        labelSafe: { bm: string; en: string };
        labelCaution: { bm: string; en: string };
        reason: { bm: string; en: string };
      }[];
    }
  > = {
    'intro-generative-ai': {
      title: { bm: 'Makmal Penilaian Penggunaan AI Guru', en: 'AI Suitability Intuition Check' },
      subtitle: {
        bm: 'Tentukan sama ada situasi berikut sesuai diserahkan kepada AI sebagai draf awal atau berisiko.',
        en: 'Decide whether each classroom request is safe for AI drafting or risky.',
      },
      items: [
        {
          statement: {
            bm: 'Minta AI mencadangkan 3 idea set induksi 5 minit untuk topik Fotosintesis Tahun 4.',
            en: 'Ask AI to suggest 3 five-minute hook activities for Year 4 Photosynthesis.',
          },
          answer: 'safe',
          labelSafe: { bm: 'Sesuai & Selamat', en: 'Safe Use Case' },
          labelCaution: { bm: 'Berisiko / Tidak Sesuai', en: 'Risky / Avoid' },
          reason: {
            bm: 'Sesuai! Idea aktiviti umum tidak melibatkan data peribadi dan guru masih menapis sebelum mengajar.',
            en: 'Safe! General lesson ideas involve no private data and you still review them before teaching.',
          },
        },
        {
          statement: {
            bm: 'Tampal markah ujian dan nombor MyKid murid supaya AI menulis ulasan kad laporan.',
            en: 'Paste pupil test scores and ID card numbers so AI writes report card remarks.',
          },
          answer: 'caution',
          labelSafe: { bm: 'Sesuai & Selamat', en: 'Safe Use Case' },
          labelCaution: { bm: 'Berisiko / Tidak Sesuai', en: 'Risky / Avoid' },
          reason: {
            bm: 'Elakkan! Jangan masukkan nama penuh atau nombor pengenalan murid ke dalam alat AI awam.',
            en: 'Avoid! Never enter student full names or national ID numbers into public AI tools.',
          },
        },
        {
          statement: {
            bm: 'Menggunakan teks sejarah janaan AI terus untuk peperiksaan tanpa menyemak tarikh dan fakta.',
            en: 'Using AI-generated historical dates directly in an exam without verifying sources.',
          },
          answer: 'caution',
          labelSafe: { bm: 'Sesuai & Selamat', en: 'Safe Use Case' },
          labelCaution: { bm: 'Berisiko / Tidak Sesuai', en: 'Risky / Avoid' },
          reason: {
            bm: 'Berisiko! AI boleh menghasilkan maklumat salah dengan nada yakin (halusinasi). Sentiasa semak buku teks.',
            en: 'Risky! AI can sound confident while inventing facts. Always verify against official textbooks.',
          },
        },
      ],
    },
    'responsible-ai-education': {
      title: { bm: 'Semakan Privasi Data Bilik Darjah', en: 'Classroom Data Privacy Scenario Check' },
      subtitle: {
        bm: 'Nilai sama ada setiap maklumat ini selamat dikongsi dengan alat AI atau dilarang sama sekali.',
        en: 'Evaluate whether each piece of classroom information is safe to share or strictly prohibited.',
      },
      items: [
        {
          statement: {
            bm: 'Nama penuh murid, alamat rumah, dan status pendapatan keluarga.',
            en: 'Student full name, home address, and family income details.',
          },
          answer: 'caution',
          labelSafe: { bm: 'Selamat Dikongsi', en: 'Safe to Share' },
          labelCaution: { bm: 'Dilarang Keras', en: 'Strictly Prohibited' },
          reason: {
            bm: 'Dilarang keras! Maklumat peribadi murid dan keluarga mesti dilindungi daripada alat AI awam.',
            en: 'Strictly prohibited! Student and family PII must never be shared with public AI platforms.',
          },
        },
        {
          statement: {
            bm: 'Standard kandungan DSKP umum tanpa sebarang identiti murid (cth: Pecahan Wajar Tahun 3).',
            en: 'General curriculum topic without student identity (for example Year 3 Fractions).',
          },
          answer: 'safe',
          labelSafe: { bm: 'Selamat Dikongsi', en: 'Safe to Share' },
          labelCaution: { bm: 'Dilarang Keras', en: 'Strictly Prohibited' },
          reason: {
            bm: 'Selamat! Topik kurikulum umum tidak mendedahkan sebarang maklumat sulit murid.',
            en: 'Safe! General syllabus concepts contain zero personal or confidential student data.',
          },
        },
        {
          statement: {
            bm: 'Menggantikan identiti dengan kod ringkas seperti "Murid A perlu bantuan asas membaca".',
            en: 'Anonymizing with generic labels like "Student A needs foundational reading support".',
          },
          answer: 'safe',
          labelSafe: { bm: 'Selamat Dikongsi', en: 'Safe to Share' },
          labelCaution: { bm: 'Dilarang Keras', en: 'Strictly Prohibited' },
          reason: {
            bm: 'Selamat jika tiada butiran lain yang membolehkan murid dikenal pasti.',
            en: 'Safe as long as no identifying context is included.',
          },
        },
      ],
    },
    'fact-checking-ai-content': {
      title: { bm: 'Makmal Kesan Fakta vs Halusinasi AI', en: 'Fact vs Hallucination Detection Lab' },
      subtitle: {
        bm: 'Semak setiap petikan jawapan AI dan kenal pasti petunjuk fakta tepat atau halusinasi.',
        en: 'Inspect each AI snippet and decide whether it is reliable or shows hallucination clues.',
      },
      items: [
        {
          statement: {
            bm: '"Menurut Jurnal Pendidikan Asia 2024 (halaman 112), kaedah X menaikkan markah sebanyak 94.7% tepat."',
            en: '"According to Asia Pedagogy Journal 2024 (page 112), Method X raised scores by exactly 94.7%."',
          },
          answer: 'caution',
          labelSafe: { bm: 'Boleh Dipercayai Terus', en: 'Trust Directly' },
          labelCaution: { bm: 'Semak Sumber (Syak Halusinasi)', en: 'Verify (Possible Hallucination)' },
          reason: {
            bm: 'Waspada! AI kerap mereka petikan jurnal, halaman, dan peratusan yang kelihatan terperinci tetapi tidak wujud.',
            en: 'Be careful! AI often invents specific journal titles, page numbers, and overly neat statistics.',
          },
        },
        {
          statement: {
            bm: 'Draf senarai 5 kata kerja aktif dalam Bahasa Melayu yang disemak semula guru menggunakan kamus.',
            en: 'A draft list of 5 action verbs verified by the teacher against the class textbook.',
          },
          answer: 'safe',
          labelSafe: { bm: 'Selamat Digunakan', en: 'Verified & Safe' },
          labelCaution: { bm: 'Tidak Selamat', en: 'Unsafe' },
          reason: {
            bm: 'Selamat! Pengesahan manusia menggunakan rujukan rasmi memastikan ketepatan sebelum dibawa ke kelas.',
            en: 'Safe! Teacher verification against trusted textbooks keeps classroom content accurate.',
          },
        },
        {
          statement: {
            bm: 'Penjelasan punca Kemerdekaan Malaysia dengan tarikh penting tanpa merujuk buku teks Sejarah.',
            en: 'Dates and causes of historical events taken straight from AI without textbook checking.',
          },
          answer: 'caution',
          labelSafe: { bm: 'Boleh Dipercayai Terus', en: 'Trust Directly' },
          labelCaution: { bm: 'Wajib Semak Buku Teks', en: 'Must Verify Textbook' },
          reason: {
            bm: 'Wajib semak! Tarikh, nama tokoh, dan perincian sejarah sering tertukar oleh model bahasa.',
            en: 'Always verify! Dates, names, and historical facts are frequently mixed up by language models.',
          },
        },
      ],
    },
  };

  const set = scenarioSets[tutorialId] ?? scenarioSets['intro-generative-ai'];
  const [answers, setAnswers] = useState<Record<number, 'safe' | 'caution'>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = set.items.filter((it, idx) => answers[idx] === it.answer).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <Brain className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{set.title[language]}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">{set.subtitle[language]}</p>
        </div>

        <button
          type="button"
          onClick={() => setAnswers({})}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      <div className="text-xs font-mono font-bold text-[#0066cc] tabular-nums">
        {language === 'bm'
          ? `Dinilai: ${answeredCount}/${set.items.length} · Tepat: ${correctCount}/${set.items.length}`
          : `Evaluated: ${answeredCount}/${set.items.length} · Correct: ${correctCount}/${set.items.length}`}
      </div>

      <div className="space-y-3">
        {set.items.map((item, idx) => {
          const picked = answers[idx];
          const isRight = picked === item.answer;
          return (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-slate-900">{item.statement[language]}</p>
              <div className="flex flex-wrap gap-2">
                {(['safe', 'caution'] as const).map((choiceKey) => (
                  <button
                    key={choiceKey}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [idx]: choiceKey }))}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                      picked === choiceKey
                        ? choiceKey === item.answer
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-[#cc310e] text-white border-[#cc310e]'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-[#0099ff]'
                    }`}
                  >
                    {choiceKey === 'safe' ? item.labelSafe[language] : item.labelCaution[language]}
                  </button>
                ))}
              </div>
              {picked && (
                <div
                  role={isRight ? 'status' : 'alert'}
                  className={`p-3 rounded-lg border text-xs ${
                    isRight
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-[#fdf2f0] border-[#cc310e]/30 text-[#99240b]'
                  }`}
                >
                  {item.reason[language]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SimulationNotice
        language={language}
        messageBm="Latihan luar talian sahaja: Tiada model AI luar dihubungi dalam aktiviti penilaian ini."
        messageEn="Offline practice exercise only: No external AI model API is called during this check."
      />
    </div>
  );
};

/* 8. PROMPT ANATOMY (prompt-writing-teachers) - links to sidebar Prompt Builder without duplicating it */
const PromptAnatomySandbox: React.FC<{
  language: Language;
  onOpenPromptBuilder?: () => void;
}> = ({ language, onOpenPromptBuilder }) => {
  const blocks = [
    {
      id: 'role',
      snippet: {
        bm: '"Bertindak sebagai Guru Sains Sekolah Rendah..."',
        en: '"Act as a Primary School Science Teacher..."',
      },
      correctPart: 'role',
    },
    {
      id: 'topic',
      snippet: {
        bm: '"...bina latihan tentang Kitaran Air Semula Jadi..."',
        en: '"...create practice questions on the Natural Water Cycle..."',
      },
      correctPart: 'topic',
    },
    {
      id: 'level',
      snippet: {
        bm: '"...untuk murid Tahun 4 aras sederhana..."',
        en: '"...tailored for Grade 4 mixed-ability pupils..."',
      },
      correctPart: 'level',
    },
    {
      id: 'format',
      snippet: {
        bm: '"...dalam jadual 5 soalan beserta skema jawapan."',
        en: '"...formatted as a 5-question table with an answer key."',
      },
      correctPart: 'format',
    },
  ];

  const [picks, setPicks] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const partLabels = [
    { value: 'role', label: language === 'bm' ? '1. Peranan (Role)' : '1. Role' },
    { value: 'topic', label: language === 'bm' ? '2. Topik (Topic)' : '2. Topic' },
    { value: 'level', label: language === 'bm' ? '3. Tahap Murid (Level)' : '3. Student Level' },
    { value: 'format', label: language === 'bm' ? '4. Format Hasilan (Format)' : '4. Output Format' },
  ];

  const allPicked = blocks.every((b) => Boolean(picks[b.id]));
  const correctTotal = blocks.filter((b) => picks[b.id] === b.correctPart).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <Blocks className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Latihan Anatomi Formula Gesaan' : '4-Part Prompt Anatomy Practice'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Padankan setiap bahagian ayat di bawah dengan komponen formula gesaan yang betul.'
              : 'Match each prompt phrase below to its correct 4-part formula component.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPicks({});
            setChecked(false);
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {blocks.map((block) => {
          const val = picks[block.id] || '';
          const isMatch = val === block.correctPart;
          return (
            <div
              key={block.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                {block.snippet[language]}
              </span>

              <select
                aria-label={block.snippet[language]}
                value={val}
                onChange={(e) => {
                  setPicks((prev) => ({ ...prev, [block.id]: e.target.value }));
                  setChecked(false);
                }}
                className={`min-h-[44px] px-3 py-2 text-xs font-bold rounded-xl border bg-white cursor-pointer shrink-0 ${
                  checked
                    ? isMatch
                      ? 'border-emerald-500 text-emerald-800'
                      : 'border-[#cc310e] text-[#99240b]'
                    : 'border-slate-300 text-slate-700'
                }`}
              >
                <option value="">{language === 'bm' ? 'Pilih komponen...' : 'Select component...'}</option>
                {partLabels.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          <span>{language === 'bm' ? 'Semak Padanan' : 'Check Matches'}</span>
        </button>

        {onOpenPromptBuilder && (
          <button
            type="button"
            onClick={onOpenPromptBuilder}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0055aa] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#0099ff]" aria-hidden="true" />
            <span>
              {language === 'bm'
                ? 'Buka Alat Penjana Gesaan AI di Bar Sisi'
                : 'Open Standalone AI Prompt Builder'}
            </span>
          </button>
        )}
      </div>

      {checked && (
        <div
          role={!allPicked || correctTotal < blocks.length ? 'alert' : 'status'}
          className={`p-3.5 rounded-xl border text-xs font-semibold ${
            allPicked && correctTotal === blocks.length
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-[#fdf2f0] border-[#cc310e]/30 text-[#99240b]'
          }`}
        >
          {!allPicked
            ? language === 'bm'
              ? 'Sila pilih padanan bagi keempat-empat baris sebelum menyemak.'
              : 'Please select a component for all 4 lines before checking.'
            : correctTotal === blocks.length
            ? language === 'bm'
              ? 'Tahniah! Anda berjaya mengenal pasti kesemua 4 komponen formula gesaan.'
              : 'Well done! You identified all 4 prompt formula components accurately.'
            : language === 'bm'
            ? `${correctTotal}/4 tepat. Semak semula petak berbingkai merah.`
            : `${correctTotal}/4 correct. Review the highlighted selections above.`}
        </div>
      )}

      <SimulationNotice
        language={language}
        messageBm="Latihan struktur gesaan tempatan sahaja. Untuk membina dan menyalin gesaan lengkap bagi mana-mana subjek, gunakan menu Pembina Gesaan AI di bar sisi."
        messageEn="Local structure exercise only. To assemble and copy full classroom prompts for any subject, open AI Prompt Builder from the sidebar."
      />
    </div>
  );
};

/* 9. RPH SCAFFOLD GENERATOR (ai-lesson-preparation) */
const RphScaffoldSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const [objectiveType, setObjectiveType] = useState<'vague' | 'measurable'>('vague');
  const [hasHook, setHasHook] = useState(true);
  const [hasPak21, setHasPak21] = useState(false);
  const [hasReflection, setHasReflection] = useState(true);
  const [checked, setChecked] = useState(false);

  const issues: string[] = [];
  if (objectiveType === 'vague') {
    issues.push(
      language === 'bm'
        ? 'Objektif "Murid faham tajuk" terlalu kabur. Tukar kepada kata kerja boleh ukur seperti "Murid dapat menyenaraikan 3 peringkat..."'
        : 'Objective "Pupils understand topic" is vague. Use measurable action verbs like "Pupils can list 3 stages..."'
    );
  }
  if (!hasHook) {
    issues.push(
      language === 'bm'
        ? 'Set Induksi tiada: Tambah aktiviti pemula 5 minit untuk menarik fokus murid.'
        : 'Missing Set Induction: Add a 5-minute starter hook to engage learners.'
    );
  }
  if (!hasPak21) {
    issues.push(
      language === 'bm'
        ? 'Aktiviti PAK-21 belum dipilih: Sertakan aktiviti berpusatkan murid seperti Think-Pair-Share atau Gallery Walk.'
        : 'No student-centered activity selected: Include an active task like Think-Pair-Share or Gallery Walk.'
    );
  }
  if (!hasReflection) {
    issues.push(
      language === 'bm'
        ? 'Penutup / Refleksi tiada: Tambah semakan exit ticket sebelum kelas tamat.'
        : 'Missing Reflection: Add a quick exit-ticket closure check.'
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <FileSpreadsheet className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Penyusun Struktur RPH Interaktif' : 'Interactive Lesson Plan Scaffold Checker'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Pilih komponen RPH yang berkualiti untuk membina rangka pengajaran harian yang lengkap.'
              : 'Select strong lesson components to assemble a measurable daily lesson scaffold.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setObjectiveType('vague');
            setHasHook(true);
            setHasPak21(false);
            setHasReflection(true);
            setChecked(false);
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <p className="font-bold text-slate-800 mb-2">
            {language === 'bm' ? '1. Pilih gaya Objektif Pembelajaran:' : '1. Choose Learning Objective phrasing:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setObjectiveType('vague');
                setChecked(false);
              }}
              className={`min-h-[44px] text-left p-3 rounded-xl border font-medium cursor-pointer ${
                objectiveType === 'vague' ? 'bg-sky-50 border-[#0099ff] text-[#0055aa]' : 'bg-white border-slate-200'
              }`}
            >
              {language === 'bm'
                ? 'A: "Murid memahami konsep kitaran air."'
                : 'A: "Pupils understand the water cycle."'}
            </button>
            <button
              type="button"
              onClick={() => {
                setObjectiveType('measurable');
                setChecked(false);
              }}
              className={`min-h-[44px] text-left p-3 rounded-xl border font-medium cursor-pointer ${
                objectiveType === 'measurable' ? 'bg-sky-50 border-[#0099ff] text-[#0055aa]' : 'bg-white border-slate-200'
              }`}
            >
              {language === 'bm'
                ? 'B: "Murid dapat melabel 3 proses kitaran air dengan tepat."'
                : 'B: "Pupils can label 3 water cycle stages accurately."'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { checked: hasHook, set: setHasHook, label: language === 'bm' ? 'Set Induksi (5 min)' : 'Set Induction (5 min)' },
            { checked: hasPak21, set: setHasPak21, label: language === 'bm' ? 'Aktiviti Think-Pair-Share' : 'Think-Pair-Share Activity' },
            { checked: hasReflection, set: setHasReflection, label: language === 'bm' ? 'Refleksi Exit Ticket' : 'Exit Ticket Reflection' },
          ].map((item, idx) => (
            <label
              key={idx}
              className="min-h-[44px] flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {
                  item.set((v: boolean) => !v);
                  setChecked(false);
                }}
                className="w-4 h-4 accent-[#0099ff]"
              />
              <span className="font-semibold text-slate-800">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setChecked(true)}
        className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
        <span>{language === 'bm' ? 'Semak Struktur RPH' : 'Validate RPH Structure'}</span>
      </button>

      {checked && (
        <div
          role={issues.length === 0 ? 'status' : 'alert'}
          className={`p-3.5 rounded-xl border text-xs space-y-1 ${
            issues.length === 0
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-[#fdf2f0] border-[#cc310e]/30 text-[#99240b]'
          }`}
        >
          {issues.length === 0 ? (
            <p className="font-bold">
              {language === 'bm'
                ? 'Rangka RPH mantap! Objektif boleh diukur dan kesemua fasa pengajaran lengkap.'
                : 'Solid lesson scaffold! Your objective is measurable and all phases are present.'}
            </p>
          ) : (
            issues.map((msg, i) => <p key={i}>• {msg}</p>)
          )}
        </div>
      )}

      <SimulationNotice
        language={language}
        messageBm="Latihan struktur RPH tempatan sahaja. Untuk menjana dan menyimpan RPH lengkap anda, gunakan modul Penjana RPH di bar sisi."
        messageEn="Local scaffold exercise only. To create and save your actual lesson plans, use the RPH Generator in the sidebar."
      />
    </div>
  );
};

/* 10. GAMIFIED QUIZ (interactive-classroom-quizzes) */
const GamifiedQuizSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const questions = [
    {
      q: {
        bm: 'Apakah panjang teks soalan kuiz permainan yang paling sesuai untuk murid sekolah rendah?',
        en: 'What question length works best for younger pupils in a timed classroom quiz?',
      },
      options: [
        { bm: 'Ringkas dan terus kepada maksud (1 baris)', en: 'Short and direct (1 concise sentence)' },
        { bm: 'Karangan panjang 6 baris sebelum soalan', en: '6-line paragraph before the question' },
      ],
      correct: 0,
    },
    {
      q: {
        bm: 'Mengapa paparan nama samaran atau mod pasukan membantu murid pemalu?',
        en: 'Why do team mode or friendly nicknames help shy learners participate?',
      },
      options: [
        { bm: 'Supaya markah boleh dipamer untuk memalukan murid', en: 'To publicly embarrass lower scores' },
        { bm: 'Mengurangkan rasa takut silap di hadapan rakan sekelas', en: 'Reduces fear of making mistakes in front of peers' },
      ],
      correct: 1,
    },
  ];

  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const current = questions[qIdx];

  const handleAnswer = (optIdx: number) => {
    if (picked !== null) return;
    setPicked(optIdx);
    if (optIdx === current.correct) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <span>{language === 'bm' ? 'Simulasi Kuiz Interaktif Kelas' : 'Gamified Quiz Interaction Sandbox'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Alami pengalaman menjawab dari sudut pandangan murid sebelum menguji di dalam kelas.'
              : 'Experience a quick live-quiz round from the student perspective.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setQIdx(0);
            setPicked(null);
            setStreak(0);
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Main Semula' : 'Replay'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-600">
          {language === 'bm' ? `Pusingan ${qIdx + 1}/${questions.length}` : `Round ${qIdx + 1}/${questions.length}`}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono tabular-nums">
          {language === 'bm' ? `Rantaian Betul: ${streak}` : `Streak: ${streak}`}
        </span>
      </div>

      <div className="p-4 rounded-xl bg-[#0a2540] text-white text-sm font-bold">
        {current.q[language]}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAnswer(idx)}
            className={`min-h-[44px] p-3.5 rounded-xl border text-left text-xs sm:text-sm font-bold cursor-pointer transition-all ${
              picked === null
                ? 'bg-white border-slate-300 hover:border-[#0099ff] hover:bg-sky-50/50 text-slate-800'
                : idx === current.correct
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : picked === idx
                ? 'bg-[#cc310e] border-[#cc310e] text-white'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            {opt[language]}
          </button>
        ))}
      </div>

      {picked !== null && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="text-xs font-bold text-slate-700">
            {picked === current.correct
              ? language === 'bm'
                ? 'Jawapan tepat! Masa tindak balas cepat.'
                : 'Correct answer! Fast, clear reading flow.'
              : language === 'bm'
              ? 'Cuba bandingkan dengan pilihan jawapan hijau.'
              : 'Compare with the highlighted green option.'}
          </span>
          <button
            type="button"
            onClick={() => {
              setPicked(null);
              setQIdx((i) => (i + 1) % questions.length);
            }}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl cursor-pointer"
          >
            <span>{language === 'bm' ? 'Soalan Seterusnya' : 'Next Question'}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <SimulationNotice
        language={language}
        messageBm="Simulasi kuiz tempatan sahaja: Tiada kod bilik pelajar atau papan pendahulu langsung disambungkan."
        messageEn="Local quiz simulation only: No live student room code or external leaderboard server is connected."
      />
    </div>
  );
};

/* 11. GAME FORMAT SWITCHER (digital-educational-games) */
const GameSwitcherSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const [mode, setMode] = useState<'wheel' | 'quiz' | 'match'>('wheel');
  const [wheelTopic, setWheelTopic] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const wheelItems = [
    language === 'bm' ? 'Sebut 1 contoh haiwan herbivor' : 'Name 1 herbivore animal',
    language === 'bm' ? 'Beri 1 contoh tenaga boleh baharu' : 'Give 1 renewable energy example',
    language === 'bm' ? 'Terangkan proses penyejatan ringkas' : 'Explain evaporation in 1 sentence',
    language === 'bm' ? 'Bina 1 ayat menggunakan kata adjektif' : 'Make 1 sentence with an adjective',
  ];

  const handleSpin = () => {
    const next = wheelItems[Math.floor(Math.random() * wheelItems.length)];
    setWheelTopic(next);
  };

  const toggleMatch = (id: string) => {
    setMatchedPairs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <Gamepad2 className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Pratonton Penukar Format Permainan' : 'Game Format Switcher Preview'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Tukar antara 3 templat permainan menggunakan bahan pengajaran yang sama.'
              : 'Switch across 3 game templates to preview how one topic adapts to each activity.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setWheelTopic(null);
            setMatchedPairs([]);
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'wheel' as const, label: language === 'bm' ? 'Roda Putar (Lisan)' : 'Spin Wheel (Oral)' },
          { id: 'quiz' as const, label: language === 'bm' ? 'Rancangan Kuiz' : 'Quiz Show' },
          { id: 'match' as const, label: language === 'bm' ? 'Padanan Kad' : 'Matching Pairs' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
              mode === tab.id
                ? 'bg-[#0099ff] text-white border-[#0099ff]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === 'wheel' && (
        <div className="p-5 rounded-xl bg-sky-50/70 border border-sky-200 text-center space-y-3">
          <p className="text-xs text-slate-600">
            {language === 'bm'
              ? 'Sesuai untuk soal jawab lisan spontan di hadapan kelas.'
              : 'Great for spontaneous oral recitation in front of the class.'}
          </p>
          <div className="p-4 rounded-xl bg-white border border-sky-200 text-sm font-bold text-[#0a2540] min-h-[56px] flex items-center justify-center">
            {wheelTopic || (language === 'bm' ? 'Klik "Putar Roda" untuk pilih soalan rawak.' : 'Click "Spin Wheel" to pick a random prompt.')}
          </div>
          <button
            type="button"
            onClick={handleSpin}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#0099ff] hover:bg-[#0088ee] text-white text-xs font-bold cursor-pointer"
          >
            {language === 'bm' ? 'Putar Roda' : 'Spin Wheel'}
          </button>
        </div>
      )}

      {mode === 'quiz' && (
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
            {language === 'bm' ? 'Mod Rancangan Kuiz (100 Mata)' : 'Quiz Show Mode (100 Points)'}
          </span>
          <p className="text-sm font-bold">
            {language === 'bm'
              ? 'Apakah sumber tenaga utama yang memanaskan air dalam kitaran air?'
              : 'What is the main energy source driving the water cycle?'}
          </p>
          <p className="text-xs text-emerald-300">
            {language === 'bm' ? 'Jawapan guru: Matahari' : 'Teacher answer key: The Sun'}
          </p>
        </div>
      )}

      {mode === 'match' && (
        <div className="space-y-2.5">
          <p className="text-xs text-slate-600">
            {language === 'bm' ? 'Klik pasangan istilah untuk mengesahkan padanan:' : 'Click each pair card to confirm its match:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'p1', text: language === 'bm' ? 'Penyejatan ↔ Cecair menjadi wap' : 'Evaporation ↔ Liquid to vapor' },
              { id: 'p2', text: language === 'bm' ? 'Kondensasi ↔ Wap membentuk awan' : 'Condensation ↔ Vapor forms clouds' },
            ].map((pair) => {
              const matched = matchedPairs.includes(pair.id);
              return (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => toggleMatch(pair.id)}
                  className={`min-h-[44px] p-3 rounded-xl border text-xs font-bold text-left cursor-pointer ${
                    matched ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  {matched ? `✓ ${pair.text}` : pair.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <SimulationNotice
        language={language}
        messageBm="Pratonton format tempatan sahaja: Gunakan idea templat ini dalam Wordwall atau platform kuiz sekolah anda."
        messageEn="Local format preview only: Build full decks in Wordwall or your school game tool."
      />
    </div>
  );
};

/* 12. WORD CLOUD SIMULATION (interactive-presentations-mentimeter) */
const WordCloudSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const initialWords: Record<string, number> =
    language === 'bm'
      ? { Kerjasama: 3, Seronok: 2, Sains: 2, Eksperimen: 1 }
      : { Teamwork: 3, Curiosity: 2, Science: 2, Discovery: 1 };

  const [words, setWords] = useState<Record<string, number>>(initialWords);
  const [inputWord, setInputWord] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addWord = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) {
      setError(
        language === 'bm'
          ? 'Sila taip satu perkataan atau frasa pendek sebelum menghantar.'
          : 'Please type a short word or phrase before submitting.'
      );
      return;
    }
    setError(null);
    setWords((prev) => ({
      ...prev,
      [cleaned]: (prev[cleaned] || 0) + 1,
    }));
    setInputWord('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWord(inputWord);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <Cloud className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Simulasi Awan Kata Langsung' : 'Live Word Cloud Simulation'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Masukkan perkataan berulang untuk melihat bagaimana perkataan popular membesar secara automatik.'
              : 'Submit words (or click sample student responses) to watch frequent words grow larger.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setWords(initialWords);
            setInputWord('');
            setError(null);
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="sandbox-word-cloud-input" className="sr-only">
          {language === 'bm' ? 'Perkataan pelajar' : 'Student response word'}
        </label>
        <input
          id="sandbox-word-cloud-input"
          type="text"
          value={inputWord}
          onChange={(e) => {
            setInputWord(e.target.value);
            if (error) setError(null);
          }}
          placeholder={
            language === 'bm' ? 'Taip 1 perkataan (cth: Seronok)...' : 'Type 1 word (e.g., Excited)...'
          }
          className="flex-1 min-h-[44px] px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff]"
        />
        <button
          type="submit"
          className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Hantar Kata' : 'Submit Word'}</span>
        </button>
      </form>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-[#fdf2f0] border border-[#cc310e]/30 text-xs text-[#99240b]">
          {error}
        </div>
      )}

      {/* Quick sample student click */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">
          {language === 'bm' ? 'Contoh undian murid:' : 'Simulate student votes:'}
        </span>
        {(language === 'bm' ? ['Seronok', 'Kerjasama', 'Kreatif'] : ['Curiosity', 'Teamwork', 'Creative']).map(
          (sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => addWord(sample)}
              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-[#0055aa] font-bold cursor-pointer"
            >
              + {sample}
            </button>
          )
        )}
      </div>

      {/* Live Word Cloud Area */}
      <div className="p-6 rounded-2xl bg-slate-900 text-center flex flex-wrap items-center justify-center gap-x-5 gap-y-3 min-h-[140px]">
        {Object.entries(words).map(([word, count]) => {
          const sizeClass =
            count >= 4 ? 'text-2xl sm:text-3xl text-amber-300' : count >= 2 ? 'text-lg sm:text-xl text-sky-300' : 'text-sm text-emerald-300';
          return (
            <span key={word} className={`font-display font-extrabold ${sizeClass}`}>
              {word} <span className="text-[11px] font-mono opacity-75">({count})</span>
            </span>
          );
        })}
      </div>

      <SimulationNotice
        language={language}
        messageBm="Simulasi awan kata tempatan sahaja: Tiada sambungan langsung kepada peranti murid."
        messageEn="Local word cloud simulation only: Not connected to live student devices."
      />
    </div>
  );
};

/* 13. COLLABORATIVE BOARD (classroom-engagement-activities) */
interface BoardNote {
  id: string;
  column: 'learned' | 'interesting' | 'question';
  text: string;
}

const CollabBoardSandbox: React.FC<{ language: Language }> = ({ language }) => {
  const initialNotes: BoardNote[] = [
    {
      id: 'n1',
      column: 'learned',
      text: language === 'bm' ? 'Air tersejat apabila dipanaskan matahari.' : 'Water evaporates when heated by the sun.',
    },
    {
      id: 'n2',
      column: 'interesting',
      text: language === 'bm' ? 'Awan terdiri daripada titisan air halus.' : 'Clouds are formed from tiny water droplets.',
    },
    {
      id: 'n3',
      column: 'question',
      text: language === 'bm' ? 'Mengapa hujan turun lebih kerap waktu petang?' : 'Why does rain happen more often in the afternoon?',
    },
  ];

  const [notes, setNotes] = useState<BoardNote[]>(initialNotes);
  const [column, setColumn] = useState<'learned' | 'interesting' | 'question'>('learned');
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { id: 'learned' as const, title: language === 'bm' ? '3 Perkara Dipelajari' : '3 Things Learned', tone: 'bg-sky-50 border-sky-200' },
    { id: 'interesting' as const, title: language === 'bm' ? '2 Fakta Menarik' : '2 Interesting Facts', tone: 'bg-emerald-50 border-emerald-200' },
    { id: 'question' as const, title: language === 'bm' ? '1 Soalan Lanjut' : '1 Question Left', tone: 'bg-amber-50 border-amber-200' },
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = noteText.trim();
    if (!trimmed) {
      setError(
        language === 'bm'
          ? 'Sila tulis isi nota dahulu sebelum menampal ke papan.'
          : 'Please type a short reflection note before posting to the board.'
      );
      return;
    }
    setError(null);
    setNotes((prev) => [...prev, { id: `note-${Date.now()}`, column, text: trimmed }]);
    setNoteText('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
            <StickyNote className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
            <span>{language === 'bm' ? 'Papan Refleksi Kolaboratif 3-2-1' : '3-2-1 Collaborative Reflection Board'}</span>
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === 'bm'
              ? 'Pilih lajur dan tampal nota refleksi murid sebagai latihan aktiviti penutup kelas.'
              : 'Pick a reflection column and post sticky notes to test a 3-2-1 closing activity.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNotes(initialNotes);
            setNoteText('');
            setError(null);
          }}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bm' ? 'Set Semula' : 'Reset'}</span>
        </button>
      </div>

      <form onSubmit={handleAddNote} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <select
          aria-label={language === 'bm' ? 'Lajur papan' : 'Board column'}
          value={column}
          onChange={(e) => setColumn(e.target.value as 'learned' | 'interesting' | 'question')}
          className="sm:col-span-4 min-h-[44px] px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl"
        >
          {columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={noteText}
          onChange={(e) => {
            setNoteText(e.target.value);
            if (error) setError(null);
          }}
          placeholder={language === 'bm' ? 'Tulis nota murid di sini...' : 'Write a student note here...'}
          className="sm:col-span-6 min-h-[44px] px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl"
        />

        <button
          type="submit"
          className="sm:col-span-2 min-h-[44px] px-4 py-2 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl cursor-pointer"
        >
          {language === 'bm' ? 'Tampal' : 'Post'}
        </button>
      </form>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-[#fdf2f0] border border-[#cc310e]/30 text-xs text-[#99240b]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {columns.map((col) => {
          const colNotes = notes.filter((n) => n.column === col.id);
          return (
            <div key={col.id} className={`p-3.5 rounded-xl border ${col.tone} space-y-2.5`}>
              <h5 className="text-xs font-bold text-slate-900">{col.title}</h5>
              {colNotes.length === 0 ? (
                <p className="text-[11px] text-slate-500">
                  {language === 'bm' ? 'Belum ada nota dalam lajur ini.' : 'No notes in this column yet.'}
                </p>
              ) : (
                colNotes.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-start justify-between gap-2"
                  >
                    <span className="text-xs text-slate-800 leading-relaxed">{n.text}</span>
                    <button
                      type="button"
                      onClick={() => setNotes((prev) => prev.filter((item) => item.id !== n.id))}
                      aria-label={language === 'bm' ? 'Padam nota' : 'Delete note'}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      <SimulationNotice
        language={language}
        messageBm="Simulasi papan tempatan sahaja: Nota tidak disegerakkan ke peranti lain."
        messageEn="Local board simulation only: Sticky notes are not synced across external devices."
      />
    </div>
  );
};

export const TutorialPracticeSandbox: React.FC<Props> = ({
  tutorial,
  language,
  onOpenPromptBuilder,
}) => {
  switch (tutorial.tryIt.sandboxType) {
    case 'shortcut-lab':
      return <ShortcutLabSandbox language={language} />;
    case 'upload-checker':
      return <UploadCheckerSandbox language={language} />;
    case 'browser-tabs':
      return <BrowserTabsSandbox language={language} />;
    case 'layout-studio':
      return <LayoutStudioSandbox tutorialId={tutorial.id} language={language} />;
    case 'quiz-config':
      return <QuizConfigSandbox language={language} />;
    case 'classroom-permissions':
      return <ClassroomPermissionsSandbox language={language} />;
    case 'ai-scenario-lab':
      return <AiScenarioLabSandbox tutorialId={tutorial.id} language={language} />;
    case 'prompt-anatomy':
      return (
        <PromptAnatomySandbox
          language={language}
          onOpenPromptBuilder={onOpenPromptBuilder}
        />
      );
    case 'rph-scaffold':
      return <RphScaffoldSandbox language={language} />;
    case 'gamified-quiz':
      return <GamifiedQuizSandbox language={language} />;
    case 'game-switcher':
      return <GameSwitcherSandbox language={language} />;
    case 'word-cloud':
      return <WordCloudSandbox language={language} />;
    case 'collab-board':
      return <CollabBoardSandbox language={language} />;
    default:
      return <AiScenarioLabSandbox tutorialId={tutorial.id} language={language} />;
  }
};
