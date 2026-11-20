import React, { useState, useEffect } from 'react';
import { Language, GeneratedRPH } from '../../types';
import { translations } from '../../data/translations';
import { RPH_CURRICULUM_DATA } from '../../data/rphCurriculum';
import { BamuMascot } from '../brand/BamuMascot';
import { ToastNotification } from '../common/ToastNotification';
import { EmptyState } from '../common/EmptyState';
import {
  Sparkles,
  Download,
  Printer,
  Copy,
  Check,
  Layers,
  FileText,
  BookmarkCheck,
  Trash2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Clock,
} from 'lucide-react';

interface Props {
  language: Language;
}

const STORAGE_KEY = 'bamudi_saved_rph_v1';

const RPH_MIN_MINUTES = 7 * 60; // 7:00 AM
const RPH_MAX_MINUTES = 19 * 60; // 7:00 PM
const RPH_STEP_MINUTES = 30;

const RPH_START_TIME_OPTIONS: number[] = Array.from(
  { length: (RPH_MAX_MINUTES - RPH_MIN_MINUTES) / RPH_STEP_MINUTES },
  (_, index) => RPH_MIN_MINUTES + index * RPH_STEP_MINUTES
);

function formatClock12h(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

function parseClockTokenToMinutes(token: string): number | null {
  const match = token.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();
  if (Number.isNaN(hours) || Number.isNaN(mins) || mins < 0 || mins >= 60) return null;
  if (period) {
    if (hours < 1 || hours > 12) return null;
    if (period === 'AM') {
      hours = hours === 12 ? 0 : hours;
    } else {
      hours = hours === 12 ? 12 : hours + 12;
    }
  } else if (hours < 0 || hours > 23) {
    return null;
  }
  return hours * 60 + mins;
}

function parseSavedTimeRange(raw: string): { start: number; end: number } | null {
  const cleaned = raw.replace(/\(.*?\)/g, '').trim();
  const parts = cleaned.split(/\s*(?:-|to|hingga)\s*/i);
  if (parts.length < 2) return null;
  const start = parseClockTokenToMinutes(parts[0]);
  const end = parseClockTokenToMinutes(parts[1]);
  if (start === null || end === null) return null;
  if (
    start < RPH_MIN_MINUTES ||
    start > RPH_MAX_MINUTES - RPH_STEP_MINUTES ||
    end <= start ||
    end > RPH_MAX_MINUTES ||
    start % RPH_STEP_MINUTES !== 0 ||
    end % RPH_STEP_MINUTES !== 0
  ) {
    return null;
  }
  return { start, end };
}

export type RphStep = 1 | 2 | 3 | 'all';

export const RphGeneratorView: React.FC<Props> = ({ language }) => {
  const t = translations[language].rphGenerator;

  // Stepper state (Langkah 1: Kurikulum, 2: Jadual, 3: Refleksi, or 'all')
  const [activeStep, setActiveStep] = useState<RphStep>(1);

  // Selection states
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('bm');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('t1');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('bm-t1-karangan');
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicTitle, setCustomTopicTitle] = useState('');

  // Editable Form fields
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [day, setDay] = useState<string>(() => {
    const daysBm = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const idx = new Date().getDay();
    return language === 'bm' ? daysBm[idx] : daysEn[idx];
  });
  const [startTimeMinutes, setStartTimeMinutes] = useState<number>(8 * 60);
  const [endTimeMinutes, setEndTimeMinutes] = useState<number>(8 * 60 + 30);
  const [className, setClassName] = useState('1 Amanah');

  const endTimeOptions: number[] = Array.from(
    { length: (RPH_MAX_MINUTES - startTimeMinutes) / RPH_STEP_MINUTES },
    (_, index) => startTimeMinutes + (index + 1) * RPH_STEP_MINUTES
  );

  const handleStartTimeChange = (nextStart: number) => {
    setStartTimeMinutes(nextStart);
    if (endTimeMinutes <= nextStart) {
      setEndTimeMinutes(Math.min(nextStart + RPH_STEP_MINUTES, RPH_MAX_MINUTES));
    }
  };

  const durationMinutes = Math.max(RPH_STEP_MINUTES, endTimeMinutes - startTimeMinutes);
  const time = `${formatClock12h(startTimeMinutes)} - ${formatClock12h(endTimeMinutes)} (${durationMinutes} ${
    language === 'bm' ? 'Minit' : 'Mins'
  })`;

  // Lesson Plan Core Content
  const [contentStandard, setContentStandard] = useState('');
  const [learningStandard, setLearningStandard] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [successCriteria, setSuccessCriteria] = useState<string[]>([]);
  const [setInduction, setSetInduction] = useState('');
  const [mainActivities, setMainActivities] = useState<string[]>([]);
  const [closure, setClosure] = useState('');
  const [teachingAids, setTeachingAids] = useState<string[]>([]);
  const [emk, setEmk] = useState<string[]>([]);
  const [reflection, setReflection] = useState(
    language === 'bm'
      ? '_____ / _____ orang murid dapat mencapai objektif pembelajaran hari ini dengan baik. Murid yang belum menguasai diberi bimbingan dalam sesi pemulihan.'
      : '_____ / _____ students successfully achieved today’s learning objectives. Students needing support received targeted scaffolding.'
  );

  // Status & Feedback states
  const [isCopied, setIsCopied] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [savedRPHs, setSavedRPHs] = useState<GeneratedRPH[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Current Subject and Level options
  const currentSubject = RPH_CURRICULUM_DATA.find((s) => s.id === selectedSubjectId) || RPH_CURRICULUM_DATA[0];
  const currentLevel = currentSubject.levels.find((l) => l.levelId === selectedLevelId) || currentSubject.levels[0];
  const currentTopic = currentLevel.topics.find((tp) => tp.id === selectedTopicId) || currentLevel.topics[0];

  // Sync content when curriculum selection changes
  useEffect(() => {
    if (currentTopic && !isCustomTopic) {
      setContentStandard(currentTopic.contentStandard);
      setLearningStandard(currentTopic.learningStandard);
      setLearningObjectives(currentTopic.suggestedObjectives[language]);
      setSuccessCriteria(currentTopic.suggestedSuccessCriteria[language]);
      setSetInduction(currentTopic.defaultActivities.setInduction[language]);
      setMainActivities(currentTopic.defaultActivities.mainActivities[language]);
      setClosure(currentTopic.defaultActivities.closure[language]);
      setTeachingAids(currentTopic.suggestedAids);
      setEmk(currentTopic.emk);
    }
  }, [selectedSubjectId, selectedLevelId, selectedTopicId, isCustomTopic, language]);

  // When subject changes, reset level & topic to valid options
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const sub = RPH_CURRICULUM_DATA.find((s) => s.id === subjectId);
    if (sub && sub.levels.length > 0) {
      const firstLevel = sub.levels[0];
      setSelectedLevelId(firstLevel.levelId);
      if (firstLevel.topics.length > 0) {
        setSelectedTopicId(firstLevel.topics[0].id);
      }
    }
    setIsCustomTopic(false);
  };

  // When level changes, reset topic
  const handleLevelChange = (levelId: string) => {
    setSelectedLevelId(levelId);
    const lvl = currentSubject.levels.find((l) => l.levelId === levelId);
    if (lvl && lvl.topics.length > 0) {
      setSelectedTopicId(lvl.topics[0].id);
    }
    setIsCustomTopic(false);
  };

  const activeTopicTitle = isCustomTopic
    ? customTopicTitle.trim() || (language === 'bm' ? 'Topik Pilihan Guru' : 'Teacher Selected Topic')
    : currentTopic ? currentTopic.title[language] : '';

  // Copy full RPH text
  const handleCopy = () => {
    const text = `
RANCANGAN PENGAJARAN HARIAN (TS25)
Mata Pelajaran: ${currentSubject.name[language]}
Tingkatan / Tahun: ${currentLevel.levelName[language]}
Kelas: ${className}
Tarikh: ${date} (${day})
Masa: ${time}
Topik: ${activeTopicTitle}

Standard Kandungan:
${contentStandard}

Standard Pembelajaran:
${learningStandard}

Objektif Pembelajaran:
${learningObjectives.map((o, idx) => `${idx + 1}. ${o}`).join('\n')}

Kriteria Kejayaan:
${successCriteria.map((c, idx) => `${idx + 1}. ${c}`).join('\n')}

Aktiviti Pembelajaran:
1. Set Induksi: ${setInduction}
2. Aktiviti Utama:
${mainActivities.map((a, idx) => `   - ${a}`).join('\n')}
3. Penutup: ${closure}

Bahan Bantu Mengajar (BBM): ${teachingAids.join(', ')}
Elemen Merentas Kurikulum (EMK): ${emk.join(', ')}
Refleksi: ${reflection}
    `.trim();

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Download Word Document (.doc format compatible with Microsoft Word & Google Docs)
  const handleDownloadDoc = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>RPH - ${activeTopicTitle}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #0099ff; padding-bottom: 10px; margin-bottom: 20px; }
          .header h2 { margin: 0; color: #0066cc; font-size: 16pt; }
          .meta-table, .content-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .meta-table td { padding: 6px 8px; border: 1px solid #cbd5e1; }
          .content-table th { background: #e6f5ff; text-align: left; padding: 8px; border: 1px solid #cbd5e1; width: 25%; font-weight: bold; color: #0055aa; }
          .content-table td { padding: 8px; border: 1px solid #cbd5e1; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>RANCANGAN PENGAJARAN HARIAN (TS25)</h2>
          <p>Kementerian Pendidikan Malaysia · Format Pembelajaran Abad Ke-21 (PAK-21)</p>
        </div>

        <table class="meta-table">
          <tr>
            <td><strong>Mata Pelajaran:</strong> ${currentSubject.name[language]}</td>
            <td><strong>Tingkatan / Tahun:</strong> ${currentLevel.levelName[language]}</td>
            <td><strong>Kelas:</strong> ${className}</td>
          </tr>
          <tr>
            <td><strong>Tarikh &amp; Hari:</strong> ${date} (${day})</td>
            <td><strong>Masa:</strong> ${time}</td>
            <td><strong>Topik:</strong> ${activeTopicTitle}</td>
          </tr>
        </table>

        <table class="content-table">
          <tr>
            <th>Standard Kandungan (SK)</th>
            <td>${contentStandard}</td>
          </tr>
          <tr>
            <th>Standard Pembelajaran (SP)</th>
            <td>${learningStandard}</td>
          </tr>
          <tr>
            <th>Objektif Pembelajaran</th>
            <td>
              <p>Pada akhir pengajaran dan pembelajaran, murid dapat:</p>
              <ol>
                ${learningObjectives.map((o) => `<li>${o}</li>`).join('')}
              </ol>
            </td>
          </tr>
          <tr>
            <th>Kriteria Kejayaan</th>
            <td>
              <ol>
                ${successCriteria.map((c) => `<li>${c}</li>`).join('')}
              </ol>
            </td>
          </tr>
          <tr>
            <th>Aktiviti PdP (PAK-21)</th>
            <td>
              <p><strong>Set Induksi (Pemula):</strong><br>${setInduction}</p>
              <p><strong>Aktiviti Utama:</strong></p>
              <ol>
                ${mainActivities.map((a) => `<li>${a}</li>`).join('')}
              </ol>
              <p><strong>Penutup:</strong><br>${closure}</p>
            </td>
          </tr>
          <tr>
            <th>Bahan Bantu Mengajar (BBM)</th>
            <td>${teachingAids.join(', ')}</td>
          </tr>
          <tr>
            <th>Elemen Merentas Kurikulum (EMK)</th>
            <td>${emk.join(', ')}</td>
          </tr>
          <tr>
            <th>Refleksi</th>
            <td>${reflection}</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RPH_${currentSubject.name[language]}_${className.replace(/\s+/g, '_')}_${date}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Trigger print dialog
  const handlePrint = () => {
    window.print();
  };

  // Save to local storage
  const handleSaveToArchive = () => {
    const newRecord: GeneratedRPH = {
      id: `rph-${Date.now()}`,
      subject: currentSubject.name[language],
      level: currentLevel.levelName[language],
      className,
      date,
      day,
      time,
      topic: activeTopicTitle,
      contentStandard,
      learningStandard,
      learningObjectives,
      successCriteria,
      setInduction,
      mainActivities,
      closure,
      teachingAids,
      emk,
      reflection,
      createdAt: Date.now(),
    };

    const updated = [newRecord, ...savedRPHs.filter((item) => item.topic !== activeTopicTitle || item.date !== date)].slice(0, 10);
    setSavedRPHs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // safe fallback
    }

    setSavedToast(t.savedSuccess);
    setTimeout(() => setSavedToast(null), 3000);
  };

  // Remove saved item
  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedRPHs.filter((r) => r.id !== id);
    setSavedRPHs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // safe fallback
    }
  };

  // Load saved item
  const handleLoadSaved = (record: GeneratedRPH) => {
    setClassName(record.className);
    setDate(record.date);
    setDay(record.day);
    const parsedRange = parseSavedTimeRange(record.time);
    if (parsedRange) {
      setStartTimeMinutes(parsedRange.start);
      setEndTimeMinutes(parsedRange.end);
    }
    setIsCustomTopic(true);
    setCustomTopicTitle(record.topic);
    setContentStandard(record.contentStandard);
    setLearningStandard(record.learningStandard);
    setLearningObjectives(record.learningObjectives);
    setSuccessCriteria(record.successCriteria);
    setSetInduction(record.setInduction);
    setMainActivities(record.mainActivities);
    setClosure(record.closure);
    setTeachingAids(record.teachingAids);
    setEmk(record.emk);
    setReflection(record.reflection);

    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn bg-[#fdfdfe]">
      {/* Toast Notification */}
      <ToastNotification
        message={savedToast}
        variant="success"
        icon="bookmark"
        onDismiss={() => setSavedToast(null)}
      />

      {/* Header Banner with Bamu Companion */}
      <div className="mb-8 bg-gradient-to-r from-sky-50 via-[#fdfdfe] to-[#fdf2f0] border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-slate-900 text-xs font-bold mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0099ff]" />
            <span>{language === 'bm' ? 'Ciri Baharu Guru' : 'Teacher Feature'}</span>
            <span className="text-[#0099ff]">·</span>
            <span className="text-[#007acc] font-bold">TS25 &amp; PAK-21</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
            {t.subtitle}
          </p>
        </div>

        <div className="shrink-0 hidden md:block">
          <BamuMascot
            mood="encouraging"
            size="lg"
            speech={
              language === 'bm'
                ? 'Pilih subjek dan topik cikgu. Bamu sediakan draf RPH serta-merta!'
                : 'Select your subject and topic. Bamu prepares your draft instantly!'
            }
          />
        </div>
      </div>

      {/* Main Grid: Form Controls (Left 5 Cols) + Live Formatted Document Preview (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0099ff]" />
                <h2 className="text-base font-bold text-slate-900 font-display">
                  {language === 'bm' ? 'Konfigurasi Pengajaran' : 'Lesson Setup'}
                </h2>
              </div>

              {/* Step Mode / All View toggle */}
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 'all' ? 1 : 'all')}
                className="text-[11px] font-bold text-[#007acc] hover:text-[#0055aa] bg-sky-50/70 hover:bg-sky-100/80 px-3 py-1.5 rounded-xl border border-sky-200/80 transition-colors cursor-pointer self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
              >
                {activeStep === 'all'
                  ? (language === 'bm' ? '← Mod Langkah' : '← Step Mode')
                  : (language === 'bm' ? 'Lihat Semua' : 'View All')}
              </button>
            </div>

            {/* Stepper Tabs */}
            {activeStep !== 'all' && (
              <nav aria-label="Langkah Penyediaan RPH" className="grid grid-cols-3 gap-2">
                {[
                  { step: 1, labelBm: '1. Kurikulum', labelEn: '1. Curriculum', descBm: 'Subjek & Topik', descEn: 'Subject & Topic' },
                  { step: 2, labelBm: '2. Jadual', labelEn: '2. Schedule', descBm: 'Kelas & Tarikh', descEn: 'Class & Date' },
                  { step: 3, labelBm: '3. Refleksi', labelEn: '3. Reflection', descBm: 'Catatan Guru', descEn: 'Teacher Notes' },
                ].map((s) => {
                  const isActive = activeStep === s.step;
                  const isPast = typeof activeStep === 'number' && activeStep > s.step;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setActiveStep(s.step as RphStep)}
                      className={`min-h-[48px] p-2 sm:p-2.5 rounded-2xl text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] border ${
                        isActive
                          ? 'bg-[#0099ff] text-white border-[#0099ff] shadow-xs'
                          : isPast
                          ? 'bg-sky-50/80 text-[#0066cc] border-sky-200 hover:bg-sky-100/80'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-[10px] sm:text-xs font-extrabold ${isActive ? 'text-white' : isPast ? 'text-[#0066cc]' : 'text-slate-700'}`}>
                          {language === 'bm' ? s.labelBm : s.labelEn}
                        </span>
                        {isPast && (
                          <span className="w-4 h-4 rounded-full bg-white/90 text-[#0099ff] flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <span className={`text-[9px] sm:text-[10px] block truncate font-medium ${isActive ? 'text-white/90' : isPast ? 'text-[#007acc]' : 'text-slate-400'}`}>
                        {language === 'bm' ? s.descBm : s.descEn}
                      </span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* STEP 1: Curriculum & Topic */}
            {(activeStep === 1 || activeStep === 'all') && (
              <div className="space-y-4 pt-1 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#0099ff]" />
                    <span>{language === 'bm' ? 'Langkah 1: Subjek & Topik DSKP' : 'Step 1: DSKP Subject & Topic'}</span>
                  </span>
                </div>

                {/* 1. Subject Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.selectSubject}
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="min-h-[44px] h-11 w-full text-xs font-bold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                  >
                    {RPH_CURRICULUM_DATA.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name[language]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Level / Form Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.selectLevel}
                  </label>
                  <select
                    value={selectedLevelId}
                    onChange={(e) => handleLevelChange(e.target.value)}
                    className="min-h-[44px] h-11 w-full text-xs font-bold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                  >
                    {currentSubject.levels.map((lvl) => (
                      <option key={lvl.levelId} value={lvl.levelId}>
                        {lvl.levelName[language]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Topic Selector or Custom Topic */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      {t.selectTopic}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomTopic(!isCustomTopic)}
                      className="text-[11px] font-bold text-[#007acc] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] rounded px-1"
                    >
                      {isCustomTopic
                        ? language === 'bm'
                          ? 'Pilih Dari Senarai'
                          : 'Choose From List'
                        : language === 'bm'
                        ? '+ Topik Sendiri'
                        : '+ Custom Topic'}
                    </button>
                  </div>

                  {isCustomTopic ? (
                    <input
                      type="text"
                      value={customTopicTitle}
                      onChange={(e) => setCustomTopicTitle(e.target.value)}
                      placeholder={t.customTopicPlaceholder}
                      className="min-h-[44px] h-11 w-full text-xs font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                    />
                  ) : (
                    <select
                      value={selectedTopicId}
                      onChange={(e) => setSelectedTopicId(e.target.value)}
                      className="min-h-[44px] h-11 w-full text-xs font-bold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                    >
                      {currentLevel.topics.map((tp) => (
                        <option key={tp.id} value={tp.id}>
                          {tp.title[language]}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {activeStep === 1 && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="min-h-[44px] w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.98] inline-flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                    >
                      <span>{language === 'bm' ? 'Seterusnya: Butiran Jadual' : 'Next: Schedule Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Classroom & Schedule Particulars */}
            {(activeStep === 2 || activeStep === 'all') && (
              <div className="space-y-4 pt-1 animate-fadeIn border-t border-slate-100 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0099ff]" />
                    <span>{language === 'bm' ? 'Langkah 2: Butiran Kelas & Jadual' : 'Step 2: Class & Schedule'}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {t.className}
                    </label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="min-h-[44px] h-11 w-full text-xs font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {t.day}
                    </label>
                    <select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="min-h-[44px] h-11 w-full text-xs font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                    >
                      {(language === 'bm'
                        ? ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Ahad']
                        : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']
                      ).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {t.date}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="min-h-[44px] h-11 w-full text-xs font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3.5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                    />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="rph-time-select" className="block text-[11px] font-bold text-slate-600 mb-1">
                      {t.time}
                    </label>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <select
                        id="rph-time-select"
                        aria-label={language === 'bm' ? 'Masa mula' : 'Start time'}
                        value={startTimeMinutes}
                        onChange={(e) => handleStartTimeChange(Number(e.target.value))}
                        className="min-h-[44px] h-11 w-full text-xs font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                      >
                        {RPH_START_TIME_OPTIONS.map((mins) => (
                          <option key={mins} value={mins}>
                            {formatClock12h(mins)}
                          </option>
                        ))}
                      </select>

                      <span className="text-xs font-bold text-slate-500 px-0.5 select-none">
                        {language === 'bm' ? 'hingga' : 'to'}
                      </span>

                      <select
                        id="rph-time-end-select"
                        aria-label={language === 'bm' ? 'Masa tamat' : 'End time'}
                        value={endTimeMinutes}
                        onChange={(e) => setEndTimeMinutes(Number(e.target.value))}
                        className="min-h-[44px] h-11 w-full text-xs font-semibold text-slate-900 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors cursor-pointer"
                      >
                        {endTimeOptions.map((mins) => (
                          <option key={mins} value={mins}>
                            {formatClock12h(mins)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {activeStep === 2 && (
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="min-h-[44px] px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{language === 'bm' ? 'Kembali' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-[#0099ff] hover:bg-[#0088ee] rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.98] inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                    >
                      <span>{language === 'bm' ? 'Seterusnya: Refleksi PdP' : 'Next: Reflection'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Teacher Reflection & Completion */}
            {(activeStep === 3 || activeStep === 'all') && (
              <div className="space-y-4 pt-1 animate-fadeIn border-t border-slate-100 first:border-t-0 first:pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0099ff]" />
                    <span>{language === 'bm' ? 'Langkah 3: Refleksi & Penilaian Guru' : 'Step 3: Teacher Reflection'}</span>
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.reflection}
                  </label>
                  <textarea
                    rows={3}
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-[#fdfdfe] border border-sky-200/90 hover:border-sky-400 rounded-xl p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff] focus-visible:border-[#0099ff] transition-colors"
                  />
                </div>

                {activeStep === 3 && (
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="min-h-[44px] px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{language === 'bm' ? 'Kembali' : 'Back'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToArchive}
                      className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-[#99240b] bg-[#fdf2f0] hover:bg-[#fde4df] border border-[#cc310e]/30 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-[0.98] inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                    >
                      <BookmarkCheck className="w-4 h-4 text-[#cc310e]" />
                      <span>{t.saveToMyRph}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Saved History Archive Accordion */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 font-display flex items-center gap-2">
                <BookmarkCheck className="w-3.5 h-3.5 text-[#cc310e]" />
                <span>{t.historyTitle}</span>
              </h3>
              <span className="font-mono text-[#007acc] font-extrabold text-xs">{savedRPHs.length}</span>
            </div>

            {savedRPHs.length === 0 ? (
              <EmptyState
                variant="transparent"
                mascotMood="encouraging"
                mascotSize="sm"
                headingLevel="h4"
                title={
                  language === 'bm'
                    ? 'Arkib RPH Masih Kosong'
                    : 'No Saved Lesson Plans Yet'
                }
                description={
                  language === 'bm'
                    ? 'Selepas menjana RPH, klik butang "Simpan ke Arkib Saya" untuk menyimpan rekod rancangan mengajar pada peranti ini secara selamat tanpa perlu daftar masuk.'
                    : 'After generating an RPH, click "Save to My Archive" to store your lesson plan records safely on this device without logging in.'
                }
              />
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {savedRPHs.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => handleLoadSaved(record)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleLoadSaved(record);
                      }
                    }}
                    className="p-3.5 rounded-2xl bg-[#fdfdfe] border border-sky-100/90 hover:border-[#0099ff] hover:bg-sky-50/20 transition-all flex items-center justify-between text-xs cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-slate-800 group-hover:text-[#0099ff] truncate">
                        {record.topic}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {record.subject} · {record.className} · {record.date}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSaved(record.id, e)}
                      className="min-w-[32px] min-h-[32px] flex items-center justify-center rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                      title="Padam arkib ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Formatted RPH Document Preview */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <FileText className="w-4 h-4 text-[#0099ff]" />
              <span className="font-bold text-slate-900">{language === 'bm' ? 'Pratonton RPH Rasmi' : 'Official RPH Preview'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl sm:rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-700 border border-slate-200/70 transition-colors cursor-pointer shadow-2xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-[#0099ff]" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{isCopied ? (language === 'bm' ? 'Disalin!' : 'Copied!') : t.copyBtn}</span>
              </button>

              <button
                onClick={handlePrint}
                className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl sm:rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-700 border border-slate-200/70 transition-colors cursor-pointer shadow-2xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>{t.printBtn}</span>
              </button>

              <button
                onClick={handleDownloadDoc}
                className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl sm:rounded-full bg-[#0099ff] hover:bg-[#0088ee] text-white transition-all cursor-pointer shadow-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.downloadDoc}</span>
              </button>

              <button
                onClick={handleSaveToArchive}
                className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl sm:rounded-full bg-[#fdf2f0] hover:bg-[#fde4df] text-[#99240b] border border-[#cc310e]/30 transition-colors cursor-pointer shadow-2xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-[#cc310e]" />
                <span>{t.saveToMyRph}</span>
              </button>
            </div>
          </div>

          {/* Formatted Document Canvas (Printable Sheet) */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm text-slate-900 font-sans print:border-none print:shadow-none print:p-0">
            {/* Document Header */}
            <div className="border-b-2 border-[#0099ff] pb-4 mb-5">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#007acc] uppercase tracking-wider mb-1">
                <span>Kementerian Pendidikan Malaysia</span>
                <span>Format Standard TS25 / PAK-21</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 font-display">
                Rancangan Pengajaran Harian (RPH)
              </h3>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100 text-xs mb-5">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.selectSubject}</span>
                <span className="font-extrabold text-[#0066cc]">{currentSubject.name[language]}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.selectLevel}</span>
                <span className="font-bold text-slate-800">{currentLevel.levelName[language]}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.className}</span>
                <span className="font-bold text-slate-800">{className}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.date} &amp; {t.day}</span>
                <span className="font-bold text-slate-800">{date} ({day})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.time}</span>
                <span className="font-bold text-slate-800">{time}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.selectTopic}</span>
                <span className="font-extrabold text-[#007acc] truncate block">{activeTopicTitle}</span>
              </div>
            </div>

            {/* Structured Table Sections */}
            <div className="space-y-4 text-xs">
              {/* SK & SP */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-sky-50/80 px-4 py-2 font-bold text-[#0055aa] border-b border-slate-200">
                  Standard Kandungan &amp; Standard Pembelajaran
                </div>
                <div className="p-4 space-y-2 text-slate-700">
                  <p><strong>SK:</strong> {contentStandard}</p>
                  <p><strong>SP:</strong> {learningStandard}</p>
                </div>
              </div>

              {/* Objectives & Success Criteria */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-sky-50/80 px-4 py-2 font-bold text-[#0055aa] border-b border-slate-200">
                  {t.objectives} &amp; {t.successCriteria}
                </div>
                <div className="p-4 space-y-3 text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">
                      {language === 'bm' ? 'Objektif Pembelajaran:' : 'Learning Objectives:'}
                    </span>
                    <ul className="list-disc pl-5 space-y-1">
                      {learningObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">
                      {language === 'bm' ? 'Kriteria Kejayaan:' : 'Success Criteria:'}
                    </span>
                    <ul className="list-disc pl-5 space-y-1">
                      {successCriteria.map((crit, i) => (
                        <li key={i}>{crit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Learning Activities (3 Phases) */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-sky-50/80 px-4 py-2 font-bold text-[#0055aa] border-b border-slate-200">
                  {language === 'bm' ? 'Aktiviti Pembelajaran (PAK-21)' : 'Learning Activities (PAK-21)'}
                </div>
                <div className="p-4 space-y-3 text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-0.5">
                      1. {t.setInduction}
                    </span>
                    <p>{setInduction}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-1">
                      2. {t.mainActivities}
                    </span>
                    <ol className="list-decimal pl-5 space-y-1.5">
                      {mainActivities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-0.5">
                      3. {t.closure}
                    </span>
                    <p>{closure}</p>
                  </div>
                </div>
              </div>

              {/* BBM & EMK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60">
                  <span className="font-bold text-[#0055aa] block mb-1">{t.teachingAids}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {teachingAids.map((aid, i) => (
                      <span key={i} className="bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-[11px] text-slate-700">
                        {aid}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/60">
                  <span className="font-bold text-[#0055aa] block mb-1">{t.emk}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {emk.map((item, i) => (
                      <span key={i} className="bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-[11px] text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
