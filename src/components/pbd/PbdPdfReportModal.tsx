import React, { useState } from 'react';
import { PBDClassRecord, PBDStudentRecord, Language } from '../../types';
import { translations } from '../../data/translations';
import {
  STUDENT_EFFORT_CONFIG,
  ASSESSMENT_METHODS_CONFIG,
  getDskpStatement,
  calculateUasaGrade,
} from '../../data/pbdSampleData';
import {
  downloadIndividualStudentPbdPdf,
  downloadClassPbdSummaryPdf,
  downloadBatchAllStudentSlipsPdf,
} from '../../utils/pbdPdfReport';
import { BamuMascot } from '../brand/BamuMascot';
import {
  X,
  FileDown,
  Printer,
  FileText,
  Users,
  CheckCircle2,
  Sparkles,
  School,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface Props {
  classRecord: PBDClassRecord;
  language: Language;
  initialStudent?: PBDStudentRecord | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

type ReportType = 'individual' | 'classSummary' | 'batchAll';

export const PbdPdfReportModal: React.FC<Props> = ({
  classRecord,
  language,
  initialStudent,
  onClose,
  onToast,
}) => {
  const t = translations[language].pbdSystem;
  const common = translations[language].common;

  const [reportType, setReportType] = useState<ReportType>(
    initialStudent ? 'individual' : 'classSummary'
  );

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent ? initialStudent.id : classRecord.students[0]?.id || ''
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const selectedStudent =
    classRecord.students.find((s) => s.id === selectedStudentId) ||
    classRecord.students[0];

  // Calculations for class summary
  const totalStudents = classRecord.students.length;
  const countTP3Plus = classRecord.students.filter((s) =>
    ['TP3', 'TP4', 'TP5', 'TP6'].includes(s.masteryLevel)
  ).length;
  const pctTP3Plus = totalStudents > 0 ? Math.round((countTP3Plus / totalStudents) * 100) : 0;
  const validScores = classRecord.students
    .map((s) => s.uasaScore)
    .filter((sc): sc is number => sc !== undefined && sc !== null && !isNaN(sc));
  const avgUasa = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
  const avgGrade = calculateUasaGrade(avgUasa).grade;

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        if (reportType === 'individual') {
          if (selectedStudent) {
            downloadIndividualStudentPbdPdf(classRecord, selectedStudent, language);
            onToast(
              language === 'bm'
                ? `Slip PBD bagi ${selectedStudent.studentName} berjaya dimuat turun (.pdf)`
                : `Official PBD Slip for ${selectedStudent.studentName} downloaded (.pdf)`
            );
          }
        } else if (reportType === 'classSummary') {
          downloadClassPbdSummaryPdf(classRecord, language);
          onToast(
            language === 'bm'
              ? `Laporan Rumusan & Transit Kelas ${classRecord.className} berjaya dimuat turun (.pdf)`
              : `Transit & Summary Report for Class ${classRecord.className} downloaded (.pdf)`
          );
        } else if (reportType === 'batchAll') {
          downloadBatchAllStudentSlipsPdf(classRecord, language);
          onToast(
            language === 'bm'
              ? `Jilid Lengkap Semua Slip Murid (${totalStudents} murid) berjaya dimuat turun (.pdf)`
              : `Complete dossier of all student slips (${totalStudents} students) downloaded (.pdf)`
          );
        }
      } catch (err) {
        console.error('Failed to generate PDF:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 150);
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const periodText =
    classRecord.reportingPeriod === 'pertengahan'
      ? 'PERTENGAHAN SESI AKADEMIK'
      : 'AKHIR SESI AKADEMIK';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-sky-100 overflow-hidden animate-fadeIn">
        {/* Top Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-50 via-[#fdfdfe] to-[#fdf2f0] border-b border-sky-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0099ff] to-[#0055cc] text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
              <FileDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#cc310e] text-white text-[10px] font-extrabold uppercase tracking-wider">
                  KPM Standard 2025
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {classRecord.className} · {classRecord.subject}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                {t.pdfModalTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label={common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Controls & Right Document Preview */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 min-h-0">
          {/* Left Column: Report Format Selection & Options */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-[#fdfdfe] space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 font-display">
                  {t.pdfReportType}
                </label>

                {/* 3 Report Types Radio Options */}
                <div className="space-y-2.5">
                  {/* Type 1: Individual Slip */}
                  <div
                    onClick={() => setReportType('individual')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      reportType === 'individual'
                        ? 'bg-sky-50/70 border-[#0099ff] ring-1 ring-[#0099ff] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${reportType === 'individual' ? 'text-[#0099ff]' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 font-display">
                        {t.pdfTypeIndividual}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {language === 'bm'
                          ? 'Slip rasmi murid lengkap dengan DSKP, kaedah, skor UASA, ulasan & skala usaha.'
                          : 'Official student slip with DSKP statements, UASA marks, remarks & effort scale.'}
                      </p>
                    </div>
                  </div>

                  {/* Type 2: Class Transit Summary */}
                  <div
                    onClick={() => setReportType('classSummary')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      reportType === 'classSummary'
                        ? 'bg-sky-50/70 border-[#0099ff] ring-1 ring-[#0099ff] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <Users className={`w-5 h-5 shrink-0 mt-0.5 ${reportType === 'classSummary' ? 'text-[#0099ff]' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 font-display">
                        {t.pdfTypeClassSummary}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {language === 'bm'
                          ? 'Rekod transit kelas berjadual landskap bersama analisis TP3+ dan purata UASA.'
                          : 'Class transit spreadsheet in landscape with TP3+ analytics and averages.'}
                      </p>
                    </div>
                  </div>

                  {/* Type 3: Batch All Slips */}
                  <div
                    onClick={() => setReportType('batchAll')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      reportType === 'batchAll'
                        ? 'bg-sky-50/70 border-[#0099ff] ring-1 ring-[#0099ff] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <Layers className={`w-5 h-5 shrink-0 mt-0.5 ${reportType === 'batchAll' ? 'text-[#0099ff]' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 font-display">
                        {t.pdfTypeBatchSlips}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {language === 'bm'
                          ? `Jana fail PDF tunggal mengandungi semua ${totalStudents} slip murid kelas untuk cetakan serentak.`
                          : `Single compilation PDF file of all ${totalStudents} student slips for batch printing.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Picker if Individual */}
              {reportType === 'individual' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl animate-fadeIn">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 font-display">
                    {t.pdfSelectStudent}
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full min-h-[44px] text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#0099ff] cursor-pointer"
                  >
                    {classRecord.students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.studentName} ({st.masteryLevel} · {st.studentId})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bamu Friendly Assurance */}
              <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-2.5 text-xs text-[#003366]">
                <BamuMascot mood="encouraging" size="xs" className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">
                    {language === 'bm' ? 'Format Standard KPM 2025' : 'Official MoE 2025 Format'}
                  </span>
                  <span className="leading-relaxed">
                    {language === 'bm'
                      ? 'Laporan PDF dijana secara automatik dengan saiz standard A4, skema fon kemas, kotak ulasan guru kelas dan ruang pengesahan pentadbir.'
                      : 'PDF reports are formatted in standard A4 with clean vector tables, class teacher comments, and administrator signature blocks.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <button
                disabled={isGenerating}
                onClick={handleDownloadPdf}
                className="w-full min-h-[44px] py-3 px-4 rounded-full font-bold text-xs text-white bg-[#0099ff] hover:bg-[#0088ee] transition-all cursor-pointer shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 group hover:scale-101"
              >
                <FileDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                <span>
                  {isGenerating
                    ? language === 'bm'
                      ? 'Sedang Menjana PDF...'
                      : 'Generating PDF...'
                    : reportType === 'individual'
                    ? t.downloadSlipPdf
                    : reportType === 'classSummary'
                    ? t.downloadClassPdf
                    : t.downloadBatchSlipsPdf}
                </span>
              </button>

              <button
                onClick={handleBrowserPrint}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-full font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'bm' ? 'Cetak Melalui Pelayar' : 'Print via Browser'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Sheet Preview matching official KPM styling */}
          <div className="lg:col-span-8 p-5 sm:p-6 bg-slate-100/60 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span className="font-bold flex items-center gap-1.5 font-display text-slate-700">
                <BookOpen className="w-4 h-4 text-[#0099ff]" />
                {t.pdfPreviewTitle}
              </span>
              <span className="text-[11px] font-mono bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                {reportType === 'classSummary' ? 'A4 Landskap (297 x 210 mm)' : 'A4 Potret (210 x 297 mm)'}
              </span>
            </div>

            {/* Simulated Paper Canvas with Shadows */}
            <div className="flex-1 bg-white border border-slate-300/80 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-900 overflow-x-auto text-[11px] print:m-0 print:border-none print:shadow-none">
              {/* IF INDIVIDUAL SLIP OR BATCH SLIP PREVIEW */}
              {reportType !== 'classSummary' && selectedStudent && (
                <div className="max-w-[700px] mx-auto space-y-4">
                  {/* Header */}
                  <div className="text-center pb-2 border-b-2 border-[#0099ff]">
                    <p className="font-bold text-xs tracking-wider uppercase text-slate-900">
                      KEMENTERIAN PENDIDIKAN MALAYSIA
                    </p>
                    <p className="font-extrabold text-sm sm:text-base text-[#0077dd] uppercase font-display mt-0.5">
                      PELAPORAN PENTAKSIRAN BILIK DARJAH (PBD)
                    </p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase mt-0.5">
                      {periodText} · SESI {classRecord.academicYear}
                    </p>
                  </div>

                  {/* Student Metadata Table */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] py-1 border-b border-slate-200">
                    <div>
                      <span className="font-bold text-slate-600">NAMA MURID: </span>
                      <span className="font-extrabold text-slate-900">{selectedStudent.studentName.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">TINGKATAN / TAHUN: </span>
                      <span>{classRecord.yearGrade.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">NO. ID / PENGENALAN: </span>
                      <span className="font-mono">{selectedStudent.studentId}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">KELAS: </span>
                      <span>{classRecord.className.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">JANTINA: </span>
                      <span>{selectedStudent.gender === 'L' ? 'LELAKI' : 'PEREMPUAN'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">NAMA SEKOLAH: </span>
                      <span>{classRecord.schoolName.toUpperCase()} ({classRecord.schoolCode})</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600">TARIKH PELAPORAN: </span>
                      <span className="font-mono">{selectedStudent.dateRecorded}</span>
                    </div>
                  </div>

                  {/* Main Assessment Table */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-sky-50 border-b border-slate-400 text-slate-900 font-bold">
                          <th rowSpan={2} className="p-2 border-r border-slate-400 w-1/4">MATA PELAJARAN</th>
                          <th colSpan={2} className="p-1.5 text-center border-r border-slate-400">PENTAKSIRAN BERTERUSAN</th>
                          {classRecord.includeUasa && (
                            <th colSpan={2} className="p-1.5 text-center border-r border-slate-400">UASA</th>
                          )}
                          <th rowSpan={2} className="p-2 border-r border-slate-400 w-1/4">ULASAN GURU MATA PELAJARAN</th>
                          <th rowSpan={2} className="p-2 text-center w-16">USAHA</th>
                        </tr>
                        <tr className="bg-sky-50/80 border-b border-slate-400 text-slate-800 text-[9px] font-bold">
                          <th className="p-1 text-center border-r border-slate-400 w-12">TP</th>
                          <th className="p-1 border-r border-slate-400">PENYATAAN TAHAP PENGUASAAN</th>
                          {classRecord.includeUasa && (
                            <>
                              <th className="p-1 text-center border-r border-slate-400 w-12">SKOR</th>
                              <th className="p-1 text-center border-r border-slate-400 w-10">GRED</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-300 align-top">
                          <td className="p-2 border-r border-slate-300">
                            <p className="font-bold text-slate-900">{classRecord.subject}</p>
                            <p className="text-[9px] text-slate-500">Guru: {classRecord.teacherName}</p>
                            <p className="text-[9px] text-slate-500">
                              Kaedah: {ASSESSMENT_METHODS_CONFIG[selectedStudent.assessmentMethod]?.label.bm}
                            </p>
                          </td>
                          <td className="p-2 text-center font-extrabold text-xs text-[#0066cc] border-r border-slate-300 bg-sky-50/40">
                            {selectedStudent.masteryLevel}
                          </td>
                          <td className="p-2 text-[9.5px] leading-relaxed text-slate-700 border-r border-slate-300 text-justify">
                            {selectedStudent.subjectStatement ||
                              getDskpStatement(classRecord.subject, selectedStudent.masteryLevel, language)}
                          </td>
                          {classRecord.includeUasa && (
                            <>
                              <td className="p-2 text-center font-bold font-mono border-r border-slate-300">
                                {selectedStudent.uasaScore !== undefined ? `${selectedStudent.uasaScore}%` : '-'}
                              </td>
                              <td className="p-2 text-center font-extrabold text-xs border-r border-slate-300 text-slate-900">
                                {selectedStudent.uasaGrade || '-'}
                              </td>
                            </>
                          )}
                          <td className="p-2 text-[9.5px] leading-relaxed text-slate-700 border-r border-slate-300">
                            {selectedStudent.remarks || 'Murid memberi tumpuan baik sepanjang sesi pembelajaran.'}
                          </td>
                          <td className="p-2 text-center font-bold text-[9px]">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8.5px] ${
                              selectedStudent.effort === 'SANGAT TINGGI'
                                ? 'bg-[#fdf2f0] text-[#99240b] border border-[#cc310e]/30'
                                : selectedStudent.effort === 'TINGGI'
                                ? 'bg-sky-100 text-[#0066cc]'
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {selectedStudent.effort}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Ulasan Guru Kelas */}
                  <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/50">
                    <span className="text-[10px] font-bold text-[#0066cc] block mb-0.5 font-display">
                      ULASAN GURU KELAS:
                    </span>
                    <p className="text-[10px] text-slate-700 leading-relaxed">
                      {classRecord.classTeacherRemarks ||
                        'Murid menunjukkan potensi pembelajaran yang membanggakan serta sentiasa bermotivasi tinggi dalam aktiviti kelas.'}
                    </p>
                  </div>

                  {/* Petunjuk Usaha Murid Legend */}
                  <div className="border border-slate-200 rounded-xl p-2.5 text-[9px] text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1">
                      PETUNJUK USAHA MURID (PANDUAN KPM PBS 2025):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-1 rounded bg-[#fdf2f0] border border-[#cc310e]/30">
                        <strong className="text-[#99240b]">SANGAT TINGGI:</strong> Mampu berdikari & tekal.
                      </div>
                      <div className="p-1 rounded bg-sky-50 border border-sky-200">
                        <strong className="text-[#0066cc]">TINGGI:</strong> Usaha tinggi & bimbingan sokongan.
                      </div>
                      <div className="p-1 rounded bg-amber-50 border border-amber-200">
                        <strong className="text-amber-800">SEDERHANA:</strong> Perlukan dorongan konsisten.
                      </div>
                      <div className="p-1 rounded bg-rose-50 border border-rose-200">
                        <strong className="text-rose-800">RENDAH:</strong> Perlukan lebih bantuan & intervensi.
                      </div>
                    </div>
                  </div>

                  {/* Verification Signatures */}
                  <div className="grid grid-cols-3 gap-4 pt-3 text-[9px] text-slate-700">
                    <div>
                      <p>Disediakan Oleh:</p>
                      <div className="h-8"></div>
                      <div className="border-t border-slate-400 pt-1">
                        <p className="font-bold text-slate-900">{classRecord.teacherName.toUpperCase()}</p>
                        <p className="text-slate-500">Guru Mata Pelajaran</p>
                      </div>
                    </div>
                    <div>
                      <p>Disahkan Oleh:</p>
                      <div className="h-8"></div>
                      <div className="border-t border-slate-400 pt-1">
                        <p className="font-bold text-slate-900">
                          {(classRecord.classTeacherName || classRecord.teacherName).toUpperCase()}
                        </p>
                        <p className="text-slate-500">Guru Kelas</p>
                      </div>
                    </div>
                    <div>
                      <p>Pengesahan Pentadbir / Penjaga:</p>
                      <div className="h-8"></div>
                      <div className="border-t border-slate-400 pt-1">
                        <p className="font-bold text-slate-900">PENGETUA / GURU BESAR</p>
                        <p className="text-slate-500">Cop Rasmi Sekolah</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* IF CLASS TRANSIT & SUMMARY PREVIEW */}
              {reportType === 'classSummary' && (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="text-center pb-2 border-b-2 border-[#0099ff]">
                    <p className="font-bold text-xs tracking-wider uppercase text-slate-900">
                      KEMENTERIAN PENDIDIKAN MALAYSIA
                    </p>
                    <p className="font-extrabold text-sm sm:text-base text-[#0077dd] uppercase font-display mt-0.5">
                      REKOD TRANSIT & LAPORAN RUMUSAN PBD KELAS
                    </p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase mt-0.5">
                      {classRecord.schoolName.toUpperCase()} ({classRecord.schoolCode}) · KELAS: {classRecord.className.toUpperCase()} · {classRecord.subject.toUpperCase()} · SESI {classRecord.academicYear}
                    </p>
                  </div>

                  {/* 4 Stats Chips */}
                  <div className="grid grid-cols-4 gap-2 text-[10px]">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-500 block">Jumlah Murid:</span>
                      <strong className="text-sm font-mono text-slate-900">{totalStudents}</strong>
                    </div>
                    <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl">
                      <span className="text-sky-700 block">Capai TP3-TP6:</span>
                      <strong className="text-sm font-mono text-[#0066cc]">{countTP3Plus} ({pctTP3Plus}%)</strong>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-500 block">Purata UASA:</span>
                      <strong className="text-sm font-mono text-slate-900">{avgUasa}% ({avgGrade})</strong>
                    </div>
                    <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-xl">
                      <span className="text-[#0055aa] block">Status PBD:</span>
                      <strong className="text-xs font-bold text-[#003366]">TERATUR & LENGKAP</strong>
                    </div>
                  </div>

                  {/* Summary Transit Roster Table */}
                  <div className="border border-slate-300 rounded-xl overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[9.5px]">
                      <thead>
                        <tr className="bg-[#0099ff] text-white font-bold text-center">
                          <th className="p-1.5 w-8">BIL</th>
                          <th className="p-1.5 text-left">NAMA MURID</th>
                          <th className="p-1.5">NO. ID</th>
                          <th className="p-1.5">JANTINA</th>
                          <th className="p-1.5">TP</th>
                          <th className="p-1.5">SKOR UASA</th>
                          <th className="p-1.5">GRED</th>
                          <th className="p-1.5">USAHA</th>
                          <th className="p-1.5 text-left">ULASAN RINGKAS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {classRecord.students.map((st, idx) => (
                          <tr key={st.id} className="hover:bg-sky-50/40">
                            <td className="p-1.5 text-center font-mono">{idx + 1}</td>
                            <td className="p-1.5 font-bold text-slate-900">{st.studentName}</td>
                            <td className="p-1.5 text-center font-mono text-slate-500">{st.studentId}</td>
                            <td className="p-1.5 text-center">{st.gender}</td>
                            <td className="p-1.5 text-center font-extrabold text-[#0066cc]">{st.masteryLevel}</td>
                            <td className="p-1.5 text-center font-mono">{st.uasaScore !== undefined ? `${st.uasaScore}%` : '-'}</td>
                            <td className="p-1.5 text-center font-bold">{st.uasaGrade || '-'}</td>
                            <td className="p-1.5 text-center">
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100">
                                {st.effort}
                              </span>
                            </td>
                            <td className="p-1.5 text-slate-600 truncate max-w-[200px]">{st.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Signatures */}
                  <div className="flex justify-between items-end pt-3 text-[9px] text-slate-700">
                    <div>
                      <p>Disediakan Oleh (Guru Mata Pelajaran):</p>
                      <div className="h-6"></div>
                      <p className="font-bold border-t border-slate-400 pt-1 text-slate-900">
                        {classRecord.teacherName.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p>Disahkan Oleh (Pengetua / Guru Besar):</p>
                      <div className="h-6"></div>
                      <p className="font-bold border-t border-slate-400 pt-1 text-slate-900">
                        PENGETUA / GURU BESAR
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
