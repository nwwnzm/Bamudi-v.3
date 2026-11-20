import React, { useState } from 'react';
import { Sparkles, Copy, Check, Info, RotateCcw, AlertCircle } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../data/translations';
import { BamuMascot } from '../brand/BamuMascot';

interface Props {
  language: Language;
}

const ROLE_PRESETS = {
  bm: [
    'Guru Sains Sekolah Rendah Pakar PAK-21',
    'Guru Bahasa Melayu Sekolah Menengah (KSSM)',
    'Guru Matematik Rendah Berpengalaman 12 Tahun',
    'Guru Pemulihan Khas & Intervensi Literasi',
    'Penyelaras TS25 & Inovasi Pembelajaran Digital',
  ],
  en: [
    'Expert Primary Science Teacher specialized in student-centered pedagogy',
    'Secondary English Language Educator (High School)',
    'Veteran Primary Mathematics Specialist (12 Years Experience)',
    'Special Education & Remedial Literacy Interventionist',
    'Curriculum Innovation & EdTech Learning Coach',
  ],
};

const TOPIC_PRESETS = {
  bm: [
    'Kitaran Air Semula Jadi & Kepentingannya',
    'Kata Adjektif & Pembinaan Ayat Majmuk',
    'Pendaraban Asas & Pecahan Wajar',
    'Ciri-ciri Haiwan Menjaga Anak & Habitat',
    'Prinsip Integriti & Etika Penggunaan AI di Sekolah',
  ],
  en: [
    'The Natural Water Cycle and Its Environmental Impact',
    'Descriptive Adjectives & Compound Sentence Construction',
    'Multiplication Fundamentals & Equivalent Fractions',
    'Animal Adaptations & Habitat Conservation',
    'Academic Integrity & Responsible AI Use in Schools',
  ],
};

const GRADE_PRESETS = {
  bm: [
    'Murid Tahap 1 (Tahun 2 & 3 - Perlukan Gambar & Ayat Pendek)',
    'Murid Tahun 4 (Aras Sederhana)',
    'Murid Tahun 5 & 6 (Persediaan UASA / Kemahiran KBAT)',
    'Murid Pemulihan Khas (Kosa kata asas & bimbingan visual)',
    'Murid Menengah Rendah (Tingkatan 1 - 3)',
  ],
  en: [
    'Lower Primary (Grades 2-3 - Needs short sentences & visual prompts)',
    'Grade 4 Pupils (Mixed Ability Classroom)',
    'Upper Primary (Grades 5-6 - Higher-Order Thinking Skills KBAT)',
    'Remedial Pupils (Scaffolded vocabulary & illustrated hints)',
    'Lower Secondary Students (Grades 7-9)',
  ],
};

const FORMAT_PRESETS = {
  bm: [
    'Jadual 5 soalan objektif aneka pilihan dengan skema jawapan dan penjelasan mudah',
    'Set Induksi 5 minit berasaskan objek maujud dalam bilik darjah',
    '3 aras aktiviti pembezaan (Pemulihan, Sederhana, Pengayaan)',
    'Lembaran kerja isi tempat kosong dengan kotak perkataan bantuan (Word Bank)',
    'Rubrik penilaian pembentangan kumpulan 4 skala (Lemah hingga Cemerlang)',
  ],
  en: [
    'Table of 5 multiple-choice questions with answer key and child-friendly explanations',
    '5-minute interactive Set Induction using tangible physical classroom props',
    '3-tiered differentiated tasks (Remedial, Core, Enrichment)',
    'Fill-in-the-blank student worksheet with a supportive word bank',
    '4-level group presentation evaluation rubric (Emerging to Mastery)',
  ],
};

export const PromptBuilderView: React.FC<Props> = ({ language }) => {
  const t = translations[language].sandbox.promptBuilder;

  const [roleIdx, setRoleIdx] = useState(0);
  const [topicIdx, setTopicIdx] = useState(0);
  const [gradeIdx, setGradeIdx] = useState(1);
  const [formatIdx, setFormatIdx] = useState(0);
  const [customTopic, setCustomTopic] = useState('');
  const [extraNote, setExtraNote] = useState('');

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const roles = ROLE_PRESETS[language];
  const topics = TOPIC_PRESETS[language];
  const gradeLevels = GRADE_PRESETS[language];
  const formats = FORMAT_PRESETS[language];

  const selectedRole = roles[roleIdx] ?? roles[0];
  const selectedTopic = customTopic.trim() ? customTopic.trim() : topics[topicIdx] ?? topics[0];
  const selectedGrade = gradeLevels[gradeIdx] ?? gradeLevels[0];
  const selectedFormat = formats[formatIdx] ?? formats[0];

  const extraInstructionLine = extraNote.trim()
    ? `\n- ${extraNote.trim()}`
    : '';

  // Dynamic assembled prompt preserving the 4-part formula
  const assembledPrompt =
    language === 'bm'
      ? `Bertindak sebagai ${selectedRole}.\n\nSaya ingin anda membina bahan pengajaran untuk topik "${selectedTopic}".\nSasaran murid adalah ${selectedGrade}.\n\nSila sediakan dalam format berikut:\n${selectedFormat}.\n\nArahan Tambahan:\n- Pastikan bahasa yang digunakan santun, tepat mengikut standard kurikulum sekolah kebangsaan.\n- Sertakan skema jawapan atau panduan guru untuk setiap bahagian.${extraInstructionLine}`
      : `Act as a ${selectedRole}.\n\nI need you to develop teaching materials on the topic "${selectedTopic}".\nThe target audience is ${selectedGrade}.\n\nPlease provide the output in the following format:\n${selectedFormat}.\n\nAdditional Instructions:\n- Ensure educational tone aligns strictly with national curriculum standards.\n- Include an answer key or teacher execution rubric for all components.${extraInstructionLine}`;

  const handleCopy = async () => {
    setCopyError(null);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(assembledPrompt);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = assembledPrompt;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (!ok) {
          throw new Error('Copy failed');
        }
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      setCopyError(
        language === 'bm'
          ? 'Salinan automatik disekat oleh pelayar. Sila pilih dan salin teks gesaan secara manual di bawah.'
          : 'Automatic copy was blocked by the browser. Please select and copy the prompt text manually below.'
      );
    }
  };

  const handleReset = () => {
    setRoleIdx(0);
    setTopicIdx(0);
    setGradeIdx(1);
    setFormatIdx(0);
    setCustomTopic('');
    setExtraNote('');
    setCopied(false);
    setCopyError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-sky-50/80 via-[#fdfdfe] to-[#fdf2f0] border border-sky-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#007acc] uppercase tracking-wider block mb-1">
            {language === 'bm' ? 'Alat Penyediaan Pengajaran AI' : 'AI Lesson Prompt Workspace'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
            {language === 'bm'
              ? 'Gunakan formula 4 bahagian (Peranan, Topik, Tahap Murid, Format) untuk membina gesaan AI yang jelas dan sedia disalin ke mana-mana alat AI pilihan anda.'
              : 'Combine the 4-part formula (Role, Topic, Student Level, Format) to craft clear classroom prompts ready to copy into any AI assistant you use.'}
          </p>
        </div>

        <div className="shrink-0 hidden sm:block">
          <BamuMascot
            mood="happy"
            size="lg"
            speech={
              language === 'bm'
                ? 'Gabungkan 4 elemen ini untuk hasil bahan PdP yang lebih tepat!'
                : 'Combine these 4 building blocks for clearer classroom results!'
            }
          />
        </div>
      </div>

      {/* Main Prompt Formulation Card */}
      <section
        aria-label={t.title}
        className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-7 shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-display">
              <Sparkles className="w-5 h-5 text-[#0099ff]" aria-hidden="true" />
              <span>{t.title}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.instructions}</p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0099ff]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{language === 'bm' ? 'Tetapkan Semula' : 'Reset Formula'}</span>
          </button>
        </div>

        {/* 4 Formula Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* 1. Role */}
          <div>
            <label
              htmlFor="prompt-role-select"
              className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <span className="w-5 h-5 rounded-full bg-sky-100 text-[#0066cc] text-[11px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span>{t.roleLabel}</span>
            </label>
            <select
              id="prompt-role-select"
              value={roleIdx}
              onChange={(e) => setRoleIdx(Number(e.target.value))}
              className="w-full min-h-[44px] text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff] cursor-pointer"
            >
              {roles.map((r, i) => (
                <option key={i} value={i}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Topic */}
          <div>
            <label
              htmlFor="prompt-topic-select"
              className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <span className="w-5 h-5 rounded-full bg-sky-100 text-[#0066cc] text-[11px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span>{t.topicLabel}</span>
            </label>
            <select
              id="prompt-topic-select"
              value={topicIdx}
              onChange={(e) => {
                setTopicIdx(Number(e.target.value));
                setCustomTopic('');
              }}
              className="w-full min-h-[44px] text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff] cursor-pointer"
            >
              {topics.map((item, i) => (
                <option key={i} value={i}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Grade */}
          <div>
            <label
              htmlFor="prompt-grade-select"
              className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <span className="w-5 h-5 rounded-full bg-sky-100 text-[#0066cc] text-[11px] font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <span>{t.gradeLabel}</span>
            </label>
            <select
              id="prompt-grade-select"
              value={gradeIdx}
              onChange={(e) => setGradeIdx(Number(e.target.value))}
              className="w-full min-h-[44px] text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff] cursor-pointer"
            >
              {gradeLevels.map((g, i) => (
                <option key={i} value={i}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Format */}
          <div>
            <label
              htmlFor="prompt-format-select"
              className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <span className="w-5 h-5 rounded-full bg-sky-100 text-[#0066cc] text-[11px] font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <span>{t.formatLabel}</span>
            </label>
            <select
              id="prompt-format-select"
              value={formatIdx}
              onChange={(e) => setFormatIdx(Number(e.target.value))}
              className="w-full min-h-[44px] text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff] cursor-pointer"
            >
              {formats.map((f, i) => (
                <option key={i} value={i}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Custom Topic & Extra Classroom Note */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="prompt-custom-topic"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              {language === 'bm'
                ? 'Atau taip topik anda sendiri (pilihan):'
                : 'Or enter your own classroom topic (optional):'}
            </label>
            <input
              id="prompt-custom-topic"
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder={
                language === 'bm'
                  ? 'Contoh: Fotosintesis Tumbuhan Tahun 4'
                  : 'Example: Year 4 Plant Photosynthesis'
              }
              className="w-full min-h-[44px] text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff]"
            />
          </div>

          <div>
            <label
              htmlFor="prompt-extra-note"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              {language === 'bm'
                ? 'Nota tambahan untuk AI (pilihan):'
                : 'Extra teacher instruction (optional):'}
            </label>
            <input
              id="prompt-extra-note"
              type="text"
              value={extraNote}
              onChange={(e) => setExtraNote(e.target.value)}
              placeholder={
                language === 'bm'
                  ? 'Contoh: Sertakan contoh konteks Malaysia'
                  : 'Example: Include everyday Malaysian classroom examples'
              }
              className="w-full min-h-[44px] text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0099ff]/25 focus:border-[#0099ff]"
            />
          </div>
        </div>

        {/* Output Studio Result */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 relative mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300">{t.outputLabel}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#0099ff] hover:bg-[#0088ee] text-white rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copied ? t.copied : t.copyPrompt}</span>
            </button>
          </div>

          <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap text-emerald-300 leading-relaxed overflow-x-auto select-all">
            {assembledPrompt}
          </pre>
        </div>

        {copyError && (
          <div
            role="alert"
            className="mb-4 p-3.5 bg-[#fdf2f0] border border-[#cc310e]/30 rounded-2xl flex items-start gap-2.5 text-xs text-[#99240b]"
          >
            <AlertCircle className="w-4 h-4 text-[#cc310e] shrink-0 mt-0.5" aria-hidden="true" />
            <span>{copyError}</span>
          </div>
        )}

        {/* Pedagogical Critique + Honest Local Tool Scope */}
        <div className="space-y-3">
          <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="leading-relaxed">
              <span className="font-bold">{t.critiqueTitle} </span>
              <span>
                {language === 'bm'
                  ? 'Formula ini mengandungi peranan autoriti, batas skop topik yang jelas, peringkat kognitif murid, dan format jadual siap guna. Ini menghalang AI daripada berleter panjang atau menghasilkan soalan di luar aras murid.'
                  : 'This 4-part formula supplies contextual authority, strict topical scope, cognitive target level, and precise table formatting. This blocks AI fluff and prevents out-of-syllabus complexity.'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 px-1">
            {language === 'bm'
              ? 'Nota alat tempatan: Alat ini menyusun templat gesaan secara langsung pada pelayar anda tanpa menghantar data ke pelayan AI luar. Salin gesaan di atas dan tampal ke dalam alat AI pilihan anda (seperti Gemini, ChatGPT, atau Claude). Elakkan memasukkan nama penuh atau nombor kad pengenalan murid.'
              : 'Local tool note: This workspace builds your prompt locally in your browser without calling an external AI backend. Copy the prompt above and paste it into your preferred AI tool (such as Gemini, ChatGPT, or Claude). Never enter student full names or ID numbers.'}
          </p>
        </div>
      </section>
    </div>
  );
};
